const mongodb = require('../database');
const { ObjectId } = require('mongodb');

module.exports  = {
    async addBook(book) {
        let db = mongodb.DBInstance();
        let collection = db.collection('books');
        return await collection.insertOne(book);
    },

    async getBook(id) {
        let db = mongodb.DBInstance();
        let collection = db.collection('books');
        return await collection.findOne({_id: ObjectId(id)});
    },

    async loadWithPagination(pageNumber, nPerPage) {
        result = [];
        let db = mongodb.DBInstance();
        let collection = db.collection('books');
        await collection.find({activeFlag: 1})
                        .sort({ _id: 1 })
                        .skip(pageNumber > 0 ? ( ( pageNumber - 1 ) * nPerPage ) : 0)
                        .limit(nPerPage)
                        .forEach( book => {
                            result.push(book);
                        })
        return result;
    },

    async updateBookById(id, update) {
        let db = mongodb.DBInstance();
        let collection = db.collection('books');
        return await collection.findOneAndUpdate(
            { _id : ObjectId(id) },
            { $set: update },
            { returnDocument: "after" }
        )
    },

    async deactiveBook(id) {
        let db = mongodb.DBInstance();
        let collection = db.collection('books');
        return await collection.updateOne(
            { _id : ObjectId(id) },
            { $set: {activeFlag: 0} }
        )
    },

    async searchWithPagination(pageNumber, nPerPage, searchName) {
        result = [];
        searchName = '/' + searchName + '/'
        let db = mongodb.DBInstance();
        let collection = db.collection('books');
        await collection.find({activeFlag: 1, name: searchName})
                        .sort({ _id: 1 })
                        .skip(pageNumber > 0 ? ( ( pageNumber - 1 ) * nPerPage ) : 0)
                        .limit(nPerPage)
                        .forEach( book => {
                            result.push(book);
                        })
        return result;
    },

    
}