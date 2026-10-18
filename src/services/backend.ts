// Backwards-compatible shim: the UI used to import { api } from './backend'.
// The backend process is gone — everything runs client-side now. This file
// just re-exports the client-side driver so existing imports keep working.
export * from './dharitreeClient';
