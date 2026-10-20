# Mockup-based visual rebuild

The mounted experience is `src/experience/RexyExperience.tsx`; styles are scoped in `src/experience/rexy.css`. The previous App remains available as source but is no longer mounted.

## Reference mapping

| Supplied mockup board | Implemented surfaces |
| --- | --- |
| Blue Dino Learning Journey | Navy sidebar, dashboard metrics, storybook hero, three subject cards, journey, weekly chart, tutor rail, phone layout |
| Learning path and discovery lab | Floating islands and selectable activities; garden experiment, sunlight/water sliders, predictions and outcomes |
| Parent insights and weekly rhythm | Sample progress charts, reflection, skill cards, weekday session blocks, family controls, saved planner |
| Voice Tutoring & Story Studio | Authored text tutor, drawable whiteboard, ten frames, story illustrations, vocabulary, predictions and story writing |

Artwork follows the reference direction rather than reproducing the boards pixel for pixel. All headings, controls, charts and labels are live HTML. The voice UI explains its unavailable state; no fake recording or AI response is presented.

## Generated artwork

Created with the built-in image generator using the supplied mockups as visual direction. The output files were resized/compressed to WebP for the app. Transparent mascot artwork also supplies the install icons. No remote image hotlinks are used.

| Asset in `public/assets/rexy-v3` | Prompt direction / mode |
| --- | --- |
| `hero.webp` | Generation: wide cinematic storybook banner; friendly blue headphone dinosaur at the left with glowing open book, magical navy forest and stars; quiet space on the right; no text or UI. |
| `world.webp` | Generation: blue/pink/green floating learning islands, miniature castle, cottage and greenhouse, dreamy clouds, friendly blue Rexy with yellow backpack; no text or UI. |
| `subjects.webp` | Generation: continuous three-panel illustrated subject atlas, blue mathematical blocks, pink reading forest, green science valley; no text or UI. |
| `story.webp` | Generation: warm sunlit garden, Lily in yellow overalls kneeling beside friendly blue headphone Rexy and a small sprout; polished storybook illustration; no text or UI. |
| `mascot.webp` | Transparent-background generation: full-body friendly blue headphone Rexy, waving, polished soft 3D storybook style, isolated, no text. |

## Functional scope

Authored tutor replies support the displayed example. The whiteboard supports drawing, colours, erasing, undo and clear. The plant sliders change a simplified model. Story paging, vocabulary, predictions and ending storage work locally. All three practice banks include five questions, hints, answer checks and completion badges. The weekly planner saves locally. Sample dashboard and parent metrics do not claim to measure activity.

## Validation

- TypeScript check and production build passed.
- Four automated lesson tests cover question integrity, tutor answer matching, plant conditions and default session totals/story length.
- Local jsdom interaction smoke check passed: all eight main routes, plant test, saved story ending, saved planner, full five-question quiz, and persisted earned badge. Canvas was stubbed for this check; drawing pixels were not verified by it.
- Cloud Browser could not open the local preview in this session. Visual screenshots, real-device layout, speech voices, touch drawing and install flows remain to be verified after deployment.
- The 3D game remains a separately loaded large bundle; Vite reports its size as a build warning.

Deployment is a separate action. This source update alone does not replace the live Firebase release.
