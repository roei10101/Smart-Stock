import React, { useState, useEffect } from 'react';
import api from '../api';
import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField
} from '@mui/material';

function EditSellerModal({ open, onClose, onSellerUpdated, sellerToEdit }) {
    const [name, setName] = useState('');

    useEffect(() => {
        if (open && sellerToEdit) {
            setName(sellerToEdit.name || '');
        }
    }, [open, sellerToEdit]);

    const handleSubmit = async () => {
        if (!name.trim()) {
            alert("Please enter a seller name.");
            return;
        }
        if (!sellerToEdit || !sellerToEdit.id) {
            alert("Error: No seller selected for editing.");
            return;
        }

        try {
            await api.put(`/api/sellers/${sellerToEdit.id}`, { name });
            onSellerUpdated(); // Refresh the list of sellers
            onClose(); // Close the modal
        } catch (error) {
            console.error('Failed to update seller:', error);
            alert(`Failed to update seller: ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>עריכת מוכר: {sellerToEdit?.name}</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="שם המוכר"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>ביטול</Button>
                <Button onClick={handleSubmit}>שמור שינויים</Button>
            </DialogActions>
        </Dialog>
    );
}

export default EditSellerModal;
