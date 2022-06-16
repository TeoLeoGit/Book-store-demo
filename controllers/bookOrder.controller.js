const BookOrder = require('../models/bookOrder.model');
const { ObjectId } = require('mongodb');

class BookOrderController {
    async getOrdersInProcess(req, res, next) {
        if(req.isAuthenticated()) {
            let page = 1;
            let limit = 10;
            if(req.params.page) page = parseInt(req.params.page)
            await BookOrder.loadWithPagination(page, limit)
                .then(result => {
                    let nextPage = page + 1;
                    let prevPage = page > 0 ?  ( page - 1 )  : 0;
                                    
                    res.render('orderInProcess', {
                        orders: result,
                        page: page,
                        next: nextPage,
                        prev: prevPage
                    })
                })
                .catch(next);    
        }
        else   
            res.redirect('/login')
    }

    async addNewOrder(req, res, next) {
        if(req.isAuthenticated()) {
            let customer = {}
            let books = []
            if(req.body.customerName) customer["name"] = req.body.customerName
            if(req.body.phone) customer["phone"] = req.body.phone
            if(req.body.email) customer["email"] = req.body.email
            if(req.body.bookIDs) books = req.body.bookIDs.split(', ')
            console.log(books)
            let order = {
                _id: new ObjectId(),
                date: new Date(),
                status: "In process",
                customer: customer,
                books: books,
            }
            await BookOrder.addOrder(order)
                .then(function (err) {
                    if(!err) res.json() //show error on web page.
                    res.redirect('/bookOrders');
                })
                .catch(next);
        }
        else   
            res.redirect('/login')
    }

    async removeOrder(req, res, next) {
        if(req.isAuthenticated()) {
            await BookOrder.removeOrder(req.body._id)
                .then(result => {
                    console.log(result)
                    res.redirect('/bookOrders');
                })
                .catch(next);
        }
        else   
            res.redirect('/login')
    }
}

module.exports = new BookOrderController();