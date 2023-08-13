import React, { useState, useContext } from 'react'

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert'

import ViewSDK from '../../Components/ViewSDK';
import axios from 'axios';

import MergeModal from '../../Components/Modals/mergeModal';
import ReorderModal from '../../Components/Modals/reorderModal';
import DeleteModal from '../../Components/Modals/deleteModal';
import SplitModal from '../../Components/Modals/splitModal';
import CreateAgreementModal from '../../Components/Modals/createAgreementModal';

import AuthContext from '../../Context/AuthContext';



const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
        },
        margin: '5px'
    },
    input: {
        display: 'none',
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    }
}));

function Dashboard() {


    const classes = useStyles();
    const [selectedFile, setSelectedFile] = useState();

    const [mergeOpen, setMergeOpen] = React.useState(false);
    const [splitOpen, setSplitOpen] = React.useState(false);
    const [reorderOpen, setReorderOpen] = React.useState(false);
    const [deleteOpen, setDeleteOpen] = React.useState(false);
    const [success, setSuccess] = useState(false);
    const [agreementOpen, setAgreementOpen] = React.useState(false);
    const [agreementId, setAgreementId] = React.useState();
    const [status, setStatus] = React.useState();

    const authContext = useContext(AuthContext);

    const mergeModalOpen = () => {
        setMergeOpen(true);
    };

    const mergeModalClose = () => {
        setMergeOpen(false);
    };

    const splitModalOpen = () => {
        setSplitOpen(true);
    };

    const splitModalClose = () => {
        setSplitOpen(false);
    };

    const reorderModalOpen = () => {
        setReorderOpen(true);
    };

    const reorderModalClose = () => {
        setReorderOpen(false);
    };

    const deleteModalOpen = () => {
        setDeleteOpen(true);
    };

    const deleteModalClose = () => {
        setDeleteOpen(false);
    };

    const agreementModalOpen = () => {
        setAgreementOpen(true);
    };

    const agreementModalClose = () => {
        setAgreementOpen(false);
    };

    const viewSDKClient = new ViewSDK();


    const uploadHandler = async (event) => {
        if (event.target.files.length > 0) {
            setSelectedFile(event.target.files[0])
            const formData = new FormData();
            formData.append('file', event.target.files[0]);
            axios.post('http://localhost:3000/uploadPdf', formData, {
                responseType: 'blob'
            }).then((response) => {
                if (response.status === 200) {
                    let url = window.URL.createObjectURL(new Blob([response.data]));
                    viewSDKClient.ready().then(() => {
                        viewSDKClient.previewFile('pdf-div', {
                            url: url,
                            fileName: event.target.files[0].name
                        })
                    });
                } else {

                }
            })
        }
    }

    const mergeHandler = async (event) => {
        let mergeFile = event.target.files[0];

        console.log(mergeFile)
        const formData = new FormData();

        formData.append('file1', selectedFile, selectedFile.name);
        formData.append('file2', mergeFile, mergeFile.filename);

        axios.post('http://localhost:3000/mergePdf', formData, {
            responseType: 'blob'
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            viewSDKClient.ready().then(() => {
                viewSDKClient.previewFile('pdf-div', {
                    url: url,
                    fileName: selectedFile.name
                });
            });
            mergeModalClose();
        })
    }

    const splitHandler = (start, end, position) => {
        const formData = new FormData();
        console.log()
        formData.append('file', selectedFile, selectedFile.filename);
        formData.append('start', `${start}`);
        formData.append('end', `${end}`);
        formData.append('position', `${position}`);
        splitModalClose();
        axios.post('http://localhost:3000/splitPdf', formData, {
            responseType: 'blob'
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', selectedFile.name + '.zip');
            document.body.append(link);
            link.click();
        });
        splitModalClose();
    }

    const reorderHandler = (page, position, pdfStart, pdfEnd) => {
        console.log('clicked')
        const formData = new FormData();
        formData.append('file', selectedFile, selectedFile.name);
        formData.append('page', `${page}`);
        formData.append('position', `${position}`);
        formData.append('pdfStart', `${pdfStart}`);
        formData.append('pdfEnd', `${pdfEnd}`);
        axios.post('http://localhost:3000/reorderPdf', formData, {
            responseType: 'blob'
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            viewSDKClient.ready().then(() => {
                viewSDKClient.previewFile('pdf-div', {
                    url: url,
                    fileName: selectedFile.name
                })
            });
        });
        reorderModalClose();
    }

    const deleteHandler = (start, end) => {
        const formData = new FormData();
        formData.append('file', selectedFile, selectedFile.name);
        formData.append('rangeStart', `${start}`);
        formData.append('rangeEnd', `${end}`);
        axios.post('http://localhost:3000/deletePdf', formData, {
            responseType: 'blob'
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            viewSDKClient.ready().then(() => {
                viewSDKClient.previewFile('pdf-div', {
                    url: url,
                    fileName: selectedFile.name
                })
            });
        });
        deleteModalClose();
    }

    const createAgreementHandler = (email1) => {
        const formData = new FormData();
        let transientId = "";
        formData.append('File-Name', selectedFile.name);
        formData.append('File', selectedFile);
        axios.post('https://api.in1.adobesign.com/api/rest/v6/transientDocuments', formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'x-api-user': `email:${authContext.userEmail}`,
                'Authorization': 'Bearer 3AAABLblqZhDEKRk8OmC1j5sy-kpOHytRrpvVgHe8J_SrA27MsOMdNApJz_QU-D9kXeKKGj6YZxRcEzxWeEGzSfM1hxXs7kCd'
            }
        }).then((response) => {
            transientId = response.data.transientDocumentId
            console.log(response.data);
            const reqBody = {
                "fileInfos": [
                    {
                        "transientDocumentId": `${transientId}`
                    }
                ],
                "name": "API Send Transient Test Agreement {{$randomInt}}",
                "participantSetsInfo": [
                    {
                        "memberInfos": [
                            {
                                "email": `${email1}`
                            }
                        ],
                        "order": 1,
                        "role": "SIGNER"
                    }
                ],
                "signatureType": "ESIGN",
                "externalId": {
                    "id": "NA2Account_{{$timestamp}}"
                },
                "state": "IN_PROCESS"
            }


            axios.post('https://api.in1.adobesign.com/api/rest/v6/agreements', reqBody, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-user': `email:${authContext.userEmail}`,
                    'Authorization': 'Bearer 3AAABLblqZhDEKRk8OmC1j5sy-kpOHytRrpvVgHe8J_SrA27MsOMdNApJz_QU-D9kXeKKGj6YZxRcEzxWeEGzSfM1hxXs7kCd'
                }
            }).then((response) => {
                if (response.status === 201) {
                    setSuccess(true);
                    setAgreementId(response.data.id);
                }
            })
        })
    }

    const getAgreementStatus = () => {
        axios.get(`https://api.in1.adobesign.com/api/rest/v6/agreements/${agreementId}`, {
            headers: {
                'x-api-user': `email:${authContext.userEmail}`,
                'Authorization': 'Bearer 3AAABLblqZhDEKRk8OmC1j5sy-kpOHytRrpvVgHe8J_SrA27MsOMdNApJz_QU-D9kXeKKGj6YZxRcEzxWeEGzSfM1hxXs7kCd'
            }
        }).then((response) => {
            if (response.status === 200) {
                setStatus(response.data.status)
            }
        })

    }

    return (
        <>
            <div className={classes.root}>

                <input
                    className={classes.input}
                    id="contained-button-file"
                    onChange={uploadHandler}
                    name="file"
                    type="file"
                />
                <>
                    <label htmlFor="contained-button-file">
                        <Button variant="outlined" color="primary" component="span">
                            Upload PDF
                    </Button>
                    </label>
                    {selectedFile &&
                        <>
                            <Button variant="outlined" color="primary" onClick={mergeModalOpen} >Merge PDF</Button>
                            <Button variant="outlined" color="secondary" onClick={splitModalOpen}>Split PDF</Button>
                            <Button variant="outlined" color="primary" onClick={reorderModalOpen}>Reorder Pages</Button>
                            <Button variant="outlined" color="secondary" onClick={deleteModalOpen}>Delete Pages</Button>
                            <Button variant="outlined" color="primary" onClick={agreementModalOpen}>Create Agreement</Button>
                            <Button variant="outlined" color="primary" onClick={getAgreementStatus}>Get Agreement Status</Button>

                        </>
                    }
                    {success &&
                        <>
                            <Alert severity="success">Agreement Created Sucessfully</Alert>
                        </>
                    }
                    {status === 'OUT_FOR_SIGNATURE' &&
                        <>
                            <Alert severity="error">{status}</Alert>
                        </>
                    }
                    {status === 'SIGNED' &&
                        <>
                            <Alert severity="info">{status}</Alert>
                        </>
                    }
                </>
                {selectedFile && <div>
                    <div id="pdf-div" className="full-window-div" />
                </div>}
            </div>
            <MergeModal open={mergeOpen} handleClose={mergeModalClose} classes={classes} mergeHandler={mergeHandler} />
            <DeleteModal open={deleteOpen} handleClose={deleteModalClose} classes={classes} deleteHandler={deleteHandler} />
            <SplitModal open={splitOpen} handleClose={splitModalClose} classes={classes} splitHandler={splitHandler} />
            <ReorderModal open={reorderOpen} handleClose={reorderModalClose} classes={classes} reorderHandler={reorderHandler} />
            <CreateAgreementModal open={agreementOpen} handleClose={agreementModalClose} classes={classes} createAgreementHandler={createAgreementHandler} />

        </>
    );
}

export default Dashboard;