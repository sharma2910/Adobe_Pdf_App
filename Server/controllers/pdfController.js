const { mergePdf, splitPdf, deletePdf, reorderPages } = require('../services/pdfService');

async function mergePdfController(req, res, next) {
    try {
        mergePdf(res, req.files.file1, req.files.file2);

    } catch (err) {
        next(err);
    }
}

async function splitPdfController(req, res, next) {
    try {
        splitPdf(res, req.file, parseInt(req.body.start), parseInt(req.body.end), parseInt(req.body.position));
    } catch (err) {
        next(err);
    }
}

async function deletePdfController(req, res, next) {
    try {
        deletePdf(res, req.file, parseInt(req.body.rangeStart), parseInt(req.body.rangeEnd));
    } catch (err) {
        next(err);
    }
}

async function test(req, res, next) {
    console.log(req.file.path)
    res.download('uploads/file-response.pdf')
}

async function reorderPdf(req, res, next) {
    try {
        reorderPages(
            res, req.file,
            parseInt(req.body.page),
            parseInt(req.body.position),
            parseInt(req.body.pdfStart),
            parseInt(req.body.pdfEnd)
        );
    }
    catch (err) {
        next(err)
    }
}

async function uploadPdf(req, res, next) {
    try {
        res.download(req.file.path)
    } catch (err) {
        next(err)
    }
}

module.exports = {
    mergePdfController,
    splitPdfController,
    deletePdfController,
    reorderPdf,
    uploadPdf,
    test
}