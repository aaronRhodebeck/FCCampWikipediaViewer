function SearchArgs(searchText, metadataToReturn, propertiesToReturn, pageToStartOn, totalPagesToReturn) {
    this.searchText = searchText;
    this.srinfo;
    this.srprop;
    this.sroffset;
    this.srlimit;


    if (metadataToReturn) {
        this.srinfo = metadataToReturn;
    } else {
        this.srinfo = "suggestion";
    }
    if (propertiesToReturn) {
        this.srprop = propertiesToReturn;
    } else {
        this.srprop = "snippet";
    }
    if (pageToStartOn) {
        this.sroffset = pageToStartOn;
    } else {
        this.sroffset = "0";
    }
    if (totalPagesToReturn) {
        this.srlimit = totalPagesToReturn;
    } else {
        this.srlimit = "20";
    }
}

function WikipediaSearch(searchParams) {
    var currentSearch = this;
    this.searchArgs = searchParams;
    this.searchResults;

    var createSearchString = function(searchText) {
        return encodeURIComponent(searchText);
    }

    var createAPICall = function(searchArgs) {
        var srsearch = createSearchString(searchArgs.searchText);

        return "action=query&list=search&" +
            "srsearch=" + srsearch + "&" +
            "srinfo=" + searchArgs.srinfo + "&" +
            "srprop=" + searchArgs.srprop + "&" +
            "sroffset=" + searchArgs.sroffset + "&" +
            "srlimit=" + searchArgs.srlimit + "&" +
            "format=json";

    }

    this.apiCall = createAPICall(this.searchArgs);

    var parseResultsJSON = function(resultsJSON) {
        var searchResults = resultsJSON.query.search
        var parsedResults = [];

        for (var i = 0; i < searchResults.length; i++) {
            var currentResult = {
                title: searchResults[i].title,
                snippet: searchResults[i].snippet,
                url: encodeURIComponent(searchResults.title),
            }
            parsedResults.push(currentResult);
        }
        currentSearch.searchResults = parsedResults;
        console.log("Parsed Results finished" + currentSearch.searchResults);
    }

    this.searchWikipedia = function() {
        return new Promise(function(resolve, reject) {
            var wikipediaURL = "https://en.wikipedia.org/w/api.php?";
            $.getJSON(wikipediaURL + currentSearch.apiCall + "&callback=?", function(value) {
                console.log("callback works");
                var parsedReuslts = parseResultsJSON(value);
                resolve(parsedReuslts);
            });
        });
    }

}

function setResultsHTML(parsedResults) {
    var totalResults = parsedResults.length;
    var wikipediaURL = "https://en.wikipedia.org/wiki/"

    for (var i = 0; i < totalResults; i++) {
        var $t = $("#resultTemplate").clone().removeAttr("id");
        var $template = $($t.html())
        var $title = $template.find(".result-title");
        var $snippet = $template.find(".result-snippet");

        $title.html(parsedResults[i].title);
        var articleURL = wikipediaURL + parsedResults[i].title.replace(/ /g, "_");
        $title.attr("href", articleURL);
        $snippet.html(parsedResults[i].snippet);
        $("#results").append($template);
    }
}

$(document).ready(function() {
    var searchArgs = new SearchArgs("Sample");
    var search = new WikipediaSearch(searchArgs);
    search.searchWikipedia().then(function() {
        setResultsHTML(search.searchResults);
    });
});