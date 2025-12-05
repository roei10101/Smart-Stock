import React, { useState, useContext } from 'react';
import { Outlet, Link as RouterLink, useNavigate } from 'react-router-dom';
import {
    Box,
    Drawer,
    Toolbar,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
    AppBar,
    IconButton,
    Typography,
    useMediaQuery,
    useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import InventoryIcon from '@mui/icons-material/Inventory';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import PeopleIcon from '@mui/icons-material/People';
import GroupIcon from '@mui/icons-material/Group';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { ColorModeContext } from '../context/ColorModeContext';

const drawerWidth = 240; // Slightly wider for better readability

function Layout() {
    const navigate = useNavigate();
    const theme = useTheme();
    const colorMode = useContext(ColorModeContext);
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const menuItems = [
        { text: 'לוח מחוונים', icon: <DashboardIcon />, path: '/dashboard' },
        { text: 'מאזן כספים', icon: <AccountBalanceIcon />, path: '/balance-sheet' },
        { text: 'מלאי', icon: <WarehouseIcon />, path: '/inventory' },
        { text: 'הוצאות', icon: <MoneyOffIcon />, path: '/expenses' },
        { text: 'מוצרים', icon: <InventoryIcon />, path: '/products' },
        { text: 'מכירות', icon: <PointOfSaleIcon />, path: '/sales' },
        { text: 'סטטיסטיקת מוכרים', icon: <LeaderboardIcon />, path: '/seller-stats' },
        { text: 'ניהול מוכרים', icon: <PeopleIcon />, path: '/sellers' },
        { text: 'ניהול לקוחות', icon: <GroupIcon />, path: '/customers' },
    ];

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/login');
    };

    const drawerContent = (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                    SmartStock
                </Typography>
            </Toolbar>
            <Divider />
            <List sx={{ flexGrow: 1, px: 2, pt: 2 }}>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                        <ListItemButton
                            component={RouterLink}
                            to={item.path}
                            onClick={isMobile ? handleDrawerToggle : null}
                            sx={{
                                borderRadius: 2,
                                textAlign: 'right',
                                flexDirection: 'row-reverse',
                                '&.active': {
                                    bgcolor: theme.palette.action.selected,
                                    color: theme.palette.primary.main,
                                    '& .MuiListItemIcon-root': {
                                        color: theme.palette.primary.main,
                                    },
                                },
                                '&:hover': {
                                    bgcolor: theme.palette.action.hover,
                                },
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 40, justifyContent: 'flex-end', color: theme.palette.text.secondary }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} sx={{ textAlign: 'right', pr: 2 }} primaryTypographyProps={{ fontWeight: 500 }} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider sx={{ my: 1 }} />
            <List sx={{ px: 2, pb: 2 }}>
                <ListItem disablePadding>
                    <ListItemButton
                        onClick={handleLogout}
                        sx={{
                            borderRadius: 2,
                            textAlign: 'right',
                            flexDirection: 'row-reverse',
                            color: theme.palette.error.main,
                            '&:hover': {
                                bgcolor: theme.palette.error.light + '20', // transparent red
                            }
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: 40, justifyContent: 'flex-end', color: theme.palette.error.main }}>
                            <LogoutIcon />
                        </ListItemIcon>
                        <ListItemText primary="התנתקות" sx={{ textAlign: 'right', pr: 2 }} />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', direction: 'ltr' }}>
            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    direction: 'rtl',
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    backdropFilter: 'blur(8px)',
                    bgcolor: theme.palette.mode === 'light' ? 'rgba(255,255,255,0.8)' : 'rgba(17, 24, 39, 0.8)',
                }}
            >
                <Toolbar>
                    {isMobile && (
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}
                    <Box sx={{ flexGrow: 1 }} /> {/* Spacer */}
                    <IconButton sx={{ ml: 1 }} onClick={colorMode.toggleColorMode} color="inherit">
                        {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                            direction: 'rtl',
                            borderLeft: `1px solid ${theme.palette.divider}`,
                            bgcolor: theme.palette.background.paper,
                        },
                    }}
                >
                    {drawerContent}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                            direction: 'rtl',
                            borderLeft: `1px solid ${theme.palette.divider}`,
                            bgcolor: theme.palette.background.paper,
                        },
                    }}
                    open
                >
                    {drawerContent}
                </Drawer>
            </Box>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    mr: { sm: `${drawerWidth}px` },
                    direction: 'ltr',
                    bgcolor: theme.palette.background.default,
                    minHeight: '100vh',
                }}
            >
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
}

export default Layout;
