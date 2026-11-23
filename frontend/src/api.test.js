import api from './api';

// Runs the request through the interceptors without touching the network
const sendWith = (adapter) => api.get('/api/products', { adapter });

describe('api client', () => {
    const originalLocation = window.location;

    beforeEach(() => {
        delete window.location;
        window.location = { href: '/' };
    });

    afterEach(() => {
        window.location = originalLocation;
        localStorage.clear();
    });

    test('attaches the stored token as a Bearer header', async () => {
        localStorage.setItem('authToken', 'abc123');
        let sentHeaders;

        await sendWith(async (config) => {
            sentHeaders = config.headers;
            return { data: [], status: 200, statusText: 'OK', headers: {}, config };
        });

        expect(sentHeaders.Authorization).toBe('Bearer abc123');
    });

    test('sends no Authorization header when logged out', async () => {
        let sentHeaders;

        await sendWith(async (config) => {
            sentHeaders = config.headers;
            return { data: [], status: 200, statusText: 'OK', headers: {}, config };
        });

        expect(sentHeaders.Authorization).toBeUndefined();
    });

    test.each([401, 403])('clears the session and goes to /login on a %i response', async (status) => {
        localStorage.setItem('authToken', 'expired');

        await expect(
            sendWith(async (config) => Promise.reject({ response: { status }, config }))
        ).rejects.toBeDefined();

        expect(localStorage.getItem('authToken')).toBeNull();
        expect(window.location.href).toBe('/login');
    });

    test('keeps the session on other errors', async () => {
        localStorage.setItem('authToken', 'still-valid');

        await expect(
            sendWith(async (config) => Promise.reject({ response: { status: 500 }, config }))
        ).rejects.toBeDefined();

        expect(localStorage.getItem('authToken')).toBe('still-valid');
    });
});
