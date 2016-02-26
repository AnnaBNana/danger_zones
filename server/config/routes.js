var warnings = require('./../controllers/warnings.js');
var alerts = require('./../controllers/alerts.js');
var news = require('./../controllers/news.js');

module.exports = function(app) {
  app.get('/warnings', function(req, res) {
    // console.log('in routes');
    warnings.index(req, res);
  })
  app.get('/alerts', function(req, res) {
    // console.log('in routes');
    alerts.index(req, res);
  })
  app.post('/news', function(req, res) {
    // console.log('in routes', req.body);
    news.index(req, res);
  })
}
