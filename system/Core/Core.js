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

"Carregando Módulos".GravarLog();
global.Core = {
    Libraries: {
        ConexaoBD: require("../../application/DAO/ConexaoBD"),
        StringBuilder: require("../../application/Utils/StringBuilder"),
        fs: require('fs'),
        fetch: require('node-fetch'),
        xmlParseString: require('xml2js').parseString
    },
    controller: [],
    services: [],
    model: [],
    status: {
        database: true,
        controler: true
    },
    config: require("../../config/config"),
    utils: {},
    helper: {
        carregar: require("../../system/helper/load"),
        url: require("../../system/helper/url"),
    }
};
"Módulos carregados com sucesso".GravarLog("success");
