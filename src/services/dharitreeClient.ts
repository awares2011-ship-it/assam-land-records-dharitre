// Client-only Dharitree driver — no backend process.
//
// Runs entirely in the WebView. On Capacitor Android (CapacitorHttp enabled)
// the native HTTP stack carries cookies and bypasses browser CORS. On web dev,
// Vite's proxy forwards `/dhar/*` to ilrms.assam.gov.in with cookie rewriting.
//
// Public shape mirrors the old backend `/api/*` responses so the UI didn't
// have to change beyond swapping imports.

export type Option = { value: string; text: string };
export type Control = {
  name: string;
  id: string;
  type: 'select' | 'text';
  label: string;
  value: string;
  options?: Option[];
  cascade?: boolean;
};
export type RecordField = { label: string; value: string };
export type RecordTable = { headers: string[]; rows: string[][] };
export type ParsedRecord = {
  title: string | null;
  fields: RecordField[];
  tables: RecordTable[];
  html?: string | null;
  text?: string | null;
  source: string;
  fetchedAt: string;
};
export type FormState = {
  sid?: string;
  action: string;
  controls: Control[];
  captchaSrc: string | null;
  captcha?: string | null;
  submitName: string;
  submitValue: string;
  message: string | null;
  result?: ParsedRecord | null;
  _mode?: 'picker' | 'form';
};

// ----- URLs --------------------------------------------------------------
// On native Capacitor, call the full origin so CapacitorHttp routes it
// through the native stack. On web dev, use a relative path so Vite's proxy
// handles it (keeps cookies same-origin to the dev server).
type CapRuntime = { isNativePlatform?: () => boolean };
function isNative(): boolean {
  try {
    const w = window as unknown as { Capacitor?: CapRuntime };
    return !!(w.Capacitor && typeof w.Capacitor.isNativePlatform === 'function' && w.Capacitor.isNativePlatform());
  } catch { return false; }
}
const ORIGIN = 'https://ilrms.assam.gov.in';
const BASE   = isNative() ? ORIGIN : '';
const DHAR   = `${BASE}/dhar/index.php`;
const URLS = {
  start:     `${DHAR}/Welcome/SelectLOC`,
  circles:   `${DHAR}/Welcome/getCirdivJson`,
  villages:  `${DHAR}/Welcome/getVillCodeJson`,
  submit:    `${DHAR}/Welcome/ROR`,
  dagLookup: `${DHAR}/Welcome/public_action_for_dag`,
  jamabandi: `${DHAR}/Welcome/jamabandi_report`,
};

// ----- Session state (module-scoped — one tab, one gov session) ---------
type Picker = {
  districts: Option[];
  circles: Option[] | null;
  villages: Option[] | null;
  selected: { dcode: string; sdvcode: string; cdvcode: string; mozcode: string; ltcode: string; vilcode: string };
};
type SessionState = {
  html: string | null;
  pageUrl: string;
  mode: 'picker' | 'form';
  lastCaptchaSrc: string | null;
  pendingDagRows: Array<Record<string, string>> | null;
  pendingDagNo: string;
  pendingCaptcha: string;
  picker: Picker;
};
const BLANK_PICKER = (): Picker => ({
  districts: [],
  circles: null,
  villages: null,
  selected: { dcode: '', sdvcode: '', cdvcode: '', mozcode: '', ltcode: '', vilcode: '' },
});
const BLANK_SESSION = (): SessionState => ({
  html: null,
  pageUrl: URLS.start,
  mode: 'picker',
  lastCaptchaSrc: null,
  pendingDagRows: null,
  pendingDagNo: '',
  pendingCaptcha: '',
  picker: BLANK_PICKER(),
});

let S: SessionState = BLANK_SESSION();

// ----- Primitives --------------------------------------------------------
const DEFAULT_HEADERS: Record<string, string> = {
  'Accept-Language': 'en-IN,en;q=0.9,as;q=0.8',
};

async function get(url: string, extra: Record<string, string> = {}): Promise<Response> {
  return fetch(url, { method: 'GET', credentials: 'include', headers: { ...DEFAULT_HEADERS, ...extra } });
}
async function postForm(url: string, body: URLSearchParams, extra: Record<string, string> = {}): Promise<Response> {
  return fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: '*/*', ...DEFAULT_HEADERS, ...extra },
    body: body.toString(),
  });
}

function parseHtml(html: string): Document {
  return new DOMParser().parseFromString(html, 'text/html');
}

function absolute(path: string): string {
  if (/^https?:/i.test(path)) return path;
  return `${ORIGIN}${path.startsWith('/') ? '' : '/dhar/'}${path}`;
}

// ----- Picker (districts / circles / villages) ---------------------------
async function openStart(): Promise<FormState> {
  const res = await get(URLS.start);
  S.html = await res.text();
  S.pageUrl = URLS.start;
  S.mode = 'picker';
  S.lastCaptchaSrc = null;
  parseDistricts();
  return state();
}

function parseDistricts(): void {
  if (!S.html) return;
  const doc = parseHtml(S.html);
  const items: Option[] = [];
  doc.querySelectorAll('ul#district li').forEach((li) => {
    const code = li.getAttribute('value') ?? li.getAttribute('id') ?? '';
    const label = (li.querySelector('a')?.textContent ?? '').replace(/\s+/g, ' ').trim();
    if (code && label) items.push({ value: code.trim(), text: label });
  });
  S.picker.districts = items;
}

async function selectDistrict(dcode: string): Promise<FormState> {
  const body = new URLSearchParams({ district_code: dcode });
  const res = await postForm(URLS.circles, body, { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' });
  const data = await res.json();
  S.picker.circles = (Array.isArray(data) ? data : []).map((r: Record<string, string>) => ({
    value: String(r.cir_code), text: String(r.loc_name ?? '').trim(),
  }));
  S.picker.villages = null;
  S.picker.selected = { ...S.picker.selected, dcode, sdvcode: '', cdvcode: '', mozcode: '', ltcode: '', vilcode: '' };
  return state();
}

async function selectCircle(cirCompound: string): Promise<FormState> {
  const [subdiv, circle] = String(cirCompound).split(' ');
  const body = new URLSearchParams({
    district_code: S.picker.selected.dcode,
    subdiv_code: subdiv ?? '',
    circle_code: circle ?? '',
  });
  const res = await postForm(URLS.villages, body, { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' });
  const data = await res.json();
  S.picker.villages = (Array.isArray(data) ? data : []).map((r: Record<string, string>) => ({
    value: String(r.vill_code), text: String(r.loc_name ?? '').trim(),
  }));
  S.picker.selected = {
    ...S.picker.selected,
    sdvcode: subdiv ?? '', cdvcode: circle ?? '',
    mozcode: '', ltcode: '', vilcode: '',
  };
  return state();
}

function selectVillage(vilCompound: string): FormState {
  const [mouza, lot, village] = String(vilCompound).split(' ');
  S.picker.selected = {
    ...S.picker.selected,
    mozcode: mouza ?? '', ltcode: lot ?? '', vilcode: village ?? '',
  };
  return state();
}

// ----- Build the FormState the UI consumes -------------------------------
function state(): FormState {
  if (S.mode === 'picker') {
    const controls: Control[] = [
      {
        name: 'dcode', id: 'dcode', type: 'select',
        label: 'জিলা / District',
        value: S.picker.selected.dcode,
        options: [{ value: '', text: 'Select…' }, ...S.picker.districts],
        cascade: true,
      },
    ];
    if (S.picker.circles) {
      controls.push({
        name: 'cdvcode', id: 'cdvcode', type: 'select',
        label: 'চক্ৰ / Circle',
        value: S.picker.selected.cdvcode ? `${S.picker.selected.sdvcode} ${S.picker.selected.cdvcode}` : '',
        options: [{ value: '', text: 'Select…' }, ...S.picker.circles],
        cascade: true,
      });
    }
    if (S.picker.villages) {
      controls.push({
        name: 'vilcode', id: 'vilcode', type: 'select',
        label: 'গাঁও / Village / Town',
        value: S.picker.selected.vilcode ? `${S.picker.selected.mozcode} ${S.picker.selected.ltcode} ${S.picker.selected.vilcode}` : '',
        options: [{ value: '', text: 'Select…' }, ...S.picker.villages],
        cascade: false,
      });
    }
    return {
      sid: 'local',
      action: URLS.submit,
      controls,
      captchaSrc: null,
      captcha: null,
      submitName: 'submit', submitValue: 'Submit',
      message: null,
      _mode: 'picker',
    };
  }
  return parseAfterSubmit();
}

// ----- Submit to Welcome/ROR → parse the follow-up page -----------------
async function submitLocation(): Promise<FormState> {
  const sel = S.picker.selected;
  const body = new URLSearchParams(sel);
  const res = await postForm(URLS.submit, body);
  S.html = await res.text();
  S.pageUrl = res.url || URLS.submit;
  S.mode = 'form';
  return parseAfterSubmit();
}

function parseAfterSubmit(): FormState {
  if (!S.html) return state();
  const doc = parseHtml(S.html);
  const form = (doc.querySelector('#rep_frm') as HTMLFormElement | null) ?? (doc.querySelector('form') as HTMLFormElement | null);

  // CAPTCHA image URL on the ROR / jamabandi page
  const img = doc.querySelector('img[src*="captcha" i], img[src*="Captcha"]') as HTMLImageElement | null;
  const captchaSrc = img ? absolute(img.getAttribute('src') ?? '') : null;
  S.lastCaptchaSrc = captchaSrc;

  // Expose any visible selects / text inputs so the UI can render them
  const controls: Control[] = [];
  form?.querySelectorAll('select[name]').forEach((el) => {
    const name = (el as HTMLSelectElement).name;
    const options = Array.from(el.querySelectorAll('option')).map((o) => ({
      value: (o as HTMLOptionElement).value ?? '', text: (o.textContent ?? '').trim(),
    }));
    controls.push({
      name, id: (el as HTMLElement).id || name, type: 'select',
      label: name,
      value: (el as HTMLSelectElement).value ?? options[0]?.value ?? '',
      options,
    });
  });
  form?.querySelectorAll('input[type=text], input:not([type])').forEach((el) => {
    const i = el as HTMLInputElement;
    if (!i.name || /capt/i.test(i.name) || i.type === 'hidden') return;
    controls.push({
      name: i.name, id: i.id || i.name, type: 'text',
      label: i.name, value: i.value ?? '',
    });
  });

  const message = (doc.querySelector('[id*="msg" i],[class*="error" i],[class*="alert" i]')?.textContent ?? '').trim() || null;

  return {
    sid: 'local',
    action: S.pageUrl,
    controls,
    captchaSrc,
    captcha: captchaSrc,     // on client we can set the <img src=…> directly; cookies travel
    submitName: 'submit', submitValue: 'Submit',
    message,
    _mode: 'form',
  };
}

// ----- The two-step dag flow --------------------------------------------
async function submitDag(captcha: string, dagNo: string, pattaTypeNo = ''): Promise<FormState> {
  // Fast-path: user already picked a patta row → go straight to jamabandi.
  if (pattaTypeNo) {
    const row = S.pendingDagRows?.find((r) => r.patta_type_code === pattaTypeNo);
    return fetchJamabandi({
      district_code: row?.dist_code ?? S.picker.selected.dcode,
      subdiv_code:   row?.subdiv_code ?? S.picker.selected.sdvcode,
      circle_code:   row?.cir_code ?? S.picker.selected.cdvcode,
      mouza_code:    row?.mouza_pargona_code ?? S.picker.selected.mozcode,
      lot_code:      row?.lot_no ?? S.picker.selected.ltcode,
      village_code:  row?.vill_townprt_code ?? S.picker.selected.vilcode,
      dag_no:        dagNo,
      patta_type_no: pattaTypeNo,
      CaptchaCode:   captcha,
    });
  }

  // Step 1: dag-type lookup (returns JSON array of matching pattas)
  const body = new URLSearchParams({
    district_code: S.picker.selected.dcode,
    subdiv_code:   S.picker.selected.sdvcode,
    circle_code:   S.picker.selected.cdvcode,
    mouza_pargona_code: S.picker.selected.mozcode,
    lot_no:        S.picker.selected.ltcode,
    village_code:  S.picker.selected.vilcode,
    dag_no:        dagNo,
    captcha,
  });
  const res = await postForm(URLS.dagLookup, body, {
    Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest',
  });
  let rows: Array<Record<string, string>> = [];
  try { rows = (await res.json()) as Array<Record<string, string>>; if (!Array.isArray(rows)) rows = []; } catch { rows = []; }

  if (rows.length === 0) {
    await submitLocation();   // re-roll the CAPTCHA
    return { ...parseAfterSubmit(), message: 'Wrong CAPTCHA or wrong dag number. Please try again.' };
  }

  if (rows.length === 1) {
    const r = rows[0];
    return fetchJamabandi({
      district_code: r.dist_code,
      subdiv_code:   r.subdiv_code,
      circle_code:   r.cir_code,
      mouza_code:    r.mouza_pargona_code,
      lot_code:      r.lot_no,
      village_code:  r.vill_townprt_code,
      dag_no:        r.dag_no,
      patta_type_no: r.patta_type_code,
      CaptchaCode:   captcha,
    });
  }

  // Multiple matches: expose a chooser
  S.pendingDagRows = rows;
  S.pendingDagNo = dagNo;
  S.pendingCaptcha = captcha;
  return chooserState(rows);
}

function chooserState(rows: Array<Record<string, string>>): FormState {
  const options: Option[] = [{ value: '', text: 'Select…' }].concat(
    rows.map((r) => ({
      value: r.patta_type_code,
      text: `দাগ নং ${r.dag_no} — ${r.patta_type_name} পট্টা, ${r.mouza_name} / ${r.lot_name}`,
    })),
  );
  return {
    sid: 'local',
    action: URLS.jamabandi,
    controls: [{
      name: 'patta_type_no', id: 'patta_type_no', type: 'select',
      label: 'Patta type (পট্টাৰ ধৰণ)',
      value: '', options,
    }],
    captchaSrc: null,
    submitName: 'submit', submitValue: 'See Jamabandi',
    message: `${rows.length} matching pattas — pick one and press Search.`,
    _mode: 'form',
  };
}

async function fetchJamabandi(fields: Record<string, string>): Promise<FormState> {
  const res = await postForm(URLS.jamabandi, new URLSearchParams(fields));
  S.html = await res.text();
  S.pageUrl = res.url || URLS.jamabandi;
  const parsed = parseAfterSubmit();
  const result = parseJamabandiRecord();
  return { ...parsed, result };
}

// ----- Jamabandi record parser (same shape as the old backend) ----------
function parseJamabandiRecord(): ParsedRecord | null {
  if (!S.html) return null;
  const doc = parseHtml(S.html);
  const report = doc.querySelector('table.report');
  if (!report) return null;

  const fields: RecordField[] = [];
  report.querySelectorAll('.float-left').forEach((el) => {
    const label = (el.querySelector('b')?.textContent ?? '').replace(/\s*:\s*$/, '').replace(/\s+/g, ' ').trim();
    const bNode = el.querySelector('b');
    const value = (() => {
      const clone = el.cloneNode(true) as HTMLElement;
      clone.querySelectorAll('b').forEach(b => b.remove());
      return clone.textContent?.replace(/\s+/g, ' ').trim() ?? '';
    })();
    if (label && value && bNode) fields.push({ label, value });
  });

  const owners: string[] = [];
  report.querySelectorAll('tbody p').forEach((p) => {
    const txt = (p.textContent ?? '').replace(/\s+/g, ' ').trim();
    if (/^\s*\d+\)\s*/.test(txt) && txt.length < 160) {
      owners.push(txt.replace(/^\s*\d+\)\s*/, '').trim());
    }
  });
  if (owners.length) fields.push({ label: 'Pattadar(s) — পট্টাদাৰ', value: owners.join('\n') });

  const html = sanitiseReportTable(report);

  return {
    title: 'Jamabandi (জৰীপ হোৱা গাঁওৰ জমাবন্দী)',
    fields,
    tables: [],
    html,
    source: S.pageUrl,
    fetchedAt: new Date().toISOString(),
  };
}

function sanitiseReportTable(table: Element): string {
  const clone = table.cloneNode(true) as HTMLElement;
  clone.querySelectorAll('script, style, link, noscript, iframe, img, .watermark1, .watermark2, .show-on-print').forEach(n => n.remove());
  clone.querySelectorAll('*').forEach((el) => {
    for (const attr of Array.from(el.attributes)) {
      if (/^on/i.test(attr.name)) el.removeAttribute(attr.name);
    }
  });
  const wrap = document.createElement('div');
  wrap.className = 'jamabandi-report';
  wrap.appendChild(clone);
  return wrap.outerHTML;
}

// ----- Public API — matches the old backend client shape ---------------
export const api = {
  async session(): Promise<FormState> {
    S = BLANK_SESSION();
    return openStart();
  },
  async select(_sid: string, name: string, value: string): Promise<FormState> {
    if (name === 'dcode')   return selectDistrict(value);
    if (name === 'cdvcode') return selectCircle(value);
    if (name === 'vilcode') return Promise.resolve(selectVillage(value));
    throw new Error(`Unknown select: ${name}`);
  },
  async captcha(_sid: string): Promise<FormState> {
    if (S.mode === 'form') return submitLocation();
    return state();
  },
  async submit(_sid: string, captcha: string, values: Record<string, string>): Promise<FormState> {
    if (S.mode === 'picker') {
      if (values.dcode)   await selectDistrict(values.dcode);
      if (values.cdvcode) await selectCircle(values.cdvcode);
      if (values.vilcode) selectVillage(values.vilcode);
      const sel = S.picker.selected;
      if (!sel.dcode || !sel.cdvcode || !sel.vilcode) {
        return { ...state(), message: 'Please pick district, circle and village first.' };
      }
      return submitLocation();
    }
    // Form mode
    const effCaptcha = values.patta_type_no ? (S.pendingCaptcha || captcha) : captcha;
    const dag = values.dag_no || S.pendingDagNo || '';
    return submitDag(effCaptcha, dag, values.patta_type_no ?? '');
  },
  discard(_sid?: string): void { S = BLANK_SESSION(); },
  async health(): Promise<boolean> { return true; },
};
