var cli = require('../clima-tempo');

var callback = function(error, result) {
    if (error) {
        console.error(error);
    }
    else{
    	console.log(result);
    }
}
//type = Default or  Extended
cli.days('3156',type,callBack);
cli.nowFromPage('3156',callback);
cli.fullFromPage('3156',callback);
cli.trendsFromPage('3156',callback);
