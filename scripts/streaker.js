//Copyright 2018 Meadow Hill Software. Some rights reserved.
//Affero GPL 3 or Later

"use strict";
var oStreaker = {};

oStreaker.addMainEventListeners = function() {
    $('#flashcards')
        .on('change', oStreaker.handleFileUpload);
};

oStreaker.handleFileUpload = function(event) {
    event.stopPropagation();
    var aFiles = $('#flashcards').prop("files");
    var file = aFiles[0];
    var sFileName = file.name;
    var aFileName = sFileName.split(".");
    var sSetName = "";
    for (var w = 0; w < (aFileName.length - 1); w++) {
        var sWord = aFileName[w];
        sSetName += sWord;
    }
    oStreaker.sSetName = sSetName;
    oStreaker.reader = new FileReader();
    oStreaker.reader.readAsText(file);
    oStreaker.reader.onload = oStreaker.handleLoadedText;
};

oStreaker.handleLoadedText = function(event) {
    event.stopPropagation();
    var sText = oStreaker.reader.result;
    var aText = [];
    if (sText.indexOf("\n") !== -1) {
        aText = sText.split("\n");
    }
    var oSet = {};
    oSet.sName = oStreaker.sSetName;
    oSet.aCards = [];
    for (var l = 0; l < aText.length; l++) {
        var sLine = aText[l];
        if (sLine[0] === "!") {
            var oTempCard = {};
            var sDate = sLine.slice(1, -1);
            oTempCard.iDate = Number(sDate);
        } else if (sLine[0] === "?") {
            if (!oTempCard) {
                var oTempCard = {};
                oTempCard.iDate = 0;
            }
            var sQuestion = sLine.slice(1, -1);
            oTempCard.sQuestion = sQuestion;
        } else if (sLine[0] === "@") {
            var sAnswer = sLine.slice(1, -1);
            oTempCard.sAnswer = sAnswer;
            oSet.aCards.push(oTempCard);
        }
    }
    var sSet = JSON.stringify(oSet);
    $('#results').text(sSet);
};

oStreaker.reader = "";

oStreaker.addMainEventListeners();
