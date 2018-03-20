//Copyright 2018 Meadow Hill Software. Some rights reserved.
//Affero GPL 3 or Later

"use strict";
var oStreaker = {};

oStreaker.addMainEventListeners = function() {
    $('#flashcards')
        .on('click touchstart', oStreaker.handleFileUpload);
};

oStreaker.handleFileUpload = function(event) {
    event.stopPropagation();
    var oFiles = $('#flashcards').prop("files");
    var file = oFiles[0];
    oStreaker.reader = new FileReader();
    oStreaker.reader.readAsText(file);
    oStreaker.reader.onloadend = oStreaker.handleLoadedText;
    //console.log(oFiles[0]);
};

oStreaker.handleLoadedText = function(event) {
    event.stopPropagation();
    var sText = oStreaker.reader.result;
    $('#results').text(sText);
};

oStreaker.reader = "";

oStreaker.addMainEventListeners();
