var mongoose = require('mongoose');

var WarningSchema = new mongoose.Schema({
  data: Object
});

mongoose.model('Warning', WarningSchema);
