class Requisicao {
    constructor(requisicao, resposta) {
        try {
            this.tempo = {
                inicio: new Date(),
                final: null
            };
            this.core = Core;
            this.codigoResposta = 200;
            this.headerResposta = {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"};
            this.requisicao = requisicao;
            this.resposta = resposta;

            if (!this.verificarStatus()) throw new Error("Aguardando inicio dos serviços.");

            this.db = new this.core.Libraries.ConexaoBD();

            this.dados = this.core.helper.requisicao.getParametros(this.requisicao.url);

            if (Object.keys(Core.assets).indexOf(this.dados.data.requisicao) > -1) {
                const asset = Core.assets[this.dados.data.requisicao];
                this.headerResposta['Content-Type'] = asset.type;
                this.finalizaRequisicao(asset.file, this.headerResposta, false);
                return;
            }


            this.objetoController = new this.dados.data.controller;
            this.objetoController.requisicao = this.requisicao;

            this.objetoController.input.get = this.dados.data.parametros;
            this.objetoController.input.postPromise = this.core.helper.requisicao.getBodyRequisicao(requisicao);

            this.objetoController.resposta = {ok: true};
            this.objetoController.headerResposta = this.headerResposta;
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

        // Aguardando dados POST
        this.objetoController.input.post = await this.objetoController.input.postPromise;
        // -------------------
        await this.objetoController[this.dados.data.funcao]();
        // -------------------

        await this.db.commit();
        await this.db.desconectar();

        this.finalizaRequisicao(this.objetoController.resposta, this.objetoController.headerResposta);
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

    finalizaRequisicao(resposta, headerResposta, json = true) {
        this.tempo.final = new Date();
        const tempoTotalRequisicao = (this.tempo.final - this.tempo.inicio);
        `Requisição finalizada em [${tempoTotalRequisicao / 1000}s]`.GravarLog();

        // Fazer validação parametros
        if (json) {
            const {ok} = resposta;
            if ([true, false].indexOf(ok) === -1) resposta.ok = true;
        }
        this.resposta.writeHead(this.codigoResposta, headerResposta);
        this.resposta.end(json ? JSON.stringify(resposta) : resposta);
    }
}

module.exports = Requisicao;
