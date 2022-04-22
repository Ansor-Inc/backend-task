const multer = require("multer");
const path = require("path");
const { fileFormat } = require("./helper");

module.exports = (folderName) => {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, path.join(process.cwd(), "images", folderName));
        },

        filename: function (req, file, cb) {
            cb(null, fileFormat(file.originalname));
        },
    });

    const fileFilter = (req, file, cb) => {
        if (
            file.mimetype === "image/jpg" ||
            file.mimetype === "image/jpeg" ||
            file.mimetype === "image/png"
        ) {
            cb(null, true);
        } else {
            cb(
                new Error("Image uploaded is not of type jpg/jpeg or png"),
                false
            );
        }
    };

    return multer({ storage, fileFilter });
};
