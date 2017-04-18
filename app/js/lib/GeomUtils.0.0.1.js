/**
 * Created by sav on 2017/4/18.
 */
(function(){

    window.GeomUtils =
    {
        getSize_cover: function(containerWidth, containerHeight, contentWidth, contentHeight)
        {
            var containerRatio = containerWidth / containerHeight,
                contentRatio = contentWidth / contentHeight,
                width, height;

            if(contentRatio > containerRatio)
            {
                height = containerHeight;
                width = height * contentRatio;
            }
            else
            {
                width = containerWidth;
                height = width / contentRatio;
            }

            var ratio = width/contentWidth;

            var tw = containerWidth / ratio,
                th = containerHeight / ratio;
            var contentCenterBound =
            {
                x: (contentWidth - tw) *.5,
                y: (contentHeight - th) *.5,
                width: tw,
                height: th
            };

            //console.log(contentCenterBound);

            return {width:width, height:height, ratio:ratio, contentCenterBound: contentCenterBound};
        },

        getSize_contain: function(containerWidth, containerHeight, contentWidth, contentHeight)
        {
            var containerRatio = containerWidth / containerHeight,
                contentRatio = contentWidth / contentHeight,
                width, height;

            if(contentRatio > containerRatio)
            {
                width = containerWidth;
                height = width / contentRatio;
            }
            else
            {
                height = containerHeight;
                width = height * contentRatio;
            }

            return {width:width, height:height, ratio:width/contentWidth};
        }
    };

}());