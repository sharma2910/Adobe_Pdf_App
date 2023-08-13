import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid';


function ReorderModal({ open, classes, handleClose, reorderHandler }) {
    const [page, setPage] = useState();
    const [position, setPosition] = useState();
    const [pdfStart, setPdfStart] = useState();
    const [pdfEnd, setPdfEnd] = useState();


    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={open}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Fade in={open}>
                <div className={classes.paper}>
                    <h2 id="transition-modal-title" >Please Provide Range </h2>
                    <div className={classes.root}>
                        <Grid container className={classes.root} >
                            <Grid item xs={12}>
                                <Grid container justify="space-evenly" al spacing={2}>
                                    <Grid item>
                                        <TextField id="outlined-basic" label="Reorder Page" variant="outlined" onChange={(event) => {
                                            setPage(event.target.value);
                                        }} />
                                    </Grid>
                                    <Grid item>
                                        <TextField id="outlined-basic" label="Move To" variant="outlined" onChange={(event) => {
                                            setPosition(event.target.value);
                                        }} />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container justify="center" spacing={2}>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid container className={classes.root} >
                            <Grid item xs={12}>
                                <Grid container justify="space-evenly" al spacing={2}>
                                    <Grid item>
                                        <TextField id="outlined-basic" label="PDF Start" variant="outlined" onChange={(event) => {
                                            setPdfStart(event.target.value);
                                        }} />
                                    </Grid>
                                    <Grid item>
                                        <TextField id="outlined-basic" label="PDF End" variant="outlined" onChange={(event) => {
                                            setPdfEnd(event.target.value);
                                        }} />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container justify="center" spacing={2}>
                                    <Grid item>
                                        <Button variant="outlined" color="primary" component="span" onClick={() => {
                                            reorderHandler(page, position, pdfStart, pdfEnd)
                                        }}>
                                            Reorder
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </div>
                </div>
            </Fade>
        </Modal >
    );
}

export default ReorderModal;