export const config = {
    db: {
        uri: process.env.DB_URI || 'mongodb://localhost:27017/mirage-backend',
    },
    server: {
        port: process.env.PORT || 3000,
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'your_jwt_secret',
        expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    },
};