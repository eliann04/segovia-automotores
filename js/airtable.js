// ============================================================
//  airtable.js — Segovia Automotores
//  Llama al endpoint seguro /api/vehicles (Vercel Serverless).
//  El token de Airtable NUNCA viaja al navegador del cliente.
// ============================================================

async function fetchAirtableVehicles() {
    const response = await fetch('/api/vehicles');

    if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(`[API] HTTP ${response.status}: ${body.error || response.statusText}`);
    }

    return response.json();
}
