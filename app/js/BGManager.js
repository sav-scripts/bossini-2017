/**
 * Created by sav on 2017/4/17.
 */
(function(){

    var _isInit = false,
        _isVideoSet = false,
        _isBackgroundsSet = false,
        _viewportIndex,
        _isPlaying = true,
        $doms = {};

    var self = window.BGManager =
    {
        init: function()
        {
            _isInit = true;

            $doms.container = $("#background");
        },

        play: function(cb, forceExecute)
        {
            if(!forceExecute)
            {
                if(_isPlaying) return;
                _isPlaying = true;
            }

            if(_viewportIndex === 0)
            {
                $doms.backgrounds.restart(cb);
            }
            else if(_viewportIndex === 1)
            {
                $doms.video.restart(cb);
            }

        },

        stop: function()
        {
            if(!_isPlaying) return;
            _isPlaying = false;

            if(_isVideoSet)
            {
                $doms.video.stop();
            }

            if(_isBackgroundsSet)
            {
                $doms.backgrounds.stop();
            }
        },

        resize: function(cb)
        {
            if(_isInit)
            {
                var oldViewportIndex = _viewportIndex,
                    vp = Main.viewport;

                _viewportIndex = vp.index;
                var isChanged = oldViewportIndex != _viewportIndex;

                if(isChanged)
                {
                    if(vp.index == 0)
                    {
                        setupBackgrounds();
                        if(_isPlaying) $doms.backgrounds.restart(cb);

                        if(_isVideoSet)
                        {
                            $doms.video.stop();
                        }
                    }
                    else
                    {
                        setupVideo();
                        if(_isPlaying) $doms.video.restart(cb);

                        if(_isBackgroundsSet)
                        {
                            $doms.backgrounds.stop();
                        }
                    }

                    return true;
                }
                else
                {
                    return false;
                }
            }

            return false;
        }

    };

    function setupBackgrounds()
    {
        if(_isBackgroundsSet) return;
        _isBackgroundsSet = true;

        var _currentIndex = 1,
            _numBackgrounds = 5,
            _sceneDuration = 5,
            _fadeDuration = 1,
            $bgDic = {};

        $doms.backgrounds = $doms.container.find(".backgrounds");

        var i;

        for(i=1;i<=_numBackgrounds;i++)
        {
            $bgDic[i] = $doms.backgrounds.find(".bg-"+i+"");
        }

        setupTimeline();

        $doms.backgrounds.restart = function(cb)
        {
            reset();

            var tl = new TimelineMax;
            tl.set($doms.backgrounds, {autoAlpha:0});
            tl.to($doms.backgrounds, _fadeDuration, {autoAlpha:1});

            $doms.backgrounds.playTL.restart();

            if(cb) cb.call();
        };

        $doms.backgrounds.stop = function()
        {
            $doms.backgrounds.playTL.pause();
        };


        function setupTimeline()
        {
            var tl = $doms.backgrounds.playTL = new TimelineMax({paused:true, repeat:-1});

            tl.add(function()
            {
                playOnce();
            }, _sceneDuration);
        }

        function playOnce()
        {
            //console.log("play once: " + _currentIndex);

            var oldIndex = _currentIndex;
            _currentIndex ++;
            if(_currentIndex > _numBackgrounds) _currentIndex = 1;

            var $oldBg = $bgDic[oldIndex],
                $newBg = $bgDic[_currentIndex];

            $doms.backgrounds.append($newBg);

            var tl = new TimelineMax;
            tl.set($newBg, {autoAlpha:0});
            tl.to($newBg, _fadeDuration, {autoAlpha:1, ease:Power1.easeIn});
            tl.add(function()
            {
                TweenMax.set($oldBg, {autoAlpha: 0});
            });

        }

        function reset()
        {
            _currentIndex = 1;

            for(var i=1; i<=_numBackgrounds;i++)
            {
                var $bg = $bgDic[i],
                    alpha = i == _currentIndex? 1: 0;
                TweenMax.set($bg, {autoAlpha:alpha});
            }
        }

    }

    function setupVideo()
    {
        if(_isVideoSet) return;
        _isVideoSet = true;

        $doms.video = $doms.container.find(".fullsize-video");

        var videoDom = $doms.video[0];

        var _cbOnFirstPlay = null,
            _isPlaying = false;

        $doms.video.restart = function(cbOnFirstPlay)
        {
            if(_isPlaying)
            {
                if(cbOnFirstPlay) cbOnFirstPlay.call();
            }
            else
            {
                _cbOnFirstPlay = cbOnFirstPlay;
                $doms.video.toggleClass("playing-mode", false);
                videoDom.addEventListener("canplay", onFirstPlay);
                videoDom.load();
            }
        };

        $doms.video.stop = function()
        {
            videoDom.pause();
            _cbOnFirstPlay = null;

            _isPlaying = false;
        };

        function onFirstPlay()
        {
            videoDom.removeEventListener("canplay", onFirstPlay);
            $doms.video.toggleClass("playing-mode", true);
            videoDom.play();

            _isPlaying = true;

            if(_cbOnFirstPlay) _cbOnFirstPlay.call();
        }
    }

}());