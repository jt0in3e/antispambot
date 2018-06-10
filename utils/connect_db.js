const if_dev = process.env.NODE_ENV == "development" ? true:false;
if (if_dev) {
    require("dotenv").load();
}

const MongoClient = require('mongodb').MongoClient;
const urlDB = process.env.DB;

const connectDB = () => {
    return MongoClient.connect(urlDB, { useNewUrlParser: true });
};

module.exports = connectDB;
