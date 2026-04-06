const fs = require('fs');

const htmlFiles = [
  '0km.html',
  '0km-modelos.html',
  'contacto.html',
  'empresa.html',
  'index.html',
  'vehiculo-detalle.html',
  'vehiculos.html'
];

htmlFiles.forEach(f => {
    let raw = fs.readFileSync(f, 'utf8');
    let out = raw;
    
    if(!out.includes('<link rel="icon"')) {
        out = out.replace(/<title>(.*?)<\/title>/i, '<title>$1</title>\n    <link rel="icon" type="image/png" href="img/logo.png">');
    }
    
    // Replace index.html exactly
    out = out.replace(/href="index\.html"/g, 'href="/"');
    // Replace other .html links
    out = out.replace(/href="([^"]+)\.html"/g, 'href="$1"');
    
    if (raw !== out) {
        fs.writeFileSync(f, out, 'utf8');
        console.log('Fixed', f);
    }
});

const jsFiles = [
    'js/0km.js',
    'js/0km-modelos.js',
    'js/catalog.js',
    'js/detalle.js',
    'js/home.js'
];

jsFiles.forEach(f => {
    let raw = fs.readFileSync(f, 'utf8');
    let out = raw;
    
    out = out.replace(/href\s*=\s*'index\.html'/g, "href = '/'");
    out = out.replace(/href\s*=\s*'([^']+)\.html'/g, "href = '$1'");
    out = out.replace(/href="index\.html\?([^"]*)"/g, 'href="/?$1"');
    out = out.replace(/href="([^"]+)\.html(\?[^"]*)?"/g, 'href="$1$2"');
    
    if(raw !== out) {
        fs.writeFileSync(f, out, 'utf8');
        console.log('Fixed', f);
    }
});
