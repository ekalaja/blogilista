const mongooseSettings = require('mongoose')

if ( process.env.NODE_ENV !== 'production' ) {
    require('dotenv').config()
}

const mongoUrl = process.env.MONGODB_URI

mongooseSettings.connect(mongoUrl)
mongooseSettings.Promise = global.Promise

module.exports = mongooseSettings
