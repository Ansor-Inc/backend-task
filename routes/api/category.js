const router = require("express").Router();
const model = require("../../models/category");
const upload = require("../../lib/malter");
const { deleteImage } = require("../../lib/helper");
const {
    mainCategorySchema,
    subCategorySchema,
} = require("../../lib/validation");

router.get("/", async (req, res) => {
    try {
        const models = await model.getAllCategories();
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

router.get("/main", async (req, res) => {
    try {
        const models = await model.getMainCategories();
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

router.get("/sub", async (req, res) => {
    try {
        if (req.query) {
            const subCategories = await model.getSubCategories(
                req.query.parentId
            );
            const { id, name, image } = await model.getCategoryById(
                req.query.parentId
            );
            res.status(200).json({
                code: 200,
                parentCategory: { id, name, image },
                results: subCategories.length,
                data: subCategories,
            });
        }
    } catch (error) {
        res.status(400).json({
            statusCode: 400,
            error: ":( Something wrong!",
        });
    }
});

router.post("/main", upload("category").single("image"), async (req, res) => {
    try {
        const { error } = mainCategorySchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                code: 400,
                message: error.details[0].message,
            });
        }
        if (!req.file) {
            res.status(400).json({
                code: 400,
                error: "an image is not provided",
            });
        }
        const newCategory = await model.addMainCategories(
            req.body.name,
            req.file.filename
        );
        res.status(201).json({
            code: 201,
            message: "new category was added successfully !",
            newCategory,
        });
    } catch (error) {
        res.status(400).json({
            code: 400,
            error: ":( Something wrong!",
        });
    }
});

router.post("/sub", async (req, res) => {
    try {
        const { error } = subCategorySchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                code: 400,
                message: error.details[0].message,
            });
        } else {
            const parentCategory = await model.getCategoryById(
                req.body.parentId
            );
            const newCategory = await model.addSubCategories(
                req.body.name,
                req.body.parentId,
                parentCategory.depth + 1
            );
            res.status(201).json({
                code: 201,
                message: "a new category was added successfully !",
                newCategory,
            });
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({
            code: 400,
            error: ":( Something wrong!",
        });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const categoryId = req.params.id * 1;
        const { image } = await model.isImageExist(categoryId);
        if (image) deleteImage("category", image);
        await model.delete(categoryId);
        res.status(200).json({
            code: 200,
            message: "The category was deleted successfully !",
        });
    } catch (error) {
        res.status(400).json({
            code: 400,
            error: ":( Something wrong!",
        });
    }
});

router.patch("/sub/:id", async (req, res) => {
    try {
        const { error } = mainCategorySchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                code: 400,
                message: error.details[0].message,
            });
        } else {
            const categoryId = req.params.id * 1;
            await model.updateSubCategory(categoryId, req.body.name);
            res.status(200).json({
                code: 200,
                message: "The category was updated successfully !",
            });
        }
    } catch (error) {
        res.status(400).json({
            code: 400,
            error: ":( Something wrong!",
        });
    }
});

router.patch(
    "/main/:id",
    upload("category").single("image"),
    async (req, res) => {
        const { error } = mainCategorySchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                code: 400,
                message: error.details[0].message,
            });
        }
        const categoryId = req.params.id * 1;
        const { image } = await model.isImageExist(categoryId);
        deleteImage("category", image);
        await model.updateMainCategory(
            categoryId,
            req.body.name,
            req.file.filename
        );
        res.status(200).json({
            code: 200,
            message: "The category was updated successfully !",
        });
    }
);

module.exports = router;
