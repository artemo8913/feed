const webpack = require('webpack');
const fs = require('fs');

const path = `${fs.realpathSync(__dirname + '../../../..')}/.env`;

require('dotenv').config({ path });

const wpEnv = new webpack.DefinePlugin({
    API_URL_ENV: JSON.stringify(process.env.API_URL_ENV),
    NEW_API_URL_ENV: JSON.stringify(process.env.NEW_API_URL_ENV),
});

module.exports = wpEnv;
