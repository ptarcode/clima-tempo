var cli = require('../clima-tempo');
var sys = require('util');


cli.days("3156",3,function(error, result) {
			    if (error) {
			        console.error(error);
			    }
			    else{
			    	console.log(result);
			    }
			})
