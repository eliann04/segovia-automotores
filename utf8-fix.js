const fs = require('fs');
let t = fs.readFileSync('js/0km-modelos.js', 'utf8');
t = t.replace(/Â¿/g, '¿');
t = t.replace(/ðŸ’¬/g, '💬');
t = t.replace(/citroÃ«n/g, 'citroën');
fs.writeFileSync('js/0km-modelos.js', t);
console.log('Fixed text!');
