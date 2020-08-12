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
global.CoreController = require("../Core/CoreController");
global.Core = {
    Libraries: {
        ConexaoBD: require("../../application/DAO/ConexaoBD"),
        StringBuilder: require("../../application/Utils/StringBuilder"),
        fs: require('fs'),
        fetch: require('node-fetch'),
        xmlParseString: require('xml2js').parseString,
        mime: require('mime'),
        os: require('os'),
        zlib: require('zlib'),
        request: require('request'),
        websocket: require('websocket'),
        http: require('http'),
        https: require('https'),
        uuid: require('uuid'),
        FormData: require('form-data'),
        axios: require('axios'),
        nodemailer: require("nodemailer")

    },
    controller: [],
    services: [],
    assets: [],
    model: [],
    status: {
        database: true,
        controler: true
    },
    Requisicao: require('../Core/MainClassRequisiaco'),
    utils: {},
    helper: {
        carregar: require("../helper/load"),
        requisicao: require("../helper/requisicao"),
        Funcoes: require("../helper/Funcoes"),
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
    const execucaoPerpetua = async () => {

    };

    Object.keys(Core.services).map(prop => {
        // Melhorar aqui
        const servico = new Core.services[prop]();
        `Iniciando [${servico.nomeServico}]`.GravarLog();
        servico.iniciar().catch(e => {
            `Houve um problema na execução do serviço [${servico.nomeServico}] [${e.toString()}]`.GravarLog("error");
        });
        servico.iniciado = true;
    });
};
module.exports = {iniciarServicos};
