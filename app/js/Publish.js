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
        _textImageSrc = './misc/sample-1.png',

        _currentStep = 'work',
        _defaultStep = 'work',
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
                        {url: "_publish.html?v=2", startWeight: 0, weight: 100, dom: null}
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
                oldPart.hide();
            }

            if(newPart)
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

    function showContent()
    {
        var tl = new TimelineMax;
        tl.set($doms.container, {autoAlpha: 0});
        tl.to($doms.container, .4, {autoAlpha: 1});
    }

    function build(templates)
    {
        $("#invisible-container").append(templates[0].dom);
        $doms.container = $("#publish");

        _partClassDic =
        {
            'work':self.WorkPart.init($doms.container.find(".work-part")),
            'form': self.FormPart.init($doms.container.find(".form-part"))
        };

        $doms.workContainer = $doms.container.find('.work-container');

        $doms.imageInput = $doms.container.find(".image-input");

        setupTextCanvas();

        setupColorSelect();

        _imageInput = new ImageInput($doms.imageInput[0], function()
        {
            Loading.progress('載入圖片中').show();
        }, resetWorkingImage);

        $doms.btnUpload = $doms.container.find(".btn-upload").on(_CLICK_, function()
        {
            _imageInput.triggerInput();
        });

        $doms.btnSend = $doms.container.find(".btn-send").on(_CLICK_, function()
        {
            //getCombinedCanvas();

            var text = self.getInputText();

            console.log(text);

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

        _imageInput.loadImg(_textImageSrc, resetWorkingImage);


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

        canvas.className = 'test-canvas';
        $('body').append(canvas);

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
        if(text === $doms.textInput.defaultText) return;

        var workRatio = _imageSettings.workRatio,
            fontFamily = $doms.textInput.css("font-family"),
            fontSize = 28 / workRatio + 'px',
            fontWeight = 'bold',
            lineHeight = 36 / workRatio;

        var textCanvas = $doms.textCanvas[0];

        var ctx = textCanvas.getContext("2d");

        ctx.clearRect(0,0,textCanvas.width, textCanvas.height);

        ctx.fillStyle = _fontColor;
        ctx.font = fontWeight + ' ' + fontSize + ' ' + fontFamily;

        var lines = text.split('\n');
        for(var i = 0;i < lines.length;i++)
        {
            printText(lines[i], i+1);
        }

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
            _workingCanvas = null;
        }

        _workingCanvas = CanvasUtils.imageToCanvas(image, _imageSettings.rawWidth, _imageSettings.rawHeight);
        _workingCanvas.className = 'raw-canvas';

        $doms.workContainer.prepend(_workingCanvas);
    }

    function show(cb)
    {
        $("#scene-container").append($doms.container);

        self.resize(true);

        self.toStep(_defaultStep);

        cb.apply();
    }

    function hide(cb)
    {
        var tl = new TimelineMax;
        tl.to($doms.container, .4, {autoAlpha: 0});
        tl.add(function ()
        {
            $doms.container.detach();
            cb.apply();
        });
    }

}());