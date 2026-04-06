const fs = require('fs');
const path = require('path');

const walk = (dir) => {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory() && !fullPath.includes('node_modules') && !fullPath.includes('.git')) {
            results = results.concat(walk(fullPath));
        } else {
            if (fullPath.endsWith('.html') || fullPath.endsWith('.js')) {
                results.push(fullPath);
            }
        }
    });
    return results;
};

const files = walk('.');

files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    let original = content;

    // Sólo para HTMLs, agregar el favicon
    if (f.endsWith('.html')) {
        if (!content.includes('rel="icon"')) {
            content = content.replace(/(<title>.*?<\/title>)/i, '$1\n    <link rel="icon" type="image/png" href="img/logo.png">');
        }
    }

    // Replace index.html exactly with /
    content = content.replace(/href="index\.html"/g, 'href="/"');
    content = content.replace(/href='index\.html'/g, "href='/'");
    content = content.replace(/['"]index\.html['"]/g, "'/'");
    
    // Replace something.html with something
    content = content.replace(/href="([^"]+)\.html(\?[^"]*)?"/g, 'href="$1$2"');
    content = content.replace(/href='([^']+)\.html(\?[^']*)?'/g, "href='$1$2'");
    
    // JS window.location overrides
    content = content.replace(/window\.location\.href\s*=\s*['"]([^'"]+)\.html(\?[^'"]*)?['"]/g, "window.location.href = '$1$2'");

    if (content !== original) {
        fs.writeFileSync(f, content, 'utf8');
        console.log('Modified', f);
    }
});
console.log('Done');
