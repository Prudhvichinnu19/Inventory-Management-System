const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const secret = 'secret';

module.exports = (app) => {
    app.use(cors({
        origin: (origin, callback) => {
            callback(null, origin); // Reflect request origin
        },
        credentials: true
    }));
    
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cookieParser(secret));
};
