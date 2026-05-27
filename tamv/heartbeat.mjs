import { inspectState, loadManifest, publishHeartbeat } from './core/federation-bus.mjs';

const manifest = await loadManifest();
const event = await publishHeartbeat(manifest, process.env.TAMV_STATE_DIR || '.tamv/state');
const state = await inspectState(process.env.TAMV_STATE_DIR || '.tamv/state');

console.log(JSON.stringify({ status: 'ok', event, state }, null, 2));
