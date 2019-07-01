require('./system/Core/Core');
const {createServer} = require('http');
const Requisicao = require('./system/Core/MainClassRequisiaco');

"Iniciando Serviço".GravarLog("success");
/***********************************/
Core.controller = Core.helper.carregar("controllers");
"Controllers carregados com sucesso".GravarLog("success");
/***********************************/

createServer((requisicao, resposta) => new Requisicao(requisicao, resposta)).listen(8080);
