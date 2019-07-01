require('./system/Core/Core');
const {createServer} = require('http');
const Requisicao = require('./system/Core/MainClassRequisiaco');

"Iniciando Serviço".GravarLog("success");
/***********************************/
Core.controller = Core.helper.carregar("controllers");
"Controllers carregados com sucesso".GravarLog("success");
Core.services = Core.helper.carregar("services");
"Serviços carregados com sucesso".GravarLog("success");
Object.keys(Core.services).map(prop => {
    const servico = new Core.services[prop]();
    `Iniciando [${servico.nomeServico}]`.GravarLog();
    servico.iniciar().catch(e => {
        `Houve um problema na execução do serviço [${servico.nomeServico}] [${e.toString()}]`.GravarLog("error");
    });
    servico.iniciado = true;
});
/***********************************/

createServer((requisicao, resposta) => new Requisicao(requisicao, resposta)).listen(8080);
