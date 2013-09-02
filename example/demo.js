var cli = require('../clima-tempo');
var sys = require('util');
var http = require('http');
var cheerio = require('cheerio');


// cli.teste

var strip = function(str){ return str.replace(/\n/g, "").replace(/\t/g, "");};

var options = {
  hostname: 'www.climatempo.com.br',
  port: 80,
  path: '/previsao-do-tempo/cidade/3156/empty',
  method: 'GET'
};

var req = http.request(options, function(response) {
	var str = '';
	response.on('data', function (chunk) {
    	str += chunk;
	});
	response.on('end', function() {
	  // console.log('done', str.length);
	  $ = cheerio.load(str);
	  
	  // sys.puts($('p#tit-momento').text());
	  
	  var previsao = {
					  'last_update' : $('.subtitle-padrao').eq(2).text(),
				      'wind'        : { 'velocity'  : $('ul#dados-momento li').eq(3).children().slice(1).eq(0).text(),
				                        'direction' : cli.wind['br'][$('ul#dados-momento li').eq(0).children().slice(1).eq(0).text()]
				                    },
				      'moisture'     : $('ul#dados-momento li').eq(4).children().slice(1).eq(0).text(),
				      'condition'    : $('ul#dados-momento li').eq(1).children().slice(1).eq(0).text(),
				      'pression'     : $('ul#dados-momento li').eq(2).children().slice(1).eq(0).text(),
				      'temperature'  : $('.temp-momento').text()
	 } 

	 //console.log(previsao);console.log('====================');
	 
var fullFromPage = function() {
	
	var previsions = new Array();
	
	for (var i=0;i<5;i++) {
		previsions.push({ 
			'last_update'                 : $('.top20 p.paragrafo-padrao').eq(5).text(),
			'date'                        : $('.topo-box .data-prev').eq(i+1).text(),
			'condition'                   : $('.box-prev-completa .fraseologia-prev').eq(i).text(),
			'wind'                        : strip($('.box-prev-completa .velocidade-vento-prev-completa').eq(i).children().eq(0).text()),
			'probability_of_precipitation': strip($('.box-prev-completa .prob-chuva-prev-completa').eq(i).children().eq(0).text()),
			'moisture_relative_complete'  : { 'max': $('.box-prev-completa .umidade-relativa-prev-completa').eq(i).children().eq(1).text(),
			                                  'min': $('.box-prev-completa .umidade-relativa-prev-completa').eq(i).children().eq(2).text()},
			'temperature'                 : { 'max': $('.box-prev-completa .maxMin-prev-completa .max').eq(i).text(),
			                                  'min': $('.box-prev-completa .maxMin-prev-completa .min').eq(i).text()},
			'uv'                          : $('.box-prev-completa .uv-size span').eq(i).text(),
			'sunrise'                     : $('.box-prev-completa .por-do-sol').eq(i).children().eq(2).text(),
			'sunset'                      : $('.box-prev-completa .por-do-sol').eq(i).children().eq(5).text()
		})
	}
	
	return previsions;
}
      
      // console.log(fullFromPage());console.log('====================');
      
var trendsFromPage = function() {
	
	var previsions = new Array();
	
	for (var i=0;i<5;i++) {
		previsions.push({ 
			  'date'                        : $('.box-prev-tendencia .data-prev').eq(i+1).text(),
              'condition'                   : strip($('.box-prev-tendencia .frase-previsao-prev-tendencia').eq(i).text()),
              'probability_of_precipitation': strip($('.box-prev-tendencia .prob-chuva-prev-tendencia').eq(i).text()),
              'temperature'                 : { 'max' : $('.box-prev-tendencia span.max').eq(i).text(),
                                                'min' : $('.box-prev-tendencia span.max').eq(i).text()}
		})
	}
	
	return previsions;
}
      
      console.log(trendsFromPage());console.log('====================');
	 
	});
});

req.on('error', function(e) {
  console.log('problem with request: ' + e.message);
  console.log( e.stack );

});

// write data to request body
// req.write('data\n');
// req.write('data\n');
req.end();
