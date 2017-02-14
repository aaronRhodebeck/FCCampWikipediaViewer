function SearchArgs(searchText, whatToSearch, metadataToReturn, propertiesToReturn, pageToStartOn, totalPagesToReturn) {
    this.searchText = searchText;
    this.srwhat = whatToSearch;
    this.srinfo = metadataToReturn;
    this.srprop = propertiesToReturn;
    this.sroffset = pageToStartOn;
    this.srlimit = totalPagesToReturn;
}

function WikipediaSearch(searchArgs) {
    this.searchArgs = searchArgs;
    this.searchResults;

    var createSearchString = function(searchText) {
        return encodeURIComponent(searchText);
    }

    var createAPICall = function() {
        var srsearch = createSearchString(this.searchArgs.searchText);
        return "action=query&list=search&" +
            "srsearch=" + srsearch + "&" +
            "srwhat=" + searchArgs.srwhat + "&" +
            "srinfo=" + searchArgs.srinfo + "&" +
            "srprop=" + searchArgs.srprop + "&" +
            "sroffset=" + searchArgs.sroffset + "&" +
            "srlimit=" + searchArgs.srlimit;
    }

    this.apiCall = createAPICall();


    this.searchWikipedia = function() {
        var wikipediaURL = "https://en.wikipedia.org/w/api.php?";
        $.getJSON(wikipediaURL + this.apiCall, function(value) {
            this.searchResults = value;
        });
    }
}