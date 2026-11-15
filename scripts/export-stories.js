// Genera data/stories.json a partir de js/HardwareData.js (fuente de verdad del runtime).
const fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.join(__dirname,'..');
const code=fs.readFileSync(path.join(root,'js/HardwareData.js'),'utf8');
const {HardwareData}=vm.runInNewContext(code+';({HardwareData})');
const missions=HardwareData.map(m=>({...m,nssdc_source_url:m.nssdc?'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id='+m.nssdc:'https://nssdc.gsfc.nasa.gov/'}));
fs.writeFileSync(path.join(root,'data/stories.json'),JSON.stringify({missions},null,2)+'\n');
console.log('data/stories.json:',missions.length,'misiones');
