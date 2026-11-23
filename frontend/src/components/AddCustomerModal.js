import React, { useState } from 'react';
import api from '../api';
import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField
} from '@mui/material';

function AddCustomerModal({ open, onClose, onCustomerAdded }) {
    const [name, setName] = useState('');

    const handleSubmit = async () => {
        if (!name.trim()) {
            alert("Please enter a customer name.");
            return;
        }

        try {
            await api.post('/api/customers', { name });
            onCustomerAdded();
            onClose();
            setName(''); // Reset name after submission
        } catch (error) {
            console.error('Failed to add customer:', error);
            alert(`Failed to add customer: ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>הוספת לקוח חדש</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="שם הלקוח"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>ביטול</Button>
                <Button onClick={handleSubmit}>הוסף לקוח</Button>
            </DialogActions>
        </Dialog>
    );
}

export default AddCustomerModal;
