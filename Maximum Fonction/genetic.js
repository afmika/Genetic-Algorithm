/*
 * On cherche le maximum de la fonction
 * f(x) = x sur [0, 2^nbr bit-1] par exemple
 */
var generation_max = 50000; //50000 generations
var population = [];
var nbr_gene = 2048; //= 2^nbr bit
var nbr_population = 50;
var best_pourcent = 0.3;
var bad_pourcent = 0.2;
var mutation_probability = 0.1;
function ranF(n){return Math.random()*n;}
function ranI(n){return Math.floor(ranF(n));}
function Individu(gene) {this.gene = gene; this.fitness = 0; this.evalued = false; }

function getEnfants(pere, mere) {
    var enfants = []; //table d individus
    var midlle = Math.floor(nbr_gene/2);
    var newgene1 = [];
    var newgene2 = [];
    for(var i=0; i < nbr_gene; i++) {
        if(i < midlle) {
            newgene1[i] = pere.gene[i];
            newgene2[i] = mere.gene[i];
        } else {
            newgene1[i] = mere.gene[i];
            newgene2[i] = pere.gene[i];
        }
    }
    //enfants.push(new Individu(newgene1));    
    //enfants.push(new Individu(newgene2));
    return (new Individu(newgene1));
}
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

function evaluerIndividu(indiv) {
    var val = 0;
    for(var i=0; i < nbr_gene; i++) {
        val += indiv.gene[i];
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
    var nbrBad = bad_pourcent * nbr_population;
    var i = 0;
    while(i < nbrBad) {
        parents.push(population[ranI(nbr_population)]);
        i++;
    }
    return parents;
}

function createRandomIndividu() {
    var gene = [];
    for(var i=0; i < nbr_gene; i++) {
        gene.push((Math.random() > 0.5) ? 1 : 0);
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

    var parents = getParents(); // 4 parents = 20% sur 20 indiv.
    //on va faire newgen parents + enfants
    //selections
    var enfants = [];
    if(getBest().fitness == nbr_gene ) {
        return true;
    }

    var nbrenfantsAFaire = nbr_population - parents.length; //16 enfants
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
            newgeneration[n].gene[g] = (newgeneration[n].gene[g] == 0)? 1 : 0 ;
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
var solution = false;
while(!solution && q < generation_max) {
    solution = Run();
    best = getBest();
    if(q % 256 == 0 || solution) console.log(best.fitness + " génération "+q);
    //console.log(best.gene + " "+best.fitness);
    q++;
}
console.log("Términé en "+(q-1)+" générations");