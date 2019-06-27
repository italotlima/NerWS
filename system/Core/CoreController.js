class CoreController {
    constructor() {
        this.requisicao = null;
        this.resposta = null;
        this.db = null;
    }

    finalizaRequisicao(resposta) {
        this.resposta = resposta;
    }
}

module.exports = CoreController;
