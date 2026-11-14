# EV-TRON 🛰️

> Hardware olvidado en la **Tierra**, la **Luna** y **Marte**, contado por **EVI** (*Exploration & Voice Intelligence*), un robot guía para público juvenil y escolar.

Proyecto para el **NASA Space Apps Challenge**. Aplicación web 3D interactiva (Three.js) sin build: abre `index.html` y funciona.

> ⚠️ Proyecto educativo hecho por participantes. No está afiliado oficialmente a la NASA.

**Demo:** `https://<usuario>.github.io/ev-tron/` · **GitLab:** `https://<usuario>.gitlab.io/ev-tron/` *(reemplaza con tus enlaces)*

## Qué incluye

- Escena 3D con campo estelar, Tierra, Luna (órbita animada) y Marte, con texturas generadas por código (sin imágenes externas).
- **17 objetos** con su historia: Vanguard 1; Apolo 11 (Eagle), LRV, ALSEP y Surveyor 3 en la Luna; Opportunity, Curiosity, Viking 1, Sojourner, Spirit, Phoenix, InSight e Ingenuity en Marte; Dawn, NEAR Shoemaker, Pioneer 10/11 y Kepler en el espacio profundo.
- **EVI**: robot flotante en un HUD (arriba a la izquierda) que vuela al objeto elegido, con cámara que la sigue y narración con efecto máquina de escribir, animación de voz y voz sintetizada opcional (🔊).
- Controles: Pausar/Reanudar, Cámara lenta, enfoque a Tierra/Luna/Marte/Vista global, Catálogo y menú **Tour guiado por EVI** (completo, por zona o por objeto).
- Accesibilidad: navegación por teclado (Catálogo y Tour), `aria-*`, texto completo para lectores de pantalla, `prefers-reduced-motion`.

## Estructura

```
ev-tron/
├── index.html            # Estructura de la página y orden de scripts
├── css/styles.css        # Estilos (HUD, panel de control, diálogo de EVI)
├── js/
│   ├── utils.js          # Utilidades compartidas ($, constantes)
│   ├── HardwareData.js   # Datos históricos de cada artefacto y enlaces fuente
│   ├── SpaceScene.js     # initScene, createPlanets, createSatellites, cámara
│   ├── EviAssistant.js   # Malla 3D de EVI, vuelo, estados y texto progresivo
│   ├── UIController.js   # Botones, tour, diálogo, catálogo, pausa/lenta
│   └── main.js           # Arranque y bucle de animación
├── scripts/
│   ├── check.sh          # Verifica sintaxis JS (node --check)
│   └── push-both.sh      # Sube a GitHub y luego a GitLab
├── .github/workflows/pages.yml   # Publicación en GitHub Pages
├── .gitlab-ci.yml                # Publicación en GitLab Pages
├── package.json · LICENSE · .gitignore · .editorconfig
└── README.md
```

Los scripts son clásicos (no módulos ES) y se cargan en el orden de `index.html`, así la app funciona abriendo el archivo con doble clic y en cualquier hosting estático.

## Ejecutar en local

```bash
# Opción 1: abrir index.html en el navegador
# Opción 2: servidor local
python3 -m http.server 8000     # http://localhost:8000
# o
npm start
```

Requiere conexión a internet para cargar Three.js r128 y Tween.js desde CDN (versiones fijadas).

## Agregar un objeto nuevo

Añade un elemento a `HardwareData` en `js/HardwareData.js` con `id`, `n` (nombre), `z` (`orbit`, `moon`, `mars` o `deep`), `y` (año de lanzamiento), `state`, `s` (`ok`/`warn`/`orb`), `story`, y posición (`lat`/`lon` en la Luna y Marte, `o` para órbitas terrestres, `pos` para espacio profundo). Si tiene página oficial, agrégala en `SRC`.

## Fuentes de datos (NASA)

- [NSSDCA · Archivo Coordinado de Datos de Ciencias Espaciales](https://nssdc.gsfc.nasa.gov/)
- [Apolo 11 · módulo lunar](https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1969-059C) · [LRV](https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1971-063C) · [ALSEP](https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1969-099C)
- [Surveyor 3](https://science.nasa.gov/mission/surveyor-3/) · [Mars Pathfinder / Sojourner](https://science.nasa.gov/mission/mars-pathfinder/) · [Spirit y Opportunity](https://science.nasa.gov/mission/mars-exploration-rovers-spirit-and-opportunity/) · [Viking 1](https://science.nasa.gov/mission/viking-1/) · [InSight](https://science.nasa.gov/mission/insight/) · [Ingenuity](https://science.nasa.gov/mission/mars-2020-perseverance/ingenuity-mars-helicopter/)
- [Dawn](https://science.nasa.gov/mission/dawn/) · [NEAR Shoemaker](https://science.nasa.gov/mission/near-shoemaker/) · [Pioneer 10](https://science.nasa.gov/mission/pioneer-10/) · [Kepler](https://science.nasa.gov/mission/kepler/)

**Nota de precisión:** las posiciones del espacio profundo son ilustrativas y no están a escala; los marcadores de ALSEP y Surveyor 3 se separan visualmente (están a unos 180 m en la Luna real). Verifica estados operativos (por ejemplo, Curiosity) en las fuentes oficiales antes de presentar.

## Publicar y subir al repositorio

Consulta la sección “Git” de la guía entregada junto al proyecto o usa estos comandos:

```bash
git init -b main
git add . && git commit -m "feat: EV-TRON v0.3"
git remote add origin  https://github.com/<usuario>/ev-tron.git
git remote add gitlab  https://gitlab.com/<usuario>/ev-tron.git
bash scripts/push-both.sh main
```

## Licencia

MIT. Ver [LICENSE](LICENSE). Three.js (MIT) y Tween.js (MIT) se cargan por CDN.
