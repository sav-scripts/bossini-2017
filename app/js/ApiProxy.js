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
            share_url: 'http://local.savorks.com/projects/zoo/bossini-2017/app/misc/fb-share.jpg',
            coupon: 'http://local.savorks.com/projects/zoo/bossini-2017/app/misc/coupon-sample.png'
        },
        "get_entries":
        {
            "error": "",  // 正常執行的話傳回空值, 有錯傳回錯誤訊息
            "data": // 搜尋結果 (如果是搜尋流水號的話, 資料最多只會有一筆)
                [
                    {
                        "serial": "0088",
                        "thumb_url": "http://local.savorks.com/projects/zoo/bossini-2017/app/misc/sample-1-thumb.png",
                        "url":  "http://local.savorks.com/projects/zoo/bossini-2017/app/misc/sample-1.png"
                    },
                    {
                        "serial": "0088",
                        "thumb_url": "http://local.savorks.com/projects/zoo/bossini-2017/app/misc/sample-1-thumb.png",
                        "url":  "http://local.savorks.com/projects/zoo/bossini-2017/app/misc/sample-1.png"
                    },
                    {
                        "serial": "0088",
                        "thumb_url": "http://local.savorks.com/projects/zoo/bossini-2017/app/misc/sample-1-thumb.png",
                        "url":  "http://local.savorks.com/projects/zoo/bossini-2017/app/misc/sample-1.png"
                    },
                    {
                        "serial": "0088",
                        "thumb_url": "http://local.savorks.com/projects/zoo/bossini-2017/app/misc/sample-1-thumb.png",
                        "url":  "http://local.savorks.com/projects/zoo/bossini-2017/app/misc/sample-1.png"
                    },
                    {
                        "serial": "0088",
                        "thumb_url": "http://local.savorks.com/projects/zoo/bossini-2017/app/misc/sample-1-thumb.png",
                        "url":  "http://local.savorks.com/projects/zoo/bossini-2017/app/misc/sample-1.png"
                    },
                    {
                        "serial": "0088",
                        "thumb_url": "http://local.savorks.com/projects/zoo/bossini-2017/app/misc/sample-1-thumb.png",
                        "url":  "http://local.savorks.com/projects/zoo/bossini-2017/app/misc/sample-1.png"
                    },
                    {
                        "serial": "0088",
                        "thumb_url": "http://local.savorks.com/projects/zoo/bossini-2017/app/misc/sample-1-thumb.png",
                        "url":  "http://local.savorks.com/projects/zoo/bossini-2017/app/misc/sample-1.png"
                    },
                    {
                        "serial": "0088",
                        "thumb_url": "http://local.savorks.com/projects/zoo/bossini-2017/app/misc/sample-1-thumb.png",
                        "url":  "http://local.savorks.com/projects/zoo/bossini-2017/app/misc/sample-1.png"
                    },
                    {
                        "serial": "0088",
                        "thumb_url": "http://local.savorks.com/projects/zoo/bossini-2017/app/misc/sample-1-thumb.png",
                        "url":  "http://local.savorks.com/projects/zoo/bossini-2017/app/misc/sample-1.png"
                    },
                    {
                        "serial": "0088",
                        "thumb_url": "http://local.savorks.com/projects/zoo/bossini-2017/app/misc/sample-1-thumb.png",
                        "url":  "http://local.savorks.com/projects/zoo/bossini-2017/app/misc/sample-1.png"
                    },
                    {
                        "serial": "0088",
                        "thumb_url": "http://local.savorks.com/projects/zoo/bossini-2017/app/misc/sample-1-thumb.png",
                        "url":  "http://local.savorks.com/projects/zoo/bossini-2017/app/misc/sample-1.png"
                    },
                    {
                        "serial": "0088",
                        "thumb_url": "http://local.savorks.com/projects/zoo/bossini-2017/app/misc/sample-1-thumb.png",
                        "url":  "http://local.savorks.com/projects/zoo/bossini-2017/app/misc/sample-1.png"
                    },
                    {
                        "serial": "0088",
                        "thumb_url": "http://local.savorks.com/projects/zoo/bossini-2017/app/misc/sample-1-thumb.png",
                        "url":  "http://local.savorks.com/projects/zoo/bossini-2017/app/misc/sample-1.png"
                    },
                    {
                        "serial": "0088",
                        "thumb_url": "http://local.savorks.com/projects/zoo/bossini-2017/app/misc/sample-1-thumb.png",
                        "url":  "http://local.savorks.com/projects/zoo/bossini-2017/app/misc/sample-1.png"
                    }
                ],
            "num_pages": 3, // 搜尋結果的頁數
            "page_index": 0, // 所回應的資料的分頁索引
            "page_size": 14 // request 的 page_size, 原樣傳回
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

            if(Main.useFakeData && fakeDataName)
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