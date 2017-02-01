/*
    Javascript available for use in SelfServe content.
*/

/*
    Enables an expandable/collapsable section of content. Must take the format of:

    <x class="selfServe"> [NOTE: This tag is provided by the SelfServeContentPlaceholder]
        <y class="expandable">
            [Text to display regardless of expand/collapse status]
            <z class="showHide">[Content to display when link is clicked]</z>
            <a class="expand" moretext="[Text of link to cause content to expand]" lesstext="[Text of link to cause content to collapse]"></a>
        </y>
    </x>

*/
$(document).ready(function () {
    function SetupExpandableSelfServe() {
        $('.selfServe .expandable a.expand').each(function () {
            var $showHide = $(this).closest('.expandable').find('.showHide')
            $showHide.hide();
            $(this).text($(this).attr("moreText"))
        });

        $('.selfServe .expandable a.expand').click(function () {
            var $showHide = $(this).closest('.expandable').find('.showHide')
            if ($showHide.is(':visible')) {
                $showHide.slideUp();
                $(this).text($(this).attr("moreText"))
            }
            else {
                $showHide.slideDown();
                $(this).text($(this).attr("lessText"))
            }
        });
    }

    SetupExpandableSelfServe();
});