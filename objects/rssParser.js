let Parser = require('rss-parser');



class RssParser {

    async getData(url, callback) {
        let parser = new Parser();

        (async () => {
            let feed = await parser.parseURL(url);
            
            /*
            console.log(feed.title);
            feed.items.forEach(item => {
                console.log(item.title + ':' + item.link)
            });
            */

            callback(feed);
        })();
    }

    async getDataString(url, callback) {
        let parser = new Parser();

        (async () => {
            let feed = await parser.parseURL(url);
            
            var output = feed.title + " ";
            
            feed.items.forEach(item => {
                //console.log(item.title + ':' + item.link);
                output = output + item.title;
            });

            /*
            console.log(feed.title);
            feed.items.forEach(item => {
                console.log(item.title + ':' + item.link)
            });
            */

            callback(output);
        })();
    }

    constructor() {
        //console.log("Parser created.");
    }
}


module.exports = RssParser;