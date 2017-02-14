describe("Jasmine Test", function() {
    pending("Initial test of Jasmine, not necessary to the specific app");

    it("should have one successful test", function() {
        expect(true).toBe(true);
    });
    it("should have one failing test", function() {
        expect(true).toBe(false);
    });
});

describe("SearchArgs", function() {
    it("should take up to six values", function() {
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
    it("should set defaults for everything but the first value if not included", function() {
        var testArgs = new SearchArgs("Search Text");

        expect(testArgs.searchText).toBe("Search Text");
        expect(testArgs.srwhat).toBe("title");
        expect(testArgs.srinfo).toBe("suggestion");
        expect(testArgs.srprop).toBe("snippet|hasrelated");
        expect(testArgs.sroffset).toBe("0");
        expect(testArgs.srlimit).toBe("1");
    })
});

describe("WikipediaSearch", function() {
    var searchArgs = new SearchArgs("wikipedia search");
    var testSearch = new WikipediaSearch(searchArgs);

    it("it's constructor should accept an object, and should make it a public property", function() {
        expect(testSearch.searchArgs).toBe(searchArgs);
    });

    it("should create the API call string", function() {
        var apiCall = testSearch.apiCall;
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
        testSearch.searchWikipedia();

        expect($.getJSON).toHaveBeenCalled();
    });

});