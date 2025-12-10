import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // 'navigate' is now used

    const handleLogin = async (e) => {
        e.preventDefault(); // מונע ריענון של הדף
        setError('');

        try {
            const response = await api.post('/api/auth/login', {
                username,
                password,
            });

            // שמירת הטוקן ב-localStorage
            localStorage.setItem('authToken', response.data.token);

            // רענון העמוד כדי שהאפליקציה תטען מחדש עם הטוקן
            // Changed to use navigate hook
            navigate('/dashboard');

        } catch (err) {
            setError('שם משתמש או סיסמה שגויים');
            console.error('Login failed:', err);
        }
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Paper sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 2, width: '300px' }}>
                <Typography variant="h5" component="h1" textAlign="center">
                    התחברות למערכת
                </Typography>
                <Box component="form" onSubmit={handleLogin}>
                    <TextField
                        label="שם משתמש"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        label="סיסמה"
                        type="password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {error && <Typography color="error" variant="body2">{error}</Typography>}
                    <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
                        התחבר
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
}

export default LoginPage;