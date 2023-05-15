const DEV = process.env.NODE_ENV !== 'production';

export const API_DOMAIN = DEV ? 'http://localhost:4000/api/v1' : `https://feed.cherepusick.keenetic.name/api/v1`;
// export const API_DOMAIN = `https://yclins.cherepusick.keenetic.name`;
