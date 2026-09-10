# Rendering and animation

## Three.js setup

`main.js` creates one `THREE.Scene` with a solid `0x181818` background. There is no fog, skybox, background texture, post-processing chain, particle system, or custom shader.

The renderer is a `THREE.WebGLRenderer` configured with:

- antialiasing enabled;
- pixel ratio set to `window.devicePixelRatio`;
- drawing size set to the current window dimensions;
- shadow maps enabled;
- a white clear color, which is normally superseded by the scene's dark background.

The canvas is appended to `document.body` only after the top-level loading manager finishes. Resize is handled twice: a window `resize` listener updates camera aspect and renderer size, and every frame `resizeRendererToDisplaySize()` compares the drawing buffer with the canvas's CSS dimensions and adjusts it when needed.

No explicit tone mapping, output color space, shadow-map type, or renderer power preference is configured, so the vendored Three.js defaults apply.

## Camera

The game uses one `PerspectiveCamera`:

| Property | Value |
| --- | --- |
| Field of view | `100` degrees |
| Aspect | `window.innerWidth / window.innerHeight`, updated on resize |
| Near plane | `0.1` |
| Far plane | `300` |

It begins at the first preset position. `OrbitControls` is constructed with a default target at the world origin, so its initial update orients the camera toward that target. The values below are rounded for readability; the source contains full-precision vectors.

| Key | Position `(x, y, z)` | Euler rotation `(x, y, z)` |
| --- | --- | --- |
| `1` | `(0.025, 4.009, 5.035)` | `(-0.543, -0.001, -0.001)` |
| `2` | `(7.980, 5.527, 6.902)` | `(-0.675, 0.734, 0.492)` |
| `3` | `(-0.011, 4.522, 7.498)` | `(-0.543, -0.001, -0.001)` |

The camera is fixed in world space and does not follow the player. This works for an endless-runner view because the player stays around `z = 0` and incoming objects move toward it.

`OrbitControls` has damping enabled with factor `0.25`, zoom enabled, and `autoRotate` set to true, but controls are disabled at startup. Key `4` toggles them. The game loop never calls `controls.update()`, so continuous auto-rotation and damping do not advance per frame; pointer-driven rotate, pan, and zoom still invoke controller updates while it is enabled.

## Lighting and shadows

The runtime scene contains six lights:

| Light | Main configuration | Purpose in the composition |
| --- | --- | --- |
| `AmbientLight` | color `0x16141E` | Low, cool baseline illumination for the cave. |
| `SpotLight` | orange `0xcf6010`, position `(0, 10, 0)` | Adds warm illumination above the player area. |
| `HemisphereLight` | black sky, orange ground `0xFF5900`, intensity `8` | Makes lower-facing surfaces feel lit by the lava while the upper environment remains dark. |
| Lava `RectAreaLight` | `0xff4e01`, intensity `1`, size `100 × 200`, around `(0, -6, -50)` | Broad warm source below the bridge. |
| Bridge-end `RectAreaLight` | white, intensity `20`, size arguments `12 × 8`, position `(0, 6, -100)` | Creates a bright endpoint deep along the bridge; a visible `RectAreaLightHelper` is attached. |
| Player `DirectionalLight` | white, casts shadows, position reset to `(0, 20, 0)` | Lights the articulated character from above. Its target position is updated to the waist every frame. |

The directional shadow camera uses near/far planes `1` and `25` and orthographic bounds from `-5` to `5` on both axes. Player primitive meshes cast shadows. The bridge and lava both cast and receive shadows. Gameplay OBJ models and glTF cave pieces do not have cast/receive flags enabled by the project code.

## Environment

### Lava

The lava is one `PlaneGeometry(1000, 1000)` at `y = -5`, rotated 90 degrees around x. A double-sided `MeshStandardMaterial` combines:

- `color.jpg` as the color map;
- `ao.jpg` as the ambient-occlusion map;
- `normal.jpg` as the normal map;
- `roughness.jpg` as the roughness map;
- `emissive.jpg` as the emissive map;
- `height.jpg` as the bump map;
- emissive color `0xec8058`.

Every map repeats `100 × 100`, uses repeat wrapping, and uses nearest-neighbor minification and magnification filters. The material is entirely built-in; there is no custom shader or vertex displacement animation. The mesh and UV offsets remain static.

`loader.js` contains an older `lavaGround` glTF loader referencing an `assets/lava-2/` directory that is not present. Its call in `WorldManager.createLava()` is commented out, so this dead path is not part of the runtime.

### Bridge

The bridge root is a `BoxGeometry(8, 1, 106)` at `(0, -0.5, -50)`. Its six material slots use repeated stone color and normal textures with different repeat factors for top, sides, and ends.

The bridge root owns:

- ten alternating arch meshes generated from a Bézier `Shape` and `ExtrudeGeometry` at ten-unit intervals;
- a left rail generated with `ExtrudeGeometry`, rotated and scaled along the bridge;
- a matching right rail.

The arches reuse the stone texture files through separately created texture objects. The rails use `restArmStone.jpg` and `restArmStonNMap.jpg`. The bridge is static: it is not tiled, translated, or recycled during play.

### Cave decoration

`spawnStalagamites()` starts 50 glTF loads of `assets/stalagmites/scene.gltf`. Each callback extracts the node named `stalagmite_2`, rotates it by π around z, and places it randomly:

- x in `[-80, 80)`;
- y in `[20, 60)`;
- z in `[-200, -10)`;
- independent x/y/z scale components in `[0.05, 0.2)`.

The inverted, elevated pieces read visually as hanging cave formations even though the class and method call them stalagmites. They are added to a shared container that is a direct child of the scene.

`assets/cave_background/back_cave.png` is not referenced by HTML, CSS, or JavaScript; the cave background is the scene's flat dark color plus the glTF formations.

## Player model

The ninja is a manually articulated hierarchy, not a skinned mesh or imported skeletal animation. `player.js` creates black `MeshStandardMaterial` primitives for the body and loads only the head from an OBJ/MTL asset created with MagicaVoxel.

The root `character` is raised by `1.33` world units so the feet meet the bridge. The `waist` begins at local `(0, 0, 0)` and serves as the transform animated for lane changes, jumping, damage steps, and falling.

```text
character Object3D
└── waist Object3D
    ├── torso Mesh — BoxGeometry(0.6, 1.0, 0.2)
    │   ├── neckRoot Mesh — CylinderGeometry(radius 0.08, height 0.15)
    │   │   └── head Object3D
    │   │       └── ninjaHead OBJ/MTL, scale 0.2, yaw π/2
    │   ├── left shoulder root Mesh — SphereGeometry(radius 0.08)
    │   │   └── upper arm Box → elbow sphere → lower arm Box → hand sphere
    │   └── right shoulder root Mesh — SphereGeometry(radius 0.08)
    │       └── upper arm Box → elbow sphere → lower arm Box → hand sphere
    ├── left hip root Object3D
    │   └── upper leg Box → knee sphere → lower leg Box → foot root → foot Box
    └── right hip root Object3D
        └── upper leg Box → knee sphere → lower leg Box → foot root → foot Box
```

The primitive dimensions are defined as constants in `player.js`, and parent-child pivots are placed at joints so Tween.js can rotate limbs naturally. All primitive body materials are separate instances even though they share the same black color. `headGeo`, a sphere created in the build method, is not attached; the OBJ is the rendered head.

The player's collision bound is one `Box3` rebuilt with `setFromObject(character)`. It encloses the current articulated pose rather than using one fixed capsule or box.

The constructor also creates a `Player.position` vector at `(0.5, 1.33, 0)`, but movement and collisions use `waist.position`; that vector does not drive the rendered character.

## Gameplay object models

Each gameplay object begins as an empty `Object3D` wrapper. Its loader later inserts a pivot and imported OBJ hierarchy:

| Type | Source | Transform and material behavior |
| --- | --- | --- |
| Spike ball | `assets/spikeBall/spikeball.obj` + `.mtl` | Scale `(0.7, 0.6, 0.7)`; material recolored `0x202020` with reflectivity `0.1` and gray specular; rotating tween enabled. |
| Star | `assets/Star/star.obj` + `.mtl` | Uniform scale `0.25`; x rotation π/2; no active local animation. |
| Heart | `assets/heart/heart.obj` + `.mtl` | Uniform scale `0.01`; material color forced red; no active local animation. |

The pivot y position is half the initial imported object's `Box3` height so the asset rests above the bridge surface. Collision bounds are later computed from the complete wrapper.

`Rock` can load `assets/rock/Rock1.obj`, but `SpawnTexturePlane()` is disabled in `WorldManager.Update()`. The rock model and its alternate source formats are not rendered during normal play.

## Tween animations

Tween.js 18.6.4 is loaded as a global before the ES-module graph. Three.js does not run a skeletal `AnimationMixer`; `AnimationManager` passes arrays of live position and rotation objects directly into chained `TWEEN.Tween` instances.

### Running and torso sway

`loadRunAnimation()` prepares, but does not immediately start, a run sequence:

1. A 300 ms linear transition establishes the initial running pose and sets `runninFlag` true.
2. A 300 ms `Sinusoidal.Out` tween moves arms and legs to the first stride pose.
3. A second 300 ms `Sinusoidal.Out` tween moves them to the opposing pose.
4. The last two tweens chain to each other indefinitely.

A separate `trumbling` loop rotates the waist around y from `-π/26` to `π/26` in two 300 ms `Sinusoidal.Out` tweens. It is kept separate so lane-dash yaw can temporarily stop it.

### Jump

The jump modifies both gameplay position and limb pose:

| Phase | Duration | Easing | Principal target/effect |
| --- | ---: | --- | --- |
| Normalize | 50 ms | Linear | Return waist y and rotations to neutral. |
| Anticipation | 150 ms | Linear | Lower waist and torso to `y = -0.1`; fold limbs. |
| Rise | 100 ms | `Cubic.Out` | Raise waist to `y = 3.5`; straighten limbs. |
| Falling pose | 100 ms | `Cubic.Out` | Rotate the arms for descent. |
| Descent | 300 ms | `Quartic.In` | Return waist to `y = 0`. |
| Landing | 100 ms | Linear | Reapply the crouched pose. |
| Recovery | 150 ms | Linear | Restore neutral transforms and clear `jumpingFlag`. |

The full chain is approximately 950 ms. The flag is set before the chain starts and again by the anticipation callback, preventing another jump or lane dash until recovery completes.

### Lane dashes

Each of the four valid transitions has its own method. The first tween takes 300 ms with `Cubic.Out`, moves waist x to `-2`, `0`, or `2`, and yaws the waist by `-π/6` for a left dash or `π/6` for a right dash. A chained 200 ms `Cubic.Out` tween returns yaw to zero and restarts the torso-sway loop.

These are gameplay animations: waist x is both the rendered position and the controller's lane state, and the player `Box3` follows it throughout the tween.

### Game-over fall

The fall stops running and sway, then starts two paths:

- a 100 ms linear normalization moves the waist to `y = 0`, `z = 4`, followed by alternating 500 ms linear limb/body poses chained indefinitely;
- a separate 2000 ms `Cubic.Out` tween, delayed 500 ms, lowers waist y to `-5` toward the lava.

### Spike-ball rotation

Each loaded spike ball starts an infinite 500 ms linear tween over its OBJ x rotation. Its `onUpdate` callback adds the tween value to the current rotation. This is primarily visual, but because the wrapper's axis-aligned bound is recomputed from the rotated object, it can also change the exact collision box.

Star, heart, and rock rotation tweens are present only in comments and do not run.

## Tween.js integration with game state

`TWEEN.update()` is called once per active gameplay frame before world, controls, and collisions, and once per game-over frame so the fall continues. It is not called while the pause loop is halted. Pause explicitly stops every tween returned by `TWEEN.getAll()` and the Resume button starts those saved tween objects again.

Tween.js is not used for object approach speed, HUD transitions, loading UI, or invulnerability blinking:

- world objects use `deltaTime × speed` in `world.js`;
- loading uses CSS keyframes;
- hit blinking uses `setTimeout` and material emissive colors;
- HUD values are direct `innerHTML` assignments.

## Asset inventory and loading

Runtime loaders are:

- `THREE.TextureLoader` for bridge and lava images;
- `MTLLoader` followed by `OBJLoader` for the ninja head, spike ball, star, and heart;
- `GLTFLoader` for the cave formations.

There are no audio files, web fonts, video files, or runtime network APIs. The menu background is `assets/officialMenuResized5.png`. The hierarchical model images and `report/report.pdf` are documentation artifacts rather than runtime assets.

For source attribution, unused assets, and licensing boundaries, see [Credits and licensing](development.md#credits-and-licensing).
