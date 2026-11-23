import React, { useState, useEffect } from 'react';
import api from '../api';
import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField,
    IconButton, Box, Typography
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

function ProductFormModal({ open, onClose, onSave, productToEdit }) {
    const [name, setName] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [variants, setVariants] = useState([{ size: '', quantity: '' }]);

    const isEditMode = !!productToEdit;

    useEffect(() => {
        if (open) {
            if (isEditMode && productToEdit) {
                setName(productToEdit.name || '');
                setImageUrl(productToEdit.imageUrl || '');
                // Robustly handle variants data to prevent crashes
                const initialVariants = productToEdit.variants && productToEdit.variants.length > 0
                    ? productToEdit.variants.map(v => ({
                        size: v.size || '',
                        quantity: v.quantity || ''
                    }))
                    : [{ size: '', quantity: '' }];
                setVariants(initialVariants);
            } else {
                // Reset form for 'add' mode
                setName('');
                setImageUrl('');
                setVariants([{ size: '', quantity: '' }]);
            }
        }
    }, [open, productToEdit, isEditMode]);

    const handleVariantChange = (index, event) => {
        // Create a new array with the updated variant, avoiding state mutation
        const newVariants = variants.map((variant, i) => {
            if (i === index) {
                return {
                    ...variant,
                    [event.target.name]: event.target.value
                };
            }
            return variant;
        });
        setVariants(newVariants);
    };

    const addVariant = () => {
        setVariants([...variants, { size: '', quantity: '' }]);
    };

    const removeVariant = (index) => {
        const newVariants = variants.filter((_, i) => i !== index);
        setVariants(newVariants);
    };

    const handleSubmit = async () => {
        // --- Frontend validation for imageUrl ---
        if (!imageUrl.trim()) {
            alert("כתובת תמונה (URL) אינה יכולה להיות ריקה.");
            return;
        }

        const productData = {
            name,
            imageUrl,
            variants: variants.map(v => ({
                size: v.size,
                quantity: Number(v.quantity) || 0 // Ensure quantity is a number
            })),
        };

        try {
            if (isEditMode) {
                await api.put(`/api/products/${productToEdit.id}`, productData);
            } else {
                await api.post('/api/products', productData);
            }
            onSave(); // Refresh the product list
            onClose(); // Close the modal
        } catch (error) {
            console.error('Failed to save product:', error);
            alert(`Failed to save product: ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{isEditMode ? 'עריכת מוצר' : 'הוספת מוצר חדש'}</DialogTitle>
            <DialogContent>
                <TextField autoFocus margin="dense" label="שם מוצר" type="text" fullWidth variant="standard" value={name} onChange={(e) => setName(e.target.value)} />
                <TextField margin="dense" label="כתובת תמונה (URL)" type="text" fullWidth variant="standard" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />

                <Typography sx={{ mt: 3, mb: 1 }}>מידות ומלאי:</Typography>
                {variants.map((variant, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <TextField label="מידה" name="size" variant="outlined" size="small" value={variant.size} onChange={(e) => handleVariantChange(index, e)} />
                        <TextField label="כמות" name="quantity" type="number" variant="outlined" size="small" value={variant.quantity} onChange={(e) => handleVariantChange(index, e)} />
                        <IconButton onClick={() => removeVariant(index)} disabled={variants.length === 1}>
                            <RemoveCircleOutlineIcon />
                        </IconButton>
                    </Box>
                ))}
                <Button startIcon={<AddCircleOutlineIcon />} onClick={addVariant} sx={{ mt: 1 }}>
                    הוסף מידה
                </Button>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>ביטול</Button>
                <Button onClick={handleSubmit}>{isEditMode ? 'שמור שינויים' : 'הוסף מוצר'}</Button>
            </DialogActions>
        </Dialog>
    );
}

export default ProductFormModal;
