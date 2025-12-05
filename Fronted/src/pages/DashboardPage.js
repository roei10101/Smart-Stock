import React, { useState, useEffect } from 'react';
import api from '../api';
import {
    Box, Typography, CircularProgress, Paper, Grid, useTheme
} from '@mui/material';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, Cell
} from 'recharts';

// Custom Tooltip for Recharts
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <Paper sx={{ p: 1, bgcolor: 'rgba(255, 255, 255, 0.9)' }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{label}</Typography>
                {payload.map((entry, index) => (
                    <Typography key={`item-${index}`} variant="body2" sx={{ color: entry.color }}>
                        {entry.name}: {entry.value} {entry.name === 'הכנסות' ? '₪' : ''}
                    </Typography>
                ))}
            </Paper>
        );
    }
    return null;
};

// Custom Pie Chart Tooltip
const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <Paper sx={{ p: 1, bgcolor: 'rgba(255, 255, 255, 0.9)' }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{data.productName}</Typography>
                <Typography variant="body2">
                    הכנסות: ₪{data.value?.toFixed(2)} ({data.percent ? (data.percent * 100).toFixed(2) : '0.00'}%)
                </Typography>
            </Paper>
        );
    }
    return null;
};


function DashboardPage() {
    const theme = useTheme(); // Access theme for colors
    const [summary, setSummary] = useState(null);
    const [salesByProduct, setSalesByProduct] = useState([]);
    const [salesBySeller, setSalesBySeller] = useState([]);
    const [salesOverTime, setSalesOverTime] = useState([]);
    const [salesDistributionByProduct, setSalesDistributionByProduct] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const chartColors = [
        theme.palette.primary.main,
        theme.palette.secondary.main,
        theme.palette.success.main,
        theme.palette.warning.main,
        theme.palette.info.main,
        theme.palette.error.main,
        '#8884d8', '#82ca9d', '#ffc658', '#ff7300'
    ];

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            setError(null);
            try {
                const [summaryRes, salesByProductRes, salesBySellerRes, salesOverTimeRes, salesDistributionRes] = await Promise.all([
                    api.get('/dashboard/summary').catch(err => { console.error("Error fetching summary:", err); return { data: null }; }),
                    api.get('/dashboard/sales-by-product').catch(err => { console.error("Error fetching sales by product:", err); return { data: [] }; }),
                    api.get('/dashboard/sales-by-seller').catch(err => { console.error("Error fetching sales by seller:", err); return { data: [] }; }),
                    api.get('/dashboard/sales-over-time').catch(err => { console.error("Error fetching sales over time:", err); return { data: [] }; }),
                    api.get('/dashboard/sales-distribution-by-product').catch(err => { console.error("Error fetching sales distribution by product:", err); return { data: [] }; }),
                ]);

                setSummary(summaryRes.data);
                setSalesByProduct(Array.isArray(salesByProductRes.data) ? salesByProductRes.data : []);
                setSalesBySeller(Array.isArray(salesBySellerRes.data) ? salesBySellerRes.data : []);
                setSalesOverTime(Array.isArray(salesOverTimeRes.data) ? salesOverTimeRes.data : []);
                const distributionData = Array.isArray(salesDistributionRes.data) ? salesDistributionRes.data : [];
                setSalesDistributionByProduct(distributionData);
                console.log("Sales Distribution Data for Pie Chart:", distributionData);

            } catch (err) {
                console.error("Failed to fetch dashboard data:", err);
                setError("Failed to load dashboard data. Please check your backend API.");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

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
                <Typography color="error" variant="h6">
                    {error}
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}> {/* Responsive padding */}
            <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3, color: theme.palette.primary.dark }}>
                לוח מחוונים
            </Typography>

            {/* Summary Cards */}
            <Grid container spacing={3} mb={4}>
                <Grid item xs={6} sm={6} md={3}>
                    <Paper elevation={3} sx={{ p: 2, textAlign: 'center', bgcolor: theme.palette.primary.light, color: theme.palette.primary.contrastText, borderRadius: 2 }}>
                        <Typography variant="h6">סה"כ מכירות</Typography>
                        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{summary?.totalSales || 0}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={6} sm={6} md={3}>
                    <Paper elevation={3} sx={{ p: 2, textAlign: 'center', bgcolor: theme.palette.secondary.light, color: theme.palette.secondary.contrastText, borderRadius: 2 }}>
                        <Typography variant="h6">סה"כ הכנסות</Typography>
                        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>₪{summary?.totalRevenue?.toFixed(2) || '0.00'}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={6} sm={6} md={3}>
                    <Paper elevation={3} sx={{ p: 2, textAlign: 'center', bgcolor: theme.palette.info.light, color: theme.palette.info.contrastText, borderRadius: 2 }}>
                        <Typography variant="h6">מוצרים במלאי</Typography>
                        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{summary?.totalProductsInStock || 0}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={6} sm={6} md={3}>
                    <Paper elevation={3} sx={{ p: 2, textAlign: 'center', bgcolor: theme.palette.success.light, color: theme.palette.success.contrastText, borderRadius: 2 }}>
                        <Typography variant="h6">לקוחות רשומים</Typography>
                        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{summary?.totalCustomers || 0}</Typography>
                    </Paper>
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                {/* Sales by Product Chart */}
                <Grid item xs={12} lg={6}>
                    <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
                        <Typography variant="h6" gutterBottom sx={{ color: theme.palette.text.primary }}>מכירות לפי מוצר</Typography>
                        {salesByProduct.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={salesByProduct} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="productName" angle={-15} textAnchor="end" height={60} interval={0} />
                                    <YAxis />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend />
                                    <Bar dataKey="totalQuantity" fill={chartColors[0]} name="כמות נמכרת" />
                                    <Bar dataKey="totalRevenue" fill={chartColors[1]} name="הכנסות" />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>אין נתוני מכירות לפי מוצר.</Typography>
                        )}
                    </Paper>
                </Grid>

                {/* Sales by Seller Chart */}
                <Grid item xs={12} lg={6}>
                    <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
                        <Typography variant="h6" gutterBottom sx={{ color: theme.palette.text.primary }}>מכירות לפי מוכר</Typography>
                        {salesBySeller.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={salesBySeller} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="sellerName" angle={-15} textAnchor="end" height={60} interval={0} />
                                    <YAxis />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend />
                                    <Bar dataKey="totalQuantity" fill={chartColors[2]} name="כמות נמכרת" />
                                    <Bar dataKey="totalRevenue" fill={chartColors[3]} name="הכנסות" />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>אין נתוני מכירות לפי מוכר.</Typography>
                        )}
                    </Paper>
                </Grid>

                {/* Sales Distribution by Product (Pie Chart) */}
                <Grid item xs={12} lg={6}>
                    <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
                        <Typography variant="h6" gutterBottom sx={{ color: theme.palette.text.primary }}>התפלגות הכנסות לפי מוצר</Typography>
                        {salesDistributionByProduct.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={salesDistributionByProduct}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                        nameKey="productName"
                                        label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                                    >
                                        {salesDistributionByProduct.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomPieTooltip />} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>אין נתוני התפלגות מכירות לפי מוצר.</Typography>
                        )}
                    </Paper>
                </Grid>

                {/* Sales Over Time Chart */}
                <Grid item xs={12} lg={6}>
                    <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
                        <Typography variant="h6" gutterBottom sx={{ color: theme.palette.text.primary }}>מכירות לאורך זמן</Typography>
                        {salesOverTime.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={salesOverTime} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend />
                                    <Line type="monotone" dataKey="totalRevenue" stroke={chartColors[4]} activeDot={{ r: 8 }} name="הכנסות" />
                                    <Line type="monotone" dataKey="totalQuantity" stroke={chartColors[5]} name="כמות נמכרת" />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>אין נתוני מכירות לאורך זמן.</Typography>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}

export default DashboardPage;
