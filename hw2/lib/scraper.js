
const fs = require('fs');
const got = require('got');
var tress = require('tress');
var cheerio = require('cheerio');
var resolve = require('url').resolve;


var results = [];
var links = {};
module.exports = scraper;

function scraper(req, res) {
    var URL = "http://" + req.query.adr;
    var depth = req.query.depth;
    var selector = req.query.selector;

    console.log ("URL: " + URL);
    console.log("depth: " + depth);
    console.log("selector: " + selector);

    var slashCount = 0;

    for(i = 0; i < URL.length; i++){
        if(URL[i] == '/')slashCount++;
    }

    console.log("slashes: " + slashCount);

    var query = tress(function processNode(url, callback) {

        got(url).then(function pageParse(data) {
            var $ = cheerio.load(data.body);
            $(selector).each(function contentSave(index, sel) {
                results.push({href: url, Content: $(sel).text()});
                console.log({href: url, Content: $(sel).text()});
            });
            $('a').each(function processLink() {
                var link = $(this).attr('href');
                var count = 0;
                var fullLink = "http://" + link;
                if( link.indexOf(URL) != -1 && links[link] != true ){ // for absolute
                    for(i = 0; i < fullLink.length; i++){
                        if(fullLink[i] == '/')count++;
                    }
                    if(count - slashCount <= depth) {
                        console.log(fullLink);
                        query.push(fullLink);
                        links[link] = true;
                    }
                }
                if (link.slice(0,1) == '/'  && links[link] != true ){ //
                    var resolvedLink = resolve(URL, link);
                    for(i = 0; i < resolvedLink.length; i++){
                        if(resolvedLink[i] == '/')count++;
                    }
                    if(count - slashCount <= depth) {
                        console.log(resolvedLink);
                        query.push(resolvedLink);
                        links[link] = true;
                    }
                }

            });

        });
        callback();
    },10);

    query.drain = function saveToFile(){
        fs.writeFileSync('./data.json', JSON.stringify(results, null, 4));
    };

    links[URL] = true;
    query.push(URL);

    res.send('COMPLITED');
}
