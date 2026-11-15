# EV-TRON 🛰️

> Forgotten hardware on **Earth orbit**, the **Moon**, **Mars** and **deep space**, told by **EVI** (*Exploration & Voice Intelligence*), a robot guide for young audiences (ages 8–12).

Built for the **NASA Space Apps Challenge**. Interactive 3D web app (Three.js), no build step: open `index.html`. Bilingual **EN / ES** (English by default).

> ⚠️ Educational project by participants. Not affiliated with or endorsed by NASA.

**Demo:** `https://<user>.github.io/ev-tron/` · **GitLab:** `https://<user>.gitlab.io/ev-tron/` *(replace with your links)*

## Features

- 3D scene: starfield, Earth, Moon (animated orbit) and Mars, with procedural textures (no external images).
- **17 missions**, each with 3 layers: **1 Record** (facts), **2 Science** (what it found) and **3 Last transmission** (poetry, always labeled as a poetic interpretation based on telemetry, not a NASA statement).
- **EVI** floats in a HUD (top left), flies to the chosen object while the camera follows, and narrates with a typewriter effect and voice animation.
- **Audio** 🔊: two different voice profiles (English / Spanish). Pressing it mid-story starts the narration from the current point. Uses the browser's speech voices, so quality depends on the device.
- **Explorers list**: enter your name at the start; finish a story and your name joins that mission's top-10 list (gold, silver, bronze, then grey; newest first, the 11th falls off) and appears as a ★ label next to the object. By default the list is stored in the browser (`localStorage`), per device; with the optional free database it is shared by everyone (see [docs/DATABASE.md](docs/DATABASE.md)).
- Controls: Pause/Resume, Slow motion, focus Earth/Moon/Mars/Global, Catalog and **Guided tour by EVI**.
- Accessibility: keyboard navigation, `aria-*`, full text for screen readers, `prefers-reduced-motion`, responsive layout for phones.

## Run locally

```bash
# Option 1: open index.html in a browser
# Option 2: local server
python3 -m http.server 8000     # http://localhost:8000
npm start                        # alternative (npx serve)
```

Needs internet to load Three.js r128 and Tween.js from CDN (pinned versions) and Google Fonts.

## Structure

```
ev-tron/
├── index.html              # page structure and script order
├── css/styles.css          # design tokens, HUD, control panel, dialog, explorers list
├── js/
│   ├── utils.js            # shared helpers
│   ├── i18n.js             # EN / ES interface strings
│   ├── config.js           # optional public DB settings (url + public key)
│   ├── Store.js            # explorers list storage: Supabase REST or localStorage
│   ├── HardwareData.js     # factual data per mission + official source links
│   ├── SpaceScene.js       # initScene, createPlanets, createSatellites, camera, labels
│   ├── EviAssistant.js     # EVI mesh, flight, states, progressive text
│   ├── UIController.js     # controls, tour, dialog, voices, welcome and explorers list
│   └── main.js             # bootstrap and animation loop
├── db/schema.sql           # table + row-level security for the optional database
├── docs/DATABASE.md        # step-by-step database setup
├── data/stories.json       # generated from HardwareData.js (npm run export-stories)
├── scripts/                # check.sh (syntax), export-stories.js, push-both.sh
├── .github/workflows/pages.yml · keepalive.yml · .gitlab-ci.yml
└── LICENSE · package.json · .gitignore · .editorconfig
```

Classic scripts (not ES modules) loaded in the order of `index.html`, so it works by double-click and on any static host. `js/HardwareData.js` is the source of truth; run `npm run export-stories` after editing it to refresh `data/stories.json`.

## Data and NASA attribution

Every mission links to its official record in the **NASA Space Science Data Coordinated Archive (NSSDCA)** and/or NASA Science: https://nssdc.gsfc.nasa.gov/

| Mission | Zone | NSSDCA | NASA Science |
|---|---|---|---|
| Vanguard 1 | orbit | [1958-002B](https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1958-002B) | — |
| Apollo 11 Lunar Module Eagle | moon | [1969-059C](https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1969-059C) | — |
| Lunar Roving Vehicle (Apollo 15) | moon | [1971-063C](https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1971-063C) | — |
| ALSEP science packages (Apollo) | moon | [1969-099C](https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1969-099C) | — |
| Surveyor 3 | moon | [1967-035A](https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1967-035A) | [NASA Science](https://science.nasa.gov/mission/surveyor-3) |
| Sojourner rover (Mars Pathfinder) | mars | [1996-068A](https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1996-068A) | [NASA Science](https://science.nasa.gov/mission/mars-pathfinder) |
| Spirit (MER-A) | mars | [2003-027A](https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2003-027A) | [NASA Science](https://science.nasa.gov/mission/mars-exploration-rovers-spirit-and-opportunity) |
| Opportunity (MER-B) | mars | [2003-032A](https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2003-032A) | [NASA Science](https://science.nasa.gov/mission/mars-exploration-rovers-spirit-and-opportunity) |
| Viking 1 & 2 landers | mars | [1975-075C](https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1975-075C) | [NASA Science](https://science.nasa.gov/mission/viking-1) |
| Phoenix lander | mars | [2007-034A](https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2007-034A) | — |
| InSight lander | mars | [2018-042A](https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2018-042A) | [NASA Science](https://science.nasa.gov/mission/insight) |
| Curiosity (MSL) | mars | [2011-070A](https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2011-070A) | — |
| Ingenuity helicopter | mars | [catalog](https://nssdc.gsfc.nasa.gov/) | [NASA Science](https://science.nasa.gov/mission/mars-2020-perseverance/ingenuity-mars-helicopter/) |
| Kepler Space Telescope | deep | [2009-011A](https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2009-011A) | [NASA Science](https://science.nasa.gov/mission/kepler) |
| Dawn spacecraft | deep | [2007-043A](https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2007-043A) | [NASA Science](https://science.nasa.gov/mission/dawn) |
| NEAR Shoemaker | deep | [1996-008A](https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1996-008A) | [NASA Science](https://science.nasa.gov/mission/near-shoemaker) |
| Pioneer 10 & 11 | deep | [1972-012A](https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1972-012A) | [NASA Science](https://science.nasa.gov/mission/pioneer-10) |

Accuracy notes: deep-space positions are illustrative and not to scale; ALSEP and Surveyor 3 markers are offset for visibility. Verify operational status (e.g. Curiosity) at the official sources before presenting.

## Shared explorers list (optional database)

GitHub Pages cannot store data, so the shared list uses a free Supabase project called with plain `fetch` (no SDK). Leave `js/config.js` empty to stay local-only. Setup takes about 5 minutes: see [docs/DATABASE.md](docs/DATABASE.md). Free projects pause after 7 days of inactivity; `keepalive.yml` pings the database every 3 days. The app asks for a **nickname**, not a full name.

## Add a mission

Add an object to `HardwareData` in `js/HardwareData.js` with `id`, `z` (`orbit`, `moon`, `mars`, `deep`), `y`, `s`, `nssdc`, an `en` and an `es` block (`n`, `loc`, `st`, `rec`, `sci`, `po`) and its position (`lat`/`lon`, `o` or `pos`). Then run `npm run check` and `npm run export-stories`.

## Deploy

- **GitHub Pages:** push to `main`, then in the repository go to *Settings → Pages → Source: GitHub Actions*. The workflow in `.github/workflows/pages.yml` publishes the site.
- **GitLab Pages:** `.gitlab-ci.yml` publishes on every push to the default branch.
- Both URLs are public and need no login.

```bash
git init -b main
git add . && git commit -m "feat: EV-TRON v0.4"
git remote add origin https://github.com/<user>/ev-tron.git
git remote add gitlab https://gitlab.com/<user>/ev-tron.git
bash scripts/push-both.sh main
```

## Resumen en español

EV-TRON cuenta, con el robot guía **EVI**, la historia del hardware que la NASA y otras agencias dejaron en la órbita terrestre, la Luna, Marte y el espacio profundo, para niños de 8 a 12 años. Interfaz en inglés por defecto con cambio a español, dos voces distintas, lista de exploradores por misión y fuentes oficiales NSSDCA/NASA Science en cada ficha. Para ejecutarlo, abre `index.html`; para publicarlo, usa GitHub Pages o GitLab Pages como se indica arriba.

## License

MIT. See [LICENSE](LICENSE). Three.js (MIT) and Tween.js (MIT) load from CDN.
