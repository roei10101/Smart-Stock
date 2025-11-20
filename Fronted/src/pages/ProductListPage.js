import React, { useState, useEffect } from 'react';
import api from '../api';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Button, Box, Typography
} from '@mui/material';
import ProductFormModal from '../components/ProductFormModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';

function ProductListPage() {
    const [products, setProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const fetchProducts = async () => {
        try {
            const response = await api.get('/products');
            setProducts(response.data);
        } catch (error) {
            console.error("Error fetching products!", error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleSave = () => {
        fetchProducts();
    };

    const handleOpenAddModal = () => {
        setSelectedProduct(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (product) => {
        setSelectedProduct(product);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedProduct) return;
        try {
            // This will delete the entire product, and the backend will handle deleting the variants.
            await api.delete(`/products/${selectedProduct.id}`);
            fetchProducts();
        } catch (error) {
            console.error('Failed to delete product:', error);
        } finally {
            setIsDeleteModalOpen(false);
            setSelectedProduct(null);
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" component="h1">ניהול מוצרים</Typography>
                <Button variant="contained" color="primary" onClick={handleOpenAddModal}>
                    הוסף מוצר חדש
                </Button>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>שם מוצר</TableCell>
                            <TableCell>מידה</TableCell>
                            <TableCell>כמות במלאי</TableCell>
                            <TableCell>פעולות</TableCell>
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
                                        <TableCell>{variant.quantity}</TableCell>
                                        {index === 0 && (
                                            <TableCell rowSpan={product.variants.length} sx={{ verticalAlign: 'top' }}>
                                                <Button size="small" onClick={() => handleOpenEditModal(product)}>ערוך</Button>
                                                <Button size="small" color="error" onClick={() => handleDeleteClick(product)}>מחק</Button>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow key={product.id}>
                                    <TableCell component="th" scope="row">{product.name}</TableCell>
                                    <TableCell colSpan={2} align="center">אין מידות זמינות</TableCell>
                                    <TableCell>
                                        <Button size="small" onClick={() => handleOpenEditModal(product)}>ערוך</Button>
                                        <Button size="small" color="error" onClick={() => handleDeleteClick(product)}>מחק</Button>
                                    </TableCell>
                                </TableRow>
                            )
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <ProductFormModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                productToEdit={selectedProduct}
            />

            <DeleteConfirmationModal
                open={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                productName={selectedProduct?.name}
            />
        </Box>
    );
}

export default ProductListPage;