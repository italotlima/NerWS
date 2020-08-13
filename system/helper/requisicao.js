exports.getParametros = url => {
    const getParams = () => {
        const parametros = {};
        const [, p] = url.split("?");
        if (!p)
            return {};
        p.split("&").map(prop => {
            const [p, v] = prop.split("=");
            parametros[p] = decodeURI(v);
        });
        return parametros;
    };

    const requisicao = {
        data: {parametros: getParams(), funcao: "index", controller: [], requisicao: url},
        status: true
    };

    url = (url.indexOf("?") === -1) ? url : url.split("?")[0];
    const parametros = url.split("/").slice(1);
    requisicao.data.funcao = parametros.slice(-1)[0];
    const path = parametros.slice(0, -1);

    requisicao.data.controller = Core.controller;
    path.map(prop => requisicao.data.controller = requisicao.data.controller[prop]);

    return requisicao;
};

exports.getBodyRequisicao = requisicao => {
    return new Promise((resolve, reject) => {
        let body = "";
        if (requisicao.method === "POST") {
            requisicao.on('data', chunk => {
                body += chunk.toString();
            });
            requisicao.on('end', () => {
                try {
                    body = JSON.parse(body);
                } catch (e) {
                    "Não foi possível converter JSON".GravarLog("warning");
                    resolve(body);
                    // reject(e);
                }
                resolve(body);
            });
        } else resolve(body);
    });
};
