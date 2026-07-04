const http = require('http');
const fs = require('fs');
const path = require('path');

// 1. Cargar variables de entorno de .env.local
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split(/\r?\n/).forEach(line => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) return;
        const index = trimmed.indexOf('=');
        if (index !== -1) {
            const key = trimmed.substring(0, index).trim();
            let val = trimmed.substring(index + 1).trim();
            if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
                val = val.slice(1, -1);
            }
            process.env[key] = val;
        }
    });
    console.log('📝 Variables de entorno cargadas desde .env.local');
} else {
    console.warn('⚠️ No se encontró el archivo .env.local');
}

// Importar el handler de vehículos
const vehiclesHandler = require('./api/vehicles.js');

const PORT = 3000;

// Caché en memoria para evitar llamadas repetidas a Airtable en desarrollo local
let apiCache = null;
let apiCacheTime = 0;
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutos (igual al s-maxage en producción)

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

const server = http.createServer(async (req, res) => {
    // Decodificar la URL para soportar caracteres especiales en nombres de archivos
    const decodedUrl = decodeURIComponent(req.url);
    const url = new URL(decodedUrl, `http://${req.headers.host}`);
    
    // Ruta de la API
    if (url.pathname === '/api/vehicles') {
        const now = Date.now();
        const noCache = url.searchParams.get('nocache') === 'true';

        if (apiCache && (now - apiCacheTime < CACHE_DURATION_MS) && !noCache) {
            console.log('⚡ Sirviendo /api/vehicles desde la caché en memoria (local)');
            res.writeHead(200, { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*' 
            });
            res.end(JSON.stringify(apiCache));
            return;
        }

        console.log('🔄 Consultando datos en tiempo real a la API de Airtable (esta petición puede tardar 2-3s)...');

        // En Vercel, req y res tienen métodos adicionales (status, json, setHeader)
        // Mockeamos res.status y res.json para que funcione api/vehicles.js sin cambios
        res.status = function(code) {
            res.statusCode = code;
            return res;
        };
        res.json = function(data) {
            if (res.statusCode === 200 || !res.statusCode) {
                apiCache = data;
                apiCacheTime = Date.now();
                console.log('💾 Datos de Airtable guardados en caché local (en memoria)');
            }
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
            return res;
        };
        
        try {
            await vehiclesHandler(req, res);
        } catch (err) {
            console.error('❌ Error en API local:', err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Internal server error' }));
        }
        return;
    }
    
    // Servir archivos estáticos
    let filePath = path.join(__dirname, url.pathname === '/' ? 'index.html' : url.pathname);
    
    // Soporte para Clean URLs (ej. /vehiculos busca /vehiculos.html)
    if (!path.extname(filePath)) {
        if (fs.existsSync(filePath + '.html')) {
            filePath += '.html';
        }
    }
    
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': contentType });
        fs.createReadStream(filePath).pipe(res);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('404 Not Found - El archivo no existe.');
    }
});

server.listen(PORT, () => {
    console.log(`\n🚀 Servidor de desarrollo corriendo en: http://localhost:${PORT}`);
    console.log(`👉 Abre la web en tu navegador para probar la conexión con Airtable.\n`);
});
