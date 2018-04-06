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
    $('#current-deck')
        .on('click', oStreaker.handleCheckbox);
    $('#enter-button')
        .on('click', oStreaker.handleEnterButton);
    $('#erase-button')
        .on('click', oStreaker.handleEraseButton);
    $('#export-button')
        .on('click', oStreaker.handleExportButton);
    $('#flashcards')
        .on('change', oStreaker.handleFileUpload);
    $('#new-deck')
        .on('click', oStreaker.handleCheckbox);
    $('#old-format')
        .on('change', oStreaker.handleFileUpload);
    $('#save-button')
        .on('click', oStreaker.handleSaveButton);
};

oStreaker.clearElements = function() {
    $('#new-question').val('');
    $('#new-answer').val('');
    $('#current-deck').prop('checked', false);
    $('#new-deck').prop('checked', false);
};

oStreaker.exportDeck = function(oDeck, sText, sId) {
    var sName = oDeck.sName;
    var sFileName = sName + ".json";
    var sDeck = JSON.stringify(oDeck);
    var flashcardFile = new Blob([sDeck], {type: 'application/json'});
    var url = URL.createObjectURL(flashcardFile);
    var span = $('<span></span>').text(sText);
    var link = $('<a />')
        .attr('href', url)
        .attr('download', sFileName)
        .text(sFileName);
    $(('#' + sId))
        .empty()
        .append(span)
        .append(link);
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

oStreaker.handleCheckbox = function(event) {
    event.stopPropagation();
    var target = $(event.target);
    var bChecked = target.prop('checked');
    var sId = target.attr('id');
    if (bChecked === true) {
        if (sId === "current-deck") {
            $('#new-deck').prop('checked', false);
        } else {
            $('#current-deck').prop('checked', false);
            var lineBreak = $('<br />')
                .attr('id', 'temp-break');
            var name = $('<input/>')
                .attr('type', 'text')
                .attr('id', 'deck-name');
            var nameSpan = $('#name-span');
            lineBreak.insertBefore(nameSpan);
            nameSpan.text('Name: ');
            nameSpan.append(name);
        }
    } else {
        if (sId === "new-deck") {
            $('#name-span').empty();
            $('#temp-break').remove();
        }
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

oStreaker.handleEnterButton = function(event) {
    event.stopPropagation();
    var sQuestion = $('#new-question').val();
    var sAnswer = $('#new-answer').val();
    var bCurrent = $('#current-deck').prop('checked');
    var bNew = $('#new-deck').prop('checked');
    var cardMessage = $('#card-message');
    if (bCurrent === false && bNew === false) {
        cardMessage
            .empty()
            .text('Error: Select deck to add card to.');
    } else if (sQuestion === "") {
        cardMessage
            .empty()
            .text('Error: Add a question.');
    } else if (sAnswer === "") {
        cardMessage
            .empty()
            .text('Error: Add an answer.');
    } else {
        var oCard = {
            "iDate": oStreaker.getCurrentDate(),
            "sQuestion": sQuestion,
            "sAnswer": sAnswer
        };
        if (bCurrent === true) {
            var oDeck = oStreaker.oCurrentDeck;
            if (oDeck !== undefined) {
                oDeck.aCards.push(oCard);
            } else {
                cardMessage
                    .empty()
                    .text('Error: No deck currently loaded.');
            }
        } else {
            var sName = $('#deck-name').val()
            if (sName === "") {
                cardMessage
                    .empty()
                    .text('Error: Add a name for the deck.');
            } else {
                var oDeck = oStreaker.oNewDeck;
                if (oDeck === undefined) {
                    oStreaker.oNewDeck = {
                        "sName": sName, 
                        "aCards": []
                    };
                    oDeck = oStreaker.oNewDeck;
                } else if (oDeck["sName"] !== sName) {
                    oDeck["sName"] = sName;
                }
                oDeck.aCards.push(oCard);
            }
        }
    }
};

oStreaker.handleEraseButton = function(event) {
    event.stopPropagation();
    var bCurrent = $('#current-deck').prop('checked');
    var bNew = $('#new-deck').prop('checked');
    if (bCurrent === true) {
        oStreaker.oCurrentDeck = undefined;
    } else if (bNew === true) {
        oStreaker.oNewDeck = undefined;
    }
};

oStreaker.handleExportButton = function(event) {
    event.stopPropagation();
    var bCurrent = $('#current-deck').prop('checked');
    var bNew = $('#new-deck').prop('checked');
    if (bCurrent === true) {
        var oDeck = oStreaker.oCurrentDeck;
    } else if (bNew === true) {
        var oDeck = oStreaker.oNewDeck;
    }
    var sText = "Exported File: ";
    var sId = "export-link";
    oStreaker.exportDeck(oDeck, sText, sId);
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
    var sText = "Converted File: ";
    var sId = "convert-link";
    oStreaker.exportDeck(oDeck, sText, sId);
};

oStreaker.handleSaveButton = function(event) {
    event.stopPropagation();
    var oDeck = oStreaker.oCurrentDeck;
    var sText = "Updated File: ";
    var sId = "update-link";
    oStreaker.exportDeck(oDeck, sText, sId);
};

oStreaker.iDrawnCardIndex = undefined;

oStreaker.oCurrentDeck = undefined;

oStreaker.oNewDeck = undefined;

oStreaker.reader = undefined;

oStreaker.addMainEventListeners();

oStreaker.clearElements();
