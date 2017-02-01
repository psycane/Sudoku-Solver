/*******************************************************************************
 * /* scoutAnalytics /
 ******************************************************************************/
var scoutAnalytics = {
	config : {
		SAT_Url : '://scout.scoutanalytics.net/x67my/sat.ashx',
		SAT_MemberType : 'memberType',
		SAT_InstType : 'instType'
	},
	init : function() {
		this.callScoutAnalytics();		
		this.bindEvents();
	},

	callScoutAnalytics : function() {
		(SAT_seqId !== '') ? $SAT.push(['setUser', SAT_seqId ]) : ''; 
		(SAT_MemberType!=='') ? $SAT.push(['setContent',this.config.SAT_MemberType, SAT_MemberType]):'';
		(SAT_InstType!=='') ? $SAT.push(['setContent',this.config.SAT_InstType, SAT_InstType]):'';

		var sa = document.createElement('script'); 
        sa.type = 'text/javascript'; sa.async = true;
        sa.src = 'http' + ('https:' == document.location.protocol ? 's' : '') + this.config.SAT_Url;
        document.body.appendChild(sa);
	},

	bindEvents : function() {
		jQuery('#article-page #nav-article').delegate('a', 'click', function(){
			var arr = [];
			siteSubSection =jQuery(this).find('b').text().replace(" ","-");
			arr.push(['setContent','siteSection','Abstract']);
			arr.push(['setContent','siteSubSection',siteSubSection]);
			scoutAnalytics.recordEvents(arr);
			});
	},
	
	recordEvents: function(arr) {
		if (typeof $AOC != 'undefined'
			&& typeof $SAT != 'undefined') {
		$SAT.clearContent();
		(SAT_MemberType!=='') ? $SAT.push(['setContent',this.config.SAT_MemberType, SAT_MemberType]) :'';
		(SAT_InstType!=='') ? $SAT.push(['setContent',this.config.SAT_InstType, SAT_InstType]) :'';

		jQuery.each(arr, function(key, data){
			$SAT.push(data);
		});
		$AOC.recordPageHit();
	}

}

};

jQuery(function() {

	scoutAnalytics.init();
}); // doc ready
