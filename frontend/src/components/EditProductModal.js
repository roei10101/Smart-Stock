import React, { useState, useEffect } from 'react';
import api from '../api';
import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField,
} from '@mui/material';

function EditProductModal({ open, onClose, onProductUpdated, productToEdit }) {
    const [formData, setFormData] = useState({
        name: '',
        size: '',
        price: '',
        quantity: '',
        imageUrl: '',
    });

    // useEffect: זהו קטע קוד חשוב. הוא יפעל בכל פעם שהחלון נפתח
    // עם מוצר חדש לעריכה, וימלא את הטופס בנתונים הקיימים.
    useEffect(() => {
        if (productToEdit) {
            setFormData({
                name: productToEdit.name || '',
                size: productToEdit.size && typeof productToEdit.size === 'object'
                    ? JSON.stringify(productToEdit.size)
                    : productToEdit.size || '',
                price: productToEdit.price || '',
                quantity: productToEdit.quantity || '',
                imageUrl: productToEdit.imageUrl || '',
            });
        }
    }, [productToEdit]); // המערך הזה גורם לקוד לרוץ מחדש רק כשה-productToEdit משתנה

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        try {
            const dataToSend = { ...formData };
            try {
                // If size is a JSON string, parse it back to an object
                dataToSend.size = JSON.parse(formData.size);
            } catch (e) {
                // Not a valid JSON string, leave it as is
            }

            // שלח בקשת PUT ל-API עם ה-ID של המוצר והנתונים המעודכנים
            await api.put(`/products/${productToEdit.id}`, dataToSend);
            onProductUpdated(); // קרא לפונקציה לרענון הרשימה
            onClose(); // סגור את החלון
        } catch (error) {
            console.error('Failed to update product:', error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>עריכת מוצר: {productToEdit?.name}</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    name="name"
                    label="שם מוצר"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={formData.name}
                    onChange={handleChange}
                />
                {/* ... שאר השדות ... */}
                <TextField margin="dense" name="size" label="מידה" type="text" fullWidth variant="standard" value={formData.size} onChange={handleChange} />
                <TextField margin="dense" name="price" label="מחיר" type="number" fullWidth variant="standard" value={formData.price} onChange={handleChange} />
                <TextField margin="dense" name="quantity" label="כמות במלאי" type="number" fullWidth variant="standard" value={formData.quantity} onChange={handleChange} />
                <TextField margin="dense" name="imageUrl" label="כתובת תמונה (URL)" type="text" fullWidth variant="standard" value={formData.imageUrl} onChange={handleChange} />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>ביטול</Button>
                <Button onClick={handleSubmit}>שמור שינויים</Button>
            </DialogActions>
        </Dialog>
    );
}

export default EditProductModal;
