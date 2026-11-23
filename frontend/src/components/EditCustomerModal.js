import React, { useState, useEffect } from 'react';
import api from '../api';
import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField
} from '@mui/material';

function EditCustomerModal({ open, onClose, onCustomerUpdated, customerToEdit }) {
    const [name, setName] = useState('');

    useEffect(() => {
        if (open && customerToEdit) {
            setName(customerToEdit.name || '');
        }
    }, [open, customerToEdit]);

    const handleSubmit = async () => {
        if (!name.trim()) {
            alert("Please enter a customer name.");
            return;
        }
        if (!customerToEdit || !customerToEdit.id) {
            alert("Error: No customer selected for editing.");
            return;
        }

        try {
            await api.put(`/api/customers/${customerToEdit.id}`, { name });
            onCustomerUpdated(); // Refresh the list of customers
            onClose(); // Close the modal
        } catch (error) {
            console.error('Failed to update customer:', error);
            alert(`Failed to update customer: ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>עריכת לקוח: {customerToEdit?.name}</DialogTitle>
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
                <Button onClick={handleSubmit}>שמור שינויים</Button>
            </DialogActions>
        </Dialog>
    );
}

export default EditCustomerModal;
