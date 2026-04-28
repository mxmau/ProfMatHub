const fs = require('fs');
const data = JSON.parse(fs.readFileSync('images.json'));
fs.writeFileSync('src/logos.ts', `export const igarassu = '${data.igarassu}';\nexport const saoLourenco = '${data.saoLourenco}';\n`);
console.log('Logos written to src/logos.ts');
