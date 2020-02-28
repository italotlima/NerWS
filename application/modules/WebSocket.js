const {http, websocket, uuid, fs, https} = Core.Libraries;
const {portaWS, portaWSS} = Core.config.server;
const {createServer} = http;
const {server: webSocketServer} = websocket;

const credentials = {key: fs.readFileSync('config/cert.key', 'utf8'), cert: fs.readFileSync('config/cert.crt', 'utf8')};

class WebSocketConexao {
    constructor(requisicao) {
        const connection = requisicao.accept(null, requisicao.origin);

        const token = uuid.v4();
        connection.id = token;
        connection.sendjson = function (json) {
            this.send(JSON.stringify(json));
        };
        Core.sessionsWebSocket[token] = {connection, eventos: {}};
        let tokenUsuario = null;

        connection.on('message', async message => {
            if (message.type === 'utf8') {
                const data = JSON.parse(message.utf8Data);
                const {metodo, token, evento} = data;
                try {
                    if (metodo === "login") {
                        const dados = {usuario: {}};
                        const f = new Core.helper.Funcoes();
                        if (await f.validaToken(token, dados, false)) {
                            if (!Core.sessions[`tkn_${token}`].ws)
                                Core.sessions[`tkn_${token}`].ws = {};
                            Core.sessions[`tkn_${token}`].ws[connection.id] = Core.sessionsWebSocket[connection.id];
                            tokenUsuario = token;
                            connection.sendjson({autenticado: true});
                        } else
                            connection.sendjson({autenticado: false});
                    } else if (metodo === 'adicionarEvento') {
                        Core.sessionsWebSocket[connection.id].eventos[evento] = true;

                    } else if (metodo === 'removerEvento') {
                        Core.sessionsWebSocket[connection.id].eventos[evento] = false;
                    }
                } catch (e) {
                    console.log(e);
                    // connection.end();
                }
            }
        });

        connection.on('close', () => {
            if (tokenUsuario)
                delete Core.sessions[`tkn_${tokenUsuario}`].ws[connection.id];
            `Conexão [${connection.id}] fechada`.GravarLog("warning");
        });
    }
}

CoreController.prototype.alterarMensagemCarregando = function (mensagemCarregando) {
    const sessoes = Core.sessions[`tkn_${this.input.get.token || this.input.post.token}`].ws;
    if (sessoes) {
        for (let i = 0; i < Object.keys(sessoes).length; i++) {
            const ws = sessoes[Object.keys(sessoes)[i]];
            if (ws)
                ws.connection.sendjson({mensagemCarregando});
        }
    }
};

Core.sessionsWebSocket = {};
const serverWSS = https.createServer(credentials);
const serverWS = createServer();

serverWS.listen(portaWS, () => `Servidor WebSocket iniciado na porta ${portaWS}`.GravarLog());
new webSocketServer({httpServer: serverWS}).on('request', request => new WebSocketConexao(request));

serverWSS.listen(portaWSS, "0.0.0.0", () => `Servidor WebSocket SSL iniciado na porta ${portaWSS}`.GravarLog());
new webSocketServer({httpServer: serverWSS}).on('request', request => new WebSocketConexao(request));
