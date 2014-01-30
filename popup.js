// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Global variable containing the query we'd like to pass to Flickr. In this
 * case, kittens!
 *
 * @type {string}
 */

//Global tracker
var QUERY = [];
var image_return_count = 0;
 
var kittenGenerator = {

  requestKittens: function() {
	//Reset the global variable
	image_return_count = 0;
	QUERY = [];
	var topCaptionElem = document.getElementById("top-caption-input");
	var bottomCaptionElem = document.getElementById("bottom-caption-input");
	var bp = chrome.extension.getBackgroundPage();
	var listOfMemes = matchWords();
	
	console.log("This is my shit nigga!");
	//Populate the drop down
	for (var i=0; i < listOfMemes.length; i++){
		console.log(listOfMemes[i]);
		$('<option/>').val(listOfMemes[i]).text(listOfMemes[i]).appendTo($('#meme-dropdown-list'));
	}
	console.log("no more shit nigga");
	
	$(document).on('change', '#meme-dropdown-list', function(e) {
		var selectedMeme = this.options[e.target.selectedIndex].text;
		$(".returned-image").hide();
		$("img[alt='" + selectedMeme + "']").show();
	});
	
	var generateButton = document.getElementById("generate-meme-link");
	
	generateButton.addEventListener("click", function() {
		var selectedMeme = $("#meme-dropdown-list").val();
		if ($("img[alt='" + selectedMeme + "']").length == 1){
			var top_caption = $("#top-caption-input").val();
			var bottom_caption = $("#bottom-caption-input").val();
			
			//CALL API TO GET LINK
			chrome.tabs.query({
			active: true,
			currentWindow: true
			}, function (tabs) {
				chrome.tabs.sendMessage(tabs[0].id, {
					meme: selectedMeme, caption1: top_caption, caption2: bottom_caption
				}, function (response) {
					console.log(response.farewell);
					
				});
				console.log("sent event at popup for button press");
				window.close();
			});
		}
		else{
			alert("please select only one meme");
		}
	});
	
	QUERY = matchWords();
	console.log(QUERY + " braahhh");
	topCaptionElem.value = bp.caption1;
	bottomCaptionElem.value = bp.caption2;
	if (QUERY){
		for (var i = 0; i < QUERY.length; i++){
			console.log(QUERY[i] + " nigga");
			var getMemePicAPI = 'http://version1.api.memegenerator.net/Generators_Search?';
			$.getJSON ( getMemePicAPI, {
				q : QUERY[i],
				pageSize : 1
			})
			.done( function (data){
				console.log(data);
				if (data.result.length > 0 ){
					var img = document.createElement('img');
					
					//Edit the image size
					var bigImageUrl = data.result[0].imageUrl;
					var beginPart = bigImageUrl.split('images/')[0];
					var tempString = bigImageUrl.split('images/')[1];
					var endPart = tempString.split('400x')[1];
					
					
					img.src = beginPart + "images/75x" + endPart;
					//img.src = data.result[0].imageUrl;
					console.log("this value got assigned: " + image_return_count);
					img.setAttribute('alt', QUERY[image_return_count]);
					img.setAttribute('class', 'returned-image');
					
					$("#meme-results").append(img);
					
					var currentMemeInDropDown = $("#meme-dropdown-list").val();
					$(".returned-image").hide();
					$("img[alt='" + currentMemeInDropDown + "']").show();
		
					console.log(img);
				}else
				{
					console.log("found nothing bro");
				}	
				image_return_count++;
			});
		}
	}
  },
 
  constructKittenURL_: function (photo) {
    return "http://farm" + photo.getAttribute("farm") +
        ".static.flickr.com/" + photo.getAttribute("server") +
        "/" + photo.getAttribute("id") +
        "_" + photo.getAttribute("secret") +
        "_z.jpg";
  },
  
  showOrHideImage: function(){
	
  }
};

// Run our kitten generation script as soon as the document's DOM is ready.
document.addEventListener('DOMContentLoaded', function () {
  kittenGenerator.requestKittens();
});


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.greeting == "hello"){
      sendResponse({farewell: "Got it in popup"});
	  console.log("omg works");
	  }
  });
  
  
function matchWords() {
    var bp = chrome.extension.getBackgroundPage();
    var meme = bp.meme;
    var memeList = bp.memeList;

    return memeList.filter(function (word) {

        var shorter, longer;
        if (meme.length > word.length) {
            shorter = word;
            longer = meme;
        } else {
            shorter = meme;
            longer = word;
        }

        for (var i = 0; i <= (longer.length - shorter.length); i++) {
            //calculates levenshtein distance
            var lev = longer.substring(i, i + shorter.length - 1).levenshtein(meme);

            //in this case the distance is in the iterval [0,1,2,3];
            if (lev >= 0 && lev <= 1) {

                return word;
            }
        }


    });
}