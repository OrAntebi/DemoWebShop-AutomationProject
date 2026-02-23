const STORE_ORIGIN = 'https://demowebshop.tricentis.com';

export function extractNumber(text) {
    if (!text) return null;
    const digitsOnly = text.replace(/[^0-9.,]/g, '').replace(/,/g, '');
    const match = digitsOnly.match(/[0-9]+(?:\.[0-9]+)?/);
    return match ? Number(match[0]) : null;
}

export function parseAmount(text) {
    const amount = extractNumber(text);
    return amount ?? NaN;
}

export function normalizeStoreItemUrl(rawItemUrl) {
    if (!rawItemUrl) return null;

    try {
        const parsedUrl = new URL(rawItemUrl, STORE_ORIGIN);
        const isStoreHost = /(^|\.)demowebshop\.tricentis\.com$/i.test(parsedUrl.hostname);
        if (!isStoreHost) return null;
        if (!parsedUrl.pathname || parsedUrl.pathname === '/' || parsedUrl.pathname.includes('/search')) return null;
        return parsedUrl.toString();
    } catch {
        return null;
    }
}