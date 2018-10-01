function Individu(gene) {
    this.gene = gene;
    this.fitness = 0;
    this.evalued = false;
}
Individu.prototype = {};
module.exports = Individu;