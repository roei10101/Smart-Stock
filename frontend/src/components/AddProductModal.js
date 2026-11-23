import React, { useState } from 'react';
import api from '../api';
import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField,
} from '@mui/material';

// הרכיב מקבל שלושה props:
// open: האם החלון פתוח (true/false)
// onClose: פונקציה שתיקרא כשהחלון נסגר
// onProductAdded: פונקציה שתיקרא לאחר שהמוצר נוסף בהצלחה
function AddProductModal({ open, onClose, onProductAdded }) {
    const [newProduct, setNewProduct] = useState({
        name: '',
        size: '',
        price: '',
        quantity: '',
        imageUrl: '',
    });

    // פונקציה שמעדכנת את ה-state בכל שינוי בטופס
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewProduct(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    // פונקציה ששולחת את הנתונים לשרת בעת שליחת הטופס
    const handleSubmit = async () => {
        try {
            // שלח בקשת POST ל-API עם נתוני המוצר החדש
            const response = await api.post('/products', newProduct);
            onProductAdded(); // קרא לפונקציה לרענון הרשימה
            onClose(); // סגור את החלון
        } catch (error) {
            console.error('Failed to add product:', error);
            // כאן אפשר להוסיף הודעת שגיאה למשתמש
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle dir="rtl">הוספת מוצר חדש</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    name="name"
                    label="שם מוצר"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={newProduct.name}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    name="size"
                    label="מידה (S, M, L...)"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={newProduct.size}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    name="price"
                    label="מחיר"
                    type="number"
                    fullWidth
                    variant="standard"
                    value={newProduct.price}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    name="quantity"
                    label="כמות במלאי"
                    type="number"
                    fullWidth
                    variant="standard"
                    value={newProduct.quantity}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    name="imageUrl"
                    label="כתובת תמונה (URL)"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={newProduct.imageUrl}
                    onChange={handleChange}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>ביטול</Button>
                <Button onClick={handleSubmit}>הוסף מוצר</Button>
            </DialogActions>
        </Dialog>
    );
}

export default AddProductModal;