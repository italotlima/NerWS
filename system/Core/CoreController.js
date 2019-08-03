class CoreController {
    constructor() {
        this.requisicao = null;
        this.resposta = null;
        this.db = null;
        this.input = {get: {}, post: {}};
        this.headerResposta = {};
    }

    finalizaRequisicao(resposta) {
        if (resposta)
            this.resposta = resposta;
    }
}

module.exports = CoreController;
