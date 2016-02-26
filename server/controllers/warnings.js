var mongoose = require('mongoose');
var Warning = mongoose.model('Warning');

module.exports = (function() {
  return {
    index:function(req, res) {
      Warning.find({}, function(err, results) {
        if(err) {
          console.log(err);
        } else {
          res.json(results);
        }
      })
    }
  }
})();
