var Ville = require("./Ville");
var Individu = require("./Individu");
var villes = [
            new Ville('A'), 
            new Ville('B'), 
            new Ville('C'), 
            new Ville('D'),
            new Ville('E'), 
            new Ville('F'), 
            new Ville('G')
];
var getVilleByName = function(name) {   
    for(var i=0; i < villes.length; i++) {
        if(villes[i].name == name) {
            return villes[i];
        }
    }
    return null;
}
var connect = function(villeName1, villeName2, dist) {
    var ville1 = getVilleByName(villeName1);
    var ville2 = getVilleByName(villeName2);
    ville1.addVoisin(ville2, dist); //circulaire
    ville2.addVoisin(ville1, dist);
}
var getDistance = function (villeName1, villeName2) {
    if(villeName1 == villeName2) return 0;
    var ville1 = getVilleByName(villeName1);
    var ville2 = getVilleByName(villeName2);
    var d = ville2.getDistance(ville1);
    return d;
}
//definitions des villes
connect('A', 'B', 2);
connect('A', 'C', 1);
connect('B', 'C', 3);
connect('B', 'D', 2);
connect('B', 'E', 5);
connect('C', 'D', 3);
connect('C', 'G', 4);
connect('D', 'E', 3);
connect('D', 'G', 2);
connect('E', 'G', 3);
connect('E', 'F', 1);
connect('G', 'F', 4);

var sortDecroissant = function(liste) {
    //tri decroissant suivant le fitness
    for(var i=0; i < liste.length; i++) {
        if(i+1 < liste.length) {
            if(liste[i].fitness < liste[i+1].fitness) {
                var tmp = liste[i];
                liste[i] = liste[i+1];        
                liste[i+1] = tmp;
                sortDecroissant(liste);
            }
        }
    }
}

var evaluerGene = function(gene) {
    //une sequence de ville qui se repete une et une seule fois
    var distance = 0;
    for(var i=0; i < gene.length; i++) {
        if(i+1 < gene.length) {
            var d = getDistance(gene[i], gene[i+1]);
            if(d == -1) {
                return -1; //infini
            } else {
                distance += d;
            }
        }
    }
    var inv = 1 / distance; //plus la distance est grande plus c est nulle
    return inv;
}

var getRandomGene = function() {
    //genere une liste de ville qui se repete une et une seule fois
    var word = ["A", "B", "C", "D", "E", "F", "G"];
    for(var i=0; i < word.length; i++) {
        var k = Math.floor(Math.random()*word.length);
        var tmp = word[k];
        word[k] = word[i];
        word[i] = tmp; 
    }
   return word;
}
var getCorrectRandomGene = function() {
    var d = getRandomGene();
    while(evaluerGene(d) == -1) {
        d = getRandomGene();
    }
    return d;
}
var createPopulationRandom = function(nbr) {
    var pop = [];
    for(var i=0; i < nbr; i++) {
        var gene = getCorrectRandomGene();
        var ind = new Individu(gene);
        pop.push(ind);
    }
    return pop;
}
var evaluatePopulation = function(liste) {
    for(var i=0; i < liste.length; i++) {
        liste[i].fitness = evaluerGene(liste[i].gene);
        liste[i].evalued = true;
    }
}
var popp = createPopulationRandom(10);
evaluatePopulation(popp);
sortDecroissant(popp);
console.log(popp);
module.exports = {

}