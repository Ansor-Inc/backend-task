const { fetch, fetchAll } = require("../lib/database");

const GET_PRODUCTS = `
SELECT
*
FROM products
ORDER BY id;
`;

const GET_SELECTED_PRODUCTS = `
SELECT
    id,
    name,
    address,
    images,
    CASE
        WHEN to_char(now()::date, 'DD.MM.YYYY') = to_char(created_at, 'DD.MM.YYYY')
        THEN 'Bugun ' || to_char(created_at, 'HH24:MI')
    ELSE to_char(created_at, 'YYYY-MM-DD HH24:MI')
    END as date,
    price,
    currency,
    negotiation
FROM products
WHERE category_id = $1
ORDER BY id desc;
`;

const GET_PRODUCT = `
SELECT
    id,
    images,
    category_id,
    name,
    address,
    price,
    currency,
    negotiation,
    type,
    condition,
    detail,
    CASE
        WHEN to_char(now()::date, 'DD.MM.YYYY') = to_char(created_at, 'DD.MM.YYYY')
        THEN 'Bugun ' || to_char(created_at, 'HH24:MI') 
    ELSE to_char(created_at, 'YYYY-MM-DD HH24:MI')
    END as date
FROM products
WHERE id = $1;
`;

const ADD_PRODUCT = `
INSERT 
INTO products(
    name, 
    category_id,
    address,
    price,
    images,
    detail,
    negotiation,
    currency,
    type,
    condition
)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
RETURNING id;
`;

const UPDATE_PRODUCT = `
UPDATE products 
SET 
    name = $2,
    category_id = $3,
    address = $4,
    price = $5,
    images = $6,
    detail = $7,
    negotiation = $8,
    currency = $9,
    type = $10,
    condition = $11
WHERE id = $1;
`;

const DELETE_PRODUCT = `
DELETE FROM products
WHERE id = $1
`;

const SEARCH = `
SELECT
    id,
    name,
    address,
    images,
    CASE
        WHEN to_char(now()::date, 'DD.MM.YYYY') = to_char(created_at, 'DD.MM.YYYY')
        THEN 'Bugun ' || to_char(created_at, 'HH24:MI')
    ELSE to_char(created_at, 'YYYY-MM-DD HH24:MI')
    END as date,
    price,
    currency,
    negotiation
FROM products
WHERE category_id = $1 AND name ILIKE '%'||$2||'%'
ORDER BY id desc; 
`;

const CONDITION = `
SELECT
    id,
    name,
    address,
    images,
    CASE
        WHEN to_char(now()::date, 'DD.MM.YYYY') = to_char(created_at, 'DD.MM.YYYY')
        THEN 'Bugun ' || to_char(created_at, 'HH24:MI')
    ELSE to_char(created_at, 'YYYY-MM-DD HH24:MI')
    END as date,
    price,
    currency,
    negotiation
FROM products
WHERE category_id = $1 AND condition = $2
ORDER BY id desc; 
`;

const MIN_PRICE_FILTER = `
SELECT
    id,
    name,
    address,
    images,
    CASE
        WHEN to_char(now()::date, 'DD.MM.YYYY') = to_char(created_at, 'DD.MM.YYYY')
        THEN 'Bugun ' || to_char(created_at, 'HH24:MI')
    ELSE to_char(created_at, 'YYYY-MM-DD HH24:MI')
    END as date,
    price,
    currency,
    negotiation
FROM products
WHERE category_id = $1 AND price >= $2
ORDER BY id desc; 
`;

const MAX_PRICE_FILTER = `
SELECT
    id,
    name,
    address,
    images,
    CASE
        WHEN to_char(now()::date, 'DD.MM.YYYY') = to_char(created_at, 'DD.MM.YYYY')
        THEN 'Bugun ' || to_char(created_at, 'HH24:MI')
    ELSE to_char(created_at, 'YYYY-MM-DD HH24:MI')
    END as date,
    price,
    currency,
    negotiation
FROM products
WHERE category_id = $1 AND price <= $2
ORDER BY id desc; 
`;

const MIN_MAX_PRICE_FILTER = `
SELECT
    id,
    name,
    address,
    images,
    CASE
        WHEN to_char(now()::date, 'DD.MM.YYYY') = to_char(created_at, 'DD.MM.YYYY')
        THEN 'Bugun ' || to_char(created_at, 'HH24:MI')
    ELSE to_char(created_at, 'YYYY-MM-DD HH24:MI')
    END as date,
    price,
    currency,
    negotiation
FROM products
WHERE category_id = $1 AND price >= $2 AND price <= $3
ORDER BY id desc; 
`;

exports.allProducts = () => fetchAll(GET_PRODUCTS);

exports.getSelectedProducts = (categoryId) =>
    fetchAll(GET_SELECTED_PRODUCTS, categoryId);

exports.getProduct = (id) => fetch(GET_PRODUCT, id);

exports.search = (categoryId, searchKey) =>
    fetchAll(SEARCH, categoryId, searchKey);

exports.condition = (categoryId, condition) =>
    fetchAll(CONDITION, categoryId, condition);

exports.minPrice = (categoryId, min) =>
    fetchAll(MIN_PRICE_FILTER, categoryId, min);

exports.maxPrice = (categoryId, max) =>
    fetchAll(MAX_PRICE_FILTER, categoryId, max);

exports.minMaxPrice = (categoryId, min, max) =>
    fetchAll(MIN_MAX_PRICE_FILTER, categoryId, min, max);

exports.addNewProduct = (data, images) =>
    fetch(
        ADD_PRODUCT,
        data.name,
        data.categoryId,
        data.address,
        data.price,
        images,
        data.detail,
        data.negotiation,
        data.currency,
        data.type,
        data.condition
    );
exports.delete = (id) => fetch(DELETE_PRODUCT, id);
exports.updateProduct = (id, data, images) =>
    fetch(
        UPDATE_PRODUCT,
        id,
        data.name,
        data.categoryId,
        data.address,
        data.price,
        images,
        data.detail,
        data.negotiation,
        data.currency,
        data.type,
        data.condition
    );
