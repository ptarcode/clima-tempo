var http   = require('http');
var parser = require('libxml-to-js');
var sys    = require('util');
var previsoes = new Array;
var callBackInject;

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var callBackParser = function(error, result) {
    if (error) {
        console.error(error);
    }
    else{
    	for (var i in result){
			//navego pelas chaves do array como um for
			// console.log(result[i].tempo);
			// console.log(conditionLabel);
			result[i].tempo = conditionLabel[result[i].tempo];
		 }
		 
		 callBackInject(result);
    }
}

var loadDays = function(url,limit) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function(){
		
		if (xhr.readyState == 4) {
			parser(xhr.responseText, '//cidade/previsao', callBackParser);
		}
	}
	
	xhr.open("GET", url);
	xhr.send();
}


var days = function(codCity,qtdDays,callBack) {
	
	callBackInject = callBack;
	
	var urlPadrao    = "http://servicos.cptec.inpe.br/XML/cidade/7dias/"+codCity+"/previsao.xml";
	  
	var urlEstendida = "http://servicos.cptec.inpe.br/XML/cidade/"+codCity+"/estendida.xml";
	
	loadDays(urlPadrao,qtdDays)

}

exports.days 	 = days;
exports.loadDays = loadDays;


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
