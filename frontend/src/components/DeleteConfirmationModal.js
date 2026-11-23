import React from 'react';
import {
    Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';

function DeleteConfirmationModal({ open, onClose, onConfirm, productName }) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
        >
            <DialogTitle>אישור מחיקה</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    האם אתה בטוח שברצונך למחוק את המוצר "{productName}"?
                    <br />
                    לא ניתן לשחזר פעולה זו.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>ביטול</Button>
                <Button onClick={onConfirm} color="error" autoFocus>
                    מחק
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default DeleteConfirmationModal;