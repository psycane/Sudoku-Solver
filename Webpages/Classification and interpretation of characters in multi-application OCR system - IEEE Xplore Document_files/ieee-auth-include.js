/**
 * 
 */

var A_POST_MSG_IFRAME_ID = "a-post-msg-iframe";
var A_POST_MSG_BIND_NAME = "a-auth-msg";

var A_COOKIE_OBSSO = "ObSSOCookie";
var A_COOKIE_IEEESSO = "ieeeSSO";

jQuery(function() {
	//a_initAuth();//xplore is using this file so validation of cookie not needed. Moved to ieee-metanav-include.js
});

function a_initAuth() {
	a_processAuth();	
}

function a_processAuth() {
	var obssoCookie = jQuery.cookie(A_COOKIE_OBSSO);
	var ieeessoCookie = jQuery.cookie(A_COOKIE_IEEESSO);
	
	if (typeof obssoCookie != "undefined" && 
			obssoCookie != null) {
		// validate obsso
		a_validateObSSO(obssoCookie);
	} else if (typeof ieeessoCookie != "undefined" && 
			ieeessoCookie != null) {
		// validate ieeesso
		a_validateIEEESSO(ieeessoCookie);
	}
}

function a_authenticateUser(username, password) {
	var authUrl = a_buildMashupUrl(A_AUTH_URL);
	
	if (username != null && username != "" && password != null && password != "") {
		username = username.replace(/</g, "&lt;").replace(/>/g, "&gt;");
		password = password.replace(/<\/(.|\n)*?>/, "").replace(/<(.|\n)*?>/, ""); 

		// init post message iframe
		if (jQuery("#" + A_POST_MSG_IFRAME_ID).length == 0) {
			jQuery("<iframe style='display:none'/>").attr({"id":A_POST_MSG_IFRAME_ID,
				"name":A_POST_MSG_IFRAME_ID,
				"src":authUrl}).load(function() {
				a_processAuthenticateUser(username, password);
			}).prependTo(jQuery("body"));
		} else {
			a_processAuthenticateUser(username, password);
		}
	} else {
		//TODO: Handle error conditions.
	}
}

function a_processAuthenticateUser(username, password) {
	var authUrl = a_buildMashupUrl(A_AUTH_URL);
	var parentUrl = window.location+"";
	
	var mashupUrl = "";
	if(typeof IEEE_MASHUP_ENGINE_SERVER_URL != 'undefined' && IEEE_MASHUP_ENGINE_SERVER_URL != ''){
		mashupUrl = IEEE_MASHUP_ENGINE_SERVER_URL; 
	}
	else{
		mashupUrl = IEEE_MASHUP_ENGINE_SERVER_URL_DEF;
	}
	
	var postMessage = {username : username, password: password, parentUrl:parentUrl, serverUrl:mashupUrl };
	pm({
		target : window.frames["" + A_POST_MSG_IFRAME_ID + ""],
		type : A_POST_MSG_BIND_NAME,
		data : postMessage,
		url : authUrl
	});
}


function a_validateObSSO() {
	var validatorUrl = a_buildMashupUrl(A_AUTH_VALIDATOR_URL);
	
	jQuery.ajax({
	      url: validatorUrl,
	      type: "GET",
	      data: ({
	    	  action : "validateObSSO"
	    	  }),
	      dataType: "jsonp",
	      success: function(data){
	    	  if(data != null && data.authStatus == "success"){
		    	  if(typeof mn_refreshMetaNav == 'function') {
		    		 mn_refreshMetaNav();
		    	  }
	    	  }
	    	  else {
	    		  var ieeessoCookie = jQuery.cookie(A_COOKIE_IEEESSO);
	    		  if (typeof ieeessoCookie != "undefined" && ieeessoCookie != null) {
	    			  a_validateIEEESSO(ieeessoCookie);
	    		  }
	    	  }
	    	  if(typeof mn_updateCartItemQtyIfNull == 'function') {
	    		  mn_updateCartItemQtyIfNull();
			  }
	    	  
	      },
		  error: function(data){
			  if(typeof mn_updateCartItemQtyIfNull == 'function') {
				  mn_updateCartItemQtyIfNull();
			  }
		  }
	   }
	);
}

function a_validateIEEESSO() {
	var validatorUrl = a_buildMashupUrl(A_AUTH_VALIDATOR_URL);
	
	jQuery.ajax({
	      url: validatorUrl,
	      type: "GET",
	      data: ({
	    	  action : "validateIEEESSO"
	    	  }),
	      dataType: "jsonp",
	      success: function(data){
	    	  if(data != null && data.authStatus == "success"){
		    	  if(typeof mn_refreshMetaNav == 'function') {
		    		 mn_refreshMetaNav();
		    	  }
	    	  }
	    	  if(typeof mn_updateCartItemQtyIfNull == 'function') {
	    		  mn_updateCartItemQtyIfNull();
			  }
	      },
		  error: function(data){
			  if(typeof mn_updateCartItemQtyIfNull == 'function') {
				  mn_updateCartItemQtyIfNull();
			  }
		  }
	   }
	);
}

function a_buildMashupUrl(url){
	var mashupUrl = "";
	if(typeof IEEE_MASHUP_ENGINE_SERVER_URL != 'undefined'){
		mashupUrl = IEEE_MASHUP_ENGINE_SERVER_URL + url; 
	}
	else{
		mashupUrl = IEEE_MASHUP_ENGINE_SERVER_URL_DEF + url;
	}
	return mashupUrl;
}




