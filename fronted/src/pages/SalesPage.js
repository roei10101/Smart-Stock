import React, { useState, useEffect } from 'react';
import api from '../api';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Button, Box, Typography, CircularProgress, useMediaQuery, useTheme, Stack, Divider
} from '@mui/material';
import AddSaleModal from '../components/AddSaleModal';
import EditSaleModal from '../components/EditSaleModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';

// Mobile-specific card component for a single sale
const SaleMobileCard = ({ sale, onEdit, onDelete }) => (
    <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
        <Stack spacing={1}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                    {sale.productName}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    ₪{sale.totalPrice}
                </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
                {new Date(sale.saleDate).toLocaleDateString('he-IL')}
            </Typography>
            <Divider />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1 }}>
                <Typography variant="body1">לקוח: <strong>{sale.customerName}</strong></Typography>
                <Typography variant="body1">מוכר: <strong>{sale.sellerName}</strong></Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body1">מידה: <strong>{sale.productSize}</strong></Typography>
                <Typography variant="body1">כמות: <strong>{sale.quantity}</strong></Typography>
            </Box>
            <Divider />
            <Stack direction="row" spacing={1} sx={{ pt: 1, justifyContent: 'flex-end' }}>
                <Button size="small" variant="outlined" onClick={() => onEdit(sale)}>ערוך</Button>
                <Button size="small" variant="contained" color="error" onClick={() => onDelete(sale)}>מחק</Button>
            </Stack>
        </Stack>
    </Paper>
);

function SalesPage() {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedSale, setSelectedSale] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [saleToDelete, setSaleToDelete] = useState(null);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md')); // Use md breakpoint for better layout on tablets

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

    const renderDesktopView = () => (
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
                                <TableCell>{sale.productSize}</TableCell>
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
                                לא נמצאו מכירות להצגה.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );

    const renderMobileView = () => (
        <Box>
            {sales.map((sale) => (
                <SaleMobileCard key={sale.id} sale={sale} onEdit={handleEditClick} onDelete={handleDeleteClick} />
            ))}
        </Box>
    );

    return (
        <Box>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 2, sm: 0 }
            }}>
                <Typography variant="h4" component="h1">
                    ניהול מכירות
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setIsModalOpen(true)}
                    sx={{ minHeight: '44px', width: { xs: '100%', sm: 'auto' } }}
                >
                    הוסף מכירה חדשה
                </Button>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                    <CircularProgress />
                </Box>
            ) : (
                isMobile ? renderMobileView() : renderDesktopView()
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
