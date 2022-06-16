const { ObjectId } = require('mongodb');
const Book = require('../models/book.model');

class BookController {
    async addNewBook(req, res, next) {
        if(req.isAuthenticated()) {
            let book = {
                _id: new ObjectId(),
                name: req.body.name,
                writers: req.body.writers.split(', '),
                price: parseFloat(req.body.price),
                types: req.body.types.split(', '),
                publisher: req.body.publisher,
                stock: parseInt(req.body.stock),
                activeFlag: 1
            }
            await Book.addBook(book)
                .then(function (err) {
                    if(!err) res.json() //show error on web page.
                    res.redirect('/books');
                })
                .catch(next);
        }
        else   
            res.redirect('/login')
    }

    async getBooks(req, res, next) {
        if(req.isAuthenticated()) {
            let page = 1;
            let limit = 10;
            if(req.params.page) page = parseInt(req.params.page)
            await Book.loadWithPagination(page, limit)
                .then(result => {
                    let nextPage = page + 1;
                    let prevPage = page > 0 ?  ( page - 1 )  : 0;
                                    
                    res.render('books', {
                        books: result,
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

    async bookDetail(req, res, next) {
        if(req.isAuthenticated()) {
            await Book.getBook(req.query._id)
                .then(result => {
                    //console.log(result)
                    res.render('bookUpdate', {
                        book: result,
                    })
                })
                .catch(next);    
        }
        else   
            res.redirect('/login')
    }

    async bookUpdate(req, res, next) {
        if(req.isAuthenticated()) {
            let update = {}
            if(req.body.name) update["name"] = req.body.name
            if(req.body.writers) update["writers"] = req.body.writers.split(', ')
            if(req.body.price) update["price"] = parseFloat(req.body.price)
            if(req.body.types) update["types"] = req.body.types.split(', ')
            if(req.body.publisher) update["publisher"] = req.body.publisher
            if(req.body.stock) update["stock"] = parseInt(req.body.stock)
    
            await Book.updateBookById(req.body._id, update)
                .then(result => {
                    res.render('bookUpdate', {
                        book: result.value
                    })
                })
                .catch(next);
        }
        else   
            res.redirect('/login')
    }

    async bookDelete(req, res, next) {
        if(req.isAuthenticated()) {
            await Book.deactiveBook(req.body._id)
                .then(function (err) {
                    if(!err) res.json()
                    res.redirect('/books');
                })
                .catch(next);
        }
        else   
            res.redirect('/login')
    }
    
}

module.exports = new BookController();