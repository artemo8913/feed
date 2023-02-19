const DEV = process.env.NODE_ENV !== 'production';

export const API_DOMAIN = DEV ? 'http://localhost:5000' : `https://${window.location.host}`;
