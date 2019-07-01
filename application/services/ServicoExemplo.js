class ServicoExemplo {
    constructor() {
        this.nomeServico = "Serviço loop de exemplo";
        this.tempoInicio = new Date();
        this.iniciado = false;
        this.statusExecutando = false;
    }

    async iniciar() {
        setInterval(() => {
            if (!this.statusExecutando) {
                this.statusExecutando = true;
                const agora = new Date();
                `Serviço executado por ${((agora - this.tempoInicio) / 1000).toFixed(0)} segundos`.GravarLog();
                this.statusExecutando = false;
            }
        }, 2 * 1000);
    }
}

module.exports = ServicoExemplo;
