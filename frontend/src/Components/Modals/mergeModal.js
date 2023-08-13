import React from 'react';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';


function MergeModal({ open, classes, handleClose, mergeHandler }) {
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
                    <h2 id="transition-modal-title">Select File to merge With</h2>
                    <div className={classes.root}>
                        <input
                            className={classes.input}
                            id="merge-button-file"
                            onChange={mergeHandler}
                            name="file"
                            type="file"
                        />
                        <label htmlFor="merge-button-file">
                            <Button variant="outlined" color="primary" component="span" >
                                Upload
                            </Button>
                        </label>
                    </div>
                </div>
            </Fade>
        </Modal>
    );
}

export default MergeModal;