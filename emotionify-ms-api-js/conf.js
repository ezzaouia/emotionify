'use strict'

const
    path = require('path')

let APP_CONF = {
    WEB_PORT: 3000,
    MS_API_KEY: 'ad03ff6c15254bc28325d9217f30c9ba',
    MS_API_URL: 'https://api.projectoxford.ai/emotion/v1.0/recognize',
    CLIENT_PATH: path.join('..', 'emotionify-ui', 'client')
}


module.exports = APP_CONF