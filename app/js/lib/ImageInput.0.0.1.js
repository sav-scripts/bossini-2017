/**
 * Created by sav on 2017/4/18.
 */
(function(){


    window.ImageInput = ImageInput;

    function ImageInput(inputDom, onLoadStart, onLoadEnd)
    {
        var self = this;
        
        self._inputDom = inputDom;
        self._onLoadStart = onLoadStart;
        self._onLoadEnd = onLoadEnd;
        
        $(inputDom).on("change", function()
        {
            self.loadFile();
        });
    }

    ImageInput.prototype =
    {
        _inputDom: null,
        _onLoadStart: null,
        _onLoadEnd: null,
        
        _image: null,

        getLoadedImage: function()
        {
            return _image;
        },

        triggerInput: function()
        {
            this._inputDom.value = null;
            this._inputDom.click();
        },
        
        loadFile: function()
        {
            var self = this;
            if(self._onLoadStart) self._onLoadStart.call();
    
            if (self._inputDom.files && self._inputDom.files[0])
            {

                var reader = new FileReader();
    
                reader.onload = function (event)
                {
                    self.loadImg(event.target.result, self._onLoadEnd);
                };
    
                reader.readAsDataURL(self._inputDom.files[0]);
            }
        },
    
        loadImg: function(src, cb)
        {
            var self = this;

            if(self._image)
            {
                $(self._image).detach();
                self._image = null;
            }

            self._image = document.createElement("img");
            self._image.crossOrigin = "anonymous";
            self._image.onload = function()
            {
                if(cb) cb.call(null, self._image);
            };

            self._image.src = src;
        }
    };

    ImageInput.imageToCanvas =  function(image)
    {
        var canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;

        var ctx = canvas.getContext('2d');

        ctx.drawImage(image, 0, 0);

        return canvas;
    };

}());