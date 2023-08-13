import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid';


function DeleteModal({ open, classes, handleClose, deleteHandler }) {
    const [start, setStart] = useState();
    const [end, setEnd] = useState();

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
                                        <TextField id="outlined-basic" label="Start" variant="outlined" onChange={(event) => {
                                            setStart(event.target.value);
                                        }} />
                                    </Grid>
                                    <Grid item>
                                        <TextField id="outlined-basic" label="End" variant="outlined" onChange={(event) => {
                                            setEnd(event.target.value);
                                        }} />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container justify="center" spacing={2}>
                                    <Grid item>
                                        <Button variant="outlined" color="primary" component="span" onClick={() => {
                                            deleteHandler(start,end)
                                        }}>
                                            Split
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

export default DeleteModal;