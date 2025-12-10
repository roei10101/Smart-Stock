import React, { useState, useEffect } from 'react';
import api from '../api';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Box, Typography, CircularProgress, Grid, useMediaQuery, useTheme, Stack, Divider
} from '@mui/material';

// Mobile-specific card component for a seller's balance
const SellerBalanceMobileCard = ({ seller }) => {
    const formatCurrency = (value) => `₪${(value || 0).toFixed(2)}`;

    return (
        <Paper elevation={2} sx={{ p: 2, mb: 2, borderRadius: 2 }}>
            <Stack spacing={1.5}>
                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                    {seller.sellerName}
                </Typography>
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body1">הכנסות:</Typography>
                    <Typography variant="body1" sx={{ color: 'green', fontWeight: 'bold' }}>{formatCurrency(seller.totalRevenue)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body1">הוצאות:</Typography>
                    <Typography variant="body1" sx={{ color: 'red', fontWeight: 'bold' }}>{formatCurrency(seller.totalExpenses)}</Typography>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1 }}>
                    <Typography variant="h6">מאזן נטו:</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{formatCurrency(seller.netBalance)}</Typography>
                </Box>
            </Stack>
        </Paper>
    );
};

function BalanceSheetPage() {
    const [balanceData, setBalanceData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        const fetchBalanceData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await api.get('/api/balance-sheet');
                if (response && response.data) {
                    setBalanceData(response.data);
                } else {
                    setBalanceData(null);
                }
            } catch (error) {
                console.error("Error fetching balance sheet data!", error);
                setError("Failed to load balance sheet data. Please check your backend API.");
            } finally {
                setLoading(false);
            }
        };

        fetchBalanceData();
    }, []);

    const formatCurrency = (value) => `₪${(value || 0).toFixed(2)}`;

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

    const storeSummary = balanceData?.storeSummary || {};
    const sellerBreakdown = balanceData?.sellerBreakdown || [];

    const renderDesktopView = () => (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>שם המוכר</TableCell>
                        <TableCell align="right">סה"כ הכנסות</TableCell>
                        <TableCell align="right">סה"כ הוצאות</TableCell>
                        <TableCell align="right">מאזן נטו</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sellerBreakdown.length > 0 ? (
                        sellerBreakdown.map((seller) => (
                            <TableRow key={seller.sellerId}>
                                <TableCell component="th" scope="row">{seller.sellerName}</TableCell>
                                <TableCell align="right" sx={{ color: 'green' }}>{formatCurrency(seller.totalRevenue)}</TableCell>
                                <TableCell align="right" sx={{ color: 'red' }}>{formatCurrency(seller.totalExpenses)}</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>{formatCurrency(seller.netBalance)}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={4} align="center">
                                לא נמצאו נתונים להצגה.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );

    const renderMobileView = () => (
        <Box>
            {sellerBreakdown.map((seller) => (
                <SellerBalanceMobileCard key={seller.sellerId} seller={seller} />
            ))}
        </Box>
    );

    return (
        <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
            <Typography variant="h4" component="h1" gutterBottom>
                מאזן כספים
            </Typography>

            {/* Store Summary */}
            <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
                סיכום כללי של החנות
            </Typography>
            <Grid container spacing={2} mb={4}>
                <Grid item xs={12} sm={4}>
                    <Paper elevation={3} sx={{ p: 2, textAlign: 'center', bgcolor: 'success.light', color: 'success.contrastText', borderRadius: 2 }}>
                        <Typography variant="h6">סה"כ הכנסות</Typography>
                        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{formatCurrency(storeSummary.totalRevenue)}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Paper elevation={3} sx={{ p: 2, textAlign: 'center', bgcolor: 'error.light', color: 'error.contrastText', borderRadius: 2 }}>
                        <Typography variant="h6">סה"כ הוצאות</Typography>
                        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{formatCurrency(storeSummary.totalExpenses)}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Paper elevation={3} sx={{ p: 2, textAlign: 'center', bgcolor: 'info.light', color: 'info.contrastText', borderRadius: 2 }}>
                        <Typography variant="h6">מאזן נטו</Typography>
                        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{formatCurrency(storeSummary.netBalance)}</Typography>
                    </Paper>
                </Grid>
            </Grid>

            {/* Seller Breakdown */}
            <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
                פירוט לפי מוכר
            </Typography>
            {isMobile ? renderMobileView() : renderDesktopView()}
        </Box>
    );
}

export default BalanceSheetPage;
