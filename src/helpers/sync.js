"use strict"

module.exports = async function() {

    const { mongoose } = require('../configs/dbConnection')
    await mongoose.connection.dropDatabase()
    console.log('- Database and all data DELETED!')

}