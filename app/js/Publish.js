(function ()
{
    var $doms = {},
        _imageInput,
        _isInit = false,
        _workingCanvas = null,
        _textCanvas = null,
        _fontColor = '#ffffff',
        _imageSettings =
        {
            rawWidth: 600,
            rawHeight: 600,
            workWidth: 350,
            workHeight: 350,
            workRatio: 350/600,
            textOffsetX: 0,
            textOffsetY: 0
        },
        _firstImageSrc = './misc/sample-1.png',
        _fixTexts = '#不停止，就是最好的超越。',

        _currentStep = 'work',
        _defaultStep = _currentStep,
        //_defaultStep = 'coupon',
        _partClassDic = null;

    var self = window.Publish =
    {
        stageIn: function (options, cb)
        {
            (!_isInit) ? loadAndBuild(execute) : execute();
            function execute(isFromLoad)
            {
                if (isFromLoad && options.cbContentLoaded) options.cbContentLoaded.call();
                show(cb);
            }

            function loadAndBuild(cb)
            {
                var templates =
                    [
                        {url: "_publish.html", startWeight: 0, weight: 100, dom: null}
                    ];

                SceneHandler.loadTemplate(null, templates, function loadComplete()
                {
                    build(templates);
                    _isInit = true;
                    cb.apply(null);
                }, 0);
            }
        },

        stageOut: function (options, cb)
        {
            hide(cb);
        },

        getCombinedCanvas: getCombinedCanvas,

        getInputText: function()
        {
            var text = $doms.textInput.val();

            if(text === $doms.textInput.defaultText) text = '';

            return text;
        },

        toStep: function(step)
        {
            var oldStep = _currentStep;
            _currentStep = step;

            var oldPart = _partClassDic[oldStep],
                newPart = _partClassDic[_currentStep];

            if(oldPart)
            {
                oldPart.hide(newPart.show);
            }
            else
            {
                newPart.show();
            }

        },

        resize: function (isFromShow)
        {
            if(_isInit)
            {
                if(BGManager.resize(showContent))
                {
                    TweenMax.set($doms.container, {autoAlpha:0});
                }
                else if(isFromShow)
                {
                    showContent();
                }
            }
        }
    };

    function build(templates)
    {
        $("#invisible-container").append(templates[0].dom);
        $doms.container = $("#publish");

        _partClassDic =
        {
            'work':self.WorkPart.init($doms.container.find(".work-part"), $doms.container),
            'form': self.FormPart.init($doms.container.find(".form-part"), $doms.container),
            'success': self.Success.init($doms.container.find(".success-dialog"), $doms.container),
            'coupon': self.Coupon.init($doms.container.find(".coupon-dialog"), $doms.container)
        };

        $doms.workContainer = $doms.container.find('.work-container').toggleClass("visible-mode", false);

        $doms.imageInput = $doms.container.find(".image-input");

        setupTextCanvas();

        setupColorSelect();

        _imageInput = new ImageInput($doms.imageInput[0], function()
        {
            Loading.progress('載入圖片中').show();
            $doms.workContainer.toggleClass("visible-mode", false);

        }, resetWorkingImage);

        $doms.btnUpload = $doms.container.find(".btn-upload").on(_CLICK_, function()
        {
            _imageInput.triggerInput();
        });

        $doms.btnNextStep = $doms.container.find(".btn-next").on(_CLICK_, function()
        {
            var text = self.getInputText();

            if(text == '')
            {
                alert('請先輸入您的不停止宣言');
            }
            else
            {
                self.toStep('form');
            }
        });


        $doms.textInput = $doms.container.find(".text-input");
        setupInput($doms.textInput);

        if(FBHelper._uid)
        {
            _firstImageSrc = 'http://graph.facebook.com/'+FBHelper._uid+'/picture?width=600&height=600';
            _imageInput.loadImg(_firstImageSrc, resetWorkingImage);
        }
        else if(Main.testmode)
        {
            //console.log('using sample as default working image');
            _imageInput.loadImg(_firstImageSrc, resetWorkingImage);
        }
        else
        {
            alert('need login facebook first');
            SceneHandler.toHash("/Index");
        }


        updateTextCanvas();

        $doms.container.detach();
    }

    function getCombinedCanvas()
    {
        var canvas = document.createElement('canvas');
        canvas.width = _imageSettings.rawWidth;
        canvas.height = _imageSettings.rawHeight;

        var ctx = canvas.getContext('2d');
        ctx.drawImage(_workingCanvas, 0, 0, _workingCanvas.width, _workingCanvas.height);

        ctx.drawImage(_textCanvas, _imageSettings.textOffsetX, _imageSettings.textOffsetY, _textCanvas.width, _textCanvas.height);

        //canvas.className = 'test-canvas';
        //$('body').append(canvas);

        return canvas;
    }

    function setupColorSelect()
    {
        var $colorBlocks = $doms.container.find(".color-block");

        setupOne(1);
        setupOne(2);
        setupOne(3);

        function setupOne(index)
        {
            var $dom = $doms.container.find(".color-block-" + index);

            $dom.on(_CLICK_, function()
            {
                _fontColor = $dom.css("background-color");

                $colorBlocks.toggleClass('focus-mode', false);
                $dom.toggleClass('focus-mode', true);

                updateTextCanvas();
            });
        }
    }

    function setupInput($dom)
    {
        $dom.defaultText = $dom.val();

        $dom.on("focus", function()
        {
            if($dom.val() == $dom.defaultText)
            {
                $dom.val("");
            }
            updateInputField($dom);

        }).on("blur", function()
        {
            if($dom.val() == '')
            {
                $dom.val($dom.defaultText);
            }
            updateInputField($dom);


        }).on("input propertychange", function()
        {
            updateInputField($dom);
            updateTextCanvas();
        });

        $dom.val($dom.defaultText);

        updateInputField($dom);
    }

    function updateInputField($dom)
    {
        $dom.toggleClass("hint-mode", ($dom.val() == $dom.defaultText));
    }

    function setupTextCanvas()
    {
        $doms.textCanvas = $doms.container.find(".text-canvas");

        _textCanvas = $doms.textCanvas[0];

        var workRatio = _imageSettings.workRatio,
            cssWidth = parseInt($doms.textCanvas.css("width")),
            cssHeight = parseInt($doms.textCanvas.css("height")),
            textCanvasWidth = parseInt(cssWidth / workRatio),
            textCanvasHeight = parseInt(cssHeight / workRatio);

        _imageSettings.textOffsetX = parseInt($doms.textCanvas.css('left'))/workRatio;
        _imageSettings.textOffsetY = parseInt($doms.textCanvas.css('top'))/workRatio;

        var textCanvas = $doms.textCanvas[0];

        textCanvas.width = textCanvasWidth;
        textCanvas.height = textCanvasHeight;
    }

    function updateTextCanvas()
    {

        var text = $doms.textInput.val();


        var workRatio = _imageSettings.workRatio,
            fontFamily = $doms.textInput.css("font-family"),
            fontSize = 27 / workRatio + 'px',
            fontWeight = 'bold',
            lineHeight = 36 / workRatio;

        var textCanvas = $doms.textCanvas[0];

        var ctx = textCanvas.getContext("2d");

        ctx.clearRect(0,0,textCanvas.width, textCanvas.height);

        ctx.fillStyle = _fontColor;
        ctx.font = fontWeight + ' ' + fontSize + ' ' + fontFamily;

        if(text === $doms.textInput.defaultText)
        {
            printText(_fixTexts, 4);
            return;
        }


        var lines = text.split('\n'),
            n = lines.length;
        if(n>3) n = 3;

        for(var i = 0;i < n;i++)
        {
            printText(lines[i], i+1);
        }

        printText(_fixTexts, 4);

        function printText(string, lineIndex)
        {
            ctx.fillText(string, 0, lineIndex * lineHeight);
        }

    }

    function resetWorkingImage(image)
    {
        Loading.hide();

        if(_workingCanvas)
        {
            $(_workingCanvas).detach();
        }

        _workingCanvas = CanvasUtils.imageToCanvas(image, _imageSettings.rawWidth, _imageSettings.rawHeight);
        _workingCanvas.className = 'raw-canvas';

        $doms.workContainer.toggleClass("visible-mode", true);

        $doms.workContainer.prepend(_workingCanvas);
    }

    function show(cb)
    {
        $("#scene-container").append($doms.container);

        self.resize(true);

        self.toStep(_defaultStep);

        cb.apply();
    }

    function showContent()
    {
        var tl = new TimelineMax;
        tl.set($doms.container, {autoAlpha: 0});
        tl.to($doms.container, .2, {autoAlpha: 1});

        tl.set($doms.container, {transformPerspective: 600, marginLeft: 0, transformOrigin: 'center center', rotationY:-70, scale:.2}, 0);

        tl.to($doms.container, 1, {rotationY: 0, scale: 1, ease:Power1.easeInOut}, 0);

        tl.add(function()
        {
            $doms.container.css('transform', 'none');
        });
    }

    function hide(cb)
    {
        var tl = new TimelineMax;

        tl.set($doms.container, {transformPerspective: 900, transformOrigin: 'center center'});
        tl.to($doms.container,1, {rotationY: 90, scale:.2, marginLeft: 400, ease:Power1.easeIn});
        //tl.to($doms.container,.5, {marginLeft: 200, ease:Power1.easeInOut});

        tl.to($doms.container, .3, {autoAlpha: 0}, "-=.3");
        tl.add(function ()
        {
            $doms.container.detach();
            cb.apply();
        });
    }

}());