const fs = require('fs');

const files = ['js/detalle.js', 'vehiculo-detalle.html', 'js/data.js'];

// Basic map for common broken UTF-8 bytes to latin1 rendering mojibake
const map = {
    'ó': 'ó',
    'ñ': 'ñ',
    'Ã\xad': 'í',
    'Ã\xad': 'í', 
    'Ã\xad': 'í', // wait, the hex for í is '\xc3\xad'
    'á': 'á',
    'é': 'é',
    'ú': 'ú',
    '·': '·',
    '—': '—',
    '⚠': '⚠',
    '': '️'
};

files.forEach(f => {
    if(!fs.existsSync(f)) return;
    let txt = fs.readFileSync(f, 'utf8');
    
    // Manual replacements
    txt = txt.replace(/ó/g, 'ó');
    txt = txt.replace(/ñ/g, 'ñ');
    txt = txt.replace(/á/g, 'á');
    txt = txt.replace(/é/g, 'é');
    txt = txt.replace(/ú/g, 'ú');
    txt = txt.replace(/·/g, '·');
    txt = txt.replace(/â€"/g, '—');
    txt = txt.replace(/⚠/g, '⚠');
    
    // The "í" is tricky because in the console it showed as "Vehículo"
    // Let's just fix the known words
    txt = txt.replace(/Vehículo/g, 'Vehículo');
    txt = txt.replace(/vehículo/g, 'vehículo');
    txt = txt.replace(/información/g, 'información');
    txt = txt.replace(/descripción/g, 'descripción');
    txt = txt.replace(/Descripción/g, 'Descripción');
    txt = txt.replace(/Catálogo/g, 'Catálogo');
    txt = txt.replace(/catálogo/g, 'catálogo');
    txt = txt.replace(/Año/g, 'Año');
    txt = txt.replace(/año/g, 'año');
    txt = txt.replace(/Transmisión/g, 'Transmisión');
    txt = txt.replace(/Navegación/g, 'Navegación');
    txt = txt.replace(/Gascón/g, 'Gascón');
    txt = txt.replace(/menú/g, 'menú');
    txt = txt.replace(/atención/g, 'atención');
    txt = txt.replace(/más/g, 'más');
    txt = txt.replace(/Podría/g, 'Podría');
    txt = txt.replace(/—/g, '—');
    txt = txt.replace(/Dueño/g, 'Dueño');
    txt = txt.replace(/dueño/g, 'dueño');
    txt = txt.replace(/día/g, 'día');

    fs.writeFileSync(f, txt);
});
console.log('Done');
