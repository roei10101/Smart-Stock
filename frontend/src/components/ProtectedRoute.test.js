import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

const renderAt = (path) =>
    render(
        <MemoryRouter initialEntries={[path]}>
            <Routes>
                <Route path="/login" element={<div>login page</div>} />
                <Route element={<ProtectedRoute />}>
                    <Route path="/sales" element={<div>sales page</div>} />
                </Route>
            </Routes>
        </MemoryRouter>
    );

describe('ProtectedRoute', () => {
    afterEach(() => localStorage.clear());

    test('redirects visitors without a token to the login page', () => {
        renderAt('/sales');

        expect(screen.getByText('login page')).toBeInTheDocument();
        expect(screen.queryByText('sales page')).not.toBeInTheDocument();
    });

    test('renders the protected page when a token is present', () => {
        localStorage.setItem('authToken', 'some-token');

        renderAt('/sales');

        expect(screen.getByText('sales page')).toBeInTheDocument();
    });
});
