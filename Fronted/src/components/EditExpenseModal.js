import React, { useState, useEffect } from 'react';
import api from '../api';
import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField,
    Select, MenuItem, FormControl, InputLabel, CircularProgress, Box
} from '@mui/material';

function EditExpenseModal({ open, onClose, onExpenseUpdated, expenseToEdit }) {
    const [expenseData, setExpenseData] = useState({
        sellerId: '',
        description: '',
        amount: '',
        date: '',
    });
    const [sellers, setSellers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (open) {
            setLoading(true);
            api.get('/sellers')
                .then(response => {
                    setSellers(Array.isArray(response.data) ? response.data : []);
                    if (expenseToEdit) {
                        setExpenseData({
                            sellerId: expenseToEdit.sellerId || '',
                            description: expenseToEdit.description || '',
                            amount: expenseToEdit.amount || '',
                            // Format the date to YYYY-MM-DD for the input field
                            date: expenseToEdit.date ? new Date(expenseToEdit.date).toISOString().split('T')[0] : '',
                        });
                    }
                })
                .catch(error => {
                    console.error("Error fetching sellers!", error);
                    setSellers([]);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [open, expenseToEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setExpenseData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async () => {
        const { sellerId, description, amount, date } = expenseData;

        if (!sellerId || !description.trim() || !amount || Number(amount) <= 0 || !date) {
            alert("Please fill all fields correctly.");
            return;
        }
        if (!expenseToEdit || !expenseToEdit.id) {
            alert("Error: No expense selected for editing.");
            return;
        }

        try {
            const payload = {
                sellerId: Number(sellerId),
                description: description.trim(),
                amount: Number(amount),
                date: date,
            };
            await api.put(`/expenses/${expenseToEdit.id}`, payload);
            onExpenseUpdated();
            onClose();
        } catch (error) {
            console.error('Failed to update expense:', error);
            alert(`Failed to update expense: ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>עריכת הוצאה</DialogTitle>
            <DialogContent>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        <FormControl fullWidth margin="dense" variant="standard">
                            <InputLabel>בחר מוכר</InputLabel>
                            <Select
                                value={expenseData.sellerId}
                                onChange={handleChange}
                                name="sellerId"
                                label="בחר מוכר"
                            >
                                {sellers.map((seller) => (
                                    <MenuItem key={seller.id} value={seller.id}>
                                        {seller.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            autoFocus
                            margin="dense"
                            name="description"
                            label="תיאור ההוצאה"
                            type="text"
                            fullWidth
                            variant="standard"
                            value={expenseData.description}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="dense"
                            name="amount"
                            label="סכום"
                            type="number"
                            fullWidth
                            variant="standard"
                            value={expenseData.amount}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="dense"
                            name="date"
                            label="תאריך"
                            type="date"
                            fullWidth
                            variant="standard"
                            value={expenseData.date}
                            onChange={handleChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>ביטול</Button>
                <Button onClick={handleSubmit} disabled={loading}>שמור שינויים</Button>
            </DialogActions>
        </Dialog>
    );
}

export default EditExpenseModal;
