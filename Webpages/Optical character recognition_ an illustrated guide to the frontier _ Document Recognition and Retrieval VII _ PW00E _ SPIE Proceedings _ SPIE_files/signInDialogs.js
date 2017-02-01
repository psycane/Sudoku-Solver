function InitiateSignInModal(jquerySelector) {

    var $signInModal = $(jquerySelector).dialog({
        closeText: "X Close",
        width: "auto",
        height: "auto",
        autoOpen: false,
        open: function(){
            $('.ui-widget-overlay').hide().fadeIn();
        },
        show: "fade",
        hide: "fade", 
        close: function (event, ui) {
            $signInModal.find('.errorMessageSection .validationControl').html('');
            $signInModal.find('.field input').val('');
        },
        modal: true,
        overlay: { opacity: 0.3, background: 'gray' }
    });

    return $signInModal;
}

function ReplaceLinkActionWithSignInModal(linkSelector, modal)
{
    $(linkSelector).click(function (e) {
        e.preventDefault();

        //clear the url, if it exists
        $(linkSelector).attr("href", "");

        //replace the returnUrl
        if (linkSelector === ".showAlerts") {
            modal.find(".hfReturnURL").val("/account/myalerts.aspx#myEmail");
        }
        else {
            modal.find(".hfReturnURL").val(location.href); 
        }

        //show the modal
        modal.parent().appendTo($("#Form1"));
        modal.dialog("open");
    });
}

var _itemIsFree = "";

function OpenDefaultSignInDialog(resourceId, resourceType, purchaseLinkUrl, returnUrlQueryString, msg)
{
    var modalToLoad;
    _itemIsFree = msg.itemIsFree;
    switch (resourceType)
    {
        case "Article":
            if ($globalSignInArticlePDF == null) {
                $globalSignInArticlePDF = InitiateSignInModal('#globalSignInArticle_divGlobalSignIn');
            }
            modalToLoad = $globalSignInArticlePDF;
            if (window.location.pathname.toLowerCase().indexOf("searchresults.aspx") >= 0) { $(".aStoreLink").attr("href", msg.storeUrl); }
            break;
        case "Proceeding":
            if ($globalSignInProceedingPDF == null) {
                $globalSignInProceedingPDF = InitiateSignInModal('#globalSignInProceeding_divGlobalSignIn');
            }
            modalToLoad = $globalSignInProceedingPDF;
            if (window.location.pathname.toLowerCase().indexOf("searchresults.aspx") >= 0) {$(".aStoreLink").attr("href", msg.storeUrl);}
            break;
        case "Chapter":
            if ($globalSignInChapterPDF == null) {
                $globalSignInChapterPDF = InitiateSignInModal('#globalSignInChapter_divGlobalSignIn');
            }
            modalToLoad = $globalSignInChapterPDF;
            break;
        default:
            if ($globalSignInMasterPDF == null) {
                $globalSignInMasterPDF = InitiateSignInModal('#globalSignInMaster_divGlobalSignIn');
            }
            modalToLoad = $globalSignInMasterPDF;
    }
    //make the replacements to customize the modal
    if (resourceType != null && resourceType != 'Generic') {
        modalToLoad.find(".accessThis").html("Access this " + resourceType);
        modalToLoad.find(".aStoreLink").attr("href", purchaseLinkUrl);
        modalToLoad.find(".aStoreLink").html("Buy this " + resourceType.toLowerCase());
        modalToLoad.find(".useTokensResourceID").val(resourceId);
        if (_itemIsFree == "True") {
            modalToLoad.find("#divSignInForFreePdf").show();
            modalToLoad.find("#globalSignInProceeding_ucPurchaseSubscription_divArticleUpSell").hide();
            modalToLoad.find("#globalSignInArticle_ucPurchaseSubscription_divArticleUpSell").hide();
            modalToLoad.find("#globalSignInProceeding_ucPurchaseSubscription_divInstShow").hide();
            modalToLoad.find("#globalSignInArticle_ucPurchaseSubscription_divGenericSignin").hide();
        } else {
            modalToLoad.find("#divSignInForFreePdf").hide();
            modalToLoad.find("#globalSignInProceeding_ucPurchaseSubscription_divArticleUpSell").show();
            modalToLoad.find("#globalSignInArticle_ucPurchaseSubscription_divArticleUpSell").show();
            modalToLoad.find("#globalSignInProceeding_ucPurchaseSubscription_divInstShow").show();
            modalToLoad.find("#globalSignInArticle_ucPurchaseSubscription_divGenericSignin").show();
        }
    }

    modalToLoad.find(".hfReturnURL").val(location.href);
    modalToLoad.find(".hfReturnUrlQueryString").val(returnUrlQueryString);

    modalToLoad.parent().appendTo($("#Form1"));
    modalToLoad.dialog("open");
}

var $globalSignInArticlePDF = null;
var $globalSignInProceedingPDF = null;
var $globalSignInChapterPDF = null;
var $globalSignInMasterPDF = null;

function openPDFWindow(resourceId, resourceType, purchaseLinkUrl) {
    // Set the PDF link for only selected article based on Security, Subscription, Freetoview, etc .
    var param = "{'resourceId' : " + resourceId + ", 'resourceType' : '" + resourceType + "' }";
    $.ajax({
        type: "POST",
        url: "/volume.aspx/SetPDFLinkBasedOnAccess",
        data: param,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (msg) {
            msg = JSON.parse(msg.d);
            if (!msg.hasAccess) {
                //Open signin dialog
                OpenDefaultSignInDialog(resourceId, resourceType, purchaseLinkUrl, "", msg);
            } else {
                location.href = "/" + msg.pdfUrl;
            }
            
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            // Can be Replace with any error message
            alert("error occured");
        }
    });

    //This prevents the href in the link that ran this from executing
    return false;
}
