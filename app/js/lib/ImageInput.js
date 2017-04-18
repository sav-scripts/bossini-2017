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
        
        loadFile: function()
        {
            //Loading.progress('empty').show();
            
            var self = this;
            if(self._onLoadStart) self._onLoadStart.call();
    
            if (self._inputDom.files && self._inputDom.files[0])
            {
    
                //console.log(_imageInput.input.files[0].size);
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
            if(_image)
            {
                $(_image).detach();
                _image = null;
            }
    
            _image = document.createElement("img");
    
            _image.onload = function()
            {
                createCanvas(_image);
    
                if(cb) cb.call();
            };
    
            _image.src = src;
        }
    }

}());