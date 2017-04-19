/**
 * Created by sav on 2017/4/19.
 */
(function(){

    var self = window.SiteUtils =
    {
        changeQueryParam: function(uri, key, value)
        {
            var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
            var separator = uri.indexOf('?') !== -1 ? "&" : "?";
            if (uri.match(re)) {
                return uri.replace(re, '$1' + key + "=" + value + '$2');
            }
            else {
                return uri + separator + key + "=" + value;
            }
        },

        removeURLParameter: function(url, parameter)
        {
            //prefer to use l.search if you have a location/link object
            var urlparts= url.split('?');
            if (urlparts.length>=2) {

                var prefix= encodeURIComponent(parameter)+'=';
                var pars= urlparts[1].split(/[&;]/g);

                //reverse iteration as may be destructive
                for (var i= pars.length; i-- > 0;) {
                    //idiom for string.startsWith
                    if (pars[i].lastIndexOf(prefix, 0) !== -1) {
                        pars.splice(i, 1);
                    }
                }

                url= urlparts[0] + (pars.length > 0 ? '?' + pars.join('&') : "");
                return url;
            } else {
                return url;
            }
        },

        getParameterByName: function(name, url)
        {
            if (!url) url = window.location.href;
            name = name.replace(/[\[\]]/g, "\\$&");
            var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, " "));
        }
    };

}());