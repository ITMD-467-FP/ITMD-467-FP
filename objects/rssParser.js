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

    async getDataString(url) {
        return new Promise((resolve, reject) => {
            let parser = new Parser();

            //console.log("ASKING FOR PARSE");
            parser.parseURL(url).then((feed) => {
                //console.log("PARSE COMPLETE");
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

                //callback(output, url);

                resolve(output);
                //return output;
            });
        });
    }

    constructor() {
        //console.log("Parser created.");
    }
}


module.exports = RssParser;