const mysql = require('mysql');

class ConexaoBD {
    constructor() {
        this.config = Core.config.database;
        this.db = null;
    }

    conectar() {
        if (this.config.enabled) {
            this.db = mysql.createConnection(this.config);
            return new Promise((resolve, reject) => {
                this.db.connect(err => {
                    if (err) {
                        console.log("[x]".red, "Erro ao conectar com o Banco de Dados");
                        reject(err);
                    } else resolve();
                });
            });
        }
    }

    desconectar() {
        if (this.config.enabled)
            this.db.end();
    }

    query(sql, args = null) {
        if (this.config.enabled) {
            return new Promise((resolve, reject) => {
                if (args) this.db.query(sql, args, (err, rows) => err ? reject(err) : resolve(rows));
                else this.db.query(sql, (err, rows) => err ? reject(err) : resolve(rows));
            });
        } else
            "A conexão com o banco de dados não está ativa.".GravarLog("error");

    }

    queryRow(sql, args = null) {
        if (this.config.enabled) {
            return new Promise((resolve, reject) => {
                if (args) this.db.query(sql, args, (err, rows) => err ? reject(err) : resolve(rows.length ? rows[0] : {}));
                else this.db.query(sql, (err, rows) => err ? reject(err) : resolve(rows.length ? rows[0] : {}));
            });
        } else
            "A conexão com o banco de dados não está ativa.".GravarLog("error");
    }

    startTransaction() {
        if (this.config.enabled) {
            return new Promise((resolve, reject) => this.db.beginTransaction(err => err ? reject(err) : resolve()));
        } else
            "A conexão com o banco de dados não está ativa.".GravarLog("error");
    }

    commit() {
        if (this.config.enabled) {
            return new Promise((resolve, reject) => this.db.commit(err => err ? reject(err) : resolve()));
        } else
            "A conexão com o banco de dados não está ativa.".GravarLog("error");
    }

    rollback() {
        if (this.config.enabled) {
            return new Promise((resolve, reject) => this.db.rollback(err => err ? reject(err) : resolve()));
        } else
            "A conexão com o banco de dados não está ativa.".GravarLog("error");
    }
}

module.exports = ConexaoBD;
