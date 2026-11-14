#!/usr/bin/env bash
# Verifica la sintaxis de todo el JS (concatenado en el mismo orden que index.html).
set -e
cd "$(dirname "$0")/.."
cat js/utils.js js/HardwareData.js js/SpaceScene.js js/EviAssistant.js js/UIController.js js/main.js > /tmp/ev-tron-all.js
node --check /tmp/ev-tron-all.js && echo "JS OK"
