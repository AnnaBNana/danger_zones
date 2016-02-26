var mongoose = require('mongoose');

var NewsSchema = new mongoose.Schema({
  stories: Object
});

mongoose.model('News', NewsSchema);
