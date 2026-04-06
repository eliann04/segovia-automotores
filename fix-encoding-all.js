const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory() && !file.includes('node_modules') && !file.includes('.git')) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.js') || file.endsWith('.html')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk('.');

files.forEach(f => {
    let t = fs.readFileSync(f, 'utf8');
    let original = t;
    if (t.includes('Ã')) {
        t = t.replace(/ó/g, 'ó');
        t = t.replace(/ñ/g, 'ñ');
        t = t.replace(/á/g, 'á');
        t = t.replace(/é/g, 'é');
        t = t.replace(/ú/g, 'ú');
        t = t.replace(/·/g, '·');
        t = t.replace(/—/g, '—');
        t = t.replace(/—/g, '—');
        t = t.replace(/⚠/g, '⚠');
        t = t.replace(/VehÃ\xADculo/g, 'Vehículo').replace(/vehÃ\xADculo/g, 'vehículo');
        t = t.replace(/Ã\xAD/g, 'í');
        t = t.replace(//g, '');
        
        if (t !== original) {
            fs.writeFileSync(f, t);
            console.log('Fixed:', f);
        }
    }
});
