const STORAGE_KEY = 'mg_products_v1';

export function getProducts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed reading products', e);
    return [];
  }
}

function saveProducts(products) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

export function addProduct(product) {
  const products = getProducts();
  const id = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  const p = { ...product, id, createdAt: new Date().toISOString() };
  products.unshift(p);
  saveProducts(products);
  return p;
}

export function updateProduct(id, updates) {
  const products = getProducts();
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  products[idx] = { ...products[idx], ...updates, updatedAt: new Date().toISOString() };
  saveProducts(products);
  return products[idx];
}

export function deleteProduct(id) {
  const products = getProducts().filter((p) => p.id !== id);
  saveProducts(products);
  return products;
}

export function getProductById(id) {
  return getProducts().find((p) => p.id === id) || null;
}