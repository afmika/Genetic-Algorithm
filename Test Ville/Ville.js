// base des villes A, B, C, D, E, F
var Ville = function(name) {
    this.name = name;
    this.voisin = []; //tab villes
    this.dist = []; //tab distances
}
Ville.prototype = {
    addVoisin : function(ville, dist) {
        //def circulaire
        for(var i=0; i < this.voisin.length; i++) {
            if(ville.name == this.voisin[i].name) {
                return false;//existatn
            }
        }
        ville.voisin.push(this);
        ville.dist.push(dist);
        this.voisin.push(ville);
        this.dist.push(dist);
        return true; //non existant
    },
    getDistance : function(ville) {
        for(var i=0; i < this.voisin.length; i++) {
            if(ville.name == this.voisin[i].name) {
                return this.dist[i];
            }
        }
        return -1; //Infini
    }
}
module.exports = Ville;