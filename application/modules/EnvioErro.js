let processoErroOriginal = Core.Requisicao.prototype.processarErro;
const {https, FormData, uag} = Core.Libraries;

Core.config.erro = {
    urlEnvio: ""
};

const enviarErro = async (nome, email, assunto, mensagem, mensagemWPP) => {
    try {
        `Abrindo novo chamado para [${Core.config.erro.urlEnvio}]`.GravarLog();
        const parametrosUrl = new FormData();
        const parametros = {subject: assunto, name: nome, email, department: 1, priority: 2, message: mensagem};
        Object.keys(parametros).map(prop => parametrosUrl.append(prop, parametros[prop]));

        await fetch(Core.config.erro.urlEnvio, {
            method: "POST",
            agent: (new https.Agent())({rejectUnauthorized: false}),
            body: parametrosUrl,
            headers: {
                'Content-Type': `multipart/form-data; boundary=${parametrosUrl.getBoundary()}`,
                'User-Agent': uag.chrome(60),
                'X-Requested-With': 'XMLHttpRequest'
            },
        });
    } catch (e) {

    }
};

Core.Requisicao.prototype.processarErro = async function (e) {
    processoErroOriginal = processoErroOriginal.bind(this);
    await processoErroOriginal(e);

    const mensagem = new Core.Libraries.StringBuilder("\n");
    const id = new Core.helper.Funcoes().makeID(10).toUpperCase();
    const data = new Date().toISOString().split("T").join("-").split("-").reverse().join("/").split("Z").reverse().join(" ").slice(1, 20);
    mensagem.append(`Erro ocorrido no sistema.`);
    mensagem.append(``);
    mensagem.append(`Identificador Único: ${id}`);
    mensagem.append(``);
    mensagem.append(`Data: ${data}`);
    mensagem.append(``);
    mensagem.append(`URL: ${this.dados.data.requisicao}`);
    mensagem.append(``);
    mensagem.append(`Corpo Requisição: `);
    mensagem.append(``);
    if (this.objetoController) {
        mensagem.append(`Dados GET`);
        if (this.objetoController.input.get)
            Object.keys(this.objetoController.input.get).map(prop => mensagem.append(`&nbsp;&nbsp;${prop} => ${JSON.stringify(this.objetoController.input.get[prop])}`));
        mensagem.append(``);
        mensagem.append(`Dados POST`);
        if (this.objetoController.input.post)
            Object.keys(this.objetoController.input.post).map(prop => mensagem.append(`&nbsp;&nbsp;${prop} => ${JSON.stringify(this.objetoController.input.post[prop])}`));
        mensagem.append(``);
    }
    mensagem.append(`Header:`);
    if (this.requisicao.headers)
        Object.keys(this.requisicao.headers).map(prop => mensagem.append(`&nbsp;&nbsp;${prop} => ${JSON.stringify(this.requisicao.headers[prop])}`));
    mensagem.append(``);
    mensagem.append(`Descrição Erro: ${e.toString()}`);

    enviarErro(
        "NervuSW WebService",
        "contato@nervusw.com.br",
        `NervuSW - Erro WebService - ${id}`,
        mensagem.toString(),
        `Descrição Erro: ${e.toString()}`
    );
};
