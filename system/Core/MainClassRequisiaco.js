class Requisicao {
    constructor(requisicao, resposta) {
        try {
            this.tempo = {
                inicio: new Date(),
                final: null
            };
            this.core = Core;
            this.requisicao = requisicao;
            this.resposta = resposta;

            if (!this.verificarStatus()) throw new Error("Aguardando inicio dos serviços.");

            this.db = new this.core.Libraries.ConexaoBD();

            this.dados = this.core.helper.url(this.requisicao.url);

            this.objetoController = new this.dados.data.controller;
            this.objetoController.requisicao = this.requisicao;
            this.objetoController.resposta = {ok: true};
            this.objetoController.db = this.db;

            // -------------------
            this.processarRequisicao().catch(this.processarErro.bind(this));
        } catch (e) {
            this.processarErro(e);
        }
    }

    processarErro(e) {
        `Não foi possível executar a controller. [${e.toString()}]`.GravarLog("error");
        this.finalizaRequisicao({ok: false});
    }

    async processarRequisicao() {
        await this.db.conectar();
        await this.db.startTransaction();

        // -------------------
        await this.objetoController[this.dados.data.funcao]();
        // -------------------

        await this.db.commit();
        await this.db.desconectar();

        this.finalizaRequisicao(this.objetoController.resposta);
    }

    verificarStatus() {
        const {status} = this.core;
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
        `Requisição finalizada em [${tempoTotalRequisicao / 1000}s]`.GravarLog();

        // Fazer validação parametros
        const {ok} = resposta;
        if ([true, false].indexOf(ok) === -1) resposta.ok = true;
        this.resposta.writeHead(200, {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"});
        this.resposta.end(JSON.stringify(resposta));
    }
}

module.exports = Requisicao;
