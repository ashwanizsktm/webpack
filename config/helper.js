const path = require('path');
/**
 * Helper functions.
 */
var ROOT = path.resolve(__dirname, '..');
var root = path.join.bind(path, ROOT);


// images
const images = [
    "/src/assets/images/issuer-logo.svg",
    "/src/assets/images/logo.svg",
    "/src/assets/images/flower.jpg",
    "/src/assets/images/webpack-log.png"
]

exports.root = root;
exports.images = images;