

(function(){

    var $doms = {},
        _isHiding = true;

    var self = window.Entries.ShowEntry =
    {
        init: function()
        {
            $doms.container = $("#entries-show-entry");

            $doms.content = $doms.container.find(".content");
            $doms.imageContainer = $doms.container.find(".image-container");

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

                $doms.imageContainer.css("background-image", "url("+imageUrl+")").css('background-size', 'cover');

                $('body').append($doms.container);

                var tl = new TimelineMax();
                tl.set($doms.container, {autoAlpha:1});

                //tl.set($doms.imageContainer, {scale:.6, autoAlpha:0}, 0);
                //tl.to($doms.imageContainer,.5,{scale:1, autoAlpha:1, ease:Power1.easeOut}, 0);

                tl.set($doms.content, {autoAlpha:0}, 0);
                tl.to($doms.content,.4, {autoAlpha:1, ease:Power1.easeOut}, 0);

                tl.set($doms.imageContainer, {autoAlpha: 0}, 0);
                tl.to($doms.imageContainer,.5,{autoAlpha:1, ease:Power1.easeIn}, "+=.5");

                tl.set($doms.btnClose, {autoAlpha:0}, 0);
                tl.to($doms.btnClose,.5, {autoAlpha:1}, "-=.0");
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