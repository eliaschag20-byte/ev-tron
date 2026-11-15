#!/usr/bin/env bash
# Verifica sintaxis de todo el JS (concatenado en el mismo orden que index.html) y prueba Store.
set -e
cd "$(dirname "$0")/.."
cat js/utils.js js/i18n.js js/config.js js/Store.js js/HardwareData.js js/SpaceScene.js js/EviAssistant.js js/UIController.js js/main.js > /tmp/ev-tron-all.js
node --check /tmp/ev-tron-all.js && echo "JS OK"
node scripts/test-store.js
