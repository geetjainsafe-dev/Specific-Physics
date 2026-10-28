# Specific Physics

**Specific Physics** is a client-side, interactive Class 11 physics laboratory aimed at students preparing for JEE Main and JEE Advanced. The website combines a minimal black-and-white learning interface with colourful scientific visualizations. The calculations live in reusable TypeScript modules, separately from the React presentation components.

## What's included in this build

- Responsive dashboard with searchable chapter and lab navigation.
- Chapter guides for the 15 requested areas, key concepts, formula conditions, and progressive learning labels.
- Formula library with chapter filters and text search.
- Practice mode with answer explanations.
- Interactive models: unit conversion, straight-line motion, projectile motion, vector components, static/kinetic friction, ideal and massive-pulley Atwood machine, relative motion and closest approach, river–boat crossing strategies, uniform circular motion, banked-road turning and friction speed limits, torque, work and energy, spring-mass SHM, gravity versus altitude, stress and strain, hydrostatic pressure, calorimetry, an isothermal ideal-gas process, qualitative molecular motion with analytical ideal-gas results, and travelling waves.
- Live result panels, semantic vector colours, playback controls for time-based models, and SVG graphs for supported models.
- Vitest checks for representative equations and boundary cases.

The chapter guide covers the broader requested syllabus, but this is a **working first release**, not a claim that every simulation in the long master specification is already implemented. In particular, detailed versions of every river/boat, rain/person, monkey/projectile, banked-road, multi-block wedge, vertical-circle, rolling, standing-wave, phase-change, and other requested specialist scenario still need dedicated modules. Several chapters currently link to a related foundation lab rather than a bespoke simulator for every subtopic. These are identified by the specific labs that exist in the sidebar and chapter guide.

## Verification status for this generated source

- All 37 TypeScript/TSX source files passed syntax transpilation in the generation environment.
- The standalone physics module passed TypeScript checking, and representative calculation smoke tests passed.
- A strict source pass with local ambient API stubs found no additional source-level type issues.
- **The full Vite production build and the actual Vitest runner were not run successfully here** because this environment could not resolve `registry.npmjs.org` during `npm install` (`EAI_AGAIN`). Install dependencies in an environment with npm registry access, then run the test/build commands below before relying on a deployment.

## Requirements

- Node.js 20+ (Node 22 recommended)
- npm

## Run locally

1. Extract the ZIP.
2. Open a terminal in the extracted `specific-physics-project` folder.
3. Install packages:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open the local address Vite prints in the terminal.

## Test and production build

```bash
npm test
npm run build
npm run preview
```

The production build is emitted to `dist/`. Physics functions can be found in `src/physics/mechanics.ts`, while interactive lab UIs are separated under `src/simulations/labs/`.

## Deploy to GitHub and Vercel

1. Extract the ZIP and create or open a GitHub repository.
2. Upload the **contents** of the project folder (not the ZIP file itself). `package.json`, `index.html`, `src/`, and `vite.config.ts` should be at the repository root.
3. Import the repository in Vercel.
4. Use these settings, or let Vercel detect Vite:
   - Framework preset: **Vite**
   - Build command: `npm run build`
   - Output directory: `dist`
   - Install command: `npm install`
5. Deploy. `vercel.json` contains an SPA rewrite so refreshing a chapter or simulation route serves `index.html`.

No backend, private API key, sign-in, or external physics service is required for the simulation calculations. The optional Google Fonts import is only for typography; the interface falls back to system sans-serif if fonts are unavailable.

## Model conventions and limits

- The models state their main assumptions in the lab workspace.
- Constant-acceleration and ideal projectile calculations are analytical.
- Friction uses a basic Coulomb model. Static friction self-adjusts until its limit; kinetic friction is used while sliding.
- Atwood's massive pulley is a uniform solid disc with an inextensible string and no slip.
- Circular-motion results treat speed as constant.
- Work–energy assumes the entered work is the net work.
- SHM uses an ideal, undamped Hookean spring.
- Gravity-versus-altitude assumes a spherical planet and an exterior point.
- Calorimetry ignores phase changes, container heat capacity, and environmental heat loss.
- The molecular dots are qualitative; displayed pressure and RMS speed come from ideal-gas equations.
- The wave lab uses a sinusoidal travelling-wave model.

The numeric ranges are classroom exploration ranges, not a promise that every selected state models all real-world material or operating limits.

## Project structure

```text
src/
  components/       Shared navigation, controls, cards, graphs and simulation layout
  data/             Chapter and lab metadata
  pages/            Dashboard, chapter guide, formula library and practice mode
  physics/          Reusable equations separated from UI
  simulations/labs/ Individual interactive labs
  tests/            Automated physics tests
  styles.css        Responsive monochrome interface and simulation styling
```

## Troubleshooting

- **Vercel shows 404:** ensure the repository contains the extracted source files, not only a ZIP, and confirm output directory `dist`; keep `vercel.json` at the repository root.
- **Blank local page:** run `npm install`, then `npm run dev`; inspect the terminal for TypeScript or import errors.
- **Build fails:** run `npm test` and `npm run build` locally and read the first reported error. Node 20+ is recommended.
- **A lab route doesn't exist:** check the lab links exposed in the dashboard and chapter guide; the roadmap includes more topics than this first interactive release implements as separate lab components.
