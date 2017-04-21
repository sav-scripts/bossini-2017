

(function(){

    var $doms = {},
        _isHiding = true;

    var self = window.Entries.ShowEntry =
    {
        init: function()
        {
            $doms.container = $("#entries-show-entry");

            $doms.imageContainer = $doms.container.find(".entry-image");

            $doms.btnClose = $doms.container.find(".btn-close").on(_CLICK_, function()
            {
                self.hide();
            });

            $doms.container.detach();
        },

        show: function(imageUrl)
        {
            if(!_isHiding) return;
            _isHiding = false;

            var img = document.createElement('img');

            Loading.progress('empty').show();

            img.onload = function()
            {
                Loading.hide();

                $doms.imageContainer.css("background-image", "url("+imageUrl+")");

                $('body').append($doms.container);

                var tl = new TimelineMax();
                tl.set($doms.container, {autoAlpha:0});
                tl.to($doms.container,.4, {autoAlpha:1});
            };

            img.src = imageUrl;
        },

        hide: function()
        {
            if(_isHiding) return;
            _isHiding = true;


            var tl = new TimelineMax();
            tl.to($doms.container,.4, {autoAlpha:0});
            tl.add(function()
            {
                $doms.container.detach();
            })
        }
    };

}());