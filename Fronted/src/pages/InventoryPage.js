import React, { useState, useEffect } from 'react';
import api from '../api';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Box, Typography, CircularProgress
} from '@mui/material';

function InventoryPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await api.get('/products');
                if (response && Array.isArray(response.data)) {
                    setProducts(response.data);
                } else {
                    setProducts([]);
                }
            } catch (error) {
                console.error("Error fetching inventory!", error);
                setError("Failed to load inventory data.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography color="error" variant="h6">{error}</Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h4" component="h1" gutterBottom>
                ניהול מלאי
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>שם מוצר</TableCell>
                            <TableCell>מידה</TableCell>
                            <TableCell align="right">כמות במלאי</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((product) =>
                            (product.variants && product.variants.length > 0) ? (
                                product.variants.map((variant, index) => (
                                    <TableRow key={`${product.id}-${variant.size}`}>
                                        {index === 0 && (
                                            <TableCell rowSpan={product.variants.length} component="th" scope="row" sx={{ verticalAlign: 'top' }}>
                                                {product.name}
                                            </TableCell>
                                        )}
                                        <TableCell>{variant.size}</TableCell>
                                        <TableCell align="right">{variant.quantity}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow key={product.id}>
                                    <TableCell component="th" scope="row">{product.name}</TableCell>
                                    <TableCell colSpan={2} align="center">אין מידות זמינות</TableCell>
                                </TableRow>
                            )
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

export default InventoryPage;
