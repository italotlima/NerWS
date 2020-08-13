require("dotenv").config({path: process.env.NODE_ENV === "test" ? ".env.test" : ".env"});
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
Core.config = {
  database: require("../../config/database"),
  server: {
    portaHTTP: process.env.APP_HTTP_PORT || 8181,
    portaWS: process.env.portaWS || 19630,
    portaWSS: process.env.portaWSS || 19631
  }
};
