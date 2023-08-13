const pdfToolSDK = require('@adobe/documentservices-pdftools-node-sdk');
const fs = require('fs')
const zip = require('express-zip');

async function getCredentials() {
    try {
        const credentials = pdfToolSDK.Credentials.
            serviceAccountCredentialsBuilder().
            fromFile('pdftools-api-credentials.json').
            build();
        return credentials;
    } catch (err) {
        console.log('Exception encountered while executing operation', err);
    }
}

async function getExecutionContext(credentials) {
    try {
        const executionContext = pdfToolSDK.ExecutionContext.create(credentials);
        return executionContext;
    } catch (err) {
        console.log('Exception encountered while executing operation', err);
    }

}



async function mergePdf(res, file1, file2) {
    try {
        const credentials = await getCredentials();
        const executionContext = await getExecutionContext(credentials);
        const combineFilesOperation = pdfToolSDK.CombineFiles.Operation.createNew();

        const combineSource1 = pdfToolSDK.FileRef.createFromLocalFile(file1[0].path);
        const combineSource2 = pdfToolSDK.FileRef.createFromLocalFile(file2[0].path);
        combineFilesOperation.addInput(combineSource1);
        combineFilesOperation.addInput(combineSource2);

        combineFilesOperation.execute(executionContext)
            .then(result => {
                result.saveAsFile(`output/${file1[0].filename}`)
                setTimeout(() => {
                    res.download(`output/${file1[0].filename}`);
                }, 1000);
                setTimeout(() => {
                    deleteOutput(`output/${file1[0].filename}`);
                }, 1000);
            })
            .catch(err => {
                res.send("not ok");
                if (err instanceof pdfToolSDK.Error.ServiceApiError || err instanceof pdfToolSDK.Error.ServiceUsageError) {
                    console.log('Exception encountered while executing operation');
                } else {
                    console.log('Exception encountered while executing operation', err);
                }
            });
    } catch (err) {
        console.log('Exception encountered while executing operation', err);
    }
}


async function getPageRangeSplit(start, end, splitPosition) {
    const pageRange = new pdfToolSDK.PageRanges();
    pageRange.addPageRange(start, splitPosition);
    pageRange.addPageRange((splitPosition + 1), end);
    return pageRange
}

async function splitPdf(res, file, start, end, splitPosition) {
    try {
        const credentials = await getCredentials();
        const executionContext = await getExecutionContext(credentials);
        const splitPDFOperation = pdfToolSDK.SplitPDF.Operation.createNew();
        const input = pdfToolSDK.FileRef.createFromLocalFile(file.path, pdfToolSDK.SplitPDF.SupportedSourceFormat.pdf);
        splitPDFOperation.setInput(input);

        const pageRanges = await getPageRangeSplit(start, end, splitPosition);
        splitPDFOperation.setPageRanges(pageRanges);

        splitPDFOperation.execute(executionContext)
            .then(async result => {
                let fileList = [];
                for (let i = 0; i < result.length; i++) {
                    result[i].saveAsFile(`output/SplitPDFByPageRangesOutput_${i}.pdf`);
                    fileList.push({
                        path: `output/SplitPDFByPageRangesOutput_${i}.pdf`,
                        name: `SplitPDFByPageRangesOutput_${i}.pdf`
                    });
                }
                console.log(fileList)
                setTimeout(() => {
                    res.zip({
                        files: fileList,
                        filename: 'Split.zip'
                    });
                }, 1000)
            })
            .catch(err => {
                throw err
            });

    } catch (err) {
        console.log('Exception encountered while executing operation', err);

    }
}

async function getPageRangeForDeletion(rangeStart, rangeEnd) {
    const pageRangeForDeletion = new pdfToolSDK.PageRanges();
    pageRangeForDeletion.addPageRange(rangeStart, rangeEnd);
    return pageRangeForDeletion;
}

async function getPageRangeForReorder(page, postion, pdfStart, pdfEnd) {
    try {

        const pageRangeForReorder = new pdfToolSDK.PageRanges();
        if (page > postion) {
            pageRangeForReorder.addPageRange(pdfStart, postion - 1);
            pageRangeForReorder.addSinglePage(page);
            pageRangeForReorder.addPageRange(postion + 1, page - 1);
            pageRangeForReorder.addPageRange(page + 1, pdfEnd);
        } else {
            pageRangeForReorder.addPageRange(pdfStart, page - 1);
            pageRangeForReorder.addPageRange(page + 1, postion);
            pageRangeForReorder.addSinglePage(page);
            pageRangeForReorder.addPageRange(postion + 1, pdfEnd);
        }
        console.log(pageRangeForReorder)
        return pageRangeForReorder;
    } catch (err) {
        throw new Error(err.message);
    }
}

async function reorderPages(res, file, page, position, pdfStart, pdfEnd) {
    try {

        const credentials = await getCredentials();
        const executionContext = await getExecutionContext(credentials);
        const reorderPagesOperation = pdfToolSDK.ReorderPages.Operation.createNew();
        const input = pdfToolSDK.FileRef.createFromLocalFile(file.path);
        const pageRangeForReorder = await getPageRangeForReorder(page, position, pdfStart, pdfEnd);

        reorderPagesOperation.setInput(input);
        reorderPagesOperation.setPagesOrder(pageRangeForReorder);

        reorderPagesOperation.execute(executionContext)
            .then(result => {

                result.saveAsFile(`output/${file.filename}`)
                setTimeout(() => {
                    res.download(`output/${file.filename}`);
                }, 1000);
                setTimeout(() => {
                    deleteOutput(`output/${file.filename}`);
                }, 1000);

            })
            .catch(err => {
                throw err;
            });

    }
    catch (err) {
        throw new Error(err.message)
    }
}

async function deletePdf(res, file, rangeStart, rangeEnd) {

    const credentials = await getCredentials();
    const executionContext = await getExecutionContext(credentials);
    const deletePagesOperation = pdfToolSDK.DeletePages.Operation.createNew();
    const input = pdfToolSDK.FileRef.createFromLocalFile(file.path);
    deletePagesOperation.setInput(input);
    console.log(file)

    const pageRangesForDeletion = await getPageRangeForDeletion(rangeStart, rangeEnd);
    deletePagesOperation.setPageRanges(pageRangesForDeletion);
    deletePagesOperation.execute(executionContext)
        .then(result => {
            console.log(result)
            result.saveAsFile(`output/${file.filename}`)
            setTimeout(() => {
                res.download(`output/${file.filename}`);
            }, 1000);
            setTimeout(() => {
                deleteOutput(`output/${file.filename}`);
            }, 1000);
        })
        .catch(err => {
            if (err instanceof pdfToolSDK.Error.ServiceApiError
                || err instanceof pdfToolSDK.Error.ServiceUsageError) {
                console.log('Exception encountered while executing operation', err);
            } else {
                console.log('Exception encountered while executing operation', err);
            }
        });

}

function deleteOutput(path) {
    fs.stat(path, function (err, stats) {
        console.log(stats);//here we got all information of file in stats variable

        if (err) {
            return console.error(err);
        }

        fs.unlink(path, function (err) {
            if (err) return console.log(err);
            console.log('file deleted successfully');
        });
    });
}


module.exports = {
    mergePdf,
    splitPdf,
    deletePdf,
    reorderPages
}

