const fs = require('fs');

const files = ['js/0km-modelos.js', 'js/detalle.js', 'js/catalog.js', 'js/0km.js'];

files.forEach(f => {
    if (fs.existsSync(f)) {
        let t = fs.readFileSync(f, 'utf8');
        let original = t;
        t = t.replace(/Â¿/g, '¿');
        t = t.replace(/ðŸ’¬/g, '💬');
        t = t.replace(/citroÃ«n/g, 'citroën');
        if (t !== original) {
            fs.writeFileSync(f, t);
            console.log('Fixed WhatsApp Mojibake in:', f);
        }
    }
});
