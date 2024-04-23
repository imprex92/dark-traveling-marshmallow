const setLs = (key, value) => { localStorage.setItem(key, JSON.stringify(value)); }
const getLs = (key) => { const value = localStorage.getItem(key); return JSON.parse(value) ?? null; }
const setSs = (key, value) => { sessionStorage.setItem(key, JSON.stringify(value)); }
const getSs = (key) => { const value = sessionStorage.getItem(key); return JSON.parse(value) ?? null; }

export { setLs, getLs, setSs, getSs }