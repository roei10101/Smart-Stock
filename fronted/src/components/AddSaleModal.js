import React, { useState, useEffect } from 'react';
import api from '../api';
import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField,
    Select, MenuItem, FormControl, InputLabel, Autocomplete, CircularProgress, Box
} from '@mui/material';

function AddSaleModal({ open, onClose, onSaleAdded }) {
    const [saleData, setSaleData] = useState({
        productId: '',
        selectedSize: '', // New: To store the selected product size
        sellerId: '',
        customerName: '',
        quantity: '',
        totalPrice: '',
    });

    const [products, setProducts] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [sellers, setSellers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [customerInputValue, setCustomerInputValue] = useState('');

    useEffect(() => {
        if (open) {
            setLoading(true);
            const fetchInitialData = async () => {
                try {
                    const [productsRes, customersRes, sellersRes] = await Promise.all([
                        api.get('/api/products').catch(err => ({ data: [] })),
                        api.get('/api/customers').catch(err => ({ data: [] })),
                        api.get('/api/sellers').catch(err => ({ data: [] })),
                    ]);

                    setProducts(Array.isArray(productsRes.data) ? productsRes.data : []);
                    setCustomers(Array.isArray(customersRes.data) ? customersRes.data : []);
                    setSellers(Array.isArray(sellersRes.data) ? sellersRes.data : []);

                } catch (error) {
                    console.error("A critical error occurred while fetching initial data:", error);
                } finally {
                    setLoading(false);
                }
            };

            fetchInitialData();

            // Reset form state and Autocomplete input
            setSaleData({
                productId: '', selectedSize: '', sellerId: '', customerName: '', quantity: '', totalPrice: '',
            });
            setCustomerInputValue('');
        }
    }, [open]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSaleData(prevState => ({
            ...prevState,
            [name]: value,
            // If product changes, reset selected size
            ...(name === 'productId' && { selectedSize: '' })
        }));
    };

    // handleAutocompleteChange function removed as it was unused and its logic inlined

    const handleSubmit = async () => {
        const { productId, selectedSize, sellerId, quantity, totalPrice } = saleData;
        const currentCustomerName = customerInputValue.trim();

        if (!productId || !selectedSize || !sellerId || !currentCustomerName || !quantity || !totalPrice) {
            alert("Please fill all fields correctly.");
            return;
        }

        try {
            const customerExists = customers.some(c => c.name.toLowerCase() === currentCustomerName.toLowerCase());

            if (!customerExists) {
                console.log(`Customer "${currentCustomerName}" does not exist. Creating...`);
                await api.post('/api/customers', { name: currentCustomerName });
                console.log(`Customer "${currentCustomerName}" created successfully.`);
            }

            const payload = {
                productId,
                selectedSize, // Include selected size in the payload
                sellerId,
                customerName: currentCustomerName,
                quantity: Number(quantity),
                totalPrice: Number(totalPrice),
            };

            await api.post('/api/sales', payload);
            onSaleAdded();
            onClose();
        } catch (error) {
            console.error('Failed to create sale:', error);
            alert(`Failed to create sale: ${error.response?.data?.message || error.message}`);
        }
    };

    const calculateTotalStock = (variants) => {
        if (!variants) return 0;
        return variants.reduce((total, v) => total + (v.quantity || 0), 0);
    };

    // Find the currently selected product to get its variants
    const selectedProduct = products.find(p => p.id === saleData.productId);
    const availableSizes = selectedProduct?.variants || [];

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>יצירת מכירה חדשה</DialogTitle>
            <DialogContent>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        <FormControl fullWidth margin="dense" variant="standard">
                            <InputLabel>בחר מוצר</InputLabel>
                            <Select value={saleData.productId} onChange={handleChange} label="בחר מוצר" name="productId">
                                {products.map((product) => (
                                    <MenuItem key={product.id} value={product.id}>
                                        {product.name} (מלאי כולל: {calculateTotalStock(product.variants)})
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {saleData.productId && ( // Only show size selector if a product is selected
                            <FormControl fullWidth margin="dense" variant="standard">
                                <InputLabel>בחר מידה</InputLabel>
                                <Select value={saleData.selectedSize} onChange={handleChange} label="בחר מידה" name="selectedSize">
                                    {availableSizes.map((variant, index) => (
                                        <MenuItem key={index} value={variant.size}>
                                            {variant.size} (מלאי: {variant.quantity})
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}

                        <FormControl fullWidth margin="dense" variant="standard">
                            <InputLabel>בחר מוכר</InputLabel>
                            <Select value={saleData.sellerId} onChange={handleChange} label="בחר מוכר" name="sellerId">
                                {sellers.map((seller) => (
                                    <MenuItem key={seller.id} value={seller.id}>{seller.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Autocomplete
                            freeSolo
                            options={customers}
                            getOptionLabel={(option) => option.name || ""}
                            value={customers.find(c => c.name === saleData.customerName) || null}
                            inputValue={customerInputValue}
                            onInputChange={(event, newInputValue) => {
                                setCustomerInputValue(newInputValue);
                                setSaleData(prevState => ({ ...prevState, customerName: newInputValue }));
                            }}
                            onChange={(event, newValue) => {
                                const newCustomerName = newValue ? (typeof newValue === 'string' ? newValue : newValue.name) : '';
                                setSaleData(prevState => ({ ...prevState, customerName: newCustomerName }));
                                setCustomerInputValue(newCustomerName);
                            }}
                            renderInput={(params) => (
                                <TextField {...params} variant="standard" label="בחר או הקלד שם לקוח" margin="dense" />
                            )}
                        />

                        <TextField margin="dense" name="quantity" label="כמות" type="number" fullWidth variant="standard" value={saleData.quantity} onChange={handleChange} />
                        <TextField margin="dense" name="totalPrice" label="מחיר סופי" type="number" fullWidth variant="standard" value={saleData.totalPrice} onChange={handleChange} />
                    </>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>ביטול</Button>
                <Button onClick={handleSubmit} disabled={loading}>צור מכירה</Button>
            </DialogActions>
        </Dialog>
    );
}

export default AddSaleModal;
