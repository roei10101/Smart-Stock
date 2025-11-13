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
    AppBar, // Import AppBar
    IconButton, // Import IconButton
    Typography, // Import Typography for app bar title
    useMediaQuery, // Import useMediaQuery
    useTheme // Import useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu'; // Import MenuIcon
import InventoryIcon from '@mui/icons-material/Inventory';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import PeopleIcon from '@mui/icons-material/People';
import GroupIcon from '@mui/icons-material/Group';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';

const drawerWidth = 220;

function Layout() {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Check if screen is small (mobile)
    const [mobileOpen, setMobileOpen] = useState(false); // State to control mobile drawer open/close

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const menuItems = [
        { text: 'לוח מחוונים', icon: <DashboardIcon />, path: '/dashboard' },
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
            <Toolbar /> {/* To push content below the app bar */}
            <List>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton
                            component={RouterLink}
                            to={item.path}
                            onClick={isMobile ? handleDrawerToggle : null} // Close drawer on mobile after click
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
            {/* App Bar */}
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    direction: 'rtl' // Ensure app bar content is RTL
                }}
            >
                <Toolbar>
                    {isMobile && ( // Show menu icon only on mobile
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

            {/* Navigation Drawer */}
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                {/* Temporary drawer for mobile */}
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' }, // Show only on extra small screens
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
                {/* Permanent drawer for desktop */}
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' }, // Show only on small screens and up
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

            {/* Main Content Area */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    mr: { sm: `${drawerWidth}px` }, // Adjust margin for permanent drawer on desktop
                    direction: 'ltr',
                }}
            >
                <Toolbar /> {/* This is important to offset content below the AppBar */}
                <Outlet />
            </Box>
        </Box>
    );
}

export default Layout;
