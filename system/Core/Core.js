const process = require('process');
require('colors');

// ------- Helpers provisórios
const tipos = {
    info: "[i]".blue,
    warning: "[!]".yellow,
    success: "[+]".green,
    error: "[x]".red
};

String.prototype.GravarLog = function (tipo = "info") {
    const data = new Date().toISOString().split("T");
    const hora = data[0].split("-").reverse().join("/") + " " + data[1].slice(0, 8);

    console.log(tipos[tipo], `[${hora}]`, this.toString());
};

require('./EventosSistema');

"Carregando Módulos".GravarLog();
global.CoreController = require("../../system/Core/CoreController");
global.Core = {
    Libraries: {
        ConexaoBD: require("../../application/DAO/ConexaoBD"),
        StringBuilder: require("../../application/Utils/StringBuilder"),
        fs: require('fs'),
        fetch: require('node-fetch'),
        xmlParseString: require('xml2js').parseString,
        mime: require('mime')
    },
    controller: [],
    services: [],
    assets: [],
    model: [],
    status: {
        database: true,
        controler: true
    },
    utils: {},
    helper: {
        carregar: require("../../system/helper/load"),
        requisicao: require("../../system/helper/requisicao"),
    }
};
"Módulos carregados com sucesso".GravarLog("success");

"Carregando arquivo de configuração".GravarLog();
try {
    Core.config = require("../../config/config");
} catch (e) {
    "Ocorreu um erro ao carregar o arquivo config/config.json".GravarLog('error');
    "O serviço será encerrado".GravarLog('error');
    `Descrição do erro: [${e.toString()}]`.GravarLog('error');
    process.exit(1);
}

const iniciarServicos = () => {
    Object.keys(Core.services).map(prop => {
        const servico = new Core.services[prop]();
        `Iniciando [${servico.nomeServico}]`.GravarLog();
        servico.iniciar().catch(e => {
            `Houve um problema na execução do serviço [${servico.nomeServico}] [${e.toString()}]`.GravarLog("error");
        });
        servico.iniciado = true;
    });
};

module.exports = {iniciarServicos};
