import React, { useState } from 'react';
import api from '../api';
import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField
} from '@mui/material';

function AddSellerModal({ open, onClose, onSellerAdded }) {
    const [name, setName] = useState('');

    const handleSubmit = async () => {
        if (!name.trim()) {
            alert("Please enter a seller name.");
            return;
        }

        try {
            await api.post('/api/sellers', { name });
            onSellerAdded();
            onClose();
            setName(''); // Reset name after submission
        } catch (error) {
            console.error('Failed to add seller:', error);
            alert(`Failed to add seller: ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>הוספת מוכר חדש</DialogTitle>
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
                <Button onClick={handleSubmit}>הוסף מוכר</Button>
            </DialogActions>
        </Dialog>
    );
}

export default AddSellerModal;
