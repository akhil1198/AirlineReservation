const mongoose = require('mongoose');
const keys = require('./keys');


const connection = async () => {
    try {
        await mongoose.connect(                     //connection to mongoDB with the mongoURI fetched from the config file
            process.env.MONGODB_URI || keys.mongoURI,
            {
                useCreateIndex: true,
                useFindAndModify: true,
                useUnifiedTopology: true,
                useNewUrlParser: true
            }            
        )
        console.log("mongoDB connected!")
    } catch (error) {
        console.log(error)
        console.log("mongoDB connection failed!")
        process.exit(1)
    }
}

module.exports = connection;