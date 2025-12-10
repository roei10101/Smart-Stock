import React, { useState, useEffect } from 'react';
import api from '../api';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Button, Box, Typography, CircularProgress, useMediaQuery, useTheme, Stack, Divider
} from '@mui/material';
import AddExpenseModal from '../components/AddExpenseModal';
import EditExpenseModal from '../components/EditExpenseModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';

// Mobile-specific card component for a single expense
const ExpenseMobileCard = ({ expense, onEdit, onDelete }) => (
    <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
        <Stack spacing={1}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                    {expense.description}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                    ₪{expense.amount.toFixed(2)}
                </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
                {new Date(expense.date).toLocaleDateString('he-IL')}
            </Typography>
            <Divider />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1 }}>
                <Typography variant="body1">שויך למוכר: <strong>{expense.sellerName}</strong></Typography>
            </Box>
            <Divider />
            <Stack direction="row" spacing={1} sx={{ pt: 1, justifyContent: 'flex-end' }}>
                <Button size="small" variant="outlined" onClick={() => onEdit(expense)}>ערוך</Button>
                <Button size="small" variant="contained" color="error" onClick={() => onDelete(expense)}>מחק</Button>
            </Stack>
        </Stack>
    </Paper>
);

function ExpensesPage() {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [expenseToEdit, setExpenseToEdit] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [expenseToDelete, setExpenseToDelete] = useState(null);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const fetchExpenses = async () => {
        setLoading(true);
        try {
            const response = await api.get('/api/expenses');
            if (response && Array.isArray(response.data)) {
                setExpenses(response.data);
            } else {
                setExpenses([]);
            }
        } catch (error) {
            console.error("Error fetching expenses!", error);
            setExpenses([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    const handleExpenseAddedOrUpdated = () => {
        fetchExpenses();
    };

    const handleOpenEditModal = (expense) => {
        setExpenseToEdit(expense);
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (expense) => {
        setExpenseToDelete(expense);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!expenseToDelete) return;
        try {
            await api.delete(`/api/expenses/${expenseToDelete.id}`);
            fetchExpenses();
        } catch (error) {
            console.error('Failed to delete expense:', error);
            alert(`Failed to delete expense: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsDeleteModalOpen(false);
            setExpenseToDelete(null);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid Date';
        return date.toLocaleDateString('he-IL', { year: 'numeric', month: '2-digit', day: '2-digit' });
    };

    const renderDesktopView = () => (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>תיאור</TableCell>
                        <TableCell>מוכר</TableCell>
                        <TableCell align="right">סכום</TableCell>
                        <TableCell align="right">תאריך</TableCell>
                        <TableCell align="center">פעולות</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {expenses.length > 0 ? (
                        expenses.map((expense) => (
                            <TableRow key={expense.id}>
                                <TableCell component="th" scope="row">{expense.description}</TableCell>
                                <TableCell>{expense.sellerName}</TableCell>
                                <TableCell align="right">₪{expense.amount.toFixed(2)}</TableCell>
                                <TableCell align="right">{formatDate(expense.date)}</TableCell>
                                <TableCell align="center">
                                    <Button size="small" onClick={() => handleOpenEditModal(expense)}>ערוך</Button>
                                    <Button size="small" color="error" onClick={() => handleDeleteClick(expense)}>מחק</Button>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={5} align="center">
                                לא נמצאו הוצאות.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );

    const renderMobileView = () => (
        <Box>
            {expenses.map((expense) => (
                <ExpenseMobileCard key={expense.id} expense={expense} onEdit={handleOpenEditModal} onDelete={handleDeleteClick} />
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
                    ניהול הוצאות
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setIsAddModalOpen(true)}
                    sx={{ minHeight: '44px', width: { xs: '100%', sm: 'auto' } }}
                >
                    הוסף הוצאה חדשה
                </Button>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                    <CircularProgress />
                </Box>
            ) : (
                isMobile ? renderMobileView() : renderDesktopView()
            )}

            <AddExpenseModal open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onExpenseAdded={handleExpenseAddedOrUpdated} />
            <EditExpenseModal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onExpenseUpdated={handleExpenseAddedOrUpdated} expenseToEdit={expenseToEdit} />
            <DeleteConfirmationModal
                open={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                productName={`ההוצאה "${expenseToDelete?.description}"`}
            />
        </Box>
    );
}

export default ExpensesPage;
