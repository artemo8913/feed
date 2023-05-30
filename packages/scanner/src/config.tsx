const DEV = process.env.NODE_ENV !== 'production';
const NEW_API_URL_ENV = process.env.NEW_API_URL_ENV;

export const API_DOMAIN = NEW_API_URL_ENV || (DEV ? 'http://localhost:4000/api/v1' : `https://feed.cherepusick.keenetic.name/api/v1`);
// export const API_DOMAIN = `https://yclins.cherepusick.keenetic.name`;
