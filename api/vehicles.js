// =============================================================
//  /api/vehicles.js  — Vercel Serverless Function
//  Proxy seguro para Airtable. El token nunca llega al cliente.
// =============================================================

const AIRTABLE_TOKEN   = process.env.AIRTABLE_TOKEN;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || 'appkEdLOMjAehQedE';
const AIRTABLE_TABLE   = 'Vehículos';

module.exports = async function handler(req, res) {
    // Sólo GET permitido
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    if (!AIRTABLE_TOKEN) {
        return res.status(500).json({ error: 'Airtable token not configured' });
    }

    const baseUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE)}`;
    const headers = { Authorization: `Bearer ${AIRTABLE_TOKEN}` };

    let records = [];
    let offset  = null;

    try {
        do {
            const url = new URL(baseUrl);
            url.searchParams.set('pageSize', '100');
            if (offset) url.searchParams.set('offset', offset);

            const response = await fetch(url.toString(), { headers });

            if (!response.ok) {
                const body = await response.json().catch(() => ({}));
                const msg  = body.error?.message || response.statusText;
                return res.status(response.status).json({ error: msg });
            }

            const data = await response.json();
            records = records.concat(data.records || []);
            offset  = data.offset || null;

        } while (offset);

    } catch (err) {
        console.error('[API/vehicles] Error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }

    // Filtrar publicados y normalizar
    const vehicles = records
        .filter(rec => rec.fields['Publicado'] === true)
        .map(rec => {
            const f = rec.fields;

            const fotosRaw = f['Fotos'] || f['fotos'] || f['Imágenes'] || f['Imagenes'] || [];
            const fotos = Array.isArray(fotosRaw) ? fotosRaw.map(att => att.url) : [];

            const descRaw = f['Descripción Web'] || f['Descripcion Web'] || f['descripcion'] || '';
            const descripcion = (typeof descRaw === 'object' && descRaw !== null)
                ? (descRaw.value || '')
                : (descRaw || '');

            const kmRaw = f['Kilometraje'];
            const kilometraje = kmRaw != null
                ? `${Number(kmRaw).toLocaleString('es-AR')} km`
                : '';

            return {
                id:          rec.id,
                nombre:      f['Nombre']       || '',
                marca:       f['Marca']        || '',
                año:         f['Año']          || null,
                tipo:        (f['Tipo']        || '').trim().toLowerCase(),
                motor:       f['Motor']        || '',
                transmision: f['Transmisión']  || f['Transmision'] || '',
                kilometraje,
                precio:      f['Precio']       || null,
                descripcion,
                combustible: f['Combustible']  || '',
                puertas:     f['Puertas']      || '',
                publicado:   true,
                inicio:      f['Inicio'] === true,
                imagen:      fotos[0]          || '',
                fotos,
            };
        });

    // Cache de 5 minutos en Vercel Edge
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json(vehicles);
};
