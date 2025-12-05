import React, { useState } from 'react';
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
import WarehouseIcon from '@mui/icons-material/Warehouse'; // Icon for Inventory

const drawerWidth = 220;

function Layout() {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const menuItems = [
        { text: 'לוח מחוונים', icon: <DashboardIcon />, path: '/dashboard' },
        { text: 'מאזן כספים', icon: <AccountBalanceIcon />, path: '/balance-sheet' },
        { text: 'מלאי', icon: <WarehouseIcon />, path: '/inventory' }, // New menu item
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
        <Box sx={{ overflow: 'auto' }}>
            <Toolbar />
            <List>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton
                            component={RouterLink}
                            to={item.path}
                            onClick={isMobile ? handleDrawerToggle : null}
                            sx={{
                                display: 'flex',
                                flexDirection: 'row-reverse',
                                justifyContent: 'flex-start',
                                textAlign: 'right',
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: '40px',
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                }}
                            >
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.text}
                                sx={{ textAlign: 'left' }}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider sx={{ my: 1 }} />
            <List>
                <ListItem disablePadding>
                    <ListItemButton
                        onClick={handleLogout}
                        sx={{
                            display: 'flex',
                            flexDirection: 'row-reverse',
                            justifyContent: 'flex-start',
                            textAlign: 'right',
                        }}
                    >
                        <ListItemIcon
                            sx={{
                                minWidth: '40px',
                                display: 'flex',
                                justifyContent: 'flex-end',
                            }}
                        >
                            <LogoutIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary="התנתקות"
                            sx={{ textAlign: 'left' }}
                        />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', direction: 'ltr' }}>
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    direction: 'rtl'
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
                    <Typography variant="h6" noWrap component="div">
                        SmartStock
                    </Typography>
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
                            textAlign: 'right',
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
                            textAlign: 'right',
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
                }}
            >
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
}

export default Layout;
