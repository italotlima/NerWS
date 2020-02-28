class Funcoes {
    makeID(tamanho = 50) {
        let text = "";
        const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (let i = 0; i < tamanho; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    validaParametros(validar) {
        const errosAplicacao = [];

        const tiposDados = {
            string: {descricao: "alfanumerico", tratamento: valor => valor.toString()},
            undefined: {descricao: "indefinido", tratamento: valor => valor},
            object: {descricao: "objeto", tratamento: valor => valor},
            boolean: {descricao: "boleano (verdadeiro/falso)", tratamento: valor => Boolean(valor)},
            number: {descricao: "numerico", tratamento: valor => parseFloat(valor)},
            date: {descricao: "data", tratamento: valor => new Date(valor)},
            function: {descricao: "funcao", tratamento: valor => valor}
        };

        if (Array.isArray(validar)) {
            validar.map(parametro => {
                let {obrigatorio, tipo, nome, valor} = parametro;

                try {
                    const novoValor = tiposDados[tipo].tratamento(valor);
                    valor = isNaN(novoValor) ? valor : novoValor;
                    if (tipo === "date") {
                        valor = valor.isValid() ? valor : null;
                        tipo = "object";
                    }
                } catch (e) {
                    valor = undefined;
                }

                if (obrigatorio === true) {
                    if (valor !== "" && valor !== undefined && valor !== null) {
                        if (tipo !== typeof valor) {
                            errosAplicacao.push({
                                mensagem_usuario: `O parametro [${nome}] deve ser ${tiposDados[tipo].descricao}.`,
                                mensagem_usuario_html: `O parametro <b>${nome}</b> deve ser <b>${tiposDados[tipo].descricao}</b>.`
                            });
                        }
                    } else {
                        errosAplicacao.push({
                            mensagem_usuario: `O parâmetro [${nome}] não pode ser vazio.`,
                            mensagem_usuario_html: `O parâmetro <b>${nome}</b> não pode ser <b>vazio</b>.`
                        });
                    }
                }
                return null;
            });
        }

        if (errosAplicacao.length > 0)
            new ErroUsuario(`Parâmetros inválidos ou ausentes`, {errosAplicacao});
        return true;
    }

    calculaPercentual(valor, percentual) {
        return (valor * percentual) / 100;
    }

    upload(local, valor) {
        return new Promise((resolve, reject) => Core.Libraries.fs.writeFile(local, valor, 'base64', err => err ? reject(err) : resolve()));
    }

    download(local) {
        return new Promise((resolve, reject) => Core.Libraries.fs.readFile(local, (e, data) => e ? reject(e) : resolve(data)));
    }

    nomeProprio(nome) {
        nome = nome.split(" ");
        for (let i = 0; i < nome.length; i++) {
            if (nome[i].length > 3 || i === 0)
                nome[i] = nome[i][0].toUpperCase() + nome[i].slice(1).toLowerCase();
        }
        nome = nome.join(" ");
        return nome;
    }

    pontuacaoNumero(valor) {
        if (!valor)
            return "";
        let valorFinal = "";
        valor = valor.toString().split("").reverse().join("");
        for (let i = valor.length - 1; i >= 0; i--) {
            valorFinal += valor[i];

            if (((i % 3) === 0) && (i > 0))
                valorFinal += ".";
        }
        return valorFinal;
    }

    xmlParaJson(xml) {
        return new Promise((resolve, reject) => Core.Libraries.xmlParseString(xml, (err, result) => err ? reject(err) : resolve(result)));
    }

    somenteNumero(numero) {
        return numero.toString().split("").filter(el => !isNaN(parseInt(el))).join("");
    }

    formatoDinheiro(valor) {
        valor = parseFloat(valor).toFixed(2).toString().split(".");
        let valorFinal = this.pontuacaoNumero(valor[0]);
        valorFinal = valorFinal + "," + valor[1];
        return "R$ " + valorFinal;
    }

    zeroEsquerda(numero, casas = 2) {
        numero = parseInt(numero || 0, 10);
        casas = (casas - 1);
        if (numero < Math.pow(10, casas)) {
            numero = new Array(casas).fill("0").join("") + numero;
        }
        return numero.toString();
    }

    timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    formataCPFCNPJ(valor) {
        if (!valor)
            return "";
        valor = this.somenteNumero(valor).toString();
        if (valor.length === 11)
            return valor.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "$1.$2.$3-$4");
        else if (valor.length === 14)
            return valor.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, "$1.$2.$3/$4-$5");
        return valor;
    }
}

module.exports = Funcoes;
