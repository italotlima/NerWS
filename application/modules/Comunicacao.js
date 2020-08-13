const {axios, nodemailer} = Core.Libraries;

const getMensagemRenderizada = async (mensagem, outros) => {
    const replaces = [...outros].filter(el => el['substituir']);

    const mensagemFinal = new Core.Libraries.StringBuilder("\n");
    mensagem.split("\n").map(prop => {
        replaces.map(prop1 => {
            const {localizar, substituir} = prop1;
            prop = prop.split(`{{${localizar}}}`).join(`${substituir}`);
        });
        mensagemFinal.append(prop);
    });
    return mensagemFinal.toString();
};

Core.config.comunicacao = {
  WhatsApp: {token: "", baseURL: "api.macrochat.com.br", versao: "v1"},
  Email: {email: "", nome: "", host: "", porta: "", senha: ""}
};

class WhatsApp {
    constructor() {
        this.token = Core.config.comunicacao.WhatsApp.token;
        this.baseURL = Core.config.comunicacao.WhatsApp.baseURL;
        this.versao = Core.config.comunicacao.WhatsApp.versao;
    }

    async enviarMensagem(numero, mensagem, parametrosMesclagem = [], arquivo = undefined, chatID = undefined) {
        mensagem = mensagem.split("<strong>").join("*");
        mensagem = mensagem.split("</strong>").join("*");
        mensagem = mensagem.split("<i>").join("_");
        mensagem = mensagem.split("</i>").join("_");

        const parametros = {numero, texto: mensagem, parametrosMesclagem, arquivo, chatID};
        const url = `https://${this.baseURL}/${this.versao}/whatsapp_api/enviarMensagem?uuid=${this.token}`;
        const {data} = await axios.post(url, parametros);
        const {ok} = data;
        if (ok)
            `Mensagem enviada com sucesso para número [${chatID || numero}]`.GravarLog("success");
        return ok;
    }
}

class Email {
    constructor(config = Core.config.comunicacao.Email) {
        this.email = config.email;
        this.nome = config.nome;
        this.transporter = nodemailer.createTransport({
            host: config.host,
            port: config.porta,
            secure: true,
            auth: {user: this.email, pass: config.senha}
        });
    }

    async enviarMensagem(email, assunto, mensagem, parametrosMesclagem = []) {
        mensagem = await getMensagemRenderizada(mensagem, parametrosMesclagem);
        mensagem = mensagem.split("\n").join("<br/>");
        const htmlHeader = `<!doctype html><html lang="pt-br"><head><title>${assunto}</title><meta name="viewport" content="width=device-width"/><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/><style>body{background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;}table{border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;}table td{font-family: sans-serif; font-size: 14px; vertical-align: top;}/* ------------------------------------- BODY & CONTAINER ------------------------------------- */ .body{background-color: #f6f6f6; width: 100%;}/* Set a max-width, and make it display as block so it will automatically stretch to that width, but will also shrink down on a phone or something */ .container{display: block; margin: 0 auto !important; /* makes it centered */ max-width: 680px; padding: 10px; width: 680px;}/* This should also be a block element, so that it will fill 100% of the .container */ .content{box-sizing: border-box; display: block; margin: 0 auto; max-width: 680px; padding: 10px;}/* ------------------------------------- HEADER, FOOTER, MAIN ------------------------------------- */ .main{background: #fff; border-radius: 3px; width: 100%;}.wrapper{box-sizing: border-box; padding: 20px;}.footer{clear: both; padding-top: 10px; text-align: center; width: 100%;}.footer td, .footer p, .footer span, .footer a{color: #999999; font-size: 12px; text-align: center;}hr{border: 0; border-bottom: 1px solid #f6f6f6; margin: 20px 0;}/* ------------------------------------- RESPONSIVE AND MOBILE FRIENDLY STYLES ------------------------------------- */ @media only screen and (max-width: 620px){table[class=body] .content{padding: 0 !important;}table[class=body] .container{padding: 0 !important; width: 100% !important;}table[class=body] .main{border-left-width: 0 !important; border-radius: 0 !important; border-right-width: 0 !important;}}</style></head><body class=""><table border="0" cellpadding="0" cellspacing="0" class="body"><tr><td>&nbsp;</td><td class="container"><div class="content"><table class="main"><tr><td class="wrapper"><table border="0" cellpadding="0" cellspacing="0"><tr><td>`;
        const htmlFooter = `</td></tr></table></td></tr></table><div class="footer"><table border="0" cellpadding="0" cellspacing="0"><tr><td class="content-block"><span>${this.nome}</span></td></tr></table></div></div></td><td>&nbsp;</td></tr></table></body></html>`;
        mensagem = `${htmlHeader}${mensagem}${htmlFooter}`;
        const configEmail = {from: `"${this.nome}" <${this.email}>`, to: email, subject: assunto, html: mensagem};
        const info = await new Promise(((resolve, reject) => this.transporter.sendMail(configEmail, (err, info) => err ? reject(err) : resolve(info))));
        `Email enviado com sucesso para [${email}]`.GravarLog("success");
        return info;
    }
}

Core.Libraries.Comunicacao = {WhatsApp: new WhatsApp(), Email: new Email()};
CoreController.prototype.Comunicacao = Core.Libraries.Comunicacao;
