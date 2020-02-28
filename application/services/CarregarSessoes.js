class CarregarSessoes {
    constructor() {
        this.nomeServico = "Carregar sessões BD";
        this.db = new Core.Libraries.ConexaoBD();
    }

    async iniciar() {
        await this.db.conectar();
        Core.sessions = {};
        const sistema_sessao = await this.db.query(`SELECT token, data_expiracao, dados FROM sistema_sessao WHERE data_expiracao > NOW()`);
        `Carregando ${sistema_sessao.length} sessões`.GravarLog();
        for (let i = 0; i < sistema_sessao.length; i++) {
            const {token, data_expiracao, dados} = sistema_sessao[i];
            Core.helper.sessoes.carregar(token, data_expiracao, JSON.parse(dados));
        }

        await this.db.desconectar();
    }
}

module.exports = CarregarSessoes;
