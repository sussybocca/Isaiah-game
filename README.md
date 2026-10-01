# ISAIAH: THE HOUSE AFTER DARK

A playable first-chapter 3D supernatural stealth/puzzle-horror **prototype** in React, TypeScript, Three.js and React Three Fiber. Original story and procedural assets, inspired by the genre's adaptive tension, puzzles and environmental interactions. No `Hello Neighbor` art, sound, code, or characters are included.

## Privacy

The private prototype includes an original cropped photograph provided by the project owner, used for Isaiah's avatar and portrait. **Do not publish this project publicly without first removing/replacing the two `src/assets/isaiah-*.jpg` files.** The fictional dream-house layout, Keeper and events are not a representation of any real home, person or incident. No personal location, contact details or exact floor plan are embedded.

## Quick start

```bash
npm install
npm run dev
```

Open the local address shown by Vite, usually `http://localhost:5173`. For a production build, run `npm run build` and `npm run preview`.

## Controls

- **WASD / arrow keys:** move; **Shift:** run; **C:** crouch; **E:** interact.
- **P:** phone and key hints; **F:** phone light; **J:** journal; **M:** toggle audio; **Esc:** close panels.
- On touch devices, use the on-screen directional controls and action buttons. Landscape orientation is recommended.

## Chapter 1: Six Echoes

Find six enchanted keys and explore the dream house. Open one of the three dream exits to select the ending. Clue notes expand the journal. Your phone provides hints and a battery-powered light. The Keeper follows a state machine (patrol, investigate, chase, return); its alert radius responds to in-game movement modes, light, and the number of dream rewinds. Three captures end the chapter in a nonviolent nightmare-loop screen. During the first two captures, select one of three story dialogue options and restart from the dream's opening scene, retaining discoveries.

The avatar has a photograph-derived face texture over a procedural humanoid mesh, with animated walk/run/crouch cycles. The short breath/grunt sound is synthesized with Web Audio and is **not** an imitation of the owner's actual voice.

## Netlify

1. Create a **private** GitHub repository and push this project's files.
2. In Netlify, import that repository. `netlify.toml` already defines `npm run build`, Node 22, and the `dist` publish directory.
3. Deploy. No environment variables or external APIs are needed.

**Important:** Netlify deployments are publicly accessible by default, even if the source repository is private. To prevent distributing the personal photograph, replace the two source photos with a fictional avatar before publicly deploying, or configure access restrictions on the site.

## Current scope

This is a functional prototype rather than a studio-quality released game. Avatar and environments use procedural geometry/materials, not sculpted/rigged AAA characters or motion-captured animation. Eight source and functional rule tests are included (`npm test`). The project includes TypeScript/TSX source files, but a full Vite production build and interactive WebGL browser playtest must be performed in an environment that can download npm dependencies. The avatar and environment are stylized procedural meshes, not a photorealistic, studio-quality release.

## Publishing to GitHub

A GitHub connector may support writing files to an **existing** repository while not supporting creating the repository itself. If needed, create an empty **private** repository named `isaiah-house-after-dark` in GitHub, then from this folder run:

```bash
git init
git add .
git commit -m "Initial Chapter One prototype"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/isaiah-house-after-dark.git
git push -u origin main
```

There is also a GitHub Actions workflow to run `npm test` and `npm run build` in the new repository. Remember that a public Netlify deployment can expose the personal character photographs even when the GitHub repository is private.
