String.prototype.GravarLog = function (tipo = "info") {
    const tipos = {info: "[i]".blue, warning: "[!]".yellow, success: "[+]".green, error: "[x]".red};
    const [data, hora] = new Date().toISOString().split("T");
    const tempo = `${data.split("-").reverse().join("/")} ${hora.slice(0, 8)}`;
    console.log(tipos[tipo], `[${tempo}]`, this.toString());
};

global.ErroUsuario = class ErroUsuario extends Error {
    constructor(mensagem_usuario, outros) {
        super();
        const {errosAplicacao, descricao_usuario} = typeof outros === "object" ? outros : (typeof outros === "string" ? outros : {});
        this.mensagem_usuario = mensagem_usuario;
        this.erros_aplicacao = errosAplicacao;
        this.descricao_usuario = descricao_usuario;
        throw this;
    }
};
