var mongoose = require('mongoose');

var AlertSchema = new mongoose.Schema({
  data: Object
});

mongoose.model('Alert', AlertSchema);
