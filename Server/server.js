const express = require('express');
const app = express();
const config = require('config');
const cors = require('cors');
const bodyParser = require('body-parser');
var zip = require('express-easy-zip');

const { upload } = require('./middelware/index');


const { mergePdfController, splitPdfController, deletePdfController, test, reorderPdf, uploadPdf } = require('./controllers/pdfController');

app.use(cors());
app.use(bodyParser.json());

app.use((err, req, res, next) => {
    res.json({
        message: `${err.message}`
    });
})
app.use(zip())

app.post('/mergePdf', upload.fields([
    {
        name: 'file1', maxCount: 1
    },
    {
        name: 'file2', maxCount: 1
    }
]), mergePdfController);

app.post('/splitPdf', upload.single('file'), splitPdfController);
app.post('/deletePdf', upload.single('file'), deletePdfController);
app.post('/reorderPdf', upload.single('file'), reorderPdf);
app.post('/uploadPdf', upload.single('file'), uploadPdf)
app.post('/test', upload.single('file'), test);


app.listen(config.PORT, () => {
    console.log(`Server listening at port ${config.PORT}`);
});