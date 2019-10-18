const {iniciarServicos} = require('./system/Core/Core');
const {createServer} = require('http');
const Requisicao = require('./system/Core/MainClassRequisiaco');

"Iniciando Serviço".GravarLog("success");
/***********************************/
Core.controller = Core.helper.carregar("controllers");
"Controllers carregados com sucesso".GravarLog("success");
Core.services = Core.helper.carregar("services");
"Serviços carregados com sucesso".GravarLog("success");
Core.assets = Core.helper.carregar("assets", false);
"Assets carregados com sucesso".GravarLog("success");

iniciarServicos();
/***********************************/

createServer((requisicao, resposta) => new Requisicao(requisicao, resposta)).listen(Core.config.server.portaHTTP);
