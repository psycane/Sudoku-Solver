var membershipIncomplete;

function mc_isMembershipComplete(callbackFunction) {
	var memIncompleteUrl = "";
	if(typeof IEEE_MASHUP_ENGINE_SERVER_URL != 'undefined' && IEEE_MASHUP_ENGINE_SERVER_URL != ''){
		memIncompleteUrl = IEEE_MASHUP_ENGINE_SERVER_URL + MC_MEMBERSHIP_INCOMPLETE_URL; 
	}
	else {
		memIncompleteUrl = IEEE_MASHUP_ENGINE_SERVER_URL_DEF + MC_MEMBERSHIP_INCOMPLETE_URL;
	}
	
	jQuery.ajax({
		
	      url: memIncompleteUrl,
	      type: "GET",
	      dataType: "jsonp",
	      
	      success: function(data){
	    	  
	    	  if(typeof callbackFunction == "function"){
	    		 
	    		  callbackFunction(data);
	    	  }
	    	 
	      },
	      error: function(request){
	    	  if(typeof callbackFunction == "function"){
	    		  callbackFunction(null);
	    	  }
	      }
	
	   }
	);
	
}

function mc_validateQuote(callbackFunction,jsonString) {
	var memIncompleteUrl = "";
	if(typeof IEEE_MASHUP_ENGINE_SERVER_URL != 'undefined' && IEEE_MASHUP_ENGINE_SERVER_URL != ''){
		memIncompleteUrl = IEEE_MASHUP_ENGINE_SERVER_URL + MC_VALIDATEQUOTE_URL; 
	}
	else {
		memIncompleteUrl = IEEE_MASHUP_ENGINE_SERVER_URL_DEF + MC_VALIDATEQUOTE_URL;
	}
	
	jQuery.ajax({
		
	      url: memIncompleteUrl,
	      type: "GET",
	      data: ({
	    	  	"validateQuote" : jsonString
	    	  }),
	      dataType: "jsonp",
	      
	      success: function(data){
	    	  if(typeof callbackFunction == "function"){
	    		  callbackFunction(data);
	    	  }
	    	 
	      },
	      error: function(request){
	    	  if(typeof callbackFunction == "function"){
	    		  callbackFunction(null);
	    	  }
	      }
	
	   }
	);
	
}


function mc_createAnalyticsCookie() {
	var existingAppName = mc_getAnalyticsAppName();
	
	if(existingAppName == null){
		var appName = "";
		if(typeof IEEE_MASHUP_APPLICATION_NAME != "undefined"){
			appName = IEEE_MASHUP_APPLICATION_NAME;
		}
		
		if(typeof applicationName != "undefined"){
			appName = applicationName;
		}
		
		var analyticsObj = new Object();
		analyticsObj.appName = appName;
		var analyticsJSON = jQuery.toJSON(analyticsObj);
		jQuery.cookie('analyticsInfo', analyticsJSON, { path: '/', domain: DOMAIN_NAME });
	}
}


function mc_getAnalyticsAppName(){
	var applicationName = null;
	var analyticsInfoCookie = jQuery.cookie('analyticsInfo');
	
	if(typeof analyticsInfoCookie != "undefined" &&  analyticsInfoCookie != null && analyticsInfoCookie != "") {
		var analyticsInfo = jQuery.evalJSON(analyticsInfoCookie);
		if (analyticsInfo.appName != null) {
			applicationName = analyticsInfo.appName;
		}
	}
	return applicationName;
}

function mc_getUserInfoId(){
	var userInfoId = null;
	var userInfoCookie = jQuery.cookie('ieeeUserInfoCookie');
	
	if(typeof userInfoCookie != "undefined" &&  userInfoCookie != null && userInfoCookie != "") {
		var userInfo = jQuery.evalJSON(userInfoCookie);
		if (userInfo.userInfoId != null) {
			userInfoId = userInfo.userInfoId;
		}
	}
	return userInfoId;
}

function mn_trackEvent(si_n, si_p){
	
	if(typeof IEEE_MASHUP_CROSSDOMAIN_MODE == "undefined" || IEEE_MASHUP_CROSSDOMAIN_MODE == null){
		mn_trackEventCrossDomain(si_n,si_p);//WT_si_n
		setTimeout('donothing()', 350);
	}
	else {
		if(typeof dcsMultiTrack == "function"){
			if(si_p.indexOf('ORDERCONFIRMATION') != -1){
				dcsMultiTrack('WT.si_n',si_n,'WT.si_p',si_p,'WT.si_cs','1');//for conversion pages.
			}
			else {
				dcsMultiTrack('WT.si_n',si_n,'WT.si_p',si_p);//WT_si_n
			}
			setTimeout('donothing()', 250);
		}
	}
}

function trackCampaignEvent(campaignId){
	if(typeof dcsMultiTrack == "function"){
		dcsMultiTrack('WT.mc_id', campaignId);
	}
}

function trackPageView(uri,ti){
	if(typeof dcsMultiTrack == "function"){
		dcsMultiTrack('DCS.dcsuri',uri,'WT.ti',ti);
		setTimeout('donothing()', 250);
	}
}

function trackPageViewWithQueryParam(uri,qry,ti){
	if(typeof dcsMultiTrack == "function"){
		dcsMultiTrack('DCS.dcsuri',uri,'DCSext.gappspage',qry,'WT.ti',ti);
		setTimeout('donothing()', 250);
	}
}

function donothing(){
}

function trackCommerceTransaction(subtotal, partNumbers){
	var store = mc_getAnalyticsAppName();
	var uri = "/CommerceTransaction.html?WT.si_p="+ store + "&WT.tx_s="+ subtotal + "&WT.pn_sku="+ partNumbers;
	var ti = "CommerceTransaction";
	trackPageView(uri,ti);
}

function trackAddItem(partNumber, prodTitle){
	var store = mc_getAnalyticsAppName();
	var uri = "/AddItem.html?WT.tx_e="+ "add" + "&WT.si_p="+store+ "&WT.pn_sku="+ partNumber + "&prodTitle="+ prodTitle;
	var ti = "AddItem";
	trackPageView(uri,ti);
}

function trackRemoveItem(partNumber, prodTitle){
	var store = mc_getAnalyticsAppName();
	var uri = "/RemoveItem.html?WT.tx_e="+ "remove" +"&WT.si_p="+store+ "&WT.pn_sku="+ partNumber + "&prodTitle="+ prodTitle;
	var ti = "RemoveItem";
	trackPageView(uri,ti);
}

function trackAddingAddress(email, country){
	var uri = "/AddingAddress.html?WT.tx_e="+ "add_address" + "&email="+email+"&country="+country;
	var ti = "AddingAddress";
	trackPageView(uri,ti);
}

function trackEditingAddress(email, country){
	var uri = "/EditingAddress.html?WT.tx_e="+ "edit_address" + "&email="+email+"&country="+country;
	var ti = "EditingAddress";
	trackPageView(uri,ti);
}

function trackAddingCreditCard(email){
	var uri = "/AddingCreditCard.html?WT.tx_e="+ "add_creditcard" +"&email="+email;
	var ti = "AddingCreditCard";
	trackPageView(uri,ti);
}

function trackEditingCreditCard(email){
	var uri = "/EditingCreditCard.html?WT.tx_e="+ "edit_creditcard" +"&email="+email;
	var ti = "EditingCreditCard";
	trackPageView(uri,ti);
}

function trackAddingPromotionCode(promoCode, email){
	var uri = "/AddingPromotionCode.html?WT.tx_e="+ "add_promocode" + "&promoCode="+promoCode + "&email="+email;
	var ti = "AddingPromotionCode";
	
	setTimeout(function() {
		trackPageView(uri,ti);
	}, 200);
}

function trackAddingDonation(donationName, amount, email){
	var uri = "/AddingDonation.html?WT.tx_e="+ "add_donation" + "&donationName="+donationName + "&amount="+ amount + "&email="+email;
	var ti = "AddingDonation";
	trackPageView(uri,ti);
}

function trackCartEmail(email){
	var uri = "/CartEmail.html?WT.tx_e="+ "cart_email" +"&email="+email;
	var ti = "CartEmail";
	trackPageView(uri,ti);
}


function mn_trackEventCrossDomain(si_n, si_p){
	if(typeof dcsMultiTrack == "function"){
		var crossDomainWT = new WebTrends();
		crossDomainWT.dcsid = MN_WEBTRENDS_DCSID;
		crossDomainWT.domain = MN_WEBTRENDS_DOMAIN;
		crossDomainWT.dcsCollect();
		crossDomainWT.dcsMultiTrack('WT.si_n',si_n,'WT.si_p',si_p);//WT_si_n
		
	}
	
}















