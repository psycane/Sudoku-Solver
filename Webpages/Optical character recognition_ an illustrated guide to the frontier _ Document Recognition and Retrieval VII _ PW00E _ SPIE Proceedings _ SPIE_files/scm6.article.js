var atab = jQuery.url().param('atab'); //tab mode

$(document).ready(function () {

	/*************************/
	/*     content tabs      */
	/*************************/
	$("div.contentContainer").hide(); //Hide all content containers

	//grabs tab id from url if present and displays that tab
	if (atab > '0') {
		$(".tabNav .atab:nth-child(" + atab + ") a").addClass("selected").show(); //Activate first tab
		$("#tab" + atab).show(); //Show first tab content
	} else {
		$(".tabNav .atab:nth-child(1) a").addClass("selected").show(); //Activate first tab
		$("#tab1").show(); //Show first tab content
	}

    //On Click Event
	$(".tabNav div a").click(function () {
		var parentTab = $('.tabNav .atab');
		var currentTab = $(this).parent().attr('class');
		var activeTab = $(this).attr("href"); //Find the href attribute value to identify the active tab + content

		// Hide Links for Submit Comment and Submit Letter by default.
		$(".divSubmitCommentButton").hide();
		$(".divSubmitLetterButton").hide();

		// Get the access mode for this tab. This might be an initial/temp solution...
		var tabAccessMode = $(this).attr("name");

		// configurable tab solution - hiding the if check
		$(".tabNav div a").removeClass("selected");
		$(this).addClass("selected"); //Add "active" class to selected tab
		$(".contentContainer").hide(); //Hide all tab content

		// configurable tab solution: show tab content only if user is allowed to see.
		if (tabAccessMode == "CanAccess") {
		    $("#globalSignInAccessThisArticle").hide();
			$(activeTab).show(); //show the active ID content
		}
		else {
			//Need to identify a better way to identify the tab that was clicked instead of hardcoding as "#tab9", etc.
			//if comment tab, show submit comment link

			// Article Tab - Must display the abstract view.
			if (activeTab == "#tab1") {
				$(activeTab).show(); //show the active ID content
				$("#globalSignInAccessThisArticle").hide(); // No need to show DIV divSignInSubscriptionUpsell since Article Tab already has Sign IN + Subscription Sell
			}
			else {
				if (activeTab == "#tab9") {
					$(".divSubmitCommentButton").show();
				}
				//if Letter tab, show submit letter link
				if (activeTab == "#tab6") {
					$(".divSubmitLetterButton").show();
				}
				$("#globalSignInAccessThisArticle").show(); //show SignIn and Subscription Upsell section. SignIn will be suppressed if user is already logged in.
			}
		}

		// find column heights of content and sidebar and adjust
		equalHeight($(".eqColumn"));

		return false;

});

	/*************************/
	/*   affiliation link    */
	/*************************/
	$('.authorSection a').bind('click', function () {
		$("div.contentContainer").hide();
		$(".tabNav div a").removeClass("selected");
		$(".tabNav .atab:nth-child(1) a").addClass("selected").show();
		$("#tab1").show();
		equalHeight($(".eqColumn"));
	});

	$('.disp-formulalink').click(function () {
		$(this).parents('.tableDialog').close();
		$("div.contentContainer").hide();
		$(".tabNav div a").removeClass("selected");
		$(".tabNav .atab:nth-child(1) a").addClass("selected").show();
		$("#tab1").show();
		equalHeight($(".eqColumn"));
	});

	/*************************/
	/*    isAuthenticated    */
	/*************************/
	if (isAuthenticated) { // check to see if user is authenticated
		/*************************/
		/* submit a comment link */
		/*************************/
		$('.submitcomment').click(function () {
			$("div.contentContainer").hide();
			$(".tabNav div a").removeClass("selected");
			$(".tabNav .atab:nth-child(9) a").addClass("selected").show();
			$("#tab9").show();
		});

		/**********************/
		/*  save to myStuff   */
		/**********************/
		$('.saveMyStuff').click(function () {
			if (previewMode) {
				alert('Saving is disabled in preview mode.');
			} else {
				var _id = this.id;
				AddItemstoMyStuff(_id);
			}
		});
	} else {
		// perform cleanup for unauthenticated visitors
	}

	if (!isMobile) {
		/************************************/
		/*Text Size Enlarger of Content Page*/
		/************************************/
		$('#text1,#text2,#text3').click(function () {
			$(this).addClass('selected').siblings().removeClass('selected');
			var size = "100%"; // default|#text1
			var headingSize = "22px";
			switch ($(this).attr("id")) {
				case "text2":
					size = "110%";
					headingSize = "24px";
					break;
				case "text3":
					size = "120%";
					headingSize = "26px"
					break;
			}
			$(".aTitle").css({ 'font-size': headingSize });
			$(".contentSection, .contentHeaderContainer,.contentBodyContainer, .doi, .paragraphSection, .para, .authorNames, .figureLabel, .refContent, .refNum, .figureLabel strong").each(function () {
				$(this).css({ 'font-size': size });
			});
		});

		/*Work around for clean display of pubmed link and crossRef link*/
		$('.refContent').each(function () {
			var crossRef = $(this).find('.refText .crossrefDoi');

			if (crossRef.length) {
				$(this).find('.refText').empty();
				if ($(this).find('.pubmedLink').length)
					$(this).find('.refText').append('&#160;&#124;&#160;');
				$(this).find('.refText').append(crossRef);
			}
		});

		if (isAuthenticated) { // check to see if user is authenticated
			growTextarea($(".copyPaste"));
		}
	} // end mobile exception
});

function addtoMyStuffs(obj) {
	/*
	Tasks: TE-1216/1217
	For Figures and Tables - Add To My Account Links
	Personal User must be logged in to be able to add Figures or Tables to My Account.
	Redirect User to SignIn Popup page if Personal User is not logged in.
	*/
	var isPersonalUserLoggedIn = $get('hfPersonalUserLoggedIn').value;
	var redirectURL = $get('hfRedirectURLForMyPOLFiguresAndTables').value;

	if (isPersonalUserLoggedIn == "1") {
		AddItemstoMyStuff(obj.id, getArticleId());
	}
	else {
		openPopupWindow(redirectURL);
	}
}
function openPopupWindow(url) {
	var w = 650;
	var h = 350;
	var left = (screen.width / 2) - (w / 2);
	var top = (screen.height / 2) - (h / 2);
	var popupParms = ',top=' + top + ',left=' + left;
	window.open(url, "mywindow", "menubar=0,resizable=1,width=800,height=450" + popupParms);
}

function getArticleId() {
	return parseInt(document.getElementById('hfArticleId').value);
}

function MyStuff(sectionId, articleId) {
	this.SectionID = sectionId;
	this.ArticleID = articleId;
}

MyStuff.prototype.toJson = function () {
	return JSON.stringify(this);
}

function AddItemstoMyStuff(sectionId) {
	var articleId = getArticleId();
	var mystuff = new MyStuff(sectionId, articleId);

	var _url = location.protocol + "//" + location.host + "/article.aspx/AddItemstoMyStuff";

	$.ajax(
                {
                	type: "POST",
                	url: _url, // "../article.aspx/AddItemstoMyStuff",
                	data: mystuff.toJson(),
                	contentType: "application/json; charset=utf-8",
                	dataType: "json",
                	processData: false,

                	success:
                    function (d) {
                    	if (d.d[1].length > 0)
                    		location.href = d.d[1];
                    	else
                    		alert("Item successfully added to My Account");
                    },
                	error: function (c) { alert(c.status + ' ' + c.statusText); }
                }
            );
}

function growTextarea(selector) {
	if ($(selector).val() != undefined) {
		var lines = $(selector).val().split('\n');
		var width = 40;
		var height = 1;
		for (var i = 0; i < lines.length; i++) {
			var linelength = lines[i].length;
			if (linelength >= width) {
				height += Math.ceil(linelength / width);
			}
		}
		height += lines.length;
		$(selector).attr("rows", height);
	}
}