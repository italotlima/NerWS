const Carregar = (tipo, onlyJS = true) => {
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
                    carregamento[nomeArquivo] = require(`../.${path}`);
                    `Arquivo carregado [${arquivos[i]}]`.GravarLog("success");
                } else {
                    if (onlyJS)
                        `Ignorando arquivo [${arquivos[i]}]`.GravarLog("warning");
                    else {
                        const {fs, mime} = Core.Libraries;
                        carregamento[`/${arquivos[i]}`] = {type: mime.getType(path), file: fs.readFileSync(path)};
                        `Arquivo carregado [${arquivos[i]}]`.GravarLog("success");
                    }
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
