const fs = require("fs");
const path = require("path");
exports.fileFormat = (fileName) => {
    const [name, extension] = fileName.split(".");
    const newName = name.split(" ").join("-");
    return `${newName}-${Date.now()}.${extension}`;
};

exports.deleteImage = (folderName, imageName) => {
    try {
        fs.unlinkSync(
            path.join(process.cwd(), "images", folderName, imageName)
        );
    } catch (error) {
        console.log(error);
    }
};
