const mysql = require('mysql');

class ConexaoBD {
    constructor() {
        this.config = Core.config.database;
        this.db = null;
    }

    conectar() {
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

    desconectar() {
        this.db.end();
    }

    query(sql, args = null) {
        return new Promise((resolve, reject) => {
            if (args) this.db.query(sql, args, (err, rows) => err ? reject(err) : resolve(rows));
            else this.db.query(sql, (err, rows) => err ? reject(err) : resolve(rows));
        });
    }

    queryRow(sql, args = null) {
        return new Promise((resolve, reject) => {
            if (args) this.db.query(sql, args, (err, rows) => err ? reject(err) : resolve(rows.length ? rows[0] : {}));
            else this.db.query(sql, (err, rows) => err ? reject(err) : resolve(rows.length ? rows[0] : {}));
        });
    }

    startTransaction() {
        return new Promise((resolve, reject) => this.db.beginTransaction(err => err ? reject(err) : resolve()));
    }

    commit() {
        return new Promise((resolve, reject) => this.db.commit(err => err ? reject(err) : resolve()));
    }

    rollback() {
        return new Promise((resolve, reject) => this.db.rollback(err => err ? reject(err) : resolve()));
    }
}

module.exports = ConexaoBD;
