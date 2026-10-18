// In-app Dharitree driver. Ported from backend/dharitree.js so the APK can talk
// to https://ilrms.assam.gov.in directly — no separate server required.
//
//   1. GET  /dhar/index.php/Welcome/SelectLOC      → districts live in <ul id="district">
//   2. POST /dhar/index.php/Welcome/getCirdivJson  → circles for a district
//   3. POST /dhar/index.php/Welcome/getVillCodeJson→ villages for a circle
//   4. POST /dhar/index.php/Welcome/ROR            → CAPTCHA + dag form, or a record
//
// The user solves whatever CAPTCHA the gov page shows; we only ferry it.

import type {
  Control, FormState, ParsedRecord, RecordField, RecordTable,
} from './backend';

const BASE = 'https://ilrms.assam.gov.in/';
const DHAR = BASE + 'dhar/index.php/';

const URLS = {
  start:     DHAR + 'Welcome/SelectLOC',
  circles:   DHAR + 'Welcome/getCirdivJson',
  villages:  DHAR + 'Welcome/getVillCodeJson',
  submit:    DHAR + 'Welcome/ROR',
  dagLookup: DHAR + 'Welcome/public_action_for_dag',
  jamabandi: DHAR + 'Welcome/jamabandi_report',
} as const;

const HEADERS: Record<string, string> = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
    '(KHTML, like Gecko) Chrome/126.0 Safari/537.36',
  'Accept-Language': 'en-IN,en;q=0.9,as;q=0.8',
};

export type TransportRequest = {
  method: 'GET' | 'POST';
  url: string;
  headers: Record<string, string>;
  body?: string;
  responseType?: 'text' | 'base64';
};

export type TransportResponse = {
  status: number;
  url: string;
  headers: Record<string, string>;
  text?: string;
  base64?: string;
};

export type Transport = (req: TransportRequest) => Promise<TransportResponse>;

/* ------------------------------------------------------------------ *
 * Cookie jar — CapacitorHttp joins repeated Set-Cookie headers with
 * ", ", so we re-split them before pulling out name=value pairs.
 * ------------------------------------------------------------------ */

function splitSetCookies(raw: string): string[] {
  const out: string[] = [];
  for (const part of raw.split(',')) {
    const token = part.trim();
    if (!token) continue;
    // A fragment opens a new cookie only when it starts with `name=value`.
    if (/^[^\s=;]+=/.test(token)) out.push(token);
    else if (out.length) out[out.length - 1] += ', ' + token;
    else out.push(token);
  }
  return out;
}

class CookieJar {
  private map = new Map<string, string>();

  absorb(headers: Record<string, string>) {
    const raw =
      headers['set-cookie'] ??
      headers['Set-Cookie'] ??
      headers['SET-COOKIE'];
    if (!raw) return;
    for (const cookie of splitSetCookies(raw)) {
      const pair = cookie.split(';')[0] ?? '';
      const i = pair.indexOf('=');
      if (i <= 0) continue;
      const name = pair.slice(0, i).trim();
      const value = pair.slice(i + 1).trim();
      if (value === '' || /^(Thu, 01 Jan 1970|W\/"")/.test(value)) this.map.delete(name);
      else this.map.set(name, value);
    }
  }

  header(): string {
    return [...this.map].map(([k, v]) => `${k}=${v}`).join('; ');
  }

  clear() { this.map.clear(); }
}

/* ------------------------------------------------------------------ *
 * HTML helpers (DOMParser replaces cheerio)
 * ------------------------------------------------------------------ */

const parse = (html: string): Document =>
  new DOMParser().parseFromString(html || '<html></html>', 'text/html');

const text = (el: Element | null | undefined): string =>
  (el?.textContent ?? '').replace(/\s+/g, ' ').trim();

function firstEl(root: ParentNode, selector: string): Element | null {
  return root.querySelector(selector);
}

function labelFor(doc: Document, el: Element, fallback: string): string {
  const id = el.getAttribute('id');
  if (id) {
    const lab = [...doc.querySelectorAll('label[for]')]
      .find((l) => l.getAttribute('for') === id);
    const t = text(lab);
    if (t) return t;
  }
  const parent = el.parentElement;
  const near = text(parent?.previousElementSibling);
  if (near && near.length < 60) return near;
  return fallback;
}

function pageMessage(doc: Document): string | null {
  const all = doc.querySelectorAll('[id], [class]');
  for (const el of all) {
    const id = el.getAttribute('id') ?? '';
    const cls = el.getAttribute('class') ?? '';
    if (/msg/i.test(id) || /error|alert/i.test(cls)) {
      const t = text(el);
      if (t) return t;
    }
  }
  return null;
}

/* ------------------------------------------------------------------ *
 * Session
 * ------------------------------------------------------------------ */

type District = { code: string; label: string };
type Circle   = { code: string; subdiv: string; circle: string; label: string };
type Village  = { code: string; mouza: string; lot: string; village: string; label: string };

type DagRow = {
  patta_type_code: string;
  patta_type_name: string;
  dag_no: string;
  dist_code: string;
  subdiv_code: string;
  cir_code: string;
  mouza_pargona_code: string;
  lot_no: string;
  vill_townprt_code: string;
  mouza_name: string;
  lot_name: string;
};

type PartialState = Omit<FormState, 'sid'> & { result?: ParsedRecord | null };

export class DharitreeSession {
  private transport: Transport;
  private cookies = new CookieJar();
  html: string | null = null;
  pageUrl = URLS.start;

  private districts: District[] = [];
  private circles: Circle[] | null = null;
  private villages: Village[] | null = null;
  private selected = { dcode: '', sdvcode: '', cdvcode: '', mozcode: '', ltcode: '', vilcode: '' };
  private mode: 'picker' | 'form' = 'picker';
  private lastCaptchaSrc: string | null = null;

  private pendingDagRows: DagRow[] | null = null;
  private pendingDagNo = '';
  private pendingCaptcha: string | null = null;

  constructor(transport: Transport) {
    this.transport = transport;
  }

  private async request(
    method: 'GET' | 'POST',
    body: string | undefined,
    url: string,
    headers: Record<string, string> = {},
    responseType: 'text' | 'base64' = 'text',
  ): Promise<TransportResponse> {
    const jar = this.cookies.header();
    const all: Record<string, string> = {
      ...HEADERS,
      Referer: URLS.start,
      ...headers,
    };
    if (jar) all.Cookie = jar;
    if (body) {
      all['Content-Type'] = 'application/x-www-form-urlencoded';
    }

    const res = await this.transport({ method, url, headers: all, body, responseType });
    this.cookies.absorb(res.headers);
    if (res.status < 200 || res.status >= 400) {
      throw new Error(`Dharitree ${method} ${url} → HTTP ${res.status}`);
    }
    return res;
  }

  /* ----- initial districts ----- */

  async open(): Promise<PartialState> {
    const res = await this.request('GET', undefined, URLS.start);
    this.html = res.text ?? '';
    this.pageUrl = res.url || URLS.start;
    this.parseDistricts();
    this.circles = null;
    this.villages = null;
    this.selected = { dcode: '', sdvcode: '', cdvcode: '', mozcode: '', ltcode: '', vilcode: '' };
    this.mode = 'picker';
    this.lastCaptchaSrc = null;
    return this.state();
  }

  private parseDistricts() {
    const doc = parse(this.html ?? '');
    const items: District[] = [];
    doc.querySelectorAll('ul#district li').forEach((li) => {
      const code = li.getAttribute('value') ?? li.getAttribute('id') ?? '';
      const label = text(li.querySelector('a'));
      if (code && label) items.push({ code: code.trim(), label });
    });
    this.districts = items;
  }

  /* ----- cascade ----- */

  private async selectDistrict(dcode: string) {
    const body = new URLSearchParams({ district_code: dcode }).toString();
    const res = await this.request('POST', body, URLS.circles, {
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    });
    this.circles = jsonRows(res.text).map((r) => {
      const [subdiv, cir] = String(r.cir_code ?? '').split(' ');
      return {
        code: String(r.cir_code ?? ''),
        subdiv: subdiv ?? '',
        circle: cir ?? '',
        label: String(r.loc_name ?? '').trim(),
      };
    });
    this.villages = null;
    this.selected = { dcode: String(dcode), sdvcode: '', cdvcode: '', mozcode: '', ltcode: '', vilcode: '' };
    return this.state();
  }

  private async selectCircle(cirCompound: string) {
    const [subdiv, circle] = String(cirCompound).split(' ');
    const body = new URLSearchParams({
      district_code: this.selected.dcode,
      subdiv_code: subdiv ?? '',
      circle_code: circle ?? '',
    }).toString();
    const res = await this.request('POST', body, URLS.villages, {
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    });
    this.villages = jsonRows(res.text).map((r) => {
      const [mouza, lot, village] = String(r.vill_code ?? '').split(' ');
      return {
        code: String(r.vill_code ?? ''),
        mouza: mouza ?? '',
        lot: lot ?? '',
        village: village ?? '',
        label: String(r.loc_name ?? '').trim(),
      };
    });
    this.selected.sdvcode = subdiv ?? '';
    this.selected.cdvcode = circle ?? '';
    this.selected.mozcode = '';
    this.selected.ltcode = '';
    this.selected.vilcode = '';
    return this.state();
  }

  private selectVillage(vilCompound: string) {
    const [mouza, lot, village] = String(vilCompound).split(' ');
    this.selected.mozcode = mouza ?? '';
    this.selected.ltcode = lot ?? '';
    this.selected.vilcode = village ?? '';
    return this.state();
  }

  async select(name: string, value: string): Promise<PartialState> {
    if (name === 'dcode') return this.selectDistrict(value);
    if (name === 'cdvcode') return this.selectCircle(value);
    if (name === 'vilcode') return this.selectVillage(value);
    throw new Error(`Unknown select: ${name}`);
  }

  /* ----- submit ----- */

  private async submitLocation(): Promise<PartialState> {
    const body = new URLSearchParams(this.selected).toString();
    const res = await this.request('POST', body, URLS.submit);
    this.html = res.text ?? '';
    this.pageUrl = res.url || URLS.submit;
    this.mode = 'form';
    return this.parseAfterSubmit();
  }

  private async submitHtmlForm(captcha: string, values: Record<string, string>): Promise<PartialState> {
    const doc = parse(this.html ?? '');
    const form = firstEl(doc, '#rep_frm') ?? doc.querySelector('form');

    const hidden = (name: string): string =>
      (form?.querySelector(`input[name="${name}"]`) as HTMLInputElement | null)?.value ||
      (form?.querySelector(`#${name}`) as HTMLInputElement | null)?.value ||
      '';

    const dagNo = values.dag_no ??
      (form?.querySelector('input[name="dag_no"]') as HTMLInputElement | null)?.value ?? '';
    const pattaTypeNo = values.patta_type_no ?? '';

    // Step 2 fast-path: the user already picked a patta from the chooser list.
    if (pattaTypeNo) {
      const row = this.pendingDagRows?.find((r) => r.patta_type_code === pattaTypeNo) ?? null;
      return this.fetchJamabandi({
        district_code: row?.dist_code ?? hidden('district_code'),
        subdiv_code: row?.subdiv_code ?? hidden('subdiv_code'),
        circle_code: row?.cir_code ?? hidden('circle_code'),
        mouza_code: row?.mouza_pargona_code ?? hidden('mouza_code'),
        lot_code: row?.lot_no ?? hidden('lot_code'),
        village_code: row?.vill_townprt_code ?? hidden('village_code'),
        dag_no: dagNo,
        patta_type_no: pattaTypeNo,
        CaptchaCode: captcha,
      });
    }

    // Step 1: dag-type lookup
    const body = new URLSearchParams({
      district_code: hidden('district_code') || this.selected.dcode,
      subdiv_code: hidden('subdiv_code') || this.selected.sdvcode,
      circle_code: hidden('circle_code') || this.selected.cdvcode,
      mouza_pargona_code: hidden('mouza_code') || this.selected.mozcode,
      lot_no: hidden('lot_code') || this.selected.ltcode,
      village_code: hidden('village_code') || this.selected.vilcode,
      dag_no: dagNo,
      captcha,
    }).toString();

    const res = await this.request('POST', body, URLS.dagLookup, {
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    });
    const rows = jsonRows(res.text) as unknown as DagRow[];

    if (rows.length === 0) {
      // Gov JS treats empty as "Captcha Error or Wrong or Improper Dag No".
      await this.submitLocation();
      return { ...this.parseAfterSubmit(), message: 'Wrong CAPTCHA or wrong dag number. Please try again.' };
    }

    if (rows.length === 1) {
      const r = rows[0];
      return this.fetchJamabandi({
        district_code: r.dist_code,
        subdiv_code: r.subdiv_code,
        circle_code: r.cir_code,
        mouza_code: r.mouza_pargona_code,
        lot_code: r.lot_no,
        village_code: r.vill_townprt_code,
        dag_no: r.dag_no,
        patta_type_no: r.patta_type_code,
        CaptchaCode: captcha,
      });
    }

    this.pendingDagRows = rows;
    this.pendingDagNo = dagNo;
    this.pendingCaptcha = captcha;
    return this.chooserState(rows);
  }

  private async fetchJamabandi(fields: Record<string, string>): Promise<PartialState> {
    const body = new URLSearchParams(fields).toString();
    const res = await this.request('POST', body, URLS.jamabandi);
    this.html = res.text ?? '';
    this.pageUrl = res.url || URLS.jamabandi;
    return this.parseAfterSubmit();
  }

  private chooserState(rows: DagRow[]): PartialState {
    const options: { value: string; text: string }[] = [
      { value: '', text: 'Select…' },
      ...rows.map((r) => ({
        value: r.patta_type_code,
        text: `দাগ নং ${r.dag_no} — ${r.patta_type_name} পট্টা, ${r.mouza_name} / ${r.lot_name}`,
      })),
    ];
    return {
      action: URLS.jamabandi,
      controls: [{
        name: 'patta_type_no', id: 'patta_type_no', type: 'select',
        label: 'Patta type (পট্টাৰ ধৰণ)', value: '', options,
      }],
      captchaSrc: null,
      submitName: 'submit',
      submitValue: 'See Jamabandi',
      message: `${rows.length} matching pattas — pick one and press Search.`,
    };
  }

  private parseAfterSubmit(): PartialState {
    const doc = parse(this.html ?? '');

    const captchaImg = [...doc.querySelectorAll('img')]
      .find((img) => /captcha/i.test(img.getAttribute('src') ?? ''));
    const captchaSrc = captchaImg
      ? safeHref(captchaImg.getAttribute('src') ?? '', this.pageUrl)
      : null;
    this.lastCaptchaSrc = captchaSrc;

    const controls: Control[] = [];

    doc.querySelectorAll('form select').forEach((sel) => {
      const name = sel.getAttribute('name');
      if (!name) return;
      const options = [...sel.querySelectorAll('option')].map((o) => ({
        value: o.getAttribute('value') ?? '',
        text: text(o),
      }));
      const selected = sel.querySelector('option[selected]');
      controls.push({
        name,
        id: sel.getAttribute('id') || name,
        type: 'select',
        label: labelFor(doc, sel, name),
        value: selected?.getAttribute('value') ?? options[0]?.value ?? '',
        options,
      });
    });

    doc.querySelectorAll('form input[type="text"], form input:not([type])').forEach((input) => {
      const name = input.getAttribute('name');
      if (!name) return;
      if (/capt/i.test(name)) return;
      if (input.getAttribute('type') === 'hidden') return;
      controls.push({
        name,
        id: input.getAttribute('id') || name,
        type: 'text',
        label: labelFor(doc, input, name),
        value: input.getAttribute('value') ?? '',
      });
    });

    const submitBtn = firstEl(doc, 'form input[type="submit"], form button[type="submit"]');
    return {
      action: this.pageUrl,
      controls,
      captchaSrc,
      submitName: submitBtn?.getAttribute('name') || 'submit',
      submitValue: submitBtn?.getAttribute('value') || 'Submit',
      message: pageMessage(doc),
    };
  }

  /* ----- public surface the UI calls ----- */

  private state(): PartialState {
    const controls: Control[] = [{
      name: 'dcode', id: 'dcode', type: 'select',
      label: 'জিলা / District',
      value: this.selected.dcode,
      options: [
        { value: '', text: 'Select…' },
        ...this.districts.map((d) => ({ value: d.code, text: d.label })),
      ],
      cascade: true,
    }];
    if (this.circles) {
      controls.push({
        name: 'cdvcode', id: 'cdvcode', type: 'select',
        label: 'চক্ৰ / Circle',
        value: this.selected.cdvcode ? `${this.selected.sdvcode} ${this.selected.cdvcode}` : '',
        options: [
          { value: '', text: 'Select…' },
          ...this.circles.map((c) => ({ value: c.code, text: c.label })),
        ],
        cascade: true,
      });
    }
    if (this.villages) {
      controls.push({
        name: 'vilcode', id: 'vilcode', type: 'select',
        label: 'গাঁও / Village / Town',
        value: this.selected.vilcode
          ? `${this.selected.mozcode} ${this.selected.ltcode} ${this.selected.vilcode}`
          : '',
        options: [
          { value: '', text: 'Select…' },
          ...this.villages.map((v) => ({ value: v.code, text: v.label })),
        ],
        cascade: false,
      });
    }
    return {
      action: URLS.submit,
      controls,
      captchaSrc: null,
      submitName: 'submit',
      submitValue: 'Submit',
      message: null,
    };
  }

  async submit(captcha: string, values: Record<string, string> = {}): Promise<PartialState> {
    if (this.mode === 'picker') {
      if (values.dcode) await this.selectDistrict(values.dcode);
      if (values.cdvcode) await this.selectCircle(values.cdvcode);
      if (values.vilcode) this.selectVillage(values.vilcode);
      if (!this.selected.dcode || !this.selected.cdvcode || !this.selected.vilcode) {
        return { ...this.state(), message: 'Please pick district, circle and village first.' };
      }
      const next = await this.submitLocation();
      const result = next.captchaSrc || next.controls.length ? null : this.parseRecord();
      return { ...next, result };
    }

    const effectiveCaptcha = values.patta_type_no ? (this.pendingCaptcha ?? captcha) : captcha;
    const effectiveValues = values.patta_type_no && !values.dag_no
      ? { ...values, dag_no: this.pendingDagNo }
      : values;
    const next = await this.submitHtmlForm(effectiveCaptcha, effectiveValues);
    const result = next.captchaSrc || next.controls.length ? null : this.parseRecord();
    return { ...next, result };
  }

  async refreshCaptcha(): Promise<PartialState> {
    if (this.mode === 'form') return this.submitLocation();
    return this.state();
  }

  /** Downloads the current CAPTCHA image with session cookies, as a data URI. */
  async fetchCaptcha(): Promise<string | null> {
    if (this.mode !== 'form') return null;
    const src = this.lastCaptchaSrc;
    if (!src) return null;
    try {
      const res = await this.request('GET', undefined, src, {}, 'base64');
      const b64 = res.base64 ?? '';
      if (b64.length < 134) return null; // ~100 bytes
      const ctype = headerOf(res.headers, 'content-type') || 'image/jpeg';
      return `data:${ctype};base64,${b64.replace(/\s+/g, '')}`;
    } catch {
      return null;
    }
  }

  private parseRecord(): ParsedRecord | null {
    if (!this.html) return null;
    const doc = parse(this.html);
    const report = doc.querySelector('table.report');
    if (!report) return null;

    const fields: RecordField[] = [];

    report.querySelectorAll('.float-left').forEach((el) => {
      const b = el.querySelector('b');
      const label = text(b).replace(/\s*:\s*$/, '');
      const clone = el.cloneNode(true) as Element;
      clone.querySelectorAll('b').forEach((n) => n.remove());
      if (b) b.remove();
      const value = text(clone);
      if (label && value) fields.push({ label, value });
    });

    const owners: string[] = [];
    report.querySelectorAll('tbody p').forEach((p) => {
      const t = text(p);
      if (/^\s*\d+\)\s*/.test(t) && t.length < 160) {
        owners.push(t.replace(/^\s*\d+\)\s*/, '').trim());
      }
    });
    if (owners.length) {
      fields.push({ label: 'Pattadar(s) — পট্টাদাৰ', value: owners.join('\n') });
    }

    return {
      title: 'Jamabandi (জৰীপ হোৱা গাঁওৰ জমাবন্দী)',
      fields,
      tables: [] as RecordTable[],
      html: sanitiseReportTable(report),
      source: this.pageUrl,
      fetchedAt: new Date().toISOString(),
    };
  }
}

/* ------------------------------------------------------------------ *
 * misc helpers
 * ------------------------------------------------------------------ */

function jsonRows(text_: string | undefined): Record<string, string>[] {
  if (!text_) return [];
  try {
    const data = JSON.parse(text_);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function headerOf(headers: Record<string, string>, key: string): string | undefined {
  const lower = key.toLowerCase();
  const found = Object.keys(headers).find((k) => k.toLowerCase() === lower);
  return found ? headers[found] : undefined;
}

function safeHref(src: string, base: string): string | null {
  try { return new URL(src, base).href; } catch { return null; }
}

/** Strip scripts/styles/watermarks and inline handlers; keep structure. */
function sanitiseReportTable(table: Element): string {
  const wrap = document.createElement('div');
  wrap.className = 'jamabandi-report';
  wrap.appendChild(table.cloneNode(true));
  wrap.querySelectorAll('script, style, link, noscript, iframe, img, .watermark1, .watermark2, .show-on-print')
    .forEach((n) => n.remove());
  [wrap, ...[...wrap.querySelectorAll('*')]].forEach((el) => {
    for (const attr of [...el.attributes]) {
      if (/^on/i.test(attr.name)) el.removeAttribute(attr.name);
    }
  });
  return wrap.outerHTML;
}
