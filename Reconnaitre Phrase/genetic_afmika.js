//on défini la sequence ADN à reconnaitre
var sequence = "Your 2D Waifu isn't real. Sorry."; //SEQUENCE A APPRENDRE
//Alphabet possible
var possible = " 123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz#!'.".split("");

function Individu(gene) {this.gene = gene; this.fitness = 0; this.evalued = false; }
function ranF(n){return Math.random()*n;}
function ranI(n){return Math.floor(ranF(n));}
//VARIABLES GLOBALES
var generation_max = 50000; //50000 generations maximums
var population = []; //Vecteur Population
var nbr_gene = sequence.length; //Taille de l'ADN
var nbr_population = 100; //Taille de la population initiale (=nbr Chromosomes)
var best_pourcent = 0.3; //Pourcentage des individus badasses
var bad_pourcent = 0.2; //(petit hack en math: pour assurer la variance statistique)
var mutation_probability = 0.1; //probabilité de mutation par défaut

function triDecroissant(liste) {
    //tri decroissant suivant le fitness
    for(var i=0; i < liste.length; i++) {
        if(i+1 < liste.length) {
            if(liste[i].fitness < liste[i+1].fitness) {
                var tmp = liste[i];
                liste[i] = liste[i+1];        
                liste[i+1] = tmp;
                triDecroissant(liste);
            }
        }
    }    
}

function getEnfants(pere, mere) {
    var midlle = Math.floor(nbr_gene/2);
    var newgene1 = [];
    for(var i=0; i < nbr_gene; i++) {
        if(i < midlle) {
            newgene1[i] = pere.gene[i];
        } else {
            newgene1[i] = mere.gene[i];
        }
    }
    return (new Individu(newgene1));
}

function evaluerIndividu(indiv) {
    var val = 0;
    for(var i=0; i < nbr_gene; i++) {
        val += (sequence[i] == indiv.gene[i]) ? 1 : 0;
    }
    indiv.fitness = val;    
    indiv.evalued = true;
}

function evaluerPopulation() {
    for(var i=0; i < nbr_population; i++) {
        evaluerIndividu(population[i]);
    }
}

function getParents() {
    //on prend un individu dans la population
    triDecroissant(population);
    var parents = [];
    //on prend 30% badass
    var indexFin = Math.floor(best_pourcent * nbr_population);
    for(var i=0; i < indexFin; i++) {
        parents.push(population[i]);
    }
	//on prend quelques autres pour assurer la variance
    var nbrBad = bad_pourcent * nbr_population;
    var i = 0;
    while(i < nbrBad) {
        parents.push(population[ranI(nbr_population)]);
        i++;
    }
    return parents;
}
function getRandomWord() {
	return possible[ranI(possible.length)];
}
function createRandomIndividu() {
    var gene = [];
    for(var i=0; i < nbr_gene; i++) {
        gene.push(getRandomWord());
    }
    var i = new Individu(gene);
    return i;
}
function createRandomPopulation() {
    for(var i=0; i < nbr_population; i++) {
        population.push(createRandomIndividu());
    }
}
function getBest() {
    triDecroissant(population);
    return population[0];
}
function Run() {
    evaluerPopulation();

    var parents = getParents(); // 20% sur N indiv.
    //on va faire newgen = parents + enfants
    //selections
    var enfants = [];
    if(getBest().fitness == nbr_gene ) {
        return true; //solution trouvée
    }
	//croisement
    var nbrenfantsAFaire = nbr_population - parents.length;
    for(var i=0; i < parents.length;) {
        var posP = ranI(parents.length),posM = ranI(parents.length);
        if(posP != posM && nbrenfantsAFaire > 0) {
            var pere = parents[posP];
            var mere = parents[posM];
            var child = getEnfants(pere, mere);
            evaluerIndividu(child);
            enfants.push(child);
            nbrenfantsAFaire--;
            i++;
       }
    }
	//newgeneration = parents + enfants
    var newgeneration = [];
    for( i=0; i < parents.length; i++) {
        newgeneration.push(parents[i]);
    }
    for( i=0; i < enfants.length; i++) {
        newgeneration.push(enfants[i]);
    }
    //mutation
    var n = 0;
    while(n < newgeneration.length) {
        if(Math.random() < mutation_probability) {
            var g = ranI(nbr_gene);
            newgeneration[n].gene[g] = getRandomWord();
        }
        n++;
    }
    //remplacement
    population = newgeneration;
    return false;
}
createRandomPopulation();
var q = 0;
var best = null;
console.log("");
var solution = false;
while(!solution && q < generation_max) {
    solution = Run();
    best = getBest();
    if(q % 64 == 0 || solution) 
		console.log("Lecture ADN => "
					+best.gene.join("") + " :: Fitness "+best.fitness + "/"+sequence.length+" :: "+q+"e génération.");
    //console.log(best.gene + " "+best.fitness);
    q++;
}
console.log("Solution trouvée en "+(q-1)+" générations");