'use strict';
var SimpleHashTable = require('simple-hashtable');
//https://www.npmjs.com/package/simple-hashtable
class TrendAlgorithm {    

    printHashtable(hashtable){
        var keys = hashtable.keys();
        for(let i = 0; i < keys.length; i++){
            console.log(`Key: ${keys[i]} Value: ${hashtable.get(keys[i])}`);
        }
    }

    /*
    Adds the given word to the hashtable with count 1; If it's already there it will increase the count by one.
    */
    addToHashtable(word, hashtable){
        if(hashtable.containsKey(word)){
            var oldCount = hashtable.get(word);
            hashtable.remove(word);
            hashtable.put(word, oldCount+1);
        }
        else {
            hashtable.put(word, 1);
        }
    }

    /*
    Params:y
    data: string to iterate through.
    callback: function to call with each individual word as a parameter.
    */
    eachWord(data, callback, hashtable) {
        var words = data.split(" ");

        for(let i = 0; i < words.length; i++){
            //console.log(words[i]);
            callback(words[i], hashtable);
        }
    }   

    constructor(data){
        this.data = data;
        this.hashtable = new SimpleHashTable();
        this.eachWord(data, this.addToHashtable, this.hashtable);
        //this.printHashtable(this.hashtable);
    }
}

module.exports = TrendAlgorithm;