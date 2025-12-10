import React, { useState, useEffect } from 'react';
import api from '../api';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Button, Box, Typography, CircularProgress, useMediaQuery, useTheme, Stack, Divider
} from '@mui/material';
import AddCustomerModal from '../components/AddCustomerModal';
import EditCustomerModal from '../components/EditCustomerModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';

// Mobile-specific card component for a single customer
const CustomerMobileCard = ({ customer, onEdit, onDelete }) => (
    <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
        <Stack spacing={1}>
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                {customer.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                ID: {customer.id}
            </Typography>
            <Divider />
            <Stack direction="row" spacing={1} sx={{ pt: 1, justifyContent: 'flex-end' }}>
                <Button size="small" variant="outlined" onClick={() => onEdit(customer)}>ערוך</Button>
                <Button size="small" variant="contained" color="error" onClick={() => onDelete(customer)}>מחק</Button>
            </Stack>
        </Stack>
    </Paper>
);

function CustomersPage() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [customerToEdit, setCustomerToEdit] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState(null);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const response = await api.get('/api/customers');
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
            await api.delete(`/api/customers/${customerToDelete.id}`);
            fetchCustomers();
        } catch (error) {
            console.error('Failed to delete customer:', error);
            alert(`Failed to delete customer: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsDeleteModalOpen(false);
            setCustomerToDelete(null);
        }
    };

    const renderDesktopView = () => (
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
    );

    const renderMobileView = () => (
        <Box>
            {customers.map((customer) => (
                <CustomerMobileCard key={customer.id} customer={customer} onEdit={handleOpenEditModal} onDelete={handleDeleteClick} />
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
                    ניהול לקוחות
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setIsAddModalOpen(true)}
                    sx={{ minHeight: '44px', width: { xs: '100%', sm: 'auto' } }}
                >
                    הוסף לקוח חדש
                </Button>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                    <CircularProgress />
                </Box>
            ) : (
                isMobile ? renderMobileView() : renderDesktopView()
            )}

            <AddCustomerModal open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onCustomerAdded={handleCustomerAddedOrUpdated} />
            <EditCustomerModal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onCustomerUpdated={handleCustomerAddedOrUpdated} customerToEdit={customerToEdit} />
            <DeleteConfirmationModal
                open={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                productName={`הלקוח ${customerToDelete?.name}`}
            />
        </Box>
    );
}

export default CustomersPage;
