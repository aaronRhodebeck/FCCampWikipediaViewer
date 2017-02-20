function SearchArgs(searchText, propertiesToReturn, totalPagesToReturn, metadataToReturn, pageToStartOn, ) {
    this.searchText = searchText;
    this.srinfo;
    this.srprop;
    this.sroffset;
    this.srlimit;

    if (propertiesToReturn) {
        this.srprop = propertiesToReturn;
    } else {
        this.srprop = "snippet";
    }
    if (totalPagesToReturn) {
        this.srlimit = totalPagesToReturn;
    } else {
        this.srlimit = "20";
    }
    if (metadataToReturn) {
        this.srinfo = metadataToReturn;
    } else {
        this.srinfo = "suggestion";
    }
    if (pageToStartOn) {
        this.sroffset = pageToStartOn;
    } else {
        this.sroffset = "0";
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
    }

    this.searchWikipedia = function() {
        return new Promise(function(resolve, reject) {
            var wikipediaURL = "https://en.wikipedia.org/w/api.php?";
            $.getJSON(wikipediaURL + currentSearch.apiCall + "&callback=?", function(value) {
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

function readSearchField() {
    return $("#searchText").val();
}

function whenEnterIsPressed() {
    return new Promise(function(resolve, reject) {
        $(document).keypress(function(e) {
            if (e.which == 13) {
                resolve();
            }
        });
    });

}

function clearDiv(divToClear) {
    $(divToClear).empty();
}

function submitSearch() {
    clearDiv("#results");
    var searchText = readSearchField();
    var searchArgs = new SearchArgs(searchText);
    var search = new WikipediaSearch(searchArgs);
    search.searchWikipedia().then(function() {
        setResultsHTML(search.searchResults);
    });
}

function goToRandomArticle() {
    window.location = "https://en.wikipedia.org/wiki/Special:Random";
}

$(document).ready(function() {
    $("#searchText").on("keypress", function() {
        whenEnterIsPressed().then(function() {
            submitSearch();
        });
    });

    $("#searchButton").on("click", function() {
        clearDiv("#results");
        var searchText = readSearchField();
        var searchArgs = new SearchArgs(searchText, "title");
        var search = new WikipediaSearch(searchArgs);
        search.searchWikipedia().then(function() {
            setResultsHTML(search.searchResults);
        });
    });

    $("#randomArticleButton").on("click", function() {
        goToRandomArticle();
    })

    /* Autocomplete not working, will come back if I have a chance
    $("#searchText").on("keypress", function() {
        var currentText = $(this).val();
        if (currentText.length > 2) {
            var autoCompleteEntries = [];
            var searchArgs = new SearchArgs(currentText, "title", 8);
            var titleSearch = new WikipediaSearch(searchArgs)
            titleSearch.searchWikipedia().then(function() {
                var numberOfTitles = titleSearch.searchResults.length;
                for (var i = 0; i < numberOfTitles; i++) {
                    autoCompleteEntries.push(titleSearch.searchResults[i].title);
                }
            });
        }
        $("#searchText").autocomplete({
            source: autoCompleteEntries,
            minLength: 3
        });
    });
    */
});