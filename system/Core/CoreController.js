class CoreController {
    constructor() {
        this.requisicao = null;
        this.resposta = null;
        this.db = null;
        this.input = {get: {}, post: {}};
        this.headerResposta = {};
        this.funcoes = new Core.helper.Funcoes();
    }

    finalizaRequisicao(resposta) {
        if (resposta)
            this.resposta = resposta;
    }
}

module.exports = CoreController;
