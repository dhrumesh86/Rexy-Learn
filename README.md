# Rexy Learn

An illustrated Grade 2 learning preview rebuilt around the four supplied Rexy Learn mockup boards. React, TypeScript and Vite; deployed as a static Firebase Hosting app.

## Experience

- Navy navigation, blue headphone Rexy, cinematic dashboard, illustrated subject cards and a persistent practice tutor.
- Floating-island learning map, interactive plant experiment, drawing whiteboard, eight-page Story Studio, Parent Insights, weekly planner, achievements and the existing 3D rover game.
- Fifteen authored Grade 2 maths, reading and science questions with hints and explanations.
- Practice badges, story endings and saved family plans persist in this browser. Parent charts, profiles and progress illustrations are clearly marked sample data.
- Responsive phone layout and a desktop phone-preview toggle. Installable web app; not a native mobile-store package.

Live AI, microphone/camera capture, account sign-in and cloud progress sync are not connected. Read-aloud uses browser speech synthesis where available. Planner reminders are preferences; they do not schedule push notifications. The plant experiment is a simplified teaching model. Only sample content is shown publicly.

## Develop and check

Use Node 24 and the committed npm lockfile.

```sh
npm ci
npm run typecheck
npm test
npm run build
npm run dev
```

`npm run preview` serves the production build locally. The optional 3D game loads separately. The legacy server/API files are retained, but API functionality is unavailable in this static release.

## Publish the current branch

The deployment branch is `codex/firebase-hosting-pwa`. For a fresh Cloud Shell checkout:

```sh
git clone --branch codex/firebase-hosting-pwa https://github.com/dhrumesh86/Rexy-Learn.git Rexy-Learn-publish
cd Rexy-Learn-publish
npm ci
npm run deploy:hosting
```

For the existing `Rexy-Learn-publish` checkout:

```sh
cd Rexy-Learn-publish
git pull --ff-only
npm ci
npm run deploy:hosting
```

Run these in [Google Cloud Shell](https://shell.cloud.google.com/?project=rexy-learn-fd58e), signed into the Google account that owns the Firebase project. The script builds and publishes only Hosting to `rexy-learn-fd58e`. Publishing replaces the default Hosting site's current release. Do not use this configuration for a different app's Hosting site.

GitHub Actions runs typechecking, lesson tests and the production build, then retains the build artifact. It does not deploy. Signing into Firebase Console does not authorize a local Firebase CLI session.

## Deployment boundaries

`firebase.json` serves `dist`, rewrites app navigation to `index.html`, and returns an unavailable-service payload for `/api/**`. Microphone, camera and geolocation capture are disabled by Hosting headers. The service worker caches only the public offline page and an icon; lessons are not available offline. This release does not change billing, create a database, or deploy existing Firestore rules.

The old Firebase integrations and rules remain in the repository for future work. They are not part of the new mounted experience. Review rules, authentication and owner isolation before implementing real family data or server-enforced parent/admin roles. Never commit credentials.

## Phone installation

Android Chrome: use the browser's Install app/Add to Home screen menu. iPhone Safari: Share → Add to Home Screen. Real phones automatically use the narrow layout. Device-specific install and speech support still require testing.

See [visual rebuild notes](docs/visual-rebuild.md) for artwork and validation details.
