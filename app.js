var express = require('express');
var app = express();
var hb = require('express-handlebars');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var methodOverride = require('method-override');
mongoose.promise = global.promise;
mongoose.connect('mongodb://localhost/rotten-potatoes');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

var Review = mongoose.model('Review', {
  title: String,
  movieTitle: String,
  description: String,
  rating: Number
});

app.engine('handlebars', hb({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
  Review.find(function(err, reviews) {
    res.render('reviews-index', {reviews: reviews});
  });
});

app.get('/reviews/new', function (req, res) {
  res.render('reviews-new', {});
});

app.get('/reviews/:id', function (req, res) {
  Review.findById(req.params.id).exec(function (err, review) {
    res.render('reviews-show', {review: review});
  });
});

app.get('/reviews/:id/edit', function (req, res) {
  Review.findById(req.params.id, function (err, review) {
    res.render('reviews-edit', {review: review, ID: req.params.id});
  });
});

app.put('/reviews/:id', function (req, res) {
  Review.findByIdAndUpdate(req.params.id,  req.body, function(err, review) {
    res.redirect('/reviews/' + review._id);
  });
});

app.delete('/reviews/:id', function (req, res) {
  Review.findByIdAndRemove(req.params.id, function(err, review) {
    res.redirect('/');
  });
});

app.post('/reviews', function (req, res) {
  Review.create(req.body, function(err, rv) {
    res.redirect('/reviews/' + rv._id);
  })
});

app.listen(3000, function() {
  console.log("Listening on port 3000!");
});
