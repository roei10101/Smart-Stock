import React, { useState, useEffect } from 'react';
import api from '../api';
import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField,
    Select, MenuItem, FormControl, InputLabel, Autocomplete, CircularProgress, Box
} from '@mui/material';

function EditSaleModal({ open, onClose, onSaleUpdated, saleToEdit }) {
    const [saleData, setSaleData] = useState({
        productId: '',
        selectedSize: '',
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
        const loadInitialData = async () => {
            setLoading(true);
            try {
                const [productsRes, customersRes, sellersRes] = await Promise.all([
                    api.get('/api/products').catch(err => ({ data: [] })),
                    api.get('/api/customers').catch(err => ({ data: [] })),
                    api.get('/api/sellers').catch(err => ({ data: [] })),
                ]);

                const fetchedProducts = Array.isArray(productsRes.data) ? productsRes.data : [];
                const fetchedCustomers = Array.isArray(customersRes.data) ? customersRes.data : [];
                const fetchedSellers = Array.isArray(sellersRes.data) ? sellersRes.data : [];

                setProducts(fetchedProducts);
                setCustomers(fetchedCustomers);
                setSellers(fetchedSellers);

                if (saleToEdit) {
                    console.log("saleToEdit received:", saleToEdit);

                    let resolvedProductId = '';
                    let resolvedSelectedSize = '';
                    const saleProductVariantId = Number(saleToEdit.productVariantId); // Ensure it's a number for comparison

                    // --- FIX: Resolve productId and selectedSize from productVariantId with type consistency ---
                    if (saleProductVariantId && fetchedProducts.length > 0) {
                        console.log("Attempting to resolve product/size using productVariantId:", saleProductVariantId);
                        for (const product of fetchedProducts) {
                            const foundVariant = product.variants?.find(v => Number(v.id) === saleProductVariantId); // Ensure v.id is also number
                            if (foundVariant) {
                                resolvedProductId = product.id;
                                resolvedSelectedSize = foundVariant.size;
                                console.log(`Found product ID: ${resolvedProductId}, Size: ${resolvedSelectedSize} for variant ID: ${saleProductVariantId}`);
                                break;
                            }
                        }
                    }

                    // Fallback if productVariantId lookup fails or is not present
                    if (!resolvedProductId && saleToEdit.productName) {
                        resolvedProductId = fetchedProducts.find(p => p.name.trim() === saleToEdit.productName.trim())?.id || '';
                        console.log("Fallback: Resolved product ID by name:", resolvedProductId);
                    }
                    if (!resolvedSelectedSize && saleToEdit.productSize) {
                        resolvedSelectedSize = saleToEdit.productSize;
                        console.log("Fallback: Resolved selected size by name:", resolvedSelectedSize);
                    }

                    const resolvedSellerId = fetchedSellers.find(s => s.name.trim() === saleToEdit.sellerName.trim())?.id || '';
                    console.log("Resolved seller ID by name:", resolvedSellerId);

                    const initialSaleData = {
                        productId: Number(resolvedProductId) || '',
                        selectedSize: resolvedSelectedSize || '',
                        sellerId: Number(resolvedSellerId) || '',
                        customerName: saleToEdit.customerName || '',
                        quantity: saleToEdit.quantity || '',
                        totalPrice: saleToEdit.totalPrice || '',
                    };
                    setSaleData(initialSaleData);
                    setCustomerInputValue(saleToEdit.customerName || '');
                    console.log("saleData initialized to:", initialSaleData);
                } else {
                    setSaleData({
                        productId: '', selectedSize: '', sellerId: '', customerName: '', quantity: '', totalPrice: '',
                    });
                    setCustomerInputValue('');
                }
            } catch (error) {
                console.error("Failed to load data for edit modal:", error);
            } finally {
                setLoading(false);
            }
        };

        if (open) {
            loadInitialData();
        }
    }, [open, saleToEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSaleData(prev => ({
            ...prev,
            [name]: value,
            ...(name === 'productId' && { selectedSize: '' }) // Reset selected size if product changes
        }));
    };

    const handleSubmit = async () => {
        const { productId, selectedSize, sellerId, customerName, quantity, totalPrice } = saleData;

        if (!productId) { alert("Please select a product."); return; }
        if (!selectedSize) { alert("Please select a size."); return; }
        if (!sellerId) { alert("Please select a seller."); return; }
        if (!customerName.trim()) { alert("Please enter a customer name."); return; }
        if (!quantity || Number(quantity) <= 0) { alert("Please enter a valid quantity."); return; }
        if (!totalPrice || Number(totalPrice) <= 0) { alert("Please enter a valid total price."); return; }
        if (!saleToEdit || !saleToEdit.id) { alert("Error: No sale selected for editing."); return; }

        try {
            const payload = {
                productId,
                selectedSize,
                sellerId,
                customerName: customerName.trim(),
                quantity: Number(quantity),
                totalPrice: Number(totalPrice),
            };

            await api.put(`/api/sales/${saleToEdit.id}`, payload);
            onSaleUpdated();
            onClose();
        } catch (error) {
            console.error('Failed to update sale:', error);
            alert(`Failed to update sale: ${error.response?.data?.message || error.message}`);
        }
    };

    const calculateTotalStock = (variants) => {
        if (!variants) return 0;
        return variants.reduce((total, v) => total + (v.quantity || 0), 0);
    };

    const selectedProduct = products.find(p => p.id === saleData.productId);
    const availableSizes = selectedProduct?.variants || [];

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>עריכת מכירה #{saleToEdit?.id}</DialogTitle>
            <DialogContent>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        {/* Product Selection */}
                        <FormControl fullWidth margin="dense" variant="standard">
                            <InputLabel>בחר מוצר</InputLabel>
                            {console.log("Product Select - saleData.productId:", saleData.productId, "Products:", products)}
                            <Select value={saleData.productId} onChange={handleChange} label="בחר מוצר" name="productId">
                                {products.map((product) => (
                                    <MenuItem key={product.id} value={Number(product.id)}>
                                        {product.name} (מלאי כולל: {calculateTotalStock(product.variants)})
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Size Selection */}
                        {saleData.productId && (
                            <FormControl fullWidth margin="dense" variant="standard">
                                <InputLabel>בחר מידה</InputLabel>
                                {console.log("Size Select - saleData.selectedSize:", saleData.selectedSize, "Available Sizes:", availableSizes)}
                                <Select value={saleData.selectedSize} onChange={handleChange} label="בחר מידה" name="selectedSize">
                                    {availableSizes.map((variant, index) => (
                                        <MenuItem key={index} value={variant.size}>
                                            {variant.size} (מלאי: {variant.quantity})
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}

                        {/* Seller Selection */}
                        <FormControl fullWidth margin="dense" variant="standard">
                            <InputLabel>בחר מוכר</InputLabel>
                            {console.log("Seller Select - saleData.sellerId:", saleData.sellerId, "Sellers:", sellers)}
                            <Select value={saleData.sellerId} onChange={handleChange} label="בחר מוכר" name="sellerId">
                                {sellers.map((seller) => (
                                    <MenuItem key={seller.id} value={Number(seller.id)}>
                                        {seller.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Customer Selection */}
                        <Autocomplete
                            freeSolo
                            options={customers}
                            getOptionLabel={(option) => option.name || ""}
                            value={
                                customers.find(c => c.name === saleData.customerName) ||
                                (saleData.customerName ? { name: saleData.customerName } : null)
                            }
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
                <Button onClick={handleSubmit}>שמור שינויים</Button>
            </DialogActions>
        </Dialog>
    );
}

export default EditSaleModal;
