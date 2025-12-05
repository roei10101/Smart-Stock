import React, { useState, useEffect } from 'react';
import api from '../api';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Box, Typography, CircularProgress, useMediaQuery, useTheme, Stack, Divider
} from '@mui/material';

// Mobile-specific card component for a seller's stats
const SellerStatMobileCard = ({ seller }) => {
    const formatCurrency = (value) => `₪${(value || 0).toFixed(2)}`;

    return (
        <Paper elevation={2} sx={{ p: 2, mb: 2, borderRadius: 2 }}>
            <Stack spacing={1.5}>
                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                    {seller.name}
                </Typography>
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body1">מספר מכירות:</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{seller.totalSales}</Typography>
                </Box>
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

function SellerStatsPage() {
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                const response = await api.get('/sellers/stats');
                if (response && Array.isArray(response.data)) {
                    setStats(response.data);
                } else {
                    setStats([]);
                }
            } catch (error) {
                console.error("Error fetching seller stats!", error);
                setStats([]);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const formatCurrency = (value) => `₪${(value || 0).toFixed(2)}`;

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    const renderDesktopView = () => (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>שם המוכר</TableCell>
                        <TableCell align="right">מספר מכירות</TableCell>
                        <TableCell align="right">סך הכל הכנסות</TableCell>
                        <TableCell align="right">סך הכל הוצאות</TableCell>
                        <TableCell align="right">מאזן נטו</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {stats.length > 0 ? (
                        stats.map((seller) => (
                            <TableRow key={seller.name}>
                                <TableCell component="th" scope="row">
                                    {seller.name}
                                </TableCell>
                                <TableCell align="right">{seller.totalSales}</TableCell>
                                <TableCell align="right" sx={{ color: 'green' }}>{formatCurrency(seller.totalRevenue)}</TableCell>
                                <TableCell align="right" sx={{ color: 'red' }}>{formatCurrency(seller.totalExpenses)}</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>{formatCurrency(seller.netBalance)}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={5} align="center">
                                לא נמצאו נתונים להצגה
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );

    const renderMobileView = () => (
        <Box>
            {stats.map((seller) => (
                <SellerStatMobileCard key={seller.name} seller={seller} />
            ))}
        </Box>
    );

    return (
        <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
            <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
                סטטיסטיקות מוכרים
            </Typography>
            {isMobile ? renderMobileView() : renderDesktopView()}
        </Box>
    );
}

export default SellerStatsPage;
