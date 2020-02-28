const {iniciarServicos} = require('./system/Core/Core');
const {createServer} = require('http');

"Iniciando Serviço".GravarLog("success");

/***********************************/
Core.controller = Core.helper.carregar("controllers");
Core.services = Core.helper.carregar("services");
Core.assets = Core.helper.carregar("assets", false);
Core.helper.carregar("modules");
iniciarServicos();
/***********************************/

createServer((requisicao, resposta) => new Core.Requisicao(requisicao, resposta)).listen(Core.config.server.portaHTTP);
