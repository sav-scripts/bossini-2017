/*
    2017/04/24: add preventDefault for both container and scrollbar when using on touchstart,
        this is for prevent parent scrolling when draging content or scroll bar

        ** no longer need Hammer.js **

 */


// JavaScript Document
(function(){
    "use strict";

    window.SimpleScroller = SimpleScroller;

    function SimpleScroller(_dom, contentHeight, _fixScrollbarHeight, _withTouch, _noArrow)
    {
        var _noScrollbarHeight = false;

        if(_noArrow == null) _noArrow = true;

        var DF =
        {
            scrollContainerWidth: 50
        };

        var _bounds =
        {
            content:{x:0,y:0,width:0,height:0},
            container:{x:0,y:0,width:0,height:0},
            scrollContainer:{x:0,y:0,width:30,height:0},
            scrollbase:{x:0,y:0,width:0,height:0},
            scrollbar:{x:0,y:0,width:0,height:0}
        };


        if(_fixScrollbarHeight != null)
        {
            _noScrollbarHeight = true;
            _bounds.scrollbar.height = _fixScrollbarHeight;
        }

        var _scrollArea =
        {
            top:0,
            height:0,
            topForScroll:0,
            heightForScroll:0,
            progress:0,
            tProgress:0
        };

        var _scrollSetting =
        {
            scrollDividContent:1,
            mouseWheelInterval:.1,
            smoothMoving:true,
            buttonInterval:30,
            buttonProgress:.02
        };

        var _customScroll =
        {
            enabled:false,
            x:0,y:0,width:0,height:0,
            barInnerHtml:null,
            baseInnerHtml:null
        };

        var _doms =
        {
            content:null,
            container:null,
            scrollContainer:null,
            scrollbase:null,
            scrollbarContainer:null,
            scrollbar:null,
            btnUp:null,
            btnDown:null
        };

        _bounds.container.width = $(_dom).width();
        _bounds.container.height = $(_dom).height();

        _doms.container = document.createElement("div");
        _doms.container.className = "ss_container";

        _doms.content = document.createElement("div");
        _doms.content.className = "ss_content";
        _doms.container.appendChild(_doms.content);

        _doms.content.innerHTML = _dom.innerHTML;
        _dom.innerHTML = "";

        _dom.appendChild(_doms.container);

        if(contentHeight == null) contentHeight = $(_doms.content).height();
        _bounds.content.height = contentHeight;

        _doms.scrollContainer = document.createElement("div");
        _doms.scrollContainer.className = "ss_scroll_container";
        _dom.appendChild(_doms.scrollContainer);

        _doms.scrollbase = document.createElement("div");
        _doms.scrollbase.className = "ss_scrollbase";
        _doms.scrollContainer.appendChild(_doms.scrollbase);

        _doms.scrollbarContainer = document.createElement("div");
        _doms.scrollbarContainer.className = "ss_scrollbar_container";
        _doms.scrollContainer.appendChild(_doms.scrollbarContainer);

        _doms.scrollbar = document.createElement("div");
        _doms.scrollbar.className = "ss_scrollbar";
        _doms.scrollbarContainer.appendChild(_doms.scrollbar);

        if(!_noArrow)
        {
            _doms.btnUp = document.createElement("div");
            _doms.btnUp.className = "ss_button_up";
            _doms.scrollContainer.appendChild(_doms.btnUp);

            _doms.btnDown = document.createElement("div");
            _doms.btnDown.className = "ss_button_down";
            _doms.scrollContainer.appendChild(_doms.btnDown);
        }

        _dom.containerSize = function(width, height)
        {
            if(width != null) _bounds.container.width = width;
            if(height != null) _bounds.container.height = height;
            return _dom;
        };

        _dom.contentHeight = function(height)
        {
            _bounds.content.height = height;
            return _dom;
        };

        _dom.scrollbarInnerHtml = function(html)
        {
            _customScroll.barInnerHtml = html;
            return _dom;
        };

        _dom.scrollbaseInnerHtml = function(html)
        {
            _customScroll.baseInnerHtml = html;
            return _dom;
        };

        _dom.scrollbarHeight = function(height)
        {
            _bounds.scrollbar.height = height;
            return _dom;
        };

        _dom.scrollBound = function(x, y, width, height)
        {
            _customScroll.enabled = true;
            _customScroll.x = x;
            _customScroll.y = y;
            _customScroll.width = width;
            _customScroll.height = height;

            return _dom;
        };

        _dom.update = update;
        _dom.updateProgress = updateProgress;
        _dom.doms = _doms;

        bindFunc();
        return _dom;


        function update(updateContentHeight)
        {
            if(updateContentHeight) _bounds.content.height = $(_doms.content).height();

            //$(_doms.container).css("width", _bounds.container.width).css("height", _bounds.container.height);
            $(_doms.container).css("width", "100%").css("height", _bounds.container.height);

            _scrollArea.height = _bounds.content.height - _bounds.container.height;
            if(_scrollArea.height < 0) _scrollArea.height = 0;
            if(_scrollArea.top > _scrollArea.height) _scrollArea.top = _scrollArea.height;



            var startY = _noArrow? 0: 30;
            var arrowHeight = _noArrow? 0: 60;

            if(!_customScroll.enabled)
            {
                _bounds.scrollContainer.x = _bounds.container.width;
                _bounds.scrollContainer.y = startY;
                _bounds.scrollContainer.width = DF.scrollContainerWidth;
                _bounds.scrollContainer.height = _bounds.container.height - arrowHeight;
            }
            else
            {
                _bounds.scrollContainer.x = (_customScroll.x == null)? _bounds.container.width: _customScroll.x;
                _bounds.scrollContainer.y = (_customScroll.y == null)? startY: _customScroll.y + startY;
                _bounds.scrollContainer.width = (_customScroll.width == null)? DF.scrollContainerWidth: _customScroll.width;
                _bounds.scrollContainer.height = (_customScroll.height == null)? _bounds.container.height - arrowHeight: _customScroll.height - arrowHeight;
            }

            _doms.scrollbar.innerHTML = (_customScroll.barInnerHtml != null)? _customScroll.barInnerHtml: "";
            _doms.scrollbase.innerHTML = (_customScroll.baseInnerHtml != null)? _customScroll.baseInnerHtml: "";

            _scrollSetting.scrollDividContent = _bounds.scrollContainer.height / _bounds.container.height;

            _bounds.scrollbar.height = (_noScrollbarHeight)? _bounds.scrollbar.height: _bounds.container.height / _bounds.content.height * _bounds.scrollContainer.height;

            _scrollArea.topForScroll = _scrollArea.top * _scrollSetting.scrollDividContent;
            _scrollArea.heightForScroll = _bounds.scrollContainer.height - _bounds.scrollbar.height;

            //console.log(_scrollArea.height);

            if(_scrollArea.height <= 0)
            {
                $(_doms.scrollContainer).css("display", "none");
            }
            else
            {
                $(_doms.scrollContainer).css("display", "block");
            }

            _scrollSetting.mouseWheelInterval = 500/_scrollArea.height * .1;
            _scrollSetting.buttonProgress = _scrollSetting.mouseWheelInterval * .3;

            $(_doms.scrollContainer)
                .css("left", _bounds.scrollContainer.x)
                .css("top", _bounds.scrollContainer.y)
                .css("width", _bounds.scrollContainer.width)
                .css("height", _bounds.scrollContainer.height);
            $(_doms.scrollbase).css("height", _bounds.scrollContainer.height);

            if(!_noScrollbarHeight)
            {
                $(_doms.scrollbar).css("height", _bounds.scrollbar.height);
            }

            $(_doms.scrollbarContainer).css("height", _bounds.scrollbar.height);

            //$(_dom).css("width", null).css("height", null).css("overflow", "");


            $(_dom).css("overflow", "visible");
            //$(_dom).css("width", "auto").css("height", "auto").css("overflow", "visible");

            updatePosition();

            return _dom;
        }

        function bindFunc()
        {
            var mouseY = 0;
            var buttonUpPressing = false;
            var buttonDownPressing = false;


            if(_withTouch)
            {

                _doms.container.addEventListener('touchstart', function(event)
                {
                    event.preventDefault();

                    mouseY = event.touches[0].screenY;
                });

                _doms.container.addEventListener('touchmove', function(event)
                {
                    event.preventDefault();

                    var dy = event.touches[0].screenY - mouseY;
                    mouseY = event.touches[0].screenY;

                    updateProgress(_scrollArea.tProgress - dy/_scrollArea.height );
                });


                // scrollbar



                _doms.scrollbarContainer.addEventListener('touchstart', function(event)
                {
                    event.preventDefault();
                    mouseY = event.touches[0].screenY;
                });

                _doms.scrollbarContainer.addEventListener('touchmove', function(event)
                {
                    event.preventDefault();

                    var dy = -(event.touches[0].screenY - mouseY);
                    mouseY = event.touches[0].screenY;

                    updateProgress(_scrollArea.tProgress - dy/_scrollArea.heightForScroll);
                });
            }
            else
            {
                bindMouseEvent(_doms.container, function(dy)
                {

                    updateProgress(_scrollArea.tProgress - dy/_scrollArea.height );
                });

                bindMouseEvent(_doms.scrollbarContainer, function(dy)
                {

                    updateProgress(_scrollArea.tProgress + dy/_scrollArea.heightForScroll);
                });
            }

            //$(_doms.scrollbarContainer).bind("mouseover", function(event)
            //{
            //    $(_doms.scrollbar).toggleClass("hover", true);
            //});
            //
            //$(_doms.scrollbarContainer).bind("mouseout", function(event)
            //{
            //    $(_doms.scrollbar).toggleClass("hover", false);
            //});

            $(document).bind("mousewheel", function(event, delta)
            {
                if(!$.contains(document, _dom)) return;
                event.stopPropagation();
                var dProgress = delta < 0? _scrollSetting.mouseWheelInterval: -_scrollSetting.mouseWheelInterval;
                updateProgress(_scrollArea.tProgress + dProgress);
            });

            function scrollUp()
            {
                if(!buttonUpPressing) return;
                var onEdge = updateProgress(_scrollArea.tProgress - _scrollSetting.buttonProgress);
                if(!onEdge) setTimeout(scrollUp, _scrollSetting.buttonInterval);
            }

            function scrollDown()
            {
                if(!buttonDownPressing) return;
                var onEdge = updateProgress(_scrollArea.tProgress + _scrollSetting.buttonProgress);
                if(!onEdge) setTimeout(scrollDown, _scrollSetting.buttonInterval);
            }
        }

        function updateProgress(progress)
        {
            var onEdge = false;
            if(progress <= 0){ progress = 0; onEdge = true; }
            if(progress >= 1){ progress = 1; onEdge = true; }

            if(_scrollSetting.smoothMoving)
            {
                _scrollArea.tProgress = progress;
                TweenLite.to(_scrollArea, .4, {progress:progress, onUpdate:updatePosition});
            }
            else
            {
                _scrollArea.tPprogress = _scrollArea.progress = progress;
                updatePosition();
            }

            return onEdge;
        }

        function updatePosition()
        {
            _scrollArea.top = _scrollArea.height * _scrollArea.progress;
            _scrollArea.topForScroll = _scrollArea.heightForScroll * _scrollArea.tProgress;

            $(_doms.scrollbarContainer).css("top", _scrollArea.topForScroll);
            $(_doms.content).css("top", -_scrollArea.top);
        }

        function bindMouseEvent(dom, onUpdate)
        {
            var isDragging = false;

            var $dom = $(dom);

            $dom.on("mousedown", function(event)
            {
                event.preventDefault();
                event.stopPropagation();

                var currentY = event.clientY;

                isDragging = true;

                $(document).on("mouseup", onMouseup);
                $(document).on("mousemove", onMousemove);


                function onMouseup(event)
                {
                    $(document).unbind("mouseup", onMouseup);
                    $(document).unbind("mousemove", onMousemove);
                }

                function onMousemove(event)
                {
                    var dy = event.clientY - currentY;
                    currentY = event.clientY;

                    onUpdate.call(null, dy);
                }

            });
        }
    }

}());