const router = require("express").Router();
const routes = require("./api");
const { apiUrl } = require("../config/keys");

const api = `/${apiUrl}`;
router.use(api, routes);
router.use(api, (req, res) => res.status(404).json({
    status: 404,
    error: "Not found"
}));

module.exports = router;