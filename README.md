# Ninja and Lava

Ninja and Lava is a desktop-first 3D endless runner that runs in the browser. Guide an automatically running ninja across a three-lane bridge, collect stars, dodge spike balls, and use hearts to keep the run alive.

## Play

**[Play the live demo](https://ernikki.github.io/NinjaAndLava/)**

The initial scene loads several 3D assets, so startup can take a little time.

## Gameplay

- Move between the left, center, and right lanes or jump over danger.
- Collect a star to add one point to the score.
- Start with three lives; spike balls remove a life and hearts add one.
- After a hit, the ninja is invulnerable for about three seconds. During that time, stars, hearts, and spike balls cannot interact with the player.
- The run ends when the remaining-life count reaches zero.

The current implementation does not cap collected hearts at the three starting lives.

## Controls

| Input | Action |
| --- | --- |
| `A` or Left Arrow | Move one lane left |
| `D` or Right Arrow | Move one lane right |
| Space | Jump |
| `Esc` | Pause |
| `1`, `2`, or `3` | Select a camera preset |
| `4` | Enable or disable orbit-camera controls |
| Left-drag / right-drag / mouse wheel | Rotate / pan / zoom the enabled orbit camera |

There are no touch or swipe controls for player movement.

## Tech Stack

- JavaScript ES modules
- Three.js for the scene, WebGL rendering, asset loading, and `Box3` collision bounds
- Tween.js for character and spike-ball animation
- HTML and CSS for the menu, tutorial, loading screen, HUD, pause overlay, and game-over overlay

Three.js, Tween.js, and their loaders are vendored in `libs/`. There is no npm dependency installation, bundler, or build step; only Normalize.css is requested from a CDN.

## Getting Started

Requirements: a modern desktop browser with WebGL and JavaScript-module support, a keyboard, and any static HTTP server. With Python 3:

```bash
git clone https://github.com/ErNikki/NinjaAndLava.git
cd NinjaAndLava
python3 -m http.server 8000 --directory ..
```

Then open [http://localhost:8000/NinjaAndLava/](http://localhost:8000/NinjaAndLava/). Keep the checkout directory named `NinjaAndLava`: `game.html` loads its scripts from the absolute `/NinjaAndLava/` path. Opening the HTML files directly with `file://` is not supported reliably by browser module security rules.

## Project Layout

- `main.js` creates the scene and coordinates the frame loop and UI.
- `world.js` builds the environment and moves and spawns gameplay objects.
- `player.js`, `animations.js`, `controls.js`, and `collisions.js` implement the ninja and game rules.
- `loader.js`, `assets/`, and `libs/` contain runtime loaders, models, textures, and vendored libraries.
- `docs/` contains the full technical documentation.

## Documentation

Start with the **[technical documentation index](docs/README.md)**:

- [Architecture and game loop](docs/architecture.md)
- [Gameplay systems](docs/gameplay.md)
- [Rendering and animation](docs/rendering.md)
- [Development, deployment, and extension guide](docs/development.md)

## Project Status

This is a self-contained educational browser game. It has no backend, persistent high score, mobile player controls, audio, automated test suite, or build pipeline.

## Contributing and Support

Contributions can be proposed through a focused pull request. For support or bug reports, [open a GitHub issue](https://github.com/ErNikki/NinjaAndLava/issues). Asset credits and licensing notes are recorded in the [development guide](docs/development.md#credits-and-licensing).

## License

The repository does not include a project-wide license, so its source code has no explicit open-source grant. Vendored libraries and third-party assets remain subject to their own licenses and attribution requirements.
