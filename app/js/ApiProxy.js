/**
 * Created by sav on 2016/7/22.
 */
(function(){

    var _fakeData =
    {
        "publish":
        {
            error: '',
            serial: '00001',
            share_image_url: 'http://local.savorks.com/projects/zoo/bossini-2017/app/misc/fb-share.jpg'
        }
    };

    var _apiExtension = "",
        _apiPath = "../process/";

    window.ApiProxy =
    {
        callApi: function(apiName, params, fakeDataName, cb)
        {
            var apiUrl = _apiPath + apiName + _apiExtension,
                method = "POST";

            //if(!fakeDataName) fakeDataName = apiName;

            if(Main.settings.useFakeData && fakeDataName)
            {
                if(fakeDataName === true) fakeDataName = apiName;

                var response = _fakeData[fakeDataName];



                complete(response);
            }
            else
            {
                $.ajax
                ({
                    url: apiUrl,
                    type: method,
                    data: params,
                    dataType: "json"
                })
                    .done(complete)
                    .fail(function ()
                    {
                        //alert("無法取得伺服器回應");
                        complete({error:"無法取得伺服器回應"});
                    });
            }

            function complete(response)
            {
                if(cb) cb.call(null, response);
            }
        }
    };

}());