import React, { useState, useEffect } from 'react';
import api from '../api';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Button, Box, Typography, CircularProgress
} from '@mui/material';
import AddSellerModal from '../components/AddSellerModal';
import EditSellerModal from '../components/EditSellerModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal'; // Import DeleteConfirmationModal

function SellersPage() {
    const [sellers, setSellers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [sellerToEdit, setSellerToEdit] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State for delete modal
    const [sellerToDelete, setSellerToDelete] = useState(null); // State to hold seller being deleted

    const fetchSellers = async () => {
        setLoading(true);
        try {
            const response = await api.get('/sellers');
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
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (seller) => {
        setSellerToDelete(seller);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!sellerToDelete) return;
        try {
            await api.delete(`/sellers/${sellerToDelete.id}`);
            handleSellerAddedOrUpdated(); // Refresh the list
        } catch (error) {
            console.error('Failed to delete seller:', error);
            alert(`Failed to delete seller: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsDeleteModalOpen(false);
            setSellerToDelete(null);
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" component="h1">
                    ניהול מוכרים
                </Typography>
                <Button variant="contained" color="primary" onClick={() => setIsAddModalOpen(true)}>
                    הוסף מוכר חדש
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
            )}

            <AddSellerModal
                open={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSellerAdded={handleSellerAddedOrUpdated}
            />

            <EditSellerModal
                open={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSellerUpdated={handleSellerAddedOrUpdated}
                sellerToEdit={sellerToEdit}
            />

            <DeleteConfirmationModal
                open={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                productName={`המוכר ${sellerToDelete?.name}`} // Using productName prop for seller name
            />
        </Box>
    );
}

export default SellersPage;
