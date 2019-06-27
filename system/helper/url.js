const getParametros = url => {
    const getParams = () => {
        const params = {};
        try {
            url.split("?")[1].split("&").map(prop => {
                const dados = prop.split("=");
                params[dados[0]] = dados[1];
            });
        } catch (e) {

        }
        return params;
    };

    const requisicao = {
        data: {
            params: getParams(),
            funcao: "index",
            controller: [],
            requisicao: url
        },
        status: true
    };

    url = (url.indexOf("?") === -1) ? url : url.split("?")[0];
    const parametros = url.split("/").slice(1);
    requisicao.data.funcao = parametros.slice(-1)[0];
    const path = parametros.slice(0, -1);

    requisicao.data.controller = Core.controller;
    path.map(prop => {
        requisicao.data.controller = requisicao.data.controller[prop];
    });

    return requisicao;
};

module.exports = getParametros;
