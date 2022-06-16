//Mongodb
const mongoose = require('mongoose');
const {MongoClient} = require('mongodb');
var Db;
module.exports = {
    connectMongoDB(url) {
        mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
            .then((result => console.log('Connected successfully to server')))
            .catch((error) => console.log(error))
    },

    async connectDatabase(uri) {
        //const client = new MongoClient(uri);
        try {
            // Connect to the MongoDB cluster
            let client = new MongoClient(process.env.DB_HOST);
            await client.connect();
            Db = client.db('Foodip');
            // Make the appropriate DB calls
            //await  listDatabases(client);
            console.log("Connected to this uri + ", uri);
        } catch (e) {
            console.error(e);
        } 
    },

    DBInstance() {
        return Db;
    }
}