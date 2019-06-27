const {createServer} = require('http');
require('colors');

const tipos = {
    info: "[i]".blue,
    warning: "[!]".yellow,
    success: "[+]".green,
    error: "[x]".red
};

const GravarLog = (mensagem, tipo = "info") => {
    const data = new Date().toISOString().split("T");
    const hora = data[0].split("-").reverse().join("/") + " " + data[1].slice(0, 8);

    console.log(tipos[tipo], `[${hora}]`, mensagem);
};

GravarLog("Iniciando Serviço", "success");
GravarLog("Carregando Módulos");
global.Core = {
    Libraries: {
        ConexaoBD: require("./application/DAO/ConexaoBD"),
        StringBuilder: require("./application/Utils/StringBuilder"),
        fs: require('fs'),
        fetch: require('node-fetch'),
        xmlParseString: require('xml2js').parseString
    },
    controller: [],
    model: [],
    config: require("./config/config"),
    utils: {
        GravarLog
    },
    helper: {
        carregar: require("./system/helper/load"),
        url: require("./system/helper/url"),
    }
};

GravarLog("Módulos carregados com sucesso", "success");
const status = {
    database: true,
    controler: true
};

/***********************************/
Core.controller = Core.helper.carregar("controllers");
GravarLog("Controllers carregados com sucesso", "success");

/***********************************/

class Requisicao {
    async constructor(requisicao, resposta) {
        try {
            this.tempo = {
                inicio: new Date(),
                final: null
            };
            this.core = Core;
            this.requisicao = requisicao;
            this.resposta = resposta;

            if (!this.verificarStatus()) throw new Error("Aguardando inicio dos serviços.");

            this.dados = Core.helper.url(this.requisicao.url);

            this.objetoController = new this.dados.data.controller;
            this.objetoController.requisicao = this.requisicao;
            this.objetoController.resposta = {ok: true};

            // -------------------
            this.db = new Core.Libraries.ConexaoBD();
            await this.db.conectar();
            await this.db.startTransaction();

            // -------------------
            await this.objetoController[this.dados.data.funcao]();
            // -------------------

            await this.db.commit();
            await this.db.desconectar();

            this.finalizaRequisicao(this.objetoController.resposta);
        } catch (e) {
            GravarLog(`Não foi possível executar a controller. [${e.toString()}]`, "error");
            this.finalizaRequisicao({ok: false});
        }
    }

    verificarStatus() {
        const statusSistema = Object.keys(status);
        for (let i = 0; i < statusSistema.length; i++) {
            if (!status[statusSistema[i]]) {
                return false;
            }
        }
        return true;
    }

    finalizaRequisicao(resposta) {
        this.tempo.final = new Date();
        const tempoTotalRequisicao = (this.tempo.final - this.tempo.inicio);
        GravarLog(`Requisição finalizada em [${tempoTotalRequisicao / 1000}s]`);

        // Fazer validação parametros
        const {ok} = resposta;
        if ([true, false].indexOf(ok) === -1) resposta.ok = true;

        this.resposta.end(JSON.stringify(resposta));
    }
}

/***********************************/

createServer((requisicao, resposta) => new Requisicao(requisicao, resposta)).listen(8080);
