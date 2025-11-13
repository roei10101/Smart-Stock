import React, { useState, useEffect } from 'react';
import api from '../api';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Box, Typography, CircularProgress
} from '@mui/material';

function SellerStatsPage() {
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true); // Add loading state

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                const response = await api.get('/sellers/stats');
                // --- Definitive Fix: Ensure response.data is an array ---
                if (response && Array.isArray(response.data)) {
                    setStats(response.data);
                } else {
                    // Handle cases where data is not as expected
                    setStats([]);
                }
            } catch (error) {
                console.error("Error fetching seller stats!", error);
                setStats([]); // Ensure stats is an empty array on error
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
                סטטיסטיקות מוכרים
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>שם המוכר</TableCell>
                            <TableCell align="right">מספר מכירות</TableCell>
                            <TableCell align="right">סך הכל הכנסות</TableCell>
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
                                    <TableCell align="right">₪{seller.totalRevenue?.toFixed(2)}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={3} align="center">
                                    לא נמצאו נתונים להצגה
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

export default SellerStatsPage;
