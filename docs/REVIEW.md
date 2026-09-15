# Client review

This repository contains the SeraFace client. The separate AI server was not changed or contacted. Sample mode is a functional client demonstration, not an implementation of skin analysis. Native installed behavior requires a separate device run.

## Service contract

Set `EXPO_PUBLIC_SERAFACE_API_URL` before bundling. Remote addresses require HTTPS; loopback HTTP is permitted for local development. Requests time out after 30 seconds. The service must allow browser CORS when web mode is used.

| Stage | Request | Required response |
| --- | --- | --- |
| Profile | POST `/api/v1/skincare/phase1/form-analysis` with JSON profile | Nonempty string `session_id`; optional `form_index` |
| Image | POST `/api/v1/skincare/phase2/image-analysis?session_id=...` with multipart field `file` | Object `ai_output` |
| Products | POST or GET `/api/v1/skincare/phase3/product-recommendations?session_id=...` | Object `products`, mapping category names to arrays |
| Routine | POST or GET `/api/v1/skincare/phase4/routine-creation?session_id=...` | Array `routine` |

Subsequent requests include `X-Session-ID`. This is a workflow identifier, not account authentication. No API secret is embedded in the client.

Profile fields: `skin_type`, `skin_conditions`, `allergies`, `goals` are string arrays; `budget` is a positive decimal PHP amount; `custom_goal` is a string; `product_experiences` contains `{ product, experience, reason }`, with experience `good`, `bad` or `neutral`.

Each product requires a nonempty `name`. Optional fields: `price` (PHP number or decimal string with optional PHP/₱ prefix), `description`, `product_link`. Unsupported currency/price formats remain unknown; they are not stripped into a misleading number. All category items are preserved. A response over 200 products is rejected.

Each routine requires a string `name`, string array `time`, and string array `instructions`. Optional string `description` is displayed. The client lists supplied entries and their time labels; it does not schedule alarms. A response over 100 steps is rejected. Missing/invalid responses produce errors, never generated substitutes.

## Verification

Verified on Node 24.20: clean npm install, audit (zero vulnerabilities), lint, Expo dependency check and 21/21 doctor checks. Three model checks, sample browser workflow and local API fixture workflow passed. Configuration introspection parsed successfully for Expo 57. Android and iOS Hermes exports also passed. Installed native behavior remains unverified.

Use `npm ci`, `npm run lint`, `npm run check`, `npx expo-doctor`, `npm run build:web`, then `npm test`. Browser checks use installed Chrome by default; `BROWSER_CHANNEL` can override the Playwright channel.

The model checks cover decimal money, unknown-price totals, profile boundaries, response validation, full product preservation and safe product links. Browser checks exercise the complete sample path, experience removal, saved plan reload, daily checkbox, clear confirmation, malformed storage recovery, failed-write retry and a 320px viewport. They assert no remote requests in sample mode.

For the isolated service-contract check, export web to `api-web` with `EXPO_PUBLIC_SERAFACE_API_URL=http://127.0.0.1:9077` and `--clear`, then run `node tools/api-check.mjs`. Playwright intercepts this address with local fixtures; no AI server is needed or contacted. The check uses the app icon as a nonpersonal upload fixture and verifies actual multipart bytes, session headers, failed and malformed responses, retry, no sample fallback and unknown prices.

After changing that environment variable, clear Metro's cache when exporting sample mode again. Generated `dist`, `api-web`, native folders and native exports are not committed.

Native verification commands: `npx expo export --platform android --platform ios --output-dir native-export` and `npx expo config --type introspect --json`. Hermes export and configuration inspection do not prove installation, native photo permissions, keyboard behavior or live service compatibility. This Windows environment has no Android SDK/emulator or Xcode; these remain explicit release checks.

## Review findings

| Pattern | Type | Occurrences | Files | Fix |
| --- | --- | --- | --- | --- |
| Silent fabricated fallback and random ratings | Misleading state | Product, report, routine and budget paths | Main/detail screens | Explicit fictional sample mode; honest empty/error states in connected mode |
| Request payload/session/photo logs | Data exposure | Both old transports and callers | API and screens | Single transport, no payload logs |
| First-only product truncation | Data loss | Store and product transform | Skincare slice, product screen | Preserve all returned category items |
| Empty cart/upload actions | Broken interaction | Two actions | Product and scan screens | Real local purchase plan and explicit photo submission |
| Experience removal compares object to index | State bug | One reducer | Skincare slice | Remove by supplied index |
| Raw persistence of temporary image/loading state | State recovery | Store | Store and gate | Versioned projection, validation, retry and reset; photos excluded |
| Custom tab pressable reloads browser | Navigation | All tabs | App | Standard navigator tab control |
| Gradient mask text/icons fail in web preview | Accessibility/rendering | Shared header/navigation | Shared components | Solid readable text/icons; retain brand gradients on suitable surfaces |

Unused, unreachable prototype screens and their orphan components were removed. Their original contents remain in Git history. No implemented community, chat, map or diet feature was removed from a reachable user flow.

## Visual review

Frontend-design and Impeccable guided the pass. The original palette and profile choice controls remain the visual reference. Review covered the real browser flow, phone screenshots and a 320px layout. Shared rows replace fabricated recommendation panels; unknown prices, mode labels and local-state feedback are visible. The mechanical detector returned no findings for the selected screens, shared workspace component and CSS; that does not certify native StyleSheet accessibility.

Screenshots in `docs/images` are produced by the browser check from the running web export. They contain only fictional sample products/routine entries. They are not native captures or AI-generated mockups.

## Release boundaries

The web export can be hosted as static files with an index fallback. For a native release, generate platform projects from the Expo config and validate on an installed device. Existing app identifiers and EAS project ID are retained; no cloud build, deployment, signing or store publication was performed.

Before enabling a real service, verify its exact response contract, CORS, transport security, user-facing data handling and service-specific authentication. This client does not verify clinical accuracy, own the separate server, implement purchase checkout, or synchronize concurrent windows. Local state is unencrypted and service sessions can expire; submit a new profile to start a fresh session. Older prototype snapshots are not migrated; clearing local data also removes the old `persist:root` key.
