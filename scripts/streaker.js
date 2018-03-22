//Copyright 2018 Meadow Hill Software. Some rights reserved.
//Affero GPL 3 or Later

"use strict";
var oStreaker = {};

oStreaker.addMainEventListeners = function() {
    $('#flashcards')
        .on('change', oStreaker.handleFileUpload);
    $('#old-format')
        .on('change', oStreaker.handleFileUpload);
};

oStreaker.handleFileUpload = function(event) {
    event.stopPropagation();
    if ($(event.target).attr('id') === "old-format") {
        var aFiles = $('#old-format').prop("files");
    } else if ($(event.target).attr('id') === "flashcards") {
        var aFiles = $('#flashcards').prop("files");
    }
    var file = aFiles[0];
    var sFileName = file.name;
    var aFileName = sFileName.split(".");
    var sDeckName = "";
    for (var w = 0; w < (aFileName.length - 1); w++) {
        var sWord = aFileName[w];
        sDeckName += sWord;
    }
    oStreaker.sDeckName = sDeckName;
    oStreaker.sFileName = sDeckName + ".json";
    oStreaker.reader = new FileReader();
    oStreaker.reader.readAsText(file);
    if ($(event.target).attr('id') === "old-format") {
        oStreaker.reader.onload = oStreaker.handleOldFormat;
    } else if ($(event.target).attr('id') === "flashcards") {
        oStreaker.reader.onload = oStreaker.handleFlashcards;
    }
};

oStreaker.handleFlashcards = function(event) {
    event.stopPropagation();
    var sDeck = oStreaker.reader.result;
    var oDeck = JSON.parse(sDeck);
    var oDate = new Date();
    var iYear = oDate.getFullYear();
    var sYear = String(iYear);
    var iMonth = oDate.getMonth();
    var sMonth = String(iMonth);
    if (sMonth.length === 1) {
        sMonth = "0" + sMonth;
    }
    var iDate = oDate.getDate();
    var sDate = String(iDate);
    if (sMonth.length === 1) {
        sDate = "0" + sDate;
    }
    var sTimeString = sYear + sMonth + sDate;
    var iTimeNumber = Number(sTimeString);
    console.log(iTimeNumber);
    $('#question')
        .empty()
        .text(oDeck);
};

oStreaker.handleOldFormat = function(event) {
    event.stopPropagation();
    var sText = oStreaker.reader.result;
    var aText = [];
    if (sText.indexOf("\n") !== -1) {
        aText = sText.split("\n");
    }
    var oDeck = {};
    oDeck.sName = oStreaker.sDeckName;
    oDeck.aCards = [];
    for (var l = 0; l < aText.length; l++) {
        var sLine = aText[l];
        if (sLine[0] === "!") {
            var oTempCard = {};
            var sDate = sLine.slice(1, -1);
            oTempCard.iDate = Number(sDate);
        } else if (sLine[0] === "?") {
            if (!oTempCard || Object.keys(oTempCard).length === 0) {
                var oTempCard = {};
                oTempCard.iDate = 0;
            }
            var sQuestion = sLine.slice(1, -1);
            oTempCard.sQuestion = sQuestion;
        } else if (sLine[0] === "@") {
            var sAnswer = sLine.slice(1, -1);
            oTempCard.sAnswer = sAnswer;
            oDeck.aCards.push(oTempCard);
            oTempCard = {};
        }
    }
    var sDeck = JSON.stringify(oDeck);
    var flashcardFile = new Blob([sDeck], {type: 'application/json'});
    var url = URL.createObjectURL(flashcardFile);
    var link = $('<a />')
        .attr('href', url)
        .attr('download', oStreaker.sFileName)
        .text(oStreaker.sFileName);
    $('#file-link')
        .empty()
        .append(link);
};

oStreaker.reader = "";

oStreaker.addMainEventListeners();
