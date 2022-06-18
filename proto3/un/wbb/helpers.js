const iFilter = function(req, file, cb) {
    // Accept images or pdf only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|pdf|PDF)$/)) {
        req.fileValidationError = 'Only image files or pdf are allowed!';
        return cb(new Error('Only image files or pdf are allowed!'), false);
    }
    cb(null, true);
};
exports.iFilter = iFilter;