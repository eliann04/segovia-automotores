// ============================================================
//  airtable.js — Segovia Automotores
//  Llama al endpoint seguro /api/vehicles (Vercel Serverless).
//  Mecanismo de almacenamiento en caché (sessionStorage / localStorage) con TTL de 5 min.
// ============================================================

const AIRTABLE_CACHE_KEY = 'segovia_vehicles_cache_v1';
const AIRTABLE_CACHE_TTL = 5 * 60 * 1000; // 5 minutos (300,000 ms)

async function fetchAirtableVehicles(forceRefresh = false) {
    if (!forceRefresh) {
        try {
            const cachedItem = sessionStorage.getItem(AIRTABLE_CACHE_KEY) || localStorage.getItem(AIRTABLE_CACHE_KEY);
            if (cachedItem) {
                const { timestamp, data } = JSON.parse(cachedItem);
                if (Date.now() - timestamp < AIRTABLE_CACHE_TTL && Array.isArray(data) && data.length > 0) {
                    return data;
                }
            }
        } catch (err) {
            console.warn('[Airtable Cache] Error leyendo caché:', err);
        }
    }

    const response = await fetch('/api/vehicles');

    if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(`[API] HTTP ${response.status}: ${body.error || response.statusText}`);
    }

    const data = await response.json();

    try {
        const cachePayload = JSON.stringify({
            timestamp: Date.now(),
            data: data
        });
        sessionStorage.setItem(AIRTABLE_CACHE_KEY, cachePayload);
        localStorage.setItem(AIRTABLE_CACHE_KEY, cachePayload);
    } catch (err) {
        console.warn('[Airtable Cache] Error guardando caché:', err);
    }

    return data;
}
