const process = require('process');

/* - * - * - * - * - * - * - * - * - * - * - * - * - * - * - * - * - * - * - * - * - * - * - * - * - * - * - * - * - */
process.on('SIGINT', () => {
    "Sinal de desligamento recebido.".GravarLog('warning');
    process.exit(0);
});
/* - * - * - * - * - * - * - * - * - * - * - * - * - * - * - * - * - * - * - * - * - * - * - * - * - * - * - * - * - */
process.on('uncaughtException', e => {
    // e.code === 'PROTOCOL_CONNECTION_LOST' --> Erro na base de dados
    `Erro ocorrido na aplicação: [${e.toString()}]`.GravarLog('warning');
});
/* - * - * - * - * - * - * - * - * - * - * - * - * - * - * - * - * - * - * - * - * - * - * - * - * - * - * - * - * - */
