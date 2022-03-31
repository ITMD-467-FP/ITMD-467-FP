'use strict';
var SimpleHashTable = require('simple-hashtable');
//https://www.npmjs.com/package/simple-hashtable
class TrendAlgorithm {    
    constructor(data){
        this.data = data;
        this.hashtable = new SimpleHashTable();
        this.eachWord(data);
    }

    /*
    Adds the given word to the hashtable with count 1; If it's already there it will increase the count by one.
    */
    addToHashTable(word){
        if(this.hashtable.containsKey(word)){
            const oldCount = this.hashtable.get(word);
            this.hashtable.remove(word);
            this.hashtable.put(word, oldCount+1);
        }
        else {
            this.hashtable.put(word, 1);
        }
    }

    /*
    Params:y
    data: string to iterate through.
    callback: function to call with each individual word as a parameter.
    */
    eachWord(data, callback) {
        var words = data.split(" ");

        for(let i = 0; i < words.length; i++){
            //console.log(words[i]);
        }
    }   
}

module.exports = TrendAlgorithm;