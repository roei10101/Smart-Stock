import React, { useState, useEffect } from 'react';
import api from '../api';
import {
    Box, Typography, CircularProgress, Paper, Grid, useTheme
} from '@mui/material';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { motion } from 'framer-motion';
import SummaryCard from '../components/SummaryCard';
import { AttachMoney, Inventory, People, ShoppingCart } from '@mui/icons-material';

// Custom Tooltip for Recharts
const CustomTooltip = ({ active, payload, label }) => {
    const theme = useTheme();
    if (active && payload && payload.length) {
        return (
            <Paper sx={{
                p: 1.5,
                bgcolor: theme.palette.background.paper,
                backgroundImage: 'none',
                backdropFilter: 'blur(4px)',
                borderRadius: 2,
                boxShadow: 3,
                border: `1px solid ${theme.palette.divider}`
            }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5, color: theme.palette.text.primary }}>{label}</Typography>
                {payload.map((entry, index) => (
                    <Typography key={`item-${index}`} variant="body2" sx={{ color: entry.color, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Box component="span" sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: entry.color }} />
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
    const theme = useTheme();
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <Paper sx={{
                p: 1.5,
                bgcolor: theme.palette.background.paper,
                backgroundImage: 'none',
                backdropFilter: 'blur(4px)',
                borderRadius: 2,
                boxShadow: 3,
                border: `1px solid ${theme.palette.divider}`
            }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5, color: theme.palette.text.primary }}>{data.productName}</Typography>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
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

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100
            }
        }
    };

    return (
        <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, minHeight: '100vh' }}>
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 'bold', color: theme.palette.text.primary }}>
                    לוח מחוונים
                </Typography>

                {/* Summary Cards */}
                <Grid container spacing={3} mb={4}>
                    <Grid item xs={12} sm={6} md={3}>
                        <SummaryCard
                            title="סה&quot;כ מכירות"
                            value={summary?.totalSales || 0}
                            icon={<ShoppingCart />}
                            color={theme.palette.primary.main}
                            delay={0.1}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <SummaryCard
                            title="סה&quot;כ הכנסות"
                            value={`₪${summary?.totalRevenue?.toFixed(2) || '0.00'}`}
                            icon={<AttachMoney />}
                            color={theme.palette.secondary.main}
                            delay={0.2}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <SummaryCard
                            title="מוצרים במלאי"
                            value={summary?.totalProductsInStock || 0}
                            icon={<Inventory />}
                            color={theme.palette.info.main}
                            delay={0.3}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <SummaryCard
                            title="לקוחות רשומים"
                            value={summary?.totalCustomers || 0}
                            icon={<People />}
                            color={theme.palette.success.main}
                            delay={0.4}
                        />
                    </Grid>
                </Grid>

                <Grid container spacing={3}>
                    {/* Sales by Product Chart */}
                    <Grid item xs={12} lg={6}>
                        <motion.div variants={itemVariants}>
                            <Paper elevation={0} sx={{ p: 3, borderRadius: 4, boxShadow: theme.shadows[3], bgcolor: theme.palette.background.paper, backgroundImage: 'none' }}>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3, color: theme.palette.text.primary }}>מכירות לפי מוצר</Typography>
                                {salesByProduct.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={salesByProduct} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider} />
                                            <XAxis dataKey="productName" angle={-15} textAnchor="end" height={60} interval={0} tick={{ fill: theme.palette.text.secondary }} />
                                            <YAxis tick={{ fill: theme.palette.text.secondary }} />
                                            <Tooltip content={<CustomTooltip />} cursor={{ fill: theme.palette.action.hover }} />
                                            <Legend />
                                            <Bar dataKey="totalQuantity" fill={chartColors[0]} name="כמות נמכרת" radius={[4, 4, 0, 0]} />
                                            <Bar dataKey="totalRevenue" fill={chartColors[1]} name="הכנסות" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>אין נתוני מכירות לפי מוצר.</Typography>
                                )}
                            </Paper>
                        </motion.div>
                    </Grid>

                    {/* Sales by Seller Chart */}
                    <Grid item xs={12} lg={6}>
                        <motion.div variants={itemVariants}>
                            <Paper elevation={0} sx={{ p: 3, borderRadius: 4, boxShadow: theme.shadows[3], bgcolor: theme.palette.background.paper, backgroundImage: 'none' }}>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3, color: theme.palette.text.primary }}>מכירות לפי מוכר</Typography>
                                {salesBySeller.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={salesBySeller} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider} />
                                            <XAxis dataKey="sellerName" angle={-15} textAnchor="end" height={60} interval={0} tick={{ fill: theme.palette.text.secondary }} />
                                            <YAxis tick={{ fill: theme.palette.text.secondary }} />
                                            <Tooltip content={<CustomTooltip />} cursor={{ fill: theme.palette.action.hover }} />
                                            <Legend />
                                            <Bar dataKey="totalQuantity" fill={chartColors[2]} name="כמות נמכרת" radius={[4, 4, 0, 0]} />
                                            <Bar dataKey="totalRevenue" fill={chartColors[3]} name="הכנסות" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>אין נתוני מכירות לפי מוכר.</Typography>
                                )}
                            </Paper>
                        </motion.div>
                    </Grid>

                    {/* Sales Distribution by Product (Pie Chart) */}
                    <Grid item xs={12} lg={6}>
                        <motion.div variants={itemVariants}>
                            <Paper elevation={0} sx={{ p: 3, borderRadius: 4, boxShadow: theme.shadows[3], bgcolor: theme.palette.background.paper, backgroundImage: 'none' }}>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3, color: theme.palette.text.primary }}>התפלגות הכנסות לפי מוצר</Typography>
                                {salesDistributionByProduct.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={salesDistributionByProduct}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                outerRadius={100}
                                                innerRadius={60}
                                                paddingAngle={5}
                                                dataKey="value"
                                                nameKey="productName"
                                            >
                                                {salesDistributionByProduct.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} stroke="none" />
                                                ))}
                                            </Pie>
                                            <Tooltip content={<CustomPieTooltip />} />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>אין נתוני התפלגות מכירות לפי מוצר.</Typography>
                                )}
                            </Paper>
                        </motion.div>
                    </Grid>

                    {/* Sales Over Time Chart */}
                    <Grid item xs={12} lg={6}>
                        <motion.div variants={itemVariants}>
                            <Paper elevation={0} sx={{ p: 3, borderRadius: 4, boxShadow: theme.shadows[3], bgcolor: theme.palette.background.paper, backgroundImage: 'none' }}>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3, color: theme.palette.text.primary }}>מכירות לאורך זמן</Typography>
                                {salesOverTime.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart data={salesOverTime} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider} />
                                            <XAxis dataKey="date" tick={{ fill: theme.palette.text.secondary }} />
                                            <YAxis tick={{ fill: theme.palette.text.secondary }} />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Legend />
                                            <Line type="monotone" dataKey="totalRevenue" stroke={chartColors[4]} strokeWidth={3} activeDot={{ r: 8 }} name="הכנסות" dot={{ r: 4 }} />
                                            <Line type="monotone" dataKey="totalQuantity" stroke={chartColors[5]} strokeWidth={3} name="כמות נמכרת" dot={{ r: 4 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>אין נתוני מכירות לאורך זמן.</Typography>
                                )}
                            </Paper>
                        </motion.div>
                    </Grid>
                </Grid>
            </motion.div>
        </Box>
    );
}

export default DashboardPage;
