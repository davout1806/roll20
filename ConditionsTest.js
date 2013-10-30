
// Create suite
describe("Condition suite", function() {
    // global variable used within this suite
    var tokenId = "1";
    var davoutToken;
    var mockToken = {};

    // code that execute before each test/ spec (it function)
    beforeEach(function(){
        state.Davout.ConditionFW.TokensWithConditionObj = undefined;

        // create mock for function get() on mockToken object.
        // use this style of mock creation when function returns a value.
        mockToken.get = jasmine.createSpy();
        // specify what mocked function should return whenever it receives a specific argument.
        mockToken.get.when("name").thenReturn("Orc");
        mockToken.get.when("represents").thenReturn("c1");
        mockToken.get.when("subtype").thenReturn("token");

        // create mock for roll20 function getObj
        // use this style of mock creation when function returns a value.
        window.getObj = jasmine.createSpy();
        window.getObj.when("graphic", tokenId).thenReturn(mockToken);

        // Davout.ConditionFW.getTokenInstance(tokenId)
        davoutToken = Davout.ConditionFW.getTokenInstance(tokenId);

        // create mock for roll20 function sendChat and log
        // use this style of mock creation when function does NOT return a value.
        spyOn(window, 'sendChat');
        spyOn(window, 'log');
    });

    // test/spec
    // In this test I'm testing my code functions addCondition() and listAllConditions()
    it ("conditions can be added and removed", function(){
        // test: at this point I expect the return value from listAllConditions() on the davoutToken to return empty string;
        expect(davoutToken.listAllConditions()).toEqual("");

        // execute function
        davoutToken.addCondition(state.Davout.ConditionFW.ConditionLookup["fatigued"]);

        // test: now after adding a condition, I expect the return value from listAllConditions() on the davoutToken to return "Fatigued<br>";
        expect(davoutToken.listAllConditions()).toEqual("Fatigued<br>");
        davoutToken.addCondition(state.Davout.ConditionFW.ConditionLookup["fatigued"]);
        expect(davoutToken.listAllConditions()).toEqual("Fatigued<br>Fatigued<br>");
        davoutToken.removeCondition(state.Davout.ConditionFW.ConditionLookup["fatigued"]);
        expect(davoutToken.listAllConditions()).toEqual("Fatigued<br>");
        davoutToken.removeCondition(state.Davout.ConditionFW.ConditionLookup["fatigued"]);
        expect(davoutToken.listAllConditions()).toEqual("");

        // test that after the above code ran that sendChat() had been called with the specified strings.
        expect(sendChat).toHaveBeenCalledWith("API", "/w gm Condition Fatigued: 1 was added to Orc");
        expect(sendChat).toHaveBeenCalledWith("API", "/w gm Condition Fatigued: 2 was added to Orc");
        expect(sendChat).toHaveBeenCalledWith("API", "/w gm Condition Fatigued was removed from Orc");

        // test that after the above code ran that log() had been called with the specified strings.
        expect(log).toHaveBeenCalledWith("Added: condition Fatigued: 1 to Orc");
        expect(log).toHaveBeenCalledWith("Added: condition Fatigued: 2 to Orc");
        expect(log).toHaveBeenCalledWith("Removed: condition Fatigued removed from Orc");
    });

    it ("prevent adding a non-stackable condition when token already has the condition.", function(){
        davoutToken.addCondition(state.Davout.ConditionFW.ConditionLookup["blinded"]);
        expect(davoutToken.listAllConditions()).toEqual("Blinded<br>");
        expect(sendChat).toHaveBeenCalledWith("API", "/w gm Condition Blinded was added to Orc");

        davoutToken.addCondition(state.Davout.ConditionFW.ConditionLookup["blinded"]);
        expect(davoutToken.listAllConditions()).toEqual("Blinded<br>");
        expect(sendChat).toHaveBeenCalledWith("API", "/w gm Orc already has the non-stackable condition Blinded");
    });

    it ("stackable conditions can stack to max and then switch to another condition", function(){
        davoutToken.addCondition(state.Davout.ConditionFW.ConditionLookup["fatigued"]);
        davoutToken.addCondition(state.Davout.ConditionFW.ConditionLookup["fatigued"]);
        davoutToken.addCondition(state.Davout.ConditionFW.ConditionLookup["fatigued"]);
        davoutToken.addCondition(state.Davout.ConditionFW.ConditionLookup["fatigued"]);
        davoutToken.addCondition(state.Davout.ConditionFW.ConditionLookup["fatigued"]);

        expect(davoutToken.listAllConditions()).toEqual("Fatigued<br>Fatigued<br>Fatigued<br>Fatigued<br>Unconscious<br>");

    });
});

