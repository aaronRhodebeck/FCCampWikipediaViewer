describe("SearchArgs", function() {
    it("should take at least one but up to six values", function() {
        var testArgs = new SearchArgs(
            "Search Text",
            "Search Area",
            "Metadata Requested",
            "Properties Requested",
            "Starting Page",
            "Total Pages"
        );

        expect(testArgs.searchText).toBe("Search Text");
        expect(testArgs.srwhat).toBe("Search Area");
        expect(testArgs.srinfo).toBe("Metadata Requested");
        expect(testArgs.srprop).toBe("Properties Requested");
        expect(testArgs.sroffset).toBe("Starting Page");
        expect(testArgs.srlimit).toBe("Total Pages");
    });
})

describe("WikipediaSearch", function() {
    var searchArgs = new SearchArgs(
        "wikipedia search",
        "title",
        "suggestion",
        "snippet|hasrelated",
        "0",
        "1"
    );
    var testSearch = new WikipediaSearch(searchArgs);

    it("it's constructor should accept an object, and should make it a public property", function() {
        expect(searchArgs.testSearch).toBe("wikipedia search");
        expect(testSearch.searchArgs).toEqual(searchArgs);
    });

    it("should create the API call string", function() {
        var apiCall = testSearch.apiCall();
        expect(apiCall).toEqual(
            "action=query&list=search&" +
            "srsearch=wikipedia%20search&" +
            "srwhat=title&" +
            "srinfo=suggestion&" +
            "srprop=snippet|hasrelated&" +
            "sroffset=0&" +
            "srlimit=1"
        );
    });

    it("should call the wikipedia search API", function() {
        spyOn($, "getJSON");
        this.testSearch.searchWikipedia();

        expect($.getJSON).toHaveBeenCalled();
        expect($.getJSON).toHaveBeenCalledWith("https://en.wikipedia.org/w/api.php?");
    });

});