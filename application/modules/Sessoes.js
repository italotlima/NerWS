Core.helper.Funcoes.prototype.validaToken = async function validaToken(token, obj = null, raise = true) {
    const dispararErro = () => {
        let erro = new Error();
        erro.codigo_erro = 46135789165;
        erro.messagem_usuario = "Token de acesso inválido.";
        if (raise)
            throw erro;
        return false
    };
    if (!token) {
        return dispararErro();
    } else {
        try {
            const {sessions} = Core;
            const {id_usuario, id_empresa_fk} = sessions[`tkn_${token}`];
            if (!id_usuario)
                return dispararErro();

            if (obj) {
                // Adicionar VALIDADE
                obj.usuario.id_usuario = id_usuario;
                obj.usuario.id_empresa = id_empresa_fk;
                return true;
            }
        } catch (e) {
            return dispararErro();
        }
    }
};
CoreController.prototype.validaToken = function (raise = true) {
    const token = this.input.get.token || this.input.post.token || null;
    return this.funcoes.validaToken(token, this, raise);
};

Core.helper.sessoes = {
    carregar: (token, data_expiracao, dados) => {
        const {id_empresa_fk, nome, id_usuario} = dados;

        Core.sessions[`tkn_${token}`] = {id_empresa_fk, nome, data_expiracao, id_usuario};

        if (!Core.sessions[`usr_${id_usuario}`])
            Core.sessions[`usr_${id_usuario}`] = {};
        Core.sessions[`usr_${id_usuario}`][token] = Core.sessions[`tkn_${token}`];

        if (!Core.sessions[`emp_${id_empresa_fk}`])
            Core.sessions[`emp_${id_empresa_fk}`] = {};
        Core.sessions[`emp_${id_empresa_fk}`][`usr_${id_usuario}`] = Core.sessions[`usr_${id_usuario}`];
    }
};
