const Carregar = tipo => {
    Core.utils.GravarLog(`Buscando Controllers em [/${tipo}]`);
    const arquivos = Core.Libraries.fs.readdirSync(`./application/${tipo}`);
    const carregamento = {};

    for (let i = 0; i < arquivos.length; i++) {
        const arquivo = arquivos[i].split(".");
        const nomeArquivo = arquivo[0];
        const tipoArquivo = arquivo[1];
        const path = `./application/${tipo}/${arquivos[i]}`;
        if (Core.Libraries.fs.statSync(path).isFile()) {
            try {
                if (tipoArquivo === "js") {
                    Core.utils.GravarLog(`Arquivo carregado [${arquivos[i]}]`, "success");
                    carregamento[nomeArquivo] = require(`../.${path}`);
                } else {
                    Core.utils.GravarLog(`Ignorando arquivo [${arquivos[i]}]`, "warning");
                }
            } catch (e) {
                console.log("Mal configurado", e);
                // Arquivo mal configurado
            }
        } else {
            Core.utils.GravarLog(`Buscando arquivos na pasta [${nomeArquivo}]`);
            carregamento[nomeArquivo] = Carregar(`${tipo}/${nomeArquivo}`);
        }
    }
    return carregamento;
};

module.exports = Carregar;
