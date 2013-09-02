var http   		   = require('http');
var parser 		   = require('libxml-to-js');
var sys    		   = require('util');
var cheerio 	   = require('cheerio');
var http 		   = require('http');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var callBackExternal;

var callBackParser = function(error, result) {
    if (error) {
        console.error(error);
    }
    else{
    	for (var i in result){
			result[i].tempo = conditionLabel[result[i].tempo];
		 }
		 
		 callBackExternal(result);
    }
}

var loadDays = function(url) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function(){
		
		if (xhr.readyState == 4) {
			parser(xhr.responseText, '//cidade/previsao', callBackParser);
		}
	}
	
	xhr.open("GET", url);
	xhr.send();
}

var days = function(codCity,type,callBack) {
	
	callBackExternal = callBack;
	type = typeof type !== 'undefined' ? type : 'Default';
	
	var url;
	var urlPadrao    = "http://servicos.cptec.inpe.br/XML/cidade/7dias/"+codCity+"/previsao.xml";
	var urlEstendida = "http://servicos.cptec.inpe.br/XML/cidade/"+codCity+"/estendida.xml";
	
	url = type === 'Default' ? urlPadrao : urlEstendida;
	
	loadDays(url)
}

// FromPage

var strip = function(str){ return str.replace(/\n/g, "").replace(/\t/g, "");};

var request = function(codCity,callback){
	var options = {
	    hostname: 'www.climatempo.com.br',
	    port: 80,
	    path: '/previsao-do-tempo/cidade/'+codCity+'/empty',
	    method: 'GET'
	}

	var req = http.request(options, function(response) {
		var str = '';
		response.on('data', function (chunk) {
	    	str += chunk;
		});
		response.on('end', function() {
	      return callback(cheerio.load(str))
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
}
	 
var nowFromPage = function(codCity,callbackExternal) {
	var callback = function(docHtml){
		var previsao = {
			'last_update' : docHtml('.subtitle-padrao').eq(2).text(),
			'wind'        : { 'velocity'  : docHtml('ul#dados-momento li').eq(3).children().slice(1).eq(0).text(),
			                  'direction' : wind['br'][docHtml('ul#dados-momento li').eq(0).children().slice(1).eq(0).text()]
			              },
			'moisture'    : docHtml('ul#dados-momento li').eq(4).children().slice(1).eq(0).text(),
			'condition'   : docHtml('ul#dados-momento li').eq(1).children().slice(1).eq(0).text(),
			'pression'    : docHtml('ul#dados-momento li').eq(2).children().slice(1).eq(0).text(),
			'temperature' : docHtml('.temp-momento').text()
	    } 
		callbackExternal(previsao);
	}
	request(codCity,callback);
}	 
	 
var fullFromPage = function(codCity,callbackExternal) {
	var callback = function(docHtml){
		var previsions = new Array();
		
		for (var i=0;i<5;i++) {
			previsions.push({ 
				'last_update'                 : docHtml('.top20 p.paragrafo-padrao').eq(5).text(),
				'date'                        : docHtml('.topo-box .data-prev').eq(i+1).text(),
				'condition'                   : docHtml('.box-prev-completa .fraseologia-prev').eq(i).text(),
				'wind'                        : strip(docHtml('.box-prev-completa .velocidade-vento-prev-completa').eq(i).children().eq(0).text()),
				'probability_of_precipitation': strip(docHtml('.box-prev-completa .prob-chuva-prev-completa').eq(i).children().eq(0).text()),
				'moisture_relative_complete'  : { 'max': docHtml('.box-prev-completa .umidade-relativa-prev-completa').eq(i).children().eq(1).text(),
				                                  'min': docHtml('.box-prev-completa .umidade-relativa-prev-completa').eq(i).children().eq(2).text()},
				'temperature'                 : { 'max': docHtml('.box-prev-completa .maxMin-prev-completa .max').eq(i).text(),
				                                  'min': docHtml('.box-prev-completa .maxMin-prev-completa .min').eq(i).text()},
				'uv'                          : docHtml('.box-prev-completa .uv-size span').eq(i).text(),
				'sunrise'                     : docHtml('.box-prev-completa .por-do-sol').eq(i).children().eq(2).text(),
				'sunset'                      : docHtml('.box-prev-completa .por-do-sol').eq(i).children().eq(5).text()
			})
		}
		callbackExternal(previsions);
	}
	request(codCity,callback);
}

var trendsFromPage = function(codCity,callbackExternal) {
	var callback = function(docHtml){
		var previsions = new Array();
	
		for (var i=0;i<5;i++) {
			previsions.push({ 
				  'date'                        : docHtml('.box-prev-tendencia .data-prev').eq(i).text(),
	              'condition'                   : strip(docHtml('.box-prev-tendencia .frase-previsao-prev-tendencia').eq(i).text()),
	              'probability_of_precipitation': strip(docHtml('.box-prev-tendencia .prob-chuva-prev-tendencia').eq(i).text()),
	              'temperature'                 : { 'max' : docHtml('.box-prev-tendencia span.max').eq(i).text(),
	                                                'min' : docHtml('.box-prev-tendencia span.max').eq(i).text()}
			})
		}
		callbackExternal(previsions);
	}
	request(codCity,callback);
}

var wind = {
       "br" : 
         {
           "N"   : "Norte",
           "S"   : "Sul",
           "E"   : "Leste",
           "W"   : "Oeste",
           "NE"  : "Nordeste",
           "NW"  : "Noroeste",
           "SE"  : "Sudeste",
           "SW"  : "Sudoeste",
           "ENE" : "Les-nordeste",
           "ESE" : "Lés-sudeste",
           "SSE" : "Su-sudeste",
           "NNE" : "Nor-nordeste",
           "NNW" : "Nor-noroeste",
           "SSW" : "Su-sudoeste",
           "WSW" : "Oés-sudoeste",
           "WNW" : "Oés-noroeste"
         },
       "en" : 
         {
           "N"    : "North",
           "S"    : "South",
           "E"    : "East",
           "W"    : "West",
           "NE"   : "Northeast",
           "NW"   : "Northwest",
           "SE"   : "Southeast",
           "SW"   : "Southwest",
           "ENE"  : "east-northeast",
           "ESE"  : "east-southeast",
           "SSE"  : "south-southeast",
           "NNE"  : "north-northeast",
           "NNO"  : "north-northwest",
           "SSWO" : "south-southwest",
           "OSO"  : "west-southwest",
           "ONO"  : "west-northwest"
         }
}

var conditionLabel = {
    
	'ec'  : 'Encoberto com Chuvas Isoladas',
	'ci'  : 'Chuvas Isoladas',
	'c '  : 'Chuva',
	'in'  : 'Instável',
	'pp'  : 'Poss. de Pancadas de Chuva',
	'cm'  : 'Chuva pela Manha',
	'cn'  : 'Chuva a Noite',
	'pt'  : 'Pancadas de Chuva a Tarde',
	'pm'  : 'Pancadas de Chuva pela Manhã',
	'np'  : 'Nublado e Pancadas de Chuva',
	'pc'  : 'Pancadas de Chuva',
	'pn'  : 'Parcialmente Nublado',
	'cv'  : 'Chuvisco',
	'ch'  : 'Chuvoso',
	't '  : 'Tempestade',
	'ps'  : 'Predomínio de Sol',
	'e '  : 'Encoberto',
	'n '  : 'Nublado',
	'cl'  : 'Céu Claro',
	'nv'  : 'Nevoeiro',
	'g '  : 'Geada',
	'ne'  : 'Neve',
	'nd'  : 'Não Definido',
	'pnt' : 'Pancadas de Chuva a Noite',
	'psc' : 'Possibilidade de Chuva',
	'pcm' : 'Possibilidade de Chuva pela Manhã',
	'pct' : 'Possibilidade de Chuva a Tarde',
	'pcn' : 'Possibilidade de Chuva a Noite',
	'npt' : 'Nublado com Pancadas a Tarde',
	'npn' : 'Nublado com Pancadas a Noite',
	'ncn' : 'Nublado com Possibilidade de Chuva a Noite',
	'nct' : 'Nublado com Possibilidade de Chuva a Tarde',
	'ncm' : 'Nublado com Possibilidade de Chuva pela Manhã',
	'npm' : 'Nublado com Pancadas pela Manhã',
	'npp' : 'Nublado com Possibilidade de Chuva',
	'vn'  : 'Variação de Nebulosidade',
	'ct'  : 'Chuva a Tarde',
	'ppn' : 'Possibilidade de Pancadas de Chuva a Noite',
	'ppt' : 'Possibilidade de Pancadas de Chuva a Tarde',
	'ppm' : 'Possibilidade de Pancadas de Chuva pela Manhã'
}

exports.days 	       = days;
exports.nowFromPage    = nowFromPage;
exports.fullFromPage   = fullFromPage;
exports.trendsFromPage = trendsFromPage;


// nome Disck Chopp NovaFriburgo
// 
// nome SerraVerdeImperial
// 
// localidades NF CM Bom Jardim
// 
// Criacao logo
// 
// Divulgar o nome, contato e serviço - As melhores do Brasil
// 
// Vinculo da Noi- Referencia de Marca e Marketing
// 
// Comodidade
