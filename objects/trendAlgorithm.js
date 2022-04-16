'use strict';
var SimpleHashTable = require('simple-hashtable');
var filterListJSON = require('./filter.json');
var filterList = [];
filterListJSON.forEach((item) => {
    filterList.push(item.word);
})
//https://www.npmjs.com/package/simple-hashtable
class TrendAlgorithm {    

    printHashtable(hashtable){
        
        let values = this.sortHashtable(hashtable);
        //Print values array.
        for(let i = 0; i < values.length; i++){
            //console.log(JSON.stringify(values[i]))
            console.log("\x1b[31m", `Term: '${values[i][0]}',`,"\x1b[32m", `Occurrences: ${values[i][1][0]},`, "\x1b[34m", `Sources: ${values[i][1][1]}`, "\x1b[37m");
        }
    }

    /**
     * Sorts hashtable by number of occurrences. 
     * Returns an array of values.
     * @param {*} hashtable 
     */
    sortHashtable(hashtable) {
        var keys = hashtable.keys();
        var values = [];
    
        //Put into array of tuples.
        for(let i = 0; i < keys.length; i++){
            //console.log(`Key: ${keys[i]} Value: ${hashtable.get(keys[i])}`);
            var item = [keys[i], hashtable.get(keys[i])];
            values.push(item);
        }

        //Sort into order by value
        for(let i = 0; i < values.length; i++){
            if(i+1 < values.length){
                if(values[i][1][0] < values[i+1][1][0]){ //swap if i is less than i + 1;
                    let temp = values[i];
                    values[i] = values[i+1];
                    values[i+1] = temp;
                    i = -1;
                }
            }
            else{
                break;
            }
        }

        return values;
    }

    /**
     * Converts hashtable to sorted json array.
     * @param {*} hashtable 
     */
    toJSON(hashtable){
        let JSON = {};

        let values = this.sortHashtable(hashtable);
        
        for(let i = 0; i < values.length; i++){
            //console.log(values[i][0]);
            JSON[values[i][0]] = {"count":values[i][1][0],"sources":values[i][1][1]};
        }

        return JSON;
    }

    /*
    Adds the given word to the hashtable with count 1; If it's already there it will increase the count by one.
    */
    addToHashtable(word, sourceUrl, hashtable){
        if(hashtable.containsKey(word)){
            var oldCount = hashtable.get(word)[0];
            var oldSources = hashtable.get(word)[1];
            
            //Check if source is already there
            if(!oldSources.includes(sourceUrl)){
                oldSources.push(sourceUrl);
            }

            hashtable.remove(word);
            hashtable.put(word, [oldCount+1, oldSources]);
        }
        else {
            hashtable.put(word, [1, [sourceUrl]]);
        }

    }

    /*
    Params:y
    data: string to iterate through.
    */
    insert(data, sourceUrl, doFilter) {
        var words = data.split(" ");

        for(let i = 0; i < words.length; i++){
            //console.log(words[i]);
            words[i] = words[i].toLowerCase()

            if(doFilter){
                if(!filterList.includes(words[i])){
                    this.addToHashtable(words[i], sourceUrl, this.hashtable);
                }
            }
            else{
                this.addToHashtable(words[i], sourceUrl, this.hashtable);
            }
            
        }
    }   

    constructor(){
        this.hashtable = new SimpleHashTable();
    }
}

module.exports = TrendAlgorithm;