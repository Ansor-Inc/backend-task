module.exports = {
    PORT: process.env.PORT,
    apiUrl: process.env.API_BASE_URL,
    dbConnection: {
        user: process.env.DB_USERNAME,
        host: "localhost",
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
    },
};
