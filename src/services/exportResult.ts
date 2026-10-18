// Capture the land-record DOM node as PNG or PDF and save it.
//
// Platforms
//   • Web / dev   — triggers a browser download via <a download>
//   • Capacitor Android — writes to Documents/ via @capacitor/filesystem
//     and opens the native share sheet so the user can open or forward it.
//
// Nothing is uploaded anywhere; the file never leaves the device.

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

type Options = { filename?: string; scale?: number };

type CapRuntime = { isNativePlatform?: () => boolean };
function isNative(): boolean {
  try {
    const w = window as unknown as { Capacitor?: CapRuntime };
    return !!(w.Capacitor && typeof w.Capacitor.isNativePlatform === 'function' && w.Capacitor.isNativePlatform());
  } catch { return false; }
}

async function render(node: HTMLElement, scale = 2): Promise<HTMLCanvasElement> {
  return html2canvas(node, {
    backgroundColor: '#ffffff',
    scale,
    useCORS: true,
    windowWidth: Math.max(node.scrollWidth, 820),
  });
}

function dataUrlToBase64(dataUrl: string): string {
  const i = dataUrl.indexOf(',');
  return i >= 0 ? dataUrl.slice(i + 1) : dataUrl;
}

function triggerDownload(dataUrl: string, filename: string) {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/**
 * Save `data` (as a data URL) under Documents/ on Android and open the share
 * sheet so the user can preview, save-as or forward it. Returns the file's
 * on-device URI so a toast can show it.
 */
async function saveToDevice(dataUrl: string, filename: string): Promise<string | null> {
  if (!isNative()) {
    triggerDownload(dataUrl, filename);
    return null;
  }
  try {
    const [{ Filesystem, Directory }, share] = await Promise.all([
      import('@capacitor/filesystem'),
      import('@capacitor/share').catch(() => null),
    ]);
    const base64 = dataUrlToBase64(dataUrl);
    const written = await Filesystem.writeFile({
      path: filename,
      data: base64,
      directory: Directory.Documents,
      recursive: true,
    });
    const uri = written.uri;
    // Open the share sheet so the user can tap "Save to Downloads" or forward it.
    try {
      await share?.Share.share({
        title: filename,
        text: 'Jamabandi record from Assam Dharitre',
        url: uri,
        dialogTitle: 'Save or share',
      });
    } catch { /* user cancelled share, file is still on disk */ }
    return uri;
  } catch (e) {
    // Fall back to a browser download if the native write failed.
    triggerDownload(dataUrl, filename);
    return null;
  }
}

export async function downloadPng(node: HTMLElement, { filename = 'land-record.png', scale = 2 }: Options = {}): Promise<string | null> {
  const canvas = await render(node, scale);
  const url = canvas.toDataURL('image/png');
  return saveToDevice(url, filename);
}

export async function downloadPdf(node: HTMLElement, { filename = 'land-record.pdf', scale = 2 }: Options = {}): Promise<string | null> {
  const canvas = await render(node, scale);
  const imgData = canvas.toDataURL('image/png');

  const pageWidth  = 595.28;
  const pageHeight = 841.89;
  const margin = 24;
  const usableWidth = pageWidth - margin * 2;
  const scaleRatio = usableWidth / canvas.width;
  const imgHeight  = canvas.height * scaleRatio;

  const pdf = new jsPDF({ orientation: 'p', unit: 'pt', format: 'a4' });
  let drawn = 0;
  while (drawn < imgHeight) {
    if (drawn > 0) pdf.addPage();
    pdf.addImage(imgData, 'PNG', margin, margin - drawn, usableWidth, imgHeight, undefined, 'FAST');
    drawn += pageHeight - margin * 2;
  }

  // jsPDF supports datauristring output directly; feed it through the
  // save-to-device path so Android gets the native share sheet.
  const dataUrl = pdf.output('datauristring'); // "data:application/pdf;filename=...;base64,..."
  return saveToDevice(dataUrl, filename);
}
