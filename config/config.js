// Define url variable
var localTest = 'mongodb://localhost/stockMarketApp-test';
var localProd = 'mongodb://localhost/stockMarketApp-prod';

exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                       process.env.NODE_ENV === 'production' ?
                              localTest:
                              localProd;
exports.PORT = process.env.PORT || 8080;
