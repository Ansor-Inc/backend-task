const router = require("express").Router();
const productModel = require("../../models/product");
const categoryModel = require("../../models/category");
const upload = require("../../lib/malter");
const { deleteImage } = require("../../lib/helper");
const { productSchema } = require("../../lib/validation");

//FOR ONLY TEST
router.get("/", async (req, res) => {
    try {
        const models = await productModel.allProducts();
        models.map((e) => (e.images = JSON.parse(e.images)));
        res.status(200).json({
            code: 200,
            results: models.length,
            data: models,
        });
    } catch (error) {
        res.status(400).json({
            statusCode: 400,
            error: ":( Something wrong!",
        });
    }
});

router.get("/category/:id", async (req, res) => {
    try {
        const products = await productModel.getSelectedProducts(
            Number(req.params.id)
        );
        console.log(req.query.min, req.query.max);
        if (req.query.search) {
            const searchResult = await productModel.search(
                req.params.id,
                req.query.search
            );
            if (!searchResult.length) {
                return res.status(404).json({
                    code: 404,
                    error: "Uzr, siz izlayotgan narsani topa olmadik…",
                });
            }
            return res.status(200).json({
                code: 200,
                results: searchResult.length,
                data: searchResult,
            });
        } else if (req.query.condition) {
            const conditionResult = await productModel.condition(
                req.params.id,
                req.query.condition
            );
            if (!conditionResult.length) {
                return res.status(404).json({
                    code: 404,
                    error: "Uzr, siz izlayotgan narsani topa olmadik…",
                });
            }
            return res.status(200).json({
                code: 200,
                results: conditionResult.length,
                data: conditionResult,
            });
        } else if (req.query.min && !req.query.max) {
            const minResult = await productModel.minPrice(
                req.params.id,
                Number(req.query.min)
            );
            if (!minResult.length) {
                return res.status(404).json({
                    code: 404,
                    error: "Uzr, siz izlayotgan narxda topa olmadik…",
                });
            }
            return res.status(200).json({
                code: 200,
                results: minResult.length,
                data: minResult,
            });
        } else if (req.query.max && !req.query.min) {
            const maxResult = await productModel.maxPrice(
                req.params.id,
                Number(req.query.max)
            );
            if (!maxResult.length) {
                return res.status(404).json({
                    code: 404,
                    error: "Uzr, siz izlayotgan narxda topa olmadik…",
                });
            }
            return res.status(200).json({
                code: 200,
                results: maxResult.length,
                data: maxResult,
            });
        } else if (req.query.min && req.query.max) {
            const minMaxResult = await productModel.minMaxPrice(
                req.params.id,
                Number(req.query.min),
                Number(req.query.max)
            );
            if (!minMaxResult.length) {
                return res.status(404).json({
                    code: 404,
                    error: "Uzr, siz izlayotgan narxda topa olmadik…",
                });
            }
            return res.status(200).json({
                code: 200,
                results: minMaxResult.length,
                data: minMaxResult,
            });
        }
        products.map((e) => (e.images = JSON.parse(e.images)[0]));
        return res.status(200).json({
            code: 200,
            results: products.length,
            data: products,
        });
    } catch (error) {
        res.status(400).json({
            statusCode: 400,
            error: ":( Something wrong!",
        });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const product = await productModel.getProduct(Number(req.params.id));
        let { id, depth } = await categoryModel.getCategory(
            product.category_id
        );
        const arr = [];
        while (depth--) {
            const category = await categoryModel.getCategory(id);
            arr.push(category.name);
            id = category.parent_id;
        }
        const address = product.address
            .split(", ")
            .map((e) => `${arr[0]} - ${e}`);
        let breadcrumb = `Bosh sahifa/${arr.reverse().join("/")}/${address.join(
            "/"
        )}`;
        product.images = JSON.parse(product.images);
        res.status(200).json({
            code: 200,
            product: { ...product, breadcrumb },
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            statusCode: 400,
            error: ":( Something wrong!",
        });
    }
});

router.post("/", upload("product").array("images", 8), async (req, res) => {
    try {
        const { error } = productSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                code: 400,
                error: error.details[0].message,
            });
        }
        if (!req.files) {
            res.status(400).json({
                code: 400,
                error: "at least, one image is required",
            });
        }
        let images = req.files.map((e) => (e = e.filename));
        images = JSON.stringify(images);
        const { id } = await productModel.addNewProduct(req.body, images);
        res.status(201).json({
            code: 201,
            message: "new product was added successfully !",
            productId: id,
        });
    } catch (error) {
        res.status(400).json({
            code: 400,
            error: ":( Something wrong!",
        });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { images } = await productModel.getProduct(id);
        for (const image of JSON.parse(images)) {
            deleteImage("product", image);
        }
        await productModel.delete(id);
        res.status(200).json({
            code: 200,
            message: "The product was deleted successfully !",
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            code: 400,
            error: ":( Something wrong!",
        });
    }
});

router.patch("/:id", upload("product").array("images", 8), async (req, res) => {
    try {
        const { error } = productSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                code: 400,
                error: error.details[0].message,
            });
        }
        const id = Number(req.params.id);
        const { images } = await productModel.getProduct(id);
        for (const image of JSON.parse(images)) {
            deleteImage("product", image);
        }
        let uploadedImages = req.files.map((e) => (e = e.filename));
        uploadedImages = JSON.stringify(uploadedImages);
        await productModel.updateProduct(id, req.body, uploadedImages);
        res.status(200).json({
            code: 200,
            message: "The product was updated successfully !",
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            code: 400,
            error: ":( Something wrong!",
        });
    }
});

module.exports = router;
