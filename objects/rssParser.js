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

    

    constructor() {
        //console.log("Parser created.");
    }
}


module.exports = RssParser;