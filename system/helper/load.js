const Carregar = tipo => {
    `Buscando [${tipo}] em [/applications/${tipo}]`.GravarLog();
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
                    `Arquivo carregado [${arquivos[i]}]`.GravarLog("success");
                    carregamento[nomeArquivo] = require(`../.${path}`);
                } else {
                    `Ignorando arquivo [${arquivos[i]}]`.GravarLog("warning");
                }
            } catch (e) {
                console.log("Mal configurado", e);
                // Arquivo mal configurado
            }
        } else {
            `Buscando arquivos na pasta [${nomeArquivo}]`.GravarLog();
            carregamento[nomeArquivo] = Carregar(`${tipo}/${nomeArquivo}`);
        }
    }
    return carregamento;
};

module.exports = Carregar;
