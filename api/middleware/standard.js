const bodyParser = require('body-parser');
const cors = require('cors');
var fs = require('fs')
var morgan = require('morgan');
var path = require('path');
var rfs = require('rotating-file-stream');

class StandardMiddleware {
    
    attachTo(app) {
        var accessLogStream = rfs.createStream('access.log', {
            interval: '1d', // rotate daily
            path: path.join(__dirname, '../../log')
          });
          
        app.use(morgan('combined', { stream: accessLogStream }))
        //app.use(morgan('dev'));
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json());

        app.use(bodyParser.urlencoded({
            parameterLimit: 1,
            limit: '1kb',
            extended: true
          }));
        app.use(cors());
    }
}

module.exports = new StandardMiddleware();