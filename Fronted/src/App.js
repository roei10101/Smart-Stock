import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// RTL styling imports
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';
import { Helmet, HelmetProvider } from 'react-helmet-async';

// Component imports
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import ProductListPage from './pages/ProductListPage';
import SalesPage from './pages/SalesPage';
import SellerStatsPage from './pages/SellerStatsPage';
import SellersPage from './pages/SellersPage';
import CustomersPage from './pages/CustomersPage';
import DashboardPage from './pages/DashboardPage';
import BalanceSheetPage from './pages/BalanceSheetPage';
import ExpensesPage from './pages/ExpensesPage';
import InventoryPage from './pages/InventoryPage'; // Import the new page

// RTL cache setup
const cacheRtl = createCache({
    key: 'mui-rtl',
    stylisPlugins: [prefixer, rtlPlugin],
});

// RTL theme setup
const theme = createTheme({
    direction: 'rtl',
    typography: {
        fontFamily: 'Assistant, Alef, Arial, sans-serif',
    },
});

function App() {
    return (
        <HelmetProvider>
            <CacheProvider value={cacheRtl}>
                <ThemeProvider theme={theme}>
                    <Helmet>
                        <html lang="he" dir="rtl" />
                        <body dir="rtl" />
                    </Helmet>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/login" element={<LoginPage />} />
                            <Route element={<ProtectedRoute />}>
                                <Route path="/" element={<Layout />}>
                                    <Route index element={<DashboardPage />} />
                                    <Route path="dashboard" element={<DashboardPage />} />
                                    <Route path="balance-sheet" element={<BalanceSheetPage />} />
                                    <Route path="inventory" element={<InventoryPage />} /> {/* Add the new route */}
                                    <Route path="expenses" element={<ExpensesPage />} />
                                    <Route path="products" element={<ProductListPage />} />
                                    <Route path="sales" element={<SalesPage />} />
                                    <Route path="seller-stats" element={<SellerStatsPage />} />
                                    <Route path="sellers" element={<SellersPage />} />
                                    <Route path="customers" element={<CustomersPage />} />
                                </Route>
                            </Route>
                        </Routes>
                    </BrowserRouter>
                </ThemeProvider>
            </CacheProvider>
        </HelmetProvider>
    );
}

export default App;
