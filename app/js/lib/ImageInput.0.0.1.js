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
                //Loading.progress('read loading').show();
                var reader = new FileReader();
    
                reader.onload = function (event)
                {
                    self.loadImg(event.target.result, self._onLoadEnd, true);
                };
    
                //reader.readAsDataURL(self._inputDom.files[0]);
                self.loadImg(self._inputDom.files[0], self._onLoadEnd);
            }
        },

        loadImg: function(file, cb, isLocal)
        {

            //Loading.progress('image loading').show();

            var self = this;

            if(self._image)
            {
                $(self._image).detach();
                self._image = null;
            }

            loadImage(
                file,
                function (img, data)
                {
                    //console.log(img);
                    //if(data && data.exif)
                    //{
                    //    alert('orientation = ' + data.exif.get('Orientation'));
                    //}

                    self._image = img;
                    if(cb) cb.call(null, self._image);
                },
                {
                    orientation: true,
                    maxWidth: 600,
                    maxHeight: 600,
                    cover: true,
                    crop: true
                }
            );
        },
    
        loadImg_old: function(src, cb, isLocal)
        {

            //Loading.progress('image loading').show();

            var self = this;

            if(self._image)
            {
                $(self._image).detach();
                self._image = null;
            }

            var img = document.createElement("img");
            if(!isLocal) img.crossOrigin = "anonymous";
            img.onload = function()
            {
                //Loading.progress('image loading end').show();


                var mpImg = new MegaPixImage(img);

                var newImg = document.createElement("img");
                newImg.onload = function()
                {
                    self._image = newImg;
                    if(cb) cb.call(null, self._image);
                };

                mpImg.render(newImg, { width: img.width, height: img.height });

                //if(cb) cb.call(null, self._image);
            };

            img.onerror = function(e)
            {
                Loading.progress('image loading error').show();
            };

            //self._image.src = test? src + 'sdfs': src;
            img.src = src;
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