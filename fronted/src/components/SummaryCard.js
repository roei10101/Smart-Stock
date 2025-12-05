import React from 'react';
import { Paper, Typography, Box, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

const MotionPaper = motion(Paper);

const SummaryCard = ({ title, value, icon, color, delay = 0 }) => {
    const theme = useTheme();

    return (
        <MotionPaper
            elevation={3}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            whileHover={{ scale: 1.05, translateY: -5, boxShadow: theme.shadows[10] }}
            sx={{
                p: 3,
                textAlign: 'center',
                background: `linear-gradient(135deg, ${color} 0%, ${theme.palette.background.paper} 100%)`,
                color: theme.palette.getContrastText(theme.palette.background.paper),
                borderRadius: 4,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden',
                backdropFilter: 'blur(10px)', // Glassmorphism effect if background was transparent
                border: `1px solid ${color}40`
            }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    opacity: 0.1,
                    transform: 'rotate(15deg)',
                    fontSize: '8rem',
                    color: color
                }}
            >
                {icon}
            </Box>

            <Box sx={{ zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                <Box sx={{ color: color, mb: 1 }}>
                    {React.cloneElement(icon, { fontSize: "large" })}
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, opacity: 0.8 }}>
                    {title}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: color }}>
                    {value}
                </Typography>
            </Box>
        </MotionPaper>
    );
};

export default SummaryCard;
