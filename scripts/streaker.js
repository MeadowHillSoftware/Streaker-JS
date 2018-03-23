//Copyright 2018 Meadow Hill Software. Some rights reserved.
//Affero GPL 3 or Later

"use strict";
var oStreaker = {};

oStreaker.addMainEventListeners = function() {
    $('#zero-days-button')
        .on('click', oStreaker.handleDaysButton);
    $('#one-day-button')
        .on('click', oStreaker.handleDaysButton);
    $('#two-days-button')
        .on('click', oStreaker.handleDaysButton);
    $('#three-days-button')
        .on('click', oStreaker.handleDaysButton);
    $('#seven-days-button')
        .on('click', oStreaker.handleDaysButton);
    $('#answer-button')
        .on('click', oStreaker.handleAnswerButton);
    $('#flashcards')
        .on('change', oStreaker.handleFileUpload);
    $('#old-format')
        .on('change', oStreaker.handleFileUpload);
    $('#save-button')
        .on('click', oStreaker.handleSaveButton);
};

oStreaker.generateQuestion = function() {
    var oDeck = oStreaker.oCurrentDeck;
    var aCards = oDeck.aCards;
    var iCurrentDate = oStreaker.getCurrentDate();
    var aIndices = [];
    for (var c = 0; c < aCards.length; c++) {
        var oCard = aCards[c];
        var iDate = oCard.iDate;
        if (iCurrentDate >= iDate) {
            aIndices.push(c);
        }
    }
    var iIndex = oStreaker.generateRandomNumber(aIndices.length);
    var iCardIndex = aIndices[iIndex];
    oStreaker.iDrawnCardIndex = iCardIndex;
    var oDrawnCard = aCards[iCardIndex];
    var sQuestion = oDrawnCard.sQuestion;
    $('#answer').empty();
    $('#question')
        .empty()
        .text(sQuestion);
};

oStreaker.generateRandomNumber = function(iLength) {
    return Math.round(Math.random() * (iLength - 1));
};

oStreaker.getCurrentDate = function() {
    var oDate = new Date();
    var iYear = oDate.getFullYear();
    var sYear = String(iYear);
    var iMonth = oDate.getMonth();
    iMonth++;
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
    return Number(sTimeString);
};

oStreaker.handleAnswerButton = function(event) {
    event.stopPropagation();
    var oDeck = oStreaker.oCurrentDeck;
    var aCards = oDeck.aCards;
    var iCardIndex = oStreaker.iDrawnCardIndex;
    var oCard = aCards[iCardIndex];
    $('#answer').text(oCard.sAnswer);
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

oStreaker.handleDaysButton = function(event) {
    event.stopPropagation();
    var sId = $(event.target).attr('id');
    if (sId !== "zero-days-button") {
        var iDelay = 1;
        if (sId === "two-days-button") {
            iDelay = 2;
        } else if (sId === "three-days-button") {
            iDelay = 3;
        } else if (sId === "seven-days-button") {
            iDelay = 7;
        }
        var aLeaps = [
            0, 
            4, 
            8, 
            12, 
            16, 
            20, 
            24, 
            28, 
            32, 
            36, 
            40, 
            44, 
            48, 
            52, 
            56, 
            60, 
            64, 
            68, 
            72, 
            76, 
            80, 
            84, 
            88, 
            92, 
            96
        ];
        var oDays = {
            1: 31, 
            2: 28, 
            3: 31, 
            4: 30, 
            5: 31, 
            6: 30, 
            7: 31, 
            8: 31, 
            9: 30, 
            10: 31, 
            11: 30, 
            12: 31
        };
        var oDate = new Date();
        var iYear = oDate.getFullYear();
        var sYear = String(iYear);
        var sPartialYear = sYear.substr(2);
        var iPartialYear = Number(sPartialYear);
        if (aLeaps.indexOf(iPartialYear) !== -1) {
            oDays["2"] = 29;
        }
        var iMonth = oDate.getMonth();
        iMonth++;
        var sMonth = String(iMonth);
        var iDate = oDate.getDate();
        var iNewDate = iDate + iDelay;
        var iNumberOfDays = oDays[sMonth]
        if (iNewDate > iNumberOfDays) {
            iNewDate = iNewDate - iNumberOfDays;
            iMonth++
            sMonth = String(iMonth);
            if (iMonth > 12) {
                iYear++;
                sYear = String(iYear);
                iMonth = 1;
                sMonth = String(iMonth);
            }
        }
        var sNewDate = String(iNewDate);
        if (sNewDate.length === 1) {
            sNewDate = "0" + sNewDate;
        }
        if (sMonth.length === 1) {
            sMonth = "0" + sMonth;
        }
        var sTimeString = sYear + sMonth + sNewDate;
        var iTimeNumber = Number(sTimeString);
        var oCurrentDeck = oStreaker.oCurrentDeck;
        var aCards = oCurrentDeck.aCards;
        var iDrawnCardIndex = oStreaker.iDrawnCardIndex;
        var oCard = aCards[iDrawnCardIndex];
        oCard.iDate = iTimeNumber;
    }
    oStreaker.generateQuestion();
};

oStreaker.handleFlashcards = function(event) {
    event.stopPropagation();
    var sDeck = oStreaker.reader.result;
    oStreaker.oCurrentDeck = JSON.parse(sDeck);
    oStreaker.generateQuestion();
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

oStreaker.handleSaveButton = function(event) {
    event.stopPropagation();
    var oDeck = oStreaker.oCurrentDeck;
    var sName = oDeck.sName;
    var sFileName = sName + ".json";
    var sDeck = JSON.stringify(oDeck);
    var flashcardFile = new Blob([sDeck], {type: 'application/json'});
    var url = URL.createObjectURL(flashcardFile);
    var link = $('<a />')
        .attr('href', url)
        .attr('download', oStreaker.sFileName)
        .text(oStreaker.sFileName);
    $('#saved-file')
        .empty()
        .append(link);
};

oStreaker.iDrawnCardIndex = undefined;

oStreaker.oCurrentDeck = undefined;

oStreaker.reader = undefined;

oStreaker.addMainEventListeners();
