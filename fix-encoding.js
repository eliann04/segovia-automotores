const fs = require('fs');

const files = ['js/detalle.js', 'vehiculo-detalle.html', 'js/data.js'];

// Basic map for common broken UTF-8 bytes to latin1 rendering mojibake
const map = {
    'Ã³': 'ó',
    'Ã±': 'ñ',
    'Ã\xad': 'í',
    'Ã\xad': 'í', 
    'Ã\xad': 'í', // wait, the hex for Ã­ is '\xc3\xad'
    'Ã¡': 'á',
    'Ã©': 'é',
    'Ãº': 'ú',
    'Â·': '·',
    'â€”': '—',
    'âš': '⚠',
    'ï¸': '️'
};

files.forEach(f => {
    if(!fs.existsSync(f)) return;
    let txt = fs.readFileSync(f, 'utf8');
    
    // Manual replacements
    txt = txt.replace(/Ã³/g, 'ó');
    txt = txt.replace(/Ã±/g, 'ñ');
    txt = txt.replace(/Ã¡/g, 'á');
    txt = txt.replace(/Ã©/g, 'é');
    txt = txt.replace(/Ãº/g, 'ú');
    txt = txt.replace(/Â·/g, '·');
    txt = txt.replace(/â€"/g, '—');
    txt = txt.replace(/âš/g, '⚠');
    
    // The "í" is tricky because in the console it showed as "VehÃ­culo"
    // Let's just fix the known words
    txt = txt.replace(/VehÃ­culo/g, 'Vehículo');
    txt = txt.replace(/vehÃ­culo/g, 'vehículo');
    txt = txt.replace(/informaciÃ³n/g, 'información');
    txt = txt.replace(/descripciÃ³n/g, 'descripción');
    txt = txt.replace(/DescripciÃ³n/g, 'Descripción');
    txt = txt.replace(/CatÃ¡logo/g, 'Catálogo');
    txt = txt.replace(/catÃ¡logo/g, 'catálogo');
    txt = txt.replace(/AÃ±o/g, 'Año');
    txt = txt.replace(/aÃ±o/g, 'año');
    txt = txt.replace(/TransmisiÃ³n/g, 'Transmisión');
    txt = txt.replace(/NavegaciÃ³n/g, 'Navegación');
    txt = txt.replace(/GascÃ³n/g, 'Gascón');
    txt = txt.replace(/menÃº/g, 'menú');
    txt = txt.replace(/atenciÃ³n/g, 'atención');
    txt = txt.replace(/mÃ¡s/g, 'más');
    txt = txt.replace(/PodrÃ­a/g, 'Podría');
    txt = txt.replace(/â€”/g, '—');
    txt = txt.replace(/DueÃ±o/g, 'Dueño');
    txt = txt.replace(/dueÃ±o/g, 'dueño');
    txt = txt.replace(/dÃ­a/g, 'día');

    fs.writeFileSync(f, txt);
});
console.log('Done');
