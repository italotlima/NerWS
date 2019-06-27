class StringBuilder {
    constructor(espaco = false) {
        this.string = "";
        this.espaco = espaco === true ? " " : ((espaco === false) ? "" : espaco);
    }

    append(texto) {
        this.string += texto + this.espaco;
    }

    toString() {
        return this.string;
    }

    clear() {
        this.string = "";
    }
}

module.exports = StringBuilder;