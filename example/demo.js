var cli = require('../clima-tempo');

var callback = function(error, result) {
    if (error) {
        console.error(error);
    }
    else{
    	console.log(result);
    }
}

cli.trendsFromPage('3156',callback);
