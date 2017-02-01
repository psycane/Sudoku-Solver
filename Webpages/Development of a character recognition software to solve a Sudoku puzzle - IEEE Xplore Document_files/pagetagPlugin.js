(function (j$) {	
	j$.fn.addTag = function (tagOptions) {
		//create default data
		var defaults = {
			tagNode : 'a',
			tagName : '',
			tagAttr : '',
			tagEventType : 'click',
			tagType : 'static',
			eventPrefix : '',
			eventLocation : false,
			analyticType : ''	,
			customEvName:'',
			customEvValue:''
		};
		var tagOptions = j$.extend(defaults, tagOptions);	
		var tagNode = tagOptions.tagNode;
		var tagName = tagOptions.tagName;
		var tagAttr = tagOptions.tagAttr;
		var tagType = tagOptions.tagType;
		var tagEventType = tagOptions.tagEventType;
		var eventPrefix = tagOptions.eventPrefix;
		var eventLocation = tagOptions.eventLocation;
		var webTrends = tagOptions.webTrends;
		var analyticType = tagOptions.analyticType;
		var customEvName = tagOptions.customEvName;
		var customEvValue = tagOptions.customEvValue;
		
		switch (tagType) { 
	        case 'static': 
	        	return this.find(tagNode).bind(tagEventType, function () {
					var evName = !tagName ? (tagAttr == 'html' ? j$(this).html() : j$(this).attr(tagAttr)) : tagName;
					var WT_evName = evName;
									
					switch (analyticType) { 
			        	case 'unica':
			        		if (eventPrefix) {
								evName = eventLocation ? 'evLocation=' + evName : '&evtype=' + evName;
								evName = 'ev=' + eventPrefix + '&' + evName;
							} else {
								evName = "ev=" + evName;
							}
			        		evName = customEvName ? (evName + '&' + customEvName +'='+ j$(this).attr(customEvValue)):evName;
			        		ntptEventTag(evName);
			        		break;
			        		
			        	case 'webtrends': 
			        		WT_evName ='xplore_'+ WT_evName;	
			        		dcsMultiTrackWrapper(WT_evName);
			        		break;
			        					        		
			        	default:	// unica + webtrends + tealium
			        		// do 'unica' (netInSight)
			        		if (eventPrefix) {
								evName = eventLocation ? 'evLocation=' + evName : '&evtype=' + evName;
								evName = 'ev=' + eventPrefix + '&' + evName;
							} else {
								evName = "ev=" + evName;
							}
			        		evName = customEvName ? (evName + '&' + customEvName +'='+ j$(this).attr(customEvValue)):evName;
				        	ntptEventTag(evName);	
				  
				        	// do 'webtrends' 
							WT_evName ='xplore_'+ WT_evName;
			        		dcsMultiTrackWrapper(WT_evName);
			        					        		
			        		break;
					}
				});
	        	break;
	        default:
	        	return this.delegate(tagNode, tagEventType, function () {
					var evName = !tagName ? (tagAttr == 'html' ? j$(this).html() : j$(this).attr(tagAttr)) : tagName;
					var WT_evName = evName;					
					switch (analyticType) { 
			        	case 'unica':
			        		if (eventPrefix) {
								evName = eventLocation ? 'evLocation=' + evName : '&evtype=' + evName;
								evName = 'ev=' + eventPrefix +  evName;
							} else {
								evName = "ev=" + evName;
							}
			        		evName = customEvName ? (evName+"&"+customEvName +'='+customEvValue):evName;
			        		ntptEventTag(evName);	
			        		break;
			        		
			        	case 'webtrends': 
			        		WT_evName ='xplore_'+ WT_evName;
			        		dcsMultiTrackWrapper(WT_evName);
			        		break;

			        	default:	// unica + webtrends + tealium
			        		// do 'unica' (netInSight)
			        		if (eventPrefix) {
								evName = eventLocation ? 'evLocation=' + evName : '&evtype=' + evName;
								evName = 'ev=' + eventPrefix + '&' + evName;
							} else {
								evName = "ev=" + evName;
				   			}        	
			        		evName = customEvName ? (evName+"&"+customEvName +'='+customEvValue):evName;
			        		ntptEventTag(evName);
			        		
			        		// do 'webtrends'
							WT_evName ='xplore_'+WT_evName;
			        		dcsMultiTrackWrapper(WT_evName);
			        		
			        		break;
					}
				});
		}
	};
	
})(jQuery);

function dcsMultiTrackWrapper(si_p) {
	var array = si_p.split("-");
	var local_si_n='';
	var local_si_p='';
	var em_add='';
	if (array[0]){
		local_si_n = array[0];
	}
	if (array[1]){
		local_si_p = array[1];
	}
	
	if (PAGE_TAGGING){
		if (local_si_n){
			if (em_add){
				dcsMultiTrack('WT.si_n',local_si_n,'WT.si_p',local_si_p);
			} else {
				dcsMultiTrack('WT.si_n',local_si_n,'WT.si_p',local_si_p,'em_Add',em_add);
			}
		} else {
			dcsMultiTrack('WT.si_p',local_si_p);
		}
	}
	return;
}