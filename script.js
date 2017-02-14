function SearchArgs(searchText, whatToSearch, metadataToReturn, propertiesToReturn, pageToStartOn, totalPagesToReturn) {
    this.searchText = searchText;
    this.srwhat;
    this.srinfo;
    this.srprop;
    this.sroffset;
    this.srlimit;

    if (whatToSearch) {
        this.srwhat = whatToSearch;
    } else {
        this.srwhat = "title";
    }
    if (metadataToReturn) {
        this.srinfo = metadataToReturn;
    } else {
        this.srinfo = "suggestion";
    }
    if (propertiesToReturn) {
        this.srprop = propertiesToReturn;
    } else {
        this.srprop = "snippet|hasrelated";
    }
    if (pageToStartOn) {
        this.sroffset = pageToStartOn;
    } else {
        this.sroffset = "0";
    }
    if (totalPagesToReturn) {
        this.srlimit = totalPagesToReturn;
    } else {
        this.srlimit = "1";
    }
}

function WikipediaSearch(searchParams) {
    this.searchArgs = searchParams;
    this.searchResults;

    var createSearchString = function(searchText) {
        return encodeURIComponent(searchText);
    }

    var createAPICall = function(searchArgs) {
        var srsearch = createSearchString(searchArgs.searchText);

        return "action=query&list=search&" +
            "srsearch=" + srsearch + "&" +
            "srwhat=" + searchArgs.srwhat + "&" +
            "srinfo=" + searchArgs.srinfo + "&" +
            "srprop=" + searchArgs.srprop + "&" +
            "sroffset=" + searchArgs.sroffset + "&" +
            "srlimit=" + searchArgs.srlimit;
    }

    this.apiCall = createAPICall(this.searchArgs);

    this.searchWikipedia = function() {
        var wikipediaURL = "https://en.wikipedia.org/w/api.php?";
        $.getJSON(wikipediaURL + this.apiCall, function(value) {
            this.searchResults = value;
        });
    }
}

var setResultsHTML = function(results) {
    $("results").innerHTML = results;
}

$(document).ready(function() {

});