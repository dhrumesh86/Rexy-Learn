# Rexy Learn

A React/Vite learning prototype with an installable phone experience, prepared for Firebase Hosting on the existing `rexy-learn` project.

## Current release

- Authored activities, stories, whiteboards, plant simulation and games.
- Sample profiles, reports, classroom data and admin screens. These are demonstrations, not live integrations or access-control boundaries.
- Progress currently lives in React state and resets on reload. Cloud progress sync is a subsequent implementation.
- Google sign-in code uses the registered Rexy Learn Web application configuration. Authentication has been initialized; Google provider activation is pending confirmation of the public support email. Verify authorized domains after deployment.
- Live AI, search/maps grounding, media generation, API telemetry and microphone capture are disabled. Adding an API key does not enable the legacy routes. Provider eligibility, authenticated backend design and usage controls must be reviewed before implementation.
- Installable web app, not a native App Store or Play Store package. Offline mode displays a reconnect page; lessons are not cached for offline use.

## Develop and validate

Use Node 24 and npm (the committed npm lockfile is authoritative).

```sh
npm ci
npm run typecheck
npm run build
npm run dev
```

`npm run dev` starts the legacy Express/Vite development server. `npm run preview` serves the production frontend locally after building. API routes intentionally remain unavailable.

## Publish through ChatGPT

Connect the official Firebase plugin to the Google account that owns `rexy-learn`. The deployment configuration publishes only static Hosting files. The plugin connection is separate from signing into the Firebase Console browser.

## Alternative: publish from your browser

Open [Google Cloud Shell](https://shell.cloud.google.com/?project=rexy-learn) with the same Google account that can access Firebase. This is browser-based. The original AI Studio Starter Tier project does not support Firebase Hosting; the separate `rexy-learn` project is on Spark. If prompted to authorize Cloud Shell, review and complete Google's prompt yourself.

After this change is merged into `main`, run:

```sh
git clone https://github.com/dhrumesh86/Rexy-Learn.git
cd Rexy-Learn
npm ci
npm run typecheck
npm run build
npx firebase-tools deploy --only hosting --project rexy-learn
```

If the directory already exists, use that checkout and `git pull --ff-only` instead of cloning again. Before merging, reviewers can use `git checkout codex/firebase-hosting-pwa` to build this branch. Check `node --version`; use Node 24 for reproducibility.

The last command publishes the app to Firebase Hosting. It does not deploy Firestore rules, change the billing plan, create a database, or host `server.ts`. Use the exact Hosting URL returned by Firebase; do not assume that a URL is live before deployment succeeds. Hosting is publicly accessible; Firebase sign-in does not make the whole site private. Only sample content should appear in the frontend.

In Firebase Console, confirm **Build → Hosting** is available and review the project's existing Hosting site before publishing; this configuration targets the default site and deployment replaces its current release. If it already hosts another application, stop and configure a separate Hosting site/target first.

For Google sign-in, check **Authentication → Sign-in method → Google** and **Settings → Authorized domains**. Add the exact deployed hostname if absent. Sign-in alone does not implement cloud learner profiles or server-enforced parent/admin roles.

Stay on Spark for this static release. This repository does not request Functions, Cloud Run, Storage uploads or a billing upgrade. A failure caused by project permissions must be resolved in your Google account; never put credentials or service-account JSON in this public repository or chat.

## Phone installation

- Android Chrome: open the deployed URL and choose **Install Rexy Learn**, or use the browser's Install app/Add to Home screen menu.
- iPhone Safari: Share → Add to Home Screen.
- Real phone widths open the phone interface without a simulated device shell. Desktop previews retain the device chooser.
- Installation depends on the browser. Device verification is still required.

## Deployment boundaries

`firebase.json` serves `dist`, rewrites app navigation to `index.html`, and returns an explicit unavailable-service payload for `/api/**`. Microphone/camera/geolocation permissions are denied in Hosting response headers for this preview. Service worker caching is limited to the public offline page and icon; it never caches Firebase, API or account responses.

Existing `firestore.rules` is retained unchanged and are **not deployed** by the hosting command. Review rules and test owner isolation in the emulator before adding real family data. The existing role field is user-editable and must not grant admin privileges.

GitHub Actions runs typechecking and a production build and saves the static artifact. It does not publish or require Google credentials. Automated deployment can follow after authenticated project access is configured.
