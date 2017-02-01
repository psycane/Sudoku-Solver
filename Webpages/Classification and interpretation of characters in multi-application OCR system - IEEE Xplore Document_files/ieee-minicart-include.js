/**
 * 
 */

var MC_COOKIE_IEEE_USER_INFO = "ieeeUserInfoCookie";

var miniCartJson = null;
var inProcess = true;
var donationsOpened = true;
var itemsOpened = true;

//jQuery(document).ready(function() {
//});

function mc_initMiniCart(mc_success, mc_error) {
	ibpMiniCart.mc_renderMiniCartContainter();
	if (ibpMiniCart.mc_hasMiniCart()) {
		ibpMiniCart.mc_processMiniCart(false, mc_success, mc_error);
	}
}
		
function mc_refreshMiniCart(mc_success, mc_error) {
	ibpMiniCart.mc_processMiniCart(false,mc_success, mc_error);
}

function mc_forceRefreshMiniCart(mc_success, mc_error) {
	ibpMiniCart.mc_processMiniCart(true,mc_success, mc_error);
}

function mc_removeItem(lineItemId,mc_success, mc_error) {
	if (lineItemId != null && lineItemId != "") {
		ibpMiniCart.mc_processRemoveItem(lineItemId,null,null,null,mc_success, mc_error);
	}
}

function mc_addItem(partNum, qty, country, membershipType, quoteGrade, mc_success, mc_error){
	if (partNum != null && qty != null && qty > 0 && membershipType !=null && country != null) {
		var obj = '[{"partNum":"' + partNum + '","quantity":"' + qty + '","membershipType":"' 
					+ membershipType + '","quoteGrade":"'+ quoteGrade +'"' + '","country":"'+ country +'"}]'; 
		ibpMiniCart.mc_addItemQueue(obj, mc_success, mc_error);
	} else {
		//TODO error handling
	}
}

//This method is deprecated.
function mc_addItem(partNum, qty, country, membershipType, quoteGrade, registrationType, mc_success, mc_error){
	if (partNum != null && qty != null && qty > 0 && membershipType !=null && country != null) {
		var obj = '[{"partNum":"' + partNum + '","quantity":"' + qty + '","membershipType":"' 
					+ membershipType + '","quoteGrade":"'+ quoteGrade +'"' + '","registrationType":"'+ registrationType +'"' + '","country":"'+ country +'"}]'; 
		ibpMiniCart.mc_addItemQueue(obj, mc_success, mc_error);
	} else {
		//TODO error handling
	}
}

function mc_addItems(items, mc_success, mc_error){
	//items is an array of json string eg: [{"partNum" : "1222", "quantity":"1", "country":"US", "membershipType" : "IEEE"}]
	
	if(items != null){
		ibpMiniCart.mc_addItemQueue(items, mc_success, mc_error);
	}
	else {
		//TODO error handling
	}
}

function mc_disable_checkout_btn(disabled){
	if(disabled){
		jQuery("#proceed-checkout-button").switchClass("button-large","button-large-disable");
		jQuery("#proceed-checkout-button").attr("disabled", "disabled");
	}
	else{
		jQuery("#proceed-checkout-button").switchClass("button-large-disable","button-large");
		jQuery("#proceed-checkout-button").removeAttr("disabled"); 
	}
}

function mc_render_membership_incomplete_msg(message){
	jQuery("#membership-incomplete-custom-msg").html(message);
}

function isValidValue(val){
	var valid = false;
	if(val != null && val != "" && val != "undefined"){
		valid = true;
	}
	return valid;
}

function mc_getIeeeUserInfo() {
	var ieeeUserInfo = null;
	
	var mc_ieeeUserInfoCookie = jQuery.cookie(MC_COOKIE_IEEE_USER_INFO);
	if (typeof mc_ieeeUserInfoCookie != "undefined"
			&& mc_ieeeUserInfoCookie != null && mc_ieeeUserInfoCookie != "") {
		ieeeUserInfo = jQuery.evalJSON(mc_ieeeUserInfoCookie);
	}
	
	return ieeeUserInfo;
}



function isPartNumberExists(partNumber){
	var partNumExists = false;
	
	if (miniCartJson != null && miniCartJson.itemGroups != null && miniCartJson.itemGroups.length != 0) {
		
		
		jQuery.each(miniCartJson.itemGroups, function(){
			var itemGroup = this;
				
			jQuery.each(itemGroup.items, function(){
				var item = this;
				var pNumber = item.partNumber;
				
				if(!partNumExists){
					if(partNumber == pNumber){
						partNumExists = true;
					}
				}
			
			});
		});
	}
	return partNumExists;
}

function getMembershipGrade(){
	var xGrade = null;
	if(isPartNumberExists("MEMIEEE500")){
		xGrade = miniCartJson.grade;
	}
	return xGrade;
}


/*
 * IBP UI common javascript utility functions Author: Nagarajan Ramalingam
 * <n.ramalingam@ieee.org> Date: 15th Sep 20011
 */
var ibpMashupUtils = {
		defIbpLoadingTxt:"Loading...",
		isOldIEBrowser : function() {
			var oldBrowser = false;
			if (navigator.appVersion.indexOf("MSIE") != -1) {
				var appVersion = navigator.appVersion.split("MSIE");
				var version = parseFloat(appVersion[1]);
				if (version <= 6) {
					oldBrowser = true;
				}
			}
			return oldBrowser;
		},
		getProgTxtWidth: function(modalWidth, inProgressText){
			
			var lTxtMinWidth = 40;
			var lTxtMaxWidth = modalWidth-100;
			var lTxtWidth = lTxtMinWidth;
			if (typeof inProgressText != "undefined") {			
				if(jQuery("#ibpTLoadTxt").length==0){
					var progTxtTDiv = "<div id='ibpTLoadTxt' style='float:left;visibility:hidden;display:block;font-size:12px;font-weight:bold;'>&nbsp;</div>";
					jQuery("body").append(progTxtTDiv);
				}
				
				$ibpTLoadTxt = jQuery("#ibpTLoadTxt");
				$ibpTLoadTxt.html(inProgressText);
				lTxtCalcWidth = $ibpTLoadTxt.width()+40;
				if(lTxtCalcWidth>lTxtMaxWidth){
					lTxtWidth = lTxtMaxWidth;
				}else if(lTxtCalcWidth<lTxtMinWidth){
					lTxtWidth = lTxtMinWidth;
				}else{
					lTxtWidth = lTxtCalcWidth;
				}					
			}
			return lTxtWidth;
			
		},
		showIbpProgressImg : function(respId, inProgressText, delayTextInfo) {
			try {
				var $ibpAjaxLoading  = null;
				var $respId = null;
				var loadingText = "&nbsp;";
				if(respId=="body"){
					respId = "page-container";
				}
				if(typeof respId == "string"){
					$respId = jQuery("#" + respId);
				}else{
					$respId = respId;
				}	
				if (($respId == null) || ($respId.length == 0)
						|| ($respId.prev("div.ibpAjaxLoading").length > 0)) {
					return;
				}
				
				var modalWidth = $respId.width()
								+ ibpMashupUtils.getIbpPadding($respId.css("padding-left"))
								+ ibpMashupUtils.getIbpPadding($respId.css("padding-right"));
				
				var lTxtWidth = ibpMashupUtils.getProgTxtWidth(modalWidth, inProgressText);
				var lTxtLeft = (modalWidth - lTxtWidth)/2;
				var lStyleWidth = lTxtWidth;
				var lTxtWidth = lTxtWidth-38;
				
				//default with no text
				if(lTxtWidth<=40){
					lStyleWidth = 30;
					lTxtWidth = 1;
				}			
				if ((typeof inProgressText != "undefined") &&
					(jQuery.trim(inProgressText).length>0)) {
					loadingText = inProgressText;
				}
				var $modalDiv ="";
				var $ibpAjaxLoading="";
				if (respId == "page-container") {												
					
					lTxtLeft +=	jQuery("#page-container").offset().left;
					$modalDiv = jQuery("<div class='ibpAjaxLoadingMask' style='top:0;width:100%;height:100%;position:fixed;'>&nbsp;</div>");
					
					$ibpAjaxLoading = jQuery("<div class='ibpAjaxLoading' style='width:100%;position:fixed;height:100%;left:0;top:0'>"+
													"<div style='top:48%;left:"+(lTxtLeft)+"px;"+ "width:"+lStyleWidth+"px; position: fixed;font-weight:bold;' class='ibpAjaxLoadingSec'>"+
													"<div class='ibpAjaxLoadingText' style='width:"+lTxtWidth+"px;'>"+loadingText+"</div>"+
												"</div>"+
											"</div>");
								
					$respId.before($modalDiv);
					$respId.before($ibpAjaxLoading);
					
				}else{								
					
					var modalHeight = $respId.height()
										+ ibpMashupUtils.getIbpPadding($respId.css("padding-top"))
										+ ibpMashupUtils.getIbpPadding($respId.css("padding-bottom"));
					if(modalHeight<=30){
						modalHeight = 30;
					}				
					
					var lTxtTop = (modalHeight / 2) - 10;
					
					var secStyle = "height:" + modalHeight + "px;width:" + modalWidth
									+ "px;position:absolute;padding:0;margin-left:"+ibpMashupUtils.getIbpPadding($respId.css("left"))+"px;";						
					
					var loadingStyle = "position:absolute;top:" + lTxtTop
										+ "px;left:" + lTxtLeft + "px;width:"+(lStyleWidth)+"px;";
					var loadingTxtStyle = "width:"+(lTxtWidth)+"px;";
					
					$ibpAjaxLoading = jQuery("<div class='ibpAjaxLoading' style='" + secStyle
									+ "'><div class='ibpAjaxLoadingSec' style='" + loadingStyle + "'><div class='ibpAjaxLoadingText' style='"+loadingTxtStyle+"' >" + loadingText
									+ "</div></div></div>");
									
					$modalDiv = "<div class='ibpAjaxLoadingMask' style='" + secStyle+"'>&nbsp;</div>";
					
					$respId.before($modalDiv);
					$respId.before($ibpAjaxLoading);
				}
				
				showIbpProgText = function(delayTimeout, delayMsg){
					
					var showIbpProgresText = function() {
						var $ajaxLoadingText = $ibpAjaxLoading.find('div.ibpAjaxLoadingText');
						if(typeof delayMsg != "undefined"){							
							var ldTxtWidth = ibpMashupUtils.getProgTxtWidth(modalWidth, delayMsg);
							var ldTxtLeft = (modalWidth - ldTxtWidth)/2;
							$ibpAjaxLoading.find('.ibpAjaxLoadingSec').css({'width' : ldTxtWidth+'px', 'left' : ldTxtLeft+'px'});
							$ibpAjaxLoading.find('.ibpAjaxLoadingText').css({'width' : ldTxtWidth-10+'px'});
							$ajaxLoadingText.html(delayMsg);
						}
						$ajaxLoadingText.css('display', 'block');
					};
					setTimeout(showIbpProgresText, delayTimeout);
					
				};
				
				$ibpAjaxLoading.find('div.ibpAjaxLoadingText').css('display', 'block');
				if (typeof inProgressText == "undefined") {				
					showIbpProgText(2000, ibpMashupUtils.defIbpLoadingTxt);
				}
				
				if(typeof delayTextInfo != "undefined"){
					
					if(jQuery.isArray(delayTextInfo)){
						jQuery.each(delayTextInfo, function(index, dtextInfo) { 
							showIbpProgText(dtextInfo.delayTextInMillis, dtextInfo.delayTextMsg);  
						});
					}else{
						showIbpProgText(delayTextInfo.delayTextInMillis, delayTextInfo.delayTextMsg);	
					}
					
				}
			} catch (e) {
				// dont do anything let it go
			}
		},
		clearIbpProgressImg : function(respId) {
			try {
				if (typeof respId != "undefined" && respId=="body") {				
					var $body = jQuery("body");
					$body.find(">div.ibpAjaxLoading, >div.ibpAjaxLoadingMask").remove();
				}else if (typeof respId != "undefined") {
					var $respId = jQuery("#" + respId);
					if ($respId == null || $respId.length == 0) {
						return;
					}			
					$respId.prev("div.ibpAjaxLoading").remove();
					$respId.prev("div.ibpAjaxLoadingMask").remove();
				} else {
					jQuery("div.ibpAjaxLoading, div.ibpAjaxLoadingMask").remove();				
				}
			} catch (e) {
				// dont do anything let it go
			}
		},
		getIbpPadding : function(paddingStr) {
			var intVal = 0;		
			try {
				if(paddingStr=="auto"){
					intVal = 0;
				}else{
					intVal = parseInt(paddingStr.replace("px", ""));	
				}			
			} catch (e) {
				intVal = 0;
			}
			return intVal;
		}
};

function mc_trackEvent(si_n, si_p){
	if(typeof dcsMultiTrack == "function"){
		dcsMultiTrack('WT.si_n',si_n,'WT.si_p',si_p);//WT_si_n
		setTimeout('donothing()', 250);
	}
}

function mc_buildMashupUrl(url){
	var mashupUrl = "";
	if(typeof IEEE_MASHUP_ENGINE_SERVER_URL != 'undefined' && IEEE_MASHUP_ENGINE_SERVER_URL != ''){
		mashupUrl = IEEE_MASHUP_ENGINE_SERVER_URL + url; 
	}
	else{
		mashupUrl = IEEE_MASHUP_ENGINE_SERVER_URL_DEF + url;
	}
	return mashupUrl;
}

function donothing(){
}

function trackProceedToCheckout(){
	if(typeof mc_trackEvent == "function"){
		  var analyticsAppName = mc_getAnalyticsAppName();
		  mc_trackEvent(analyticsAppName+'_ADDTOCART',analyticsAppName+'_PROCEED_TO_CHECKOUT');//Webtrends tracking
		  mc_trackEvent('ADDTOCART','PROCEED_TO_CHECKOUT');//Webtrends tracking
	}
	
	if(typeof ntptEventTag == "function"){
		var eventString = 'ev=IBP_PT_checkout&evType=IBPCART';
		if(typeof NTPT_PGEXTRA != "undefined" && NTPT_PGEXTRA != null){
			eventString = eventString + "&" + NTPT_PGEXTRA;
		}
			
		ntptEventTag(eventString);
	}
}


var ibpMiniCart = {
		
		mc_processMiniCart : function (forceRefresh, mc_success, mc_error) {
			ibpMiniCart.mc_renderMiniCartMsg(MC_LOADING_MSG);
			inProcess = true;
			
			var applicationName = "";
			if(typeof IEEE_MASHUP_APPLICATION_NAME != "undefined"){
				applicationName = IEEE_MASHUP_APPLICATION_NAME;
			}
			var timeout = (typeof MC_TIMEOUT != "undefined" && MC_TIMEOUT != null) ? MC_TIMEOUT : MC_TIMEOUT_DEF;
			
			ibpMiniCart.mc_loadDelayMessage();
			var mashupUrl = mc_buildMashupUrl(MC_MINICART_SERVLET_URL);
			jQuery.ajax({
			      url: mashupUrl,
			      type: "GET",
			      data: ({
			    	  "action" : "getMiniCart",
			    	  "appName": applicationName,
			    	  "forceRefresh" : forceRefresh
			    	  }),
			      dataType: "jsonp",
			      crossDomain: true,
			      timeout : timeout,
			      success: function(data){
			    	  inProcess = false;
			    	  if (data != null ) {
			    		  if(data.errorMsg == undefined || data.errorMsg == ""){
			    			  miniCartJson =  data;
			    			  ibpMiniCart.mc_renderMiniCart(data);
			    			  ibpMiniCart.mc_bindMiniCartEvents();
			    			  if(typeof mn_updateCartItemQty != "undefined"){//to update the qty in meta nav
				    			  mn_updateCartItemQty();
				    		  }
				    		  if(typeof mc_success == "function"){
				 	    		 mc_success(data);
				 	    	  }
			    	  	  }
				    	  else{
				    		  ibpMiniCart.mc_renderMiniCartError(data);
				    	  }
			    	  
			    	  }
			    	  else{
			    		  ibpMiniCart.mc_clearMiniCart();
			    	  }
			    	  ibpMashupUtils.clearIbpProgressImg("mc_minicart-container");
			    	  
			      },
				  error: function(request, text, errorThrown){
					  inProcess = false;
					  
					  
					  if(request.readyState == 0 && errorThrown == '') {
						  return; // it's not really an error
					  } 
					  else{
						  if(typeof mc_error == "function"){
				    		  mc_error(request);
				    	  }
						  
						  if(request.responseText != undefined){
							  ibpMiniCart.mc_renderMiniCartError(request.responseText,mc_error);
						  }
					  }
					  ibpMashupUtils.clearIbpProgressImg("mc_minicart-container");
					  
				  }	
			   }
			);
		},
		
		mc_hasMiniCart : function () {
			var hasMiniCart = false;

			var ieeeUserInfo = mc_getIeeeUserInfo();
			
			if (ieeeUserInfo != null) {
			
				if(isValidValue(ieeeUserInfo.anonymousCartId) || isValidValue(ieeeUserInfo.userInfoId)){
					hasMiniCart = true;
				}
			}
			
			return hasMiniCart;
		},
		
		mc_bindMiniCartEvents : function () {
			
			
			jQuery('.mc-remove-item-link').click(function(){
				
				jQuery("#mc-items-added").html('');
				jQuery("#mc-items-added").hide();
				
				var itemrow = jQuery(this).closest('.mc-cart-item-row');
				var itemrowH = jQuery(itemrow).css('height');
				var itemrowW = jQuery(itemrow).css('width');
				var itemrowp = jQuery(itemrow).position();
				var itemrowT = itemrowp.top -15;
				var itemrowTop =  "-18px";
				
				
				var itemrowL = itemrowp.left;
				var itemRemoveFlashNotice = jQuery(this).closest('.mc-cart-item-row').find('.mc-remove-confirmation');
				var flashNoticeHt = 50;
				if(itemrow.find("span.mc-item-qty").length>0){
					flashNoticeHt = 77;
				}
				jQuery(itemRemoveFlashNotice).css({
					position: 'relative',
					float: 'left',
					width: itemrowW,
					height: flashNoticeHt+"px",
					top:itemrowTop
					
				});
				var middleWidth = jQuery(itemrow).width()-30 + 'px';
				var middleHeight = flashNoticeHt+'px';
		        

		        jQuery(itemRemoveFlashNotice).children().wrapAll('<div class="mc-remove-confirmation-content" style="width:' + middleWidth + ';"></div>');
				jQuery(itemRemoveFlashNotice).children('.mc-remove-confirmation-content').wrap('<div class="mc-content-shell" style="height:' + middleHeight + '"></div>');
				jQuery(itemRemoveFlashNotice).children('.mc-content-shell').prepend('<div class="mc-left-shell"></div>').append('<div class="mc-right-shell"></div>');
				jQuery(itemRemoveFlashNotice).prepend('<div class="mc-top-shell"></div>').append('<div class="mc-bottom-shell"></div>');
				jQuery(itemRemoveFlashNotice).children('.mc-top-shell').html('<div class="mc-top-left-shell"></div><div class="mc-top-middle-shell" style="width:' + middleWidth + ';"></div><div class="mc-top-right-shell"></div><div class="clearit">&nbsp;</div>');
				jQuery(itemRemoveFlashNotice).children('.mc-bottom-shell').html('<div class="mc-bottom-left-shell"></div><div class="mc-bottom-middle-shell" style="width:' + middleWidth + ';"></div><div class="mc-bottom-right-shell"></div>');
				jQuery(itemRemoveFlashNotice).show();
				
				// disable proceed to checkout
				jQuery('#mc-proceed-checkout-button').removeAttr('disabled').attr('src','/images/button-proceed-checkout-dis.gif');
				
				//return false;
			});
			
			jQuery('.mc-cancel-remove-item').click(function(){
				var itemRemoveFlashNotice = jQuery(this).closest('.mc-remove-confirmation');
				jQuery(itemRemoveFlashNotice).css({position:'relative',height:'0px',width:'0px'});
				jQuery(itemRemoveFlashNotice).append(jQuery(itemRemoveFlashNotice).find('.mc-remove-confirmation-content').children());
				jQuery(itemRemoveFlashNotice).children('.mc-top-shell, .mc-content-shell, .mc-bottom-shell').remove();
				jQuery(itemRemoveFlashNotice).hide();
				
				// re-enable proceed to checkout
				jQuery('#mc-proceed-checkout-button').removeAttr('disabled').attr('src','/images/button-proceed-checkout.gif');

				return false;
			});


			jQuery('.mc-remove-item-confirm-action').click(function(){
		            
						var cDiv = jQuery(this).closest('.mc-cart-item-row');
						var lineItemIdStr = cDiv.attr("callback-data");
		            	
						var pipeIndex = lineItemIdStr.indexOf("|");
						var hashIndex = lineItemIdStr.indexOf("#");
						var caratIndex = lineItemIdStr.indexOf("~");
						
		            	var lineItemId = lineItemIdStr.substring(15,pipeIndex);//remove mc_item-row-id-
		            	
		            	var partNumber = lineItemIdStr.substring(pipeIndex+1,hashIndex);//remove mc_item-row-id-
		            	
		            	var productType = lineItemIdStr.substring(hashIndex+1, caratIndex);//remove mc_item-row-id-
		            	
		            	var productDescription = lineItemIdStr.substring(caratIndex+1);//remove mc_item-row-id-
		            	
		            	
		            	ibpMashupUtils.showIbpProgressImg("mc_minicart-container", ""); 
		            	ibpMiniCart.mc_processRemoveItem(lineItemId, partNumber, productType, productDescription);
		            
				
					
				// re-enable proceed to checkout
				jQuery('#proceed-checkout-button').attr('disabled','').attr('src','/images/button-proceed-checkout.gif');

				// Call a Java component to recalculate the cart sub-totals, totals and other dependencies
				
				// ? What if removing the only row left?
				return false;
			});


		    // identify active and hover states for proceed to check out button
		    jQuery('#proceed-checkout-button').hover(function(){
		        jQuery('#proceed-checkout-button').attr('src','/images/button-proceed-checkout-hov.gif');
		    },function(){
		        jQuery('#proceed-checkout-button').attr('src','/images/button-proceed-checkout.gif');
		    }).mousedown(function(){
		        jQuery('#proceed-checkout-button').attr('src','/images/button-proceed-checkout-act.gif');
		    });

		    // disable removal of item if another remove action has been initiated
		    jQuery('.mc-remove-item-link').click(function(evt){
		        if(jQuery('.mc-remove-confirmation').is(':visible')){
		            jQuery('.mc-remove-item-link').undelegate("click");
		            evt.preventDefault();
		            return false;
		        }
		    });
		    jQuery('#mc-proceed-checkout-button').click(function(evt){
		    	var checkoutUrl = mc_buildMashupUrl(MC_MINICART_CHECKOUT_URL);
		    	
		    	if(typeof refSite != 'undefined' && typeof refSiteName != 'undefined'){
		    		var closeurl = window.location.href;
		    		var encCloseurl;
		    		if (closeurl != null && closeurl != "") {
		    			encCloseurl = encodeURIComponent(closeurl);
		    		}
		    		
		    		checkoutUrl += "?refSite="+refSite + "&refSiteName="+refSiteName + "&closeurl="+encCloseurl; 
		    	}
		    	
		    	
		    	trackProceedToCheckout();
		    	
		    	var millisecondsToWait = 200;
		    	setTimeout(function() {
		    		window.location.href = checkoutUrl;
		    	}, millisecondsToWait);

		    	
		    });
		    
		    jQuery('#mc-signin-link').click(function(){
		    	if(jQuery('#singleSignOnFlyout') != "" && jQuery('#singleSignOnFlyout') != undefined){
		    		jQuery('#singleSignOnFlyout').show();
		    	}
		    	else{
		    		try{
		    			javascript:Modal.show('/xpl/mwMemberSignIn.jsp');
		    		}
		    		catch(e){
		    			//do nothing
		    		}
		    	}
		    });
		    
		    
		    
		    jQuery('#toggleDonations').click(function(){
		    	if(!donationsOpened){
		    		jQuery('div[id=mc-donation-items]').show();
		    		
		    		jQuery('#toggleDonations').removeClass("mc-toggle-control-closed");
		    		jQuery('#toggleDonations').addClass("mc-toggle-control-opened");
		    		jQuery('.mc-donation-total').hide();
		    		jQuery('#mc-donation-qty').hide();
		    		donationsOpened = true;
		    	}
		    	else{
		    		jQuery('div[id=mc-donation-items]').hide();
		    		jQuery('#toggleDonations').removeClass("mc-toggle-control-opened");
		    		jQuery('#toggleDonations').toggleClass("mc-toggle-control-closed");
		    		jQuery('.mc-donation-total').show();
		    		jQuery('#mc-donation-qty').show();
		    		donationsOpened = false;
		    	}
		    	return false;
		    });
		    
		    jQuery('#toggleItems').click(function(){
		    	if(!itemsOpened){
		    		jQuery('#toggleItems').removeClass("mc-toggle-control-closed");
		    		jQuery('#toggleItems').addClass("mc-toggle-control-opened");
		    		jQuery('.mc-items-total').hide();
		    		jQuery('#mc-items-qty').hide();
		    		jQuery('.mc-items-row').show();
		    		itemsOpened = true;
		    	} else{
		    		jQuery('#toggleItems').removeClass("mc-toggle-control-opened");
		    		jQuery('#toggleItems').addClass("mc-toggle-control-closed");
		    		jQuery('.mc-items-total').show();
		    		jQuery('#mc-items-qty').show();
		    		jQuery('.mc-items-row').hide();
		    		itemsOpened = false;
		    	}
		    	return false;
		    });
		},
		
		mc_renderMiniCart : function (miniCart) {
			
			
			if (miniCart.itemGroups == null || miniCart.itemGroups.length == 0) {
				jQuery("#mc_minicart-container").html("");
			}
			
			if ((miniCart.itemGroups != null && miniCart.itemGroups.length != 0)|| (miniCart.donations != null && miniCart.donations.length != 0)) {
				jQuery("#mc_minicart-container").html(
						'<div class="callout-panel mc-product-cart">'+
						'<h3 class="mc-header first-rail">My Cart</h3>'+
					    '<div class="mc-content">'+
					    
					    '<div id="mc-items-added" class="mc-confirmation-msg">'+
					    '<p>Items have been added to the cart</p>'+
					    '</div>'
				);
				
				
				// render Items
				if (miniCart.itemGroups != null && miniCart.itemGroups.length != 0) {
					var itemsHeader = 	'<div class="mc-section">' +	
					'<div class="mc-sub-section">' +
					'<div class="mc-items-heading">' +
					'<a title="Open the Items Panel" class="items-toggle mc-toggle-control mc-toggle-control-opened" href="#" id="toggleItems">&nbsp;</a>' +
					'Items<span id="mc-items-qty" style="display:none">('+ miniCart.itemsQuantity+')'+ '</span>' +
					'</div>' +
					'<div class="mc-items-total" style="display:none">US$' + miniCart.itemsTotalAmount + '</div>' +
					'<div class="mc-clearit">&nbsp;</div>' +
					'<div style="border-top: 1px solid #c2c2c2; height:0px; width: 102%;">&nbsp;</div>' +
					'<div class="mc-clearit">&nbsp;</div>' +
					'</div>';
					jQuery(".mc-content").append(itemsHeader);



					jQuery.each(miniCart.itemGroups, function(){
						var itemGroup = this;		


						// render items in sections
						jQuery.each(itemGroup.items, function(){
							var item = this;

							var monthlySub = "";
							var assetType = item.assetType;
							var prodType = item.productType;

							if(assetType != null && assetType != "undefined" && assetType == "Monthly" && prodType != "Periodicals"){
								monthlySub = '(monthly subscription)' + '<br\>';
							}

							var membershipType = "";

							//alert("item.isMembershipProduct = "+ item.isMembershipProduct);
							//alert("item.isEmembershipt = "+ item.isEmembership);
							//alert("item.isStudentMember = "+ item.isStudentMember);

							if(item.isMembershipProduct){
								if(item.isStudentMember){
									membershipType = "(Student)" + '<br\>';
								}else if(item.isEmembership){
									membershipType = "(electronic)" + '<br\>';
								}
							}

							var mediaType = item.mediaType;
							var format = "";

							if(mediaType != null && mediaType != "undefined" && mediaType != "" && mediaType != "All" && mediaType != "None"){
								format = 'Format: ' + mediaType;
							}

							var price = item.totalLineItemPrice;

							if(price != null && price != "undefined"){
								price = 'US</span>$'+ item.totalLineItemPrice;
							}
							else{
								price = "Not Offered";
							}

							var rowClassName = 'mc-cart-item-row';

							if(itemGroup.salesChannelName == 'Xplore'){
								rowClassName = rowClassName + ' ' +'xplore-item';
							}
							else{
								rowClassName = rowClassName + ' ' +'membership-item';
							}

							var removeLink = '<a class="mc-bullet-link mc-remove-item-link" title="Remove this item from your shopping cart" href="#">Remove</a>';



							if(item.removeAllowed != null && item.removeAllowed == false){
								removeLink = '';
							}


							var prodDetailUrl =  item.lineItemURL;

							var prodDetailUrlHtml = "";

							if(prodDetailUrl != undefined && prodDetailUrl != null && prodDetailUrl != "" && prodDetailUrl != "undefined" && item.productType != MC_VCEP_PRODUCT_TYPE){
								prodDetailUrlHtml = '<a class="title" href="' + item.lineItemURL + '">' + item.title + '</a><br\>';
							}
							else{
								prodDetailUrlHtml = item.title+'<br\>';
							}
							var mcRemoveMsg = "Are you sure you want to remove this item?";
							var mcQtyStr="";
							if((item.quantity!="null") && 
									(item.quantity!="") &&
									(item.quantity>1)){
								mcQtyStr = "<br\><span class='mc-item-qty'> Quantity: "+ item.quantity+ '</span><br\>';
								mcRemoveMsg="Remove deletes entire item (quantity can be adjusted at checkout). Do you want to proceed?";
							}

							var itemTitle = item.title;
							itemTitle = itemTitle.replace(/</g, "&lt;").replace(/>/g, "&gt;");

							jQuery(".mc-content .mc-section").filter(":last").append(

									'<div id="mc_item-row-id-'+ item.lineItemId + '" callback-data="mc_item-row-id-' + item.lineItemId + "|" + item.partNumber +  "#" + item.productType + "~" + itemTitle + '" class="'+ rowClassName +' mc-items-row">'+


									'<p>'+ 

									prodDetailUrlHtml +

									monthlySub +

									membershipType +

									format +

									mcQtyStr+'</p><p class="mc-summary">'+ 

									removeLink +

									price +

									'</p><div style="margin:0 11px;border-top: 1px dotted #c2c2c2; height:0px">&nbsp;</div>'+

									'<div style="display:none;" class="mc-remove-confirmation"> <strong>'+
									mcRemoveMsg + '</strong>'+
									' <div class="align-left"><a title="Confirm that you want to remove this item from your cart" class="mc-remove-item-confirm-action button-link" href="">Yes, remove</a> <br>'+
									'  <a title="Cancel this action" class="mc-cancel-remove-item button-link" href="#">Cancel</a></div>'+
									'</div>'+
									'<div class="clearit"></div>'+
									'</div>'	
							);
						});
					});
				}
				
				if(miniCart.donations != null && miniCart.donations.length != 0){
					
					var donationsHeader = 	'<div class="mc-section">'+				
											'<div class="mc-sub-section"><div class="mc-donations-heading">'+ 
											'<a title="Open the Donations Panel" class="donation-toggle mc-toggle-control mc-toggle-control-closed" href="#" id="toggleDonations">&nbsp;</a>'+
											'Donations<span id="mc-donation-qty">('+ miniCart.donationQty+')'+ '</span></div><div class="mc-donation-total">US</span>$' + miniCart.donationTotal+ '</div><div class="mc-clearit">&nbsp;</div>' +
											'<div style="border-top: 1px solid #c2c2c2; height:0px; width: 102%;">&nbsp;</div>' +
											'<div class="mc-clearit">&nbsp;</div>' +
											'</div>';
					
					
					if(donationsOpened){
						donationsHeader = 	'<div class="mc-section">'+				
											'<div class="mc-sub-section"><div class="mc-donations-heading">'+ 
											'<a title="Close the Donations Panel" class="donation-toggle mc-toggle-control mc-toggle-control-opened" href="#" id="toggleDonations">&nbsp;</a>'+
											'Donations<span id="mc-donation-qty" style="display:none">('+ miniCart.donationQty+')'+ '</span></div><div class="mc-donation-total" style="display:none">US</span>$' + miniCart.donationTotal+ '</div><div class="mc-clearit">&nbsp;</div>' +
											'<div style="border-top: 1px solid #c2c2c2; height:0px; width: 102%;">&nbsp;</div>' +
											'<div class="mc-clearit">&nbsp;</div>' +
											'</div>';
					}
					
					jQuery(".mc-content").append(donationsHeader);
					
					jQuery.each(miniCart.donations, function(){
						var donation = this;
						
						var donationAmount = donation.amount;
						
						if(donationAmount != null && donationAmount != "undefined"){
							donationAmount = 'US</span>$'+ donationAmount;
						}
						else{
							price = "N/A";
						}
						
						var donationUrl =  donation.donationUrl;
						
						var donationUrlHtml = "";
						
						
						var donationTitle = donation.description;
						donationTitle = donationTitle.replace(/</g, "&lt;").replace(/>/g, "&gt;");
						
						if(donationUrl != undefined && donationUrl != null && donationUrl != "" && donationUrl != "undefined"){
							donationUrlHtml = '<a class="title" href="' + donationUrl + '">' + donationTitle + '</a><br\>';
						}
						else{
							donationUrlHtml = donation.description+'<br\>';
						}
						
						
						var donationDiv = '<div id="mc-donation-items" style="display:none">';
						if(donationsOpened){
							donationDiv = '<div id="mc-donation-items">';
						}
						
						
						
						jQuery(".mc-content .mc-section").filter(":last").append(
								donationDiv +
								
								'<div id="mc_item-row-id-'+ donation.lineItemId + '" callback-data="mc_item-row-id-' + donation.lineItemId + '|" class="mc-cart-item-row">'+
						        
								
									'<p>'+
									
									donationUrlHtml +

								
									'</p>'+ 
						            
									'<p class="mc-summary">'+
									
									'<p class="mc-summary"><a class="mc-bullet-link mc-remove-item-link" title="Remove this item from your shopping cart" '+
						            'href="#">Remove</a>'+
						            
									donationAmount +
						            
						            '</p>'+

						            '<div style="display:none;" class="mc-remove-confirmation"> <strong>Are you sure you want to remove this item?</strong>'+
						             ' <div class="align-left"><a title="Confirm that you want to remove this item from your cart" class="mc-remove-item-confirm-action button-link" href="">Yes, remove this item</a> <br>'+
						              '  <a title="Cancel this action" class="mc-cancel-remove-item button-link" href="#">Cancel</a></div>'+
						            '</div>'+
						            
						          '</div>'	+
						          '<div class="clearit"></div>'+
						          '</div>'
						);

					});
				}
				
				
				var mc_disable_checkout_btn_def = "button-large button-width-mid float-right";
				
				if (typeof mc_disable_checkout_btn_flag != "undefined" && mc_disable_checkout_btn_flag != null) {
					if(mc_disable_checkout_btn_flag)
						mc_disable_checkout_btn_def = "button-large-disable button-width-mid float-right";
				}
			
				var buttonDisableFlag = ''; 
				
				if (miniCart.hasMembershipProduct &&!miniCart.membershipComplete) {
					mc_disable_checkout_btn_def = "button-large-disable button-width-mid float-right";
					buttonDisableFlag = 'disabled';
				}
				
				// render subtotal section
				jQuery(".mc-content").append(
					'<div class="mc-section-last">\n' +
					'	<p class="mc-checkout"><span>Subtotal*</span> <span class="disclaimer">US</span>$' + miniCart.subtotal + '</p>\n' +
					'<div style="float:left;padding-left:10px;height:40px">*&nbsp;</div>'+
					'	<p class="mc-disclaimer mc-checkout">Any applicable taxes and shipping charges are calculated during Checkout</p>\n' +
					'	<p class="text-right">\n' +
					'	<input type="button" class="'+ mc_disable_checkout_btn_def +'" id="mc-proceed-checkout-button" value="Proceed to checkout"' + 
					    buttonDisableFlag + '/>\n' +
					'	</p>\n' +
					'	<div class="clearit"></div>' + 
					'</div>\n'
				);
				
				
				// render minicart messages
				jQuery(".mc-content").append(
					'<div id="mc_minicart-messages" style="display:none">\n' +
					'</div>\n'
				);
				
				var memCompleteUrl = mc_buildMashupUrl(MC_COMPLETE_MEMBERSHIP_URL);
				
				if (miniCart.hasMembershipProduct && !miniCart.membershipComplete) {
					jQuery(".mc-content").append('<div class="confirmation-msg" id="mc-mem-complete-msg">' +
			        '<div class="corner-img"></div>'+
			        '<p class="confirmation-description">For membership and subscriptions, you will need to <a href="'+ memCompleteUrl +'">complete an application </a>first before proceeding with checkout.</p>'+
			        '<div class="clearit" style="padding-top:5px;"></div><div><b>Questions?</b><div class="clearit"></div><a href="https://supportcenter.ieee.org">Contact IEEE</a></div>'+
			        '</div>');
				}

				if (!miniCart.signedIn) {
					
					var mc_not_signedin_def_msg = '<p class="confirmation-description margin-t10"><b>Already an IEEE member? <a href="#" id="mc-signin-link">Sign in for discounted pricing.</a></b></p>';
					
					jQuery(".mc-content").append(
						'<p class="confirmation-description margin-t10"><b>Already an IEEE member? <a href="#" id="mc-signin-link">Sign in for discounted pricing.</a></b></p>'
					);
				}
				
			}
		},
		
		
		mc_renderMiniCartContainter : function () {
			jQuery("#mc_ieee-mini-cart-include").after(
				'<div id="mc_minicart-container" class="mc-minicart-content">' +
				'</div>'
			);
		},
		
		mc_clearMiniCart : function (miniCart) {
			jQuery("#mc_minicart-container").html('');
		},
		
		mc_renderMiniCartError : function (data, mc_error) {
			var cont = jQuery("#mc_minicart-container").html();

			if(cont == "" ){
				jQuery("#mc_minicart-container").html(
						'<div class="callout-panel mc-product-cart">'+
						'<h3 class="mc-header first-rail">My Cart</h3>'+
					    '<div class="mc-content">'+
					    '<div id="mc-items-added" class="mc-confirmation-msg">'+
					    '</div>'
				);
			}
			
			var errorMessage = "";
			
			if(typeof data != "undefined"){
				errorMessage = data.errorMsg; 
			}
			
			if(errorMessage == IBP_SOA_TIMEOUT){
				errorMessage = MC_TIMEOUT_ERROR_MSG;
			}
			
			if (errorMessage == "" || errorMessage == "undefined" || typeof errorMessage == "undefined") {
				errorMessage = mc_system_error;
			}
			
			
			
			jQuery("#mc-items-added").html('<p>'+errorMessage+'</p>');
			jQuery("#mc-items-added").show();
				
			if(typeof mc_error == "function"){
				 mc_error(data.errorMsg);
			}

			
			
			var itemRemoveFlashNotice = jQuery('.mc-remove-confirmation');
			jQuery(itemRemoveFlashNotice).css({position:'relative',height:'0px',width:'0px'});
			jQuery(itemRemoveFlashNotice).append(jQuery(itemRemoveFlashNotice).find('.mc-remove-confirmation-content').children());
			jQuery(itemRemoveFlashNotice).children('.mc-top-shell, .mc-content-shell, .mc-bottom-shell').remove();
			jQuery(itemRemoveFlashNotice).hide();
			
		},
		

		mc_renderMiniCartMsg : function (msg) {
			var cont = jQuery("#mc_minicart-container").html();
			
			if(cont == "" ){
				jQuery("#mc_minicart-container").html(
						'<div class="callout-panel mc-product-cart">'+
						'<div class="mc-header first-rail">My Cart</div>'+
					    '<div class="mc-content">'+
					    '<div id="mc-items-added" class="mc-confirmation-msg">'+
					    '<p>'+ msg +'</p>'+
					    '</div>'
				);
			}
			else{
				jQuery("#mc-items-added").html("<p>"+ msg +"</p>");
			}
			jQuery("#mc-items-added").show();
			
			ibpMashupUtils.showIbpProgressImg("mc_minicart-container", "");
			 
		},
		
		mc_processRemoveItem : function (lineItemId, partNumber, productType, productDescription, mc_success, mc_error) {
			ibpMashupUtils.showIbpProgressImg("mc_minicart-container", ""); 
			
			var applicationName = "";
			if(typeof IEEE_MASHUP_APPLICATION_NAME != "undefined"){
				applicationName = IEEE_MASHUP_APPLICATION_NAME;
			}
			
			var timeout = (typeof MC_TIMEOUT != "undefined" && MC_TIMEOUT != null) ? MC_TIMEOUT : MC_TIMEOUT_DEF;
			var mashupUrl = mc_buildMashupUrl(MC_MINICART_SERVLET_URL);
			
			jQuery.ajax({
			      url: mashupUrl,
			      type: "GET",
			      data: ({
			    	  "action" : "removeItem",
			    	  "appName": applicationName,
			    	  "lineItemId": lineItemId
			    	  }),
			      dataType: "jsonp",
			      crossDomain: true,
			      timeout : timeout,
			      success: function(data){
			    	  
			    	  if (data != null) {
			    		  
			    		  if(data.errorMsg == undefined){ 
			    			  miniCartJson = data; 
			    			  ibpMiniCart.mc_renderMiniCart(data);
					    	  ibpMiniCart.mc_bindMiniCartEvents();
					    	  
					    	  if(typeof mn_updateCartItemQty == "function"){//to update the qty in meta nav
				    			  mn_updateCartItemQty();
				    		  }
					    	  
			    		  }
			    		  else{
			    			  
			    			  ibpMiniCart.mc_renderMiniCartError(data,mc_error);
			    		  }
				    	  
			    	  } 
			    	  else{
			    		  ibpMiniCart.mc_clearMiniCart();
			    	  }
			    	  ibpMashupUtils.clearIbpProgressImg("mc_minicart-container");
			    	  
			    	  var obj = '{"partNumber":"' + partNumber + '","lineItemId":"' + lineItemId + '","productType":"'+ productType +  '","productDescription":"'+ productDescription + '"}'; 

			    	  
			    	  if(typeof mc_success == "function"){
			    		  mc_success(data,obj);
			    	  }
			    	  
			    	  if(typeof mc_removeItem_success == "function"){
			    		  mc_removeItem_success(data,obj);
			    	  }
			    	  
			    	  if(typeof trackRemoveItem == "function"){
			    		  trackRemoveItem(partNumber,productDescription);
			    	  }
			      },
				  error: function(request, text, errorThrown){
					  //jQuery("#mc-items-added").html("<p>Error in removing the item.</p>");
					  //jQuery("#mc-items-added").show();
					  
					  
					  if(request.readyState == 0 && errorThrown == '') {
						  return; // it's not really an error
					  } 
					  else{
						  var respData = request.responseText;
						  
						  if(typeof mc_error == "function"){
							  mc_error(respData.errorMsg);
				    	  }  
					  
						  if(request.responseText != undefined){
							  ibpMiniCart.mc_renderMiniCartError(respData,mc_error);
						  }
					  }
					  
					  ibpMashupUtils.clearIbpProgressImg("mc_minicart-container");
					  
				  }
			   }
			);
		},
		
		mc_processAddItem : function(items, mc_success, mc_error){
			var itemsData = items;
			inProcess = true;
			var applicationName = "";
			if(typeof IEEE_MASHUP_APPLICATION_NAME != "undefined"){
				applicationName = IEEE_MASHUP_APPLICATION_NAME;
			}
			
			var timeout = (typeof MC_TIMEOUT != "undefined" && MC_TIMEOUT != null) ? MC_TIMEOUT : MC_TIMEOUT_DEF;
			
			ibpMiniCart.mc_addItemDelayMessage();
			var mashupUrl = mc_buildMashupUrl(MC_MINICART_SERVLET_URL);
			
			jQuery.ajax({
			      url: mashupUrl,
			      type: "GET",
			      data: ({
			    	  "action" : "addItem",
			    	  "appName": applicationName,
			    	  "items": itemsData
			    	  }),
			      dataType: "jsonp",
			      crossDomain: true,
			      timeout : timeout,
			      success: function(data){
			    	  inProcess = false;
			    	  if (data != null) {
			    		  if(data.errorMsg == undefined){
			    			  miniCartJson = data;
			    			  ibpMiniCart.mc_renderMiniCart(data);
				    		  
				    		  if(jQuery('#mc-items-added').is(":hidden")){
				    			  jQuery('#mc-items-added').toggle("blind",function(){
				    				  //setTimeout(function() {jQuery('#mc-items-added').toggle('fast');}, 5000);
				    			  });
				    		  }
				    		  
			
				    		  ibpMiniCart.mc_bindMiniCartEvents();
				    		  
				    		  if(typeof mn_updateCartItemQty == "function"){//to update the qty in meta nav
				    			  mn_updateCartItemQty();
				    		  }
				    		  
				    		  if(typeof mc_success == "function"){
							 		mc_success(miniCartJson);
					    	  }
				    		  
				    		  if(typeof trackAddItem == "function"){
				    			  if ((data.itemGroups != null && data.itemGroups.length != 0)){
				    				  jQuery.each(data.itemGroups, function(){
				  						var itemGroup = this;
				  						jQuery.each(itemGroup.items, function(){
				  							var item = this;
				  							var itemTitle = item.title;
				  							var itemPartNumber =item.partNumber;
				  							trackAddItem(itemPartNumber,itemTitle);
				  						});
				  					});
				    			  }
				    		  }
				    		  
				    		  
			    	  	  }
				    	  else{
				    		  ibpMiniCart.mc_renderMiniCartError(data,mc_error);
				    	  }
			    	  } 
			    	  else{
			    		  ibpMiniCart.mc_clearMiniCart();
			    	  }
			    	  
			      },
				  error: function(request, text, errorThrown){
					  inProcess = false;
					  ibpMashupUtils.clearIbpProgressImg("mc_minicart-container");
					  
					  if(request.readyState == 0 && errorThrown == '') {
						  return; // it's not really an error
					  } 
					  else{
						  var respData = request.responseText;
						  
						  if(typeof mc_error == "function"){
							  mc_error(respData.errorMsg);
				    	  }  
					  
						  if(request.responseText != undefined){
							  ibpMiniCart.mc_renderMiniCartError(respData,mc_error);
						  }
					  }
					  
					  
					  if(typeof mc_trackEvent == "function"){
		    			  var analyticsAppName = mc_getAnalyticsAppName();
		    			  mc_trackEvent(analyticsAppName+'_ADDTOCART',analyticsAppName+'_ADDTOCART_FAILED');//Webtrends tracking for add cart success
		    			  mc_trackEvent('ADDTOCART','ADDTOCART_FAILED');//Webtrends tracking for add cart success
		    		  }
				  }
			   }
			);
		},		

		mc_addItemQueue : function(qItems, mc_success, mc_error) {
		  mc_createAnalyticsCookie();
	
		  if(typeof mc_trackEvent == "function"){
			  var analyticsAppName = mc_getAnalyticsAppName();
			  mc_trackEvent(analyticsAppName+'_ADDTOCART',analyticsAppName+'_ADDTOCART');//Webtrends tracking for add cart
			  mc_trackEvent('ADDTOCART','ADDTOCART');//Webtrends tracking for add cart
		  }
	
		  // Create a new queue.
		  var q = jQuery.jqmq({
		  delay: -1,
		  
		  callback: function(items) {
			  var q = this;
			  ibpMiniCart.mc_renderMiniCartMsg(MC_ADDING_MSG);
			  ibpMiniCart.mc_processAddItem(items, 
			  function(data){
				  q.next(false);
			  }, 
			  function(errorMsg){
				  ibpMashupUtils.clearIbpProgressImg("mc_minicart-container");
				  if(typeof mc_error == "function"){
					  mc_error(errorMsg);
		    	  }
			  });
		  },
		  complete: function(){
			 ibpMashupUtils.clearIbpProgressImg("mc_minicart-container");
			 setTimeout(function() {jQuery('#mc-items-added').toggle('fast');}, 5000);
			 
			  if(typeof mc_success == "function"){
			 		mc_success(miniCartJson);
			  }
			 
			  if(typeof mc_trackEvent == "function"){
				  var analyticsAppName = mc_getAnalyticsAppName();
				  mc_trackEvent(analyticsAppName+'_ADDTOCART',analyticsAppName+'_ADDTOCART_SUCCESS');//Webtrends tracking for add cart success
				  mc_trackEvent('ADDTOCART','ADDTOCART_SUCCESS');//Webtrends tracking for add cart success
			  }
		  }
		  });

		  var qItemsJson;
			if(typeof qItems == "string"){
				  qItemsJson = jQuery.parseJSON(qItems);  
			}
			
			var batchSize = 5;//default is 5
			if(typeof MC_MINICART_BATCH_SIZE != "undefined"){
				batchSize = MC_MINICART_BATCH_SIZE;
			}
			
			if(qItemsJson.length > batchSize){
				  var itemArr = [];
				  
				  jQuery.each(qItemsJson, function(index,qItem){
					  itemArr.push(qItem);
					  if((index+1)%batchSize == 0){
						  q.add(jQuery.toJSON(itemArr));
						  itemArr = [];
					  }
				  });
				  
				  if(itemArr.length > 0){//for the last chunk
					  q.add(jQuery.toJSON(itemArr));
				  }
			}
			else{
				  q.add(qItems);
			}
},
		refreshWindow : function(){
			location.reload();
		},

		openContactWindow : function(){
			if(typeof MC_ERROR_CONTACT_URL != "undefined"){
				window.open(MC_ERROR_CONTACT_URL);
			}
		},
		
		mc_loadDelayMessage : function(){
			if("true" == MC_OPERATION_DELAY_MSG_FLAG){
				var timeToChange = (typeof MC_OPERATION_DELAY_TIMEOUT != "undefined" && MC_OPERATION_DELAY_TIMEOUT != null) ? MC_OPERATION_DELAY_TIMEOUT : MC_OPERATION_DELAY_TIMEOUT_DEF;
				var delayMsg = (typeof MC_LOADING_DELAY_MSG != "undefined" && MC_LOADING_DELAY_MSG != null ) ? MC_LOADING_DELAY_MSG : MC_LOADING_DELAY_MSG_DEF;
				setTimeout(function(){
					if(inProcess){
						ibpMiniCart.mc_renderMiniCartMsg(delayMsg);
					}
				}, timeToChange);
			}
		},
		
		mc_addItemDelayMessage : function(){
			if("true" == MC_OPERATION_DELAY_MSG_FLAG){
				
				var timeToChange = (typeof MC_OPERATION_DELAY_TIMEOUT != "undefined" && MC_OPERATION_DELAY_TIMEOUT != null) ? MC_OPERATION_DELAY_TIMEOUT : MC_OPERATION_DELAY_TIMEOUT_DEF;
				var delayMsg = (typeof MC_ADDING_DELAY_MSG != "undefined" && MC_ADDING_DELAY_MSG != null ) ? MC_ADDING_DELAY_MSG : MC_ADDING_DELAY_MSG_DEF;
				
				setTimeout(function(){
					if(inProcess){
						ibpMiniCart.mc_renderMiniCartMsg(delayMsg);
					}
				}, timeToChange);
			}
		}
};

