import React, { useState, useEffect } from 'react';
import api from '../api';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Button, Box, Typography, CircularProgress
} from '@mui/material';
import AddCustomerModal from '../components/AddCustomerModal';
import EditCustomerModal from '../components/EditCustomerModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal'; // Re-using for customer deletion

function CustomersPage() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [customerToEdit, setCustomerToEdit] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState(null);

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const response = await api.get('/customers');
            if (response && Array.isArray(response.data)) {
                setCustomers(response.data);
            } else {
                setCustomers([]);
            }
        } catch (error) {
            console.error("Error fetching customers!", error);
            setCustomers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleCustomerAddedOrUpdated = () => {
        fetchCustomers();
    };

    const handleOpenEditModal = (customer) => {
        setCustomerToEdit(customer);
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (customer) => {
        setCustomerToDelete(customer);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!customerToDelete) return;
        try {
            await api.delete(`/customers/${customerToDelete.id}`);
            fetchCustomers();
        } catch (error) {
            console.error('Failed to delete customer:', error);
            alert(`Failed to delete customer: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsDeleteModalOpen(false);
            setCustomerToDelete(null);
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" component="h1">
                    ניהול לקוחות
                </Typography>
                <Button variant="contained" color="primary" onClick={() => setIsAddModalOpen(true)}>
                    הוסף לקוח חדש
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
                                <TableCell>שם הלקוח</TableCell>
                                <TableCell>ID</TableCell>
                                <TableCell>פעולות</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {customers.length > 0 ? (
                                customers.map((customer) => (
                                    <TableRow key={customer.id}>
                                        <TableCell component="th" scope="row">{customer.name}</TableCell>
                                        <TableCell>{customer.id}</TableCell>
                                        <TableCell>
                                            <Button size="small" onClick={() => handleOpenEditModal(customer)}>ערוך</Button>
                                            <Button size="small" color="error" onClick={() => handleDeleteClick(customer)}>מחק</Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={3} align="center">
                                        לא נמצאו לקוחות.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <AddCustomerModal
                open={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onCustomerAdded={handleCustomerAddedOrUpdated}
            />

            <EditCustomerModal
                open={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onCustomerUpdated={handleCustomerAddedOrUpdated}
                customerToEdit={customerToEdit}
            />

            <DeleteConfirmationModal
                open={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                productName={`הלקוח ${customerToDelete?.name}`} // Re-using productName prop for customer name
            />
        </Box>
    );
}

export default CustomersPage;
