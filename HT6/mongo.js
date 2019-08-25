var  mongoose = require('mongoose');

mongoose.connect('mongodb+srv://client:McAi163fBaW0_@cluster0-96ptv.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true});

var productSchema = new mongoose.Schema({
    asin: String,
    comments: []
});

var Product = mongoose.model('Product', productSchema);

Product.create({asin: '12', comments: ['12', '14']})