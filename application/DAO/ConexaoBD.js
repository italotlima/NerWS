const mysql = require('mysql');

class ConexaoBD {
    constructor() {
        this.config = Core.config.database;
        this.db = null;
    }

    conectar() {
        if (this.config.enabled) {
            this.db = mysql.createConnection(this.config);
            return new Promise((resolve, reject) => this.db.connect(err => (err) ? reject(new Error(`Não foi possível se conectar com o Banco de Dados [${err.toString()}]`)) : resolve()));
        }
    }

    desconectar() {
        if (this.config.enabled && this.db)
            this.db.end();
    }

    query(sql, args = null) {
        if (!this.config.enabled)
            throw new Error("A conexão com o banco de dados não está ativa.");
        return new Promise((resolve, reject) => {
            if (args) this.db.query(sql, args, (err, rows) => err ? reject(err) : resolve(rows));
            else this.db.query(sql, (err, rows) => err ? reject(err) : resolve(rows));
        });
    }

    queryRow(sql, args = null) {
        if (!this.config.enabled)
            throw new Error("A conexão com o banco de dados não está ativa.");
        return new Promise((resolve, reject) => {
            if (args) this.db.query(sql, args, (err, rows) => err ? reject(err) : resolve(rows.length ? rows[0] : {}));
            else this.db.query(sql, (err, rows) => err ? reject(err) : resolve(rows.length ? rows[0] : {}));
        });
    }

    startTransaction() {
        if (!this.config.enabled)
            throw new Error("A conexão com o banco de dados não está ativa.");
        return new Promise((resolve, reject) => this.db.beginTransaction(err => err ? reject(err) : resolve()));
    }

    commit() {
        if (!this.config.enabled)
            throw new Error("A conexão com o banco de dados não está ativa.");
        return new Promise((resolve, reject) => this.db.commit(err => err ? reject(err) : resolve()));
    }

    rollback() {
        if (!this.config.enabled)
            throw new Error("A conexão com o banco de dados não está ativa.");
        if (this.db)
            return new Promise((resolve, reject) => this.db.rollback(err => err ? reject(err) : resolve()));
    }
}

module.exports = ConexaoBD;
