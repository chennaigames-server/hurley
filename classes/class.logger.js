const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, prettyPrint } = format;

module.exports = class loggerobj {
    constructor(apiname) {
        this.apiname = apiname.split(/[\\/]/).pop();
        
        /* DYNAMIC FILE NAME GENERATOR */
        this.combined = 'COMBINED_LOG_'+this.generate_filename()+'.log';
    }

    logger() {
        return createLogger({
            format: combine(
                label({ label: this.apiname }),
                timestamp(),
                prettyPrint()
            ),
            transports: [
                new transports.File({ filename: './logs/error.log', level: 'error' }),
                new transports.File({ filename: './logs/'+this.combined }),
            ]
        })
    }

    generate_filename()
    {
        var date = new Date().toLocaleString('en-US', { hour12: false }).split(" ");
        var time = date[1];
        var mdy = date[0];
        mdy = mdy.split('/');
        var month = parseInt(mdy[0]);
        var day = parseInt(mdy[1]);
        var year = parseInt(mdy[2]);

        time = time.split(':');
        var hour = parseInt(time[0]);
        var formatted_date = year + '_' + month + '_' + day + '_' +hour;
        return formatted_date;
    }
}
