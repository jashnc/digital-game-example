/**
 * Created by laura on 5/2/16.
 */

vars genotypes = ["Aa", "AA", "Bb", "BB", "Cc", "CC"];

function Npc(x, y, png){
    this.x = x;
    this.y = y;
    this.png = png;
}

function Seed(x, y){
    this.x = x;
    this.y = y;
    var index = Math.random()*genotypes.length();
    this.genotype = genotypes[index];
    
}


