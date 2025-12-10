import React, { useState, useEffect } from 'react';
import api from '../api';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Button, Box, Typography, CircularProgress, useMediaQuery, useTheme, Stack, Divider
} from '@mui/material';
import AddSellerModal from '../components/AddSellerModal';
import EditSellerModal from '../components/EditSellerModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';

// Mobile-specific card component for a single seller
const SellerMobileCard = ({ seller, onEdit, onDelete }) => (
    <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
        <Stack spacing={1}>
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                {seller.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                ID: {seller.id}
            </Typography>
            <Divider />
            <Stack direction="row" spacing={1} sx={{ pt: 1, justifyContent: 'flex-end' }}>
                <Button size="small" variant="outlined" onClick={() => onEdit(seller)}>ערוך</Button>
                <Button size="small" variant="contained" color="error" onClick={() => onDelete(seller)}>מחק</Button>
            </Stack>
        </Stack>
    </Paper>
);

function SellersPage() {
    const [sellers, setSellers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddSellerModalOpen, setIsAddSellerModalOpen] = useState(false);
    const [isEditSellerModalOpen, setIsEditSellerModalOpen] = useState(false);
    const [sellerToEdit, setSellerToEdit] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [sellerToDelete, setSellerToDelete] = useState(null);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const fetchSellers = async () => {
        setLoading(true);
        try {
            const response = await api.get('/api/sellers');
            if (response && Array.isArray(response.data)) {
                setSellers(response.data);
            } else {
                setSellers([]);
            }
        } catch (error) {
            console.error("Error fetching sellers!", error);
            setSellers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSellers();
    }, []);

    const handleSellerAddedOrUpdated = () => {
        fetchSellers();
    };

    const handleOpenEditModal = (seller) => {
        setSellerToEdit(seller);
        setIsEditSellerModalOpen(true);
    };

    const handleDeleteClick = (seller) => {
        setSellerToDelete(seller);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!sellerToDelete) return;
        try {
            await api.delete(`/api/sellers/${sellerToDelete.id}`);
            handleSellerAddedOrUpdated();
        } catch (error) {
            console.error('Failed to delete seller:', error);
            alert(`Failed to delete seller: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsDeleteModalOpen(false);
            setSellerToDelete(null);
        }
    };

    const renderDesktopView = () => (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>שם המוכר</TableCell>
                        <TableCell>ID</TableCell>
                        <TableCell>פעולות</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sellers.length > 0 ? (
                        sellers.map((seller) => (
                            <TableRow key={seller.id}>
                                <TableCell component="th" scope="row">{seller.name}</TableCell>
                                <TableCell>{seller.id}</TableCell>
                                <TableCell>
                                    <Button size="small" onClick={() => handleOpenEditModal(seller)}>ערוך</Button>
                                    <Button size="small" color="error" onClick={() => handleDeleteClick(seller)}>מחק</Button>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={3} align="center">
                                לא נמצאו מוכרים.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );

    const renderMobileView = () => (
        <Box>
            {sellers.map((seller) => (
                <SellerMobileCard key={seller.id} seller={seller} onEdit={handleOpenEditModal} onDelete={handleDeleteClick} />
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
                    ניהול מוכרים
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setIsAddSellerModalOpen(true)}
                    sx={{ minHeight: '44px', width: { xs: '100%', sm: 'auto' } }}
                >
                    הוסף מוכר חדש
                </Button>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                    <CircularProgress />
                </Box>
            ) : (
                isMobile ? renderMobileView() : renderDesktopView()
            )}

            <AddSellerModal open={isAddSellerModalOpen} onClose={() => setIsAddSellerModalOpen(false)} onSellerAdded={handleSellerAddedOrUpdated} />
            <EditSellerModal open={isEditSellerModalOpen} onClose={() => setIsEditSellerModalOpen(false)} onSellerUpdated={handleSellerAddedOrUpdated} sellerToEdit={sellerToEdit} />
            <DeleteConfirmationModal
                open={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                productName={`המוכר ${sellerToDelete?.name}`}
            />
        </Box>
    );
}

export default SellersPage;
