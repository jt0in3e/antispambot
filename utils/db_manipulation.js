const connectDB = require('./connect_db');

const showEntries = (collection) => {
    connectDB()
        .then((client) => {
            
        })
        .catch(err => console.log(err))
}


module.exports = {

}
