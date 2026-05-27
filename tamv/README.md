# TAMV Federation Bootstrap

This directory is the first executable connection layer for the TAMV repository network.

## What it does

- Defines a shared node manifest contract in `protocol/tamv-federation-v1.schema.json`.
- Registers this repository as `tamv.orchestrator` in `node.manifest.json`.
- Provides a dependency-free Node.js event bus in `core/federation-bus.mjs`.
- Seeds the initial registry in `registry/nodes.json`.

## Execution model

The bus is intentionally explicit and file-backed. It does not read secrets, does not open sockets, and does not call external services by default. Nodes exchange information by publishing signed JSONL events into `.tamv/state/events.jsonl`; a later API or worker can move those events between repositories or services.

## Minimal local heartbeat

```sh
node -e "import('./tamv/core/federation-bus.mjs').then(async m => { const manifest = await m.loadManifest(); await m.publishHeartbeat(manifest); console.log(await m.inspectState()); })"
```

## Event contract

Every event contains:

- `protocol`: fixed to `tamv-federation-v1`
- `type`: event name such as `NODE_HEARTBEAT` or `PDF_READY`
- `source`: publishing node id
- `repository`: source repository
- `payload`: structured data
- `integrity`: SHA-256 hash of the stable event payload

## Next integration steps

1. Add `tamv/node.manifest.json` to every TAMV repository.
2. Wire frontend export actions to publish `EXPORT_REQUESTED`.
3. Wire geometry and print workers to publish `GEOMETRY_READY`, `PRINT_TEMPLATE_READY`, and `PDF_READY`.
4. Add a scheduled collector in `tamv-sovereign-api` that ingests node events and updates `datostamv`.
5. Promote quality scoring events into the self-evolution loop.
