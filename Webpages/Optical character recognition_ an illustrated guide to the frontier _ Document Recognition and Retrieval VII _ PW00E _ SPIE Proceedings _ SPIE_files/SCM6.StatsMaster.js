var SMActionItemType = '{ "0" : "WidgetPanelExpanded" , "1" : "WidgetPanelCollasped"}';
var ActionURL = location.href;
var asyncTracking = true;

function ActionType(k, v) {
    this.ActionFilterKey = k;
    this.ActionFilterValue = v;
}

function UserSessionItem(sessionid, clientid, siteid) {
    this.SessionID = sessionid;
    this.ClientID = clientid;
    this.SiteID = siteid;
}

function UserTracking(actionType, actionDescription, actionDate, usersessionitem, url) {
    this.ActionFilterType = actionType;
    this.ActionDescription = actionDescription;
    this.ActionDateTime = actionDate;
    this.UserSessionItem = usersessionitem;
    this.ActionURL = url;
}

function UserTracking(actionType, actionDescription, actionDate, usersessionitem, url, IndividualCanView, InstitutionCanView) {
    this.ActionFilterType = actionType;
    this.ActionDescription = actionDescription;
    this.ActionDateTime = actionDate;
    this.UserSessionItem = usersessionitem;
    this.ActionURL = url;
    this.IndividualCanView = IndividualCanView;
    this.InstitutionCanView = InstitutionCanView;

}

UserTracking.prototype.toJson = function () {
    return JSON.stringify(this);
}


function dostatstracking(actiontype, actiondescription, actiondate, usersessionitem, url, callback, IndividualCanView, InstitutionCanView) {
    var userTracking = new UserTracking(actiontype, actiondescription, actiondate, usersessionitem, url, IndividualCanView, InstitutionCanView);

    //    var _url = "../Services/UserClientActionService.svc/TrackClientActivity";

    var _url = "ClientTrackingHandler.ashx";
    $.ajax(
            {
                type: "POST",
                url: _url,
                data: userTracking.toJson(),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                async: asyncTracking,
                processData: true,
                success:
                    function (data) {
                        var s = data;
                        callbackFn(s);
                    },
                error: function (c) {
                    //alert(c.status + ' ' + c.statusText);
                    callbackFn(c.status);
                }
            }
        );
}

function callbackFn(msg) {

}

function doTracking(actiontype, actiondescription, actiondate, usersessionitem, url) {
    mydotracking(actiontype, actiondescription, actiondate, usersessionitem, url, callbackFn, 0, 0);
}

// this is to avoid zero error in firefox. async= true will not work if you do ajax and postback at the same time.
function doTracking(actiontype, actiondescription, actiondate, usersessionitem, url, isAsync) {
    if (isAsync == "sync") {
        asyncTracking = false;
    }
    dostatstracking(actiontype, actiondescription, actiondate, usersessionitem, url, callbackFn, 0, 0);
}
function doTracking(actiontype, actiondescription, actiondate, usersessionitem, url, isAsync, IndividualCanView, InstitutionCanView) {
    if (isAsync == "sync") {
        asyncTracking = false;
    }
    dostatstracking(actiontype, actiondescription, actiondate, usersessionitem, url, callbackFn, IndividualCanView, InstitutionCanView);
}




String.prototype.format = function () {
    var s, i;
    s = this;
    i = arguments.length;
    while (i--)
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
    return s;
};


var JumpId = '';
$(document).ready(function () {
    // User Alerts popup
    // set the value  for Email Address textbox from the hidden field.

    //            $(class1).click(function () {
    //                alert("message");

    //            });
    //            JumpId = jQuery.url.param('JumperID');

    //            if (JumpId) {
    //                var anchorhref = '#Jump' + JumpId.toString();
    //                $('#triggerJumpLocation').attr("href", anchorhref);
    //                $("#triggerJumpLocation").trigger("click");
    //                location.href = anchorhref;
    //            }

    // tracking content references

    /*Hiding Pubmed History Section*/
    if ($('.contentSectionTab').find('.PubHistory')) {
        var me = $('.contentSectionTab').find('.PubHistory');
        $(me).parents('.contentSectionTab').hide();
    }
    /*Ends*/

    /*Displaying copyright section on all the article page*/



    $('.crsRef').click(function () {
        var tab = $(this).context.innerText;
        var key = 'CrossReferenceLink'
        //popuate the input object and call the pagebase method to update the database
        this.UserSessionItem = new UserSessionItem(getStatsTrackingSessionID(), 0, 0);
        this.ActionType = new ActionType(1, key);
        doTracking(this.ActionType, tab.toString(), "<%=System.DateTime.Now %>", this.UserSessionItem, (window.location).toString());
    });

    $('.pubmedLink').click(function () {

        var tab = $(this).attr('href');
        var key = 'CrossReferenceLink';
        this.UserSessionItem = new UserSessionItem(getStatsTrackingSessionID(), 0, 0);
        this.ActionType = new ActionType(1, key);
        doTracking(this.ActionType, tab.toString(), "<%=System.DateTime.Now %>", this.UserSessionItem, (window.location).toString());
    });

    $('#txtUserAlertEmailAddress').val($('#hfOriginalEmailAddress').val());

    var browserversion = $.browser;

    if (browserversion.mozilla && parseInt(browserversion.version) < 2) {
        $('.saveMyStuff').click(function () {
            var _id = this.id;
            AddItemstoMyStuff(_id);
        });
    }

});

function detailsHandler(href) {
    var hiddenField = document.getElementById('scm6MainContent_ucGetCitation_articleId').value;
    //get any other hidden fields and append them.
    href = href + "&articleid=" + hiddenField;
    //then redirect to the revised url
    window.location = href;
}

MyResource.prototype.toJson = function () {
    return JSON.stringify(this);
}

function MyResource(resourcetype, resourceId) {
    this.ResourceType = resourcetype;
    this.ResourceId = resourceId;
}

function ResourceAccess(hasAccess, resourcePdfurl) {
    this.hasAccess = hasAccess;
    this.resourcePdfUrl = resourcePdfurl;
}

function isUserSubscribedToResource(resourcetype, resourceId) {
    var mystuff = new MyResource(resourcetype, resourceId);
    // var _url = location.protocol + "//" + location.host + "/searchresults.aspx/IsUserSubscribedToResource";
    var _url = "CheckAccessToResource.ashx";
    var oreturn = null;

    $.ajax(
                {
                    type: "POST",
                    url: _url, // "../article.aspx/AddItemstoMyStuff",
                    data: mystuff.toJson(),
                    contentType: "application/json; charset=utf-8",
                    async: false,
                    dataType: "json",
                    processData: false,
                    success:
                    function (d) {
                        oreturn = new ResourceAccess(d.hasAccess, d.resourcePdfurl);
                        // return oreturn;
                    },
                    error: function (c) { alert(c.status + ' ' + c.statusText); }
                }
            );
    return oreturn;

}

