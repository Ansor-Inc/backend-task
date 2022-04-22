const { fetch, fetchAll } = require("../lib/database");

const GET_All_CATEGORIES = `
SELECT
    id,
    name
FROM categories
ORDER BY id;
`;

GET_CATEGORY = `
SELECT *
FROM categories
WHERE id = $1
`;

const GET_MAIN_CATEGORIES = `
SELECT
    id,
    name,
    image
FROM categories
WHERE depth = 1
ORDER BY id;
`;

const GET_CATEGORY_BY_ID = `
SELECT *
FROM categories
WHERE id = $1;
`;

const GET_SUB_CATEGORIES = `
SELECT 
    id,
    name
FROM categories
WHERE parent_id = $1;
`;

const ADD_MAIN_CATEGORIES = `
INSERT into categories(name, image)
VALUES ($1, $2)
RETURNING id, name, image;
`;

const ADD_SUB_CATEGORIES = `
INSERT into categories(name, parent_id, depth)
VALUES ($1, $2, $3)
RETURNING id, name;
`;

const DELETE = `
DELETE FROM categories
WHERE id = $1
`;

const UPDATE_SUB_CATEGORIES = `
UPDATE categories 
SET 
    name = $2
WHERE id = $1;
`;

const UPDATE_MAIN_CATEGORIES = `
UPDATE categories 
SET 
    name = $2,
    image = $3
WHERE id = $1;
`;

const IS_IMAGE_EXIST = `
SELECT
image 
FROM categories
WHERE id = $1
`;

exports.getAllCategories = () => fetchAll(GET_All_CATEGORIES);
exports.getMainCategories = () => fetchAll(GET_MAIN_CATEGORIES);
exports.getCategoryById = (id) => fetch(GET_CATEGORY_BY_ID, id);
exports.getSubCategories = (id) => fetchAll(GET_SUB_CATEGORIES, id);
exports.getCategory = (id) => fetch(GET_CATEGORY, id);
exports.addMainCategories = (name, image) =>
    fetch(ADD_MAIN_CATEGORIES, name, image);
exports.addSubCategories = (name, parentId, depth) =>
    fetch(ADD_SUB_CATEGORIES, name, parentId, depth);
exports.delete = (id) => fetch(DELETE, id);
exports.updateSubCategory = (id, name) =>
    fetch(UPDATE_SUB_CATEGORIES, id, name);
exports.updateMainCategory = (id, name, image) =>
    fetch(UPDATE_MAIN_CATEGORIES, id, name, image);
exports.isImageExist = (id) => fetch(IS_IMAGE_EXIST, id);
