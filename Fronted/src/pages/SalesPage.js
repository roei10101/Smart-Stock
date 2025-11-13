import React, { useState, useEffect } from 'react';
import api from '../api';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Button, Box, Typography, CircularProgress
} from '@mui/material';
import AddSaleModal from '../components/AddSaleModal';
import EditSaleModal from '../components/EditSaleModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';

function SalesPage() {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedSale, setSelectedSale] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [saleToDelete, setSaleToDelete] = useState(null);

    const fetchSales = async () => {
        setLoading(true);
        try {
            const response = await api.get('/sales');
            if (response && Array.isArray(response.data)) {
                setSales(response.data);
            } else {
                setSales([]);
            }
        } catch (error) {
            console.error("Error fetching sales!", error);
            setSales([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSales();
    }, []);

    const handleSaleAdded = () => fetchSales();
    const handleSaleUpdated = () => fetchSales();

    const handleEditClick = (sale) => {
        setSelectedSale(sale);
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (sale) => {
        setSaleToDelete(sale);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!saleToDelete) return;
        try {
            await api.delete(`/sales/${saleToDelete.id}`);
            fetchSales();
        } catch (error) {
            console.error('Failed to delete sale:', error);
        } finally {
            setIsDeleteModalOpen(false);
            setSaleToDelete(null);
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" component="h1">
                    ניהול מכירות
                </Typography>
                <Button variant="contained" color="primary" onClick={() => setIsModalOpen(true)}>
                    הוסף מכירה חדשה
                </Button>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                    <CircularProgress />
                </Box>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>שם מוצר</TableCell>
                                <TableCell>מידה</TableCell>
                                <TableCell>שם לקוח</TableCell>
                                <TableCell>מוכר</TableCell>
                                <TableCell align="left">כמות</TableCell>
                                <TableCell align="left">מחיר סופי</TableCell>
                                <TableCell align="left">תאריך</TableCell>
                                <TableCell align="left">פעולות</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sales.length > 0 ? (
                                sales.map((sale) => (
                                    <TableRow key={sale.id}>
                                        <TableCell>{sale.productName}</TableCell>
                                        <TableCell>{sale.productSize}</TableCell> {/* --- FIX: Changed from selectedSize to productSize --- */}
                                        <TableCell>{sale.customerName}</TableCell>
                                        <TableCell>{sale.sellerName}</TableCell>
                                        <TableCell align="left">{sale.quantity}</TableCell>
                                        <TableCell align="left">₪{sale.totalPrice}</TableCell>
                                        <TableCell align="left">{new Date(sale.saleDate).toLocaleDateString('he-IL')}</TableCell>
                                        <TableCell align="left">
                                            <Button size="small" onClick={() => handleEditClick(sale)}>ערוך</Button>
                                            <Button size="small" color="error" onClick={() => handleDeleteClick(sale)}>מחק</Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={8} align="center">
                                        לא נמצאו מכירות להצגה. ייתכן שאין לך הרשאה לצפות בנתונים אלו.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <AddSaleModal open={isModalOpen} onClose={() => setIsModalOpen(false)} onSaleAdded={handleSaleAdded} />
            <EditSaleModal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onSaleUpdated={handleSaleUpdated} saleToEdit={selectedSale} />
            <DeleteConfirmationModal
                open={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                productName={`המכירה של ${saleToDelete?.productName} ללקוח ${saleToDelete?.customerName}`}
            />
        </Box>
    );
}

export default SalesPage;
