const mongodb = require('../database');
const { ObjectId } = require('mongodb');

module.exports  = {
    async loadWithPagination(pageNumber, nPerPage) {
        result = [];
        let db = mongodb.DBInstance();
        let collection = db.collection('bookOrders');
        await collection.aggregate([
                            {$unwind: "$books"},
                            {
                                $addFields: {
                                   convertedId: { $toObjectId: "$books" }
                            }},
                            {$lookup: {
                                from:"books",
                                localField: "convertedId",
                                foreignField: "_id",
                                as: "books"
                            }},
                            { $unwind: "$books" },
                            { $group: {
                                "_id": "$_id",
                                "date": { "$first": "$date" },
                                "status": { "$first": "$status" },
                                "customer": { "$first": "$customer" },
                                "books": { "$push": "$books" }
                            } },
                            {$match: {
                                status: 'In process'
                            }}]
        ).skip(pageNumber > 0 ? ( ( pageNumber - 1 ) * nPerPage ) : 0)
        .limit(nPerPage)
        .forEach( order => {
            result.push(order);
        })
        return result;
    },

    async addOrder(order) {
        let db = mongodb.DBInstance();
        let collection = db.collection('bookOrders');
        return await collection.insertOne(order);
    },

    async removeOrder(id) {
        let db = mongodb.DBInstance();
        let collection = db.collection('bookOrders');
        return await collection.deleteOne({_id: ObjectId(id)});
    },
}