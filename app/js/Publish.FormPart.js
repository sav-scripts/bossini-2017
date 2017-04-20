/**
 * Created by sav on 2017/4/19.
 */
(function(){

    var $doms = {},
        _isHiding = true;

    var self = window.Publish.FormPart =
    {
        init: function($container, $parent)
        {
            $doms.container = $container;
            $doms.parent = $parent;

            TweenMax.set($doms.container,{autoAlpha:0, marginLeft: -50});

            $doms.fields =
            {
                firstName: $doms.container.find(".field-first-name"),
                lastName: $doms.container.find(".field-last-name"),

                email: $doms.container.find(".field-email"),
                phone: $doms.container.find(".field-phone"),

                genderSelect: $doms.container.find(".gender-select"),

                addressCounty: $doms.container.find(".address-county"),
                addressZone: $doms.container.find(".address-zone"),

                addressDetail: $doms.container.find(".field-address-detail")
            };

            $doms.eulaCheckbox = $doms.container.find(".eula-checkbox input");
            $doms.informCheckbox = $doms.container.find(".inform-checkbox input");

            FormHelper.completeCounty($doms.fields.addressCounty, $doms.fields.addressZone);

            $doms.btnSend = $doms.container.find(".btn-send").on(_CLICK_, function()
            {
                trySend();
                //Publish.toStep('success');
            });

            return self;
        },

        show: function(cb)
        {
            if(!_isHiding) return;
            _isHiding = false;

            $doms.parent.toggleClass('success-mode', false);
            $doms.parent.toggleClass('coupon-mode', false);

            TweenMax.set($doms.container,{autoAlpha:0, marginLeft: -50});
            TweenMax.to($doms.container,.4,{autoAlpha:1, marginLeft: 0, onComplete: cb});
        },

        hide: function(cb)
        {
            if(_isHiding) return;
            _isHiding = true;

            $doms.container.css
            ({
                'opacity': '',
                'margin-left': '',
                'visibility': ''
            });

            if(cb) cb.call();
            //TweenMax.to($doms.container,.4,{autoAlpha:0, marginLeft: 50, onComplete: cb});
        }
    };

    function trySend()
    {
        Publish.Coupon.setCouponUrl(null);

        var formObj = checkForm();
        //var formObj = {};

        if(formObj)
        {
            var canvas = Publish.getCombinedCanvas();

            if(canvas)
            {
                formObj.image_data = canvas.toDataURL("image/jpeg", .95).replace(/^data:image\/jpeg;base64,/, "");

                formObj.description = Publish.getInputText();

                formObj.fb_uid = FBHelper._uid;
                formObj.fb_token = FBHelper._token;

                Loading.progress('資料傳輸中 ... 請稍候').show();

                ApiProxy.callApi("publish", formObj, true, function(response)
                {
                    if(response.error)
                    {
                        alert(response.error);
                    }
                    else
                    {
                        //alert('資料送出成功');

                        Publish.Success.setShareImageUrl(response.share_url);
                        Publish.Coupon.setCouponUrl(response.coupon);

                        Publish.toStep('success');
                    }

                    Loading.hide();
                });

            }
            else
            {
                alert('lack image data');
            }
        }

    }

    function checkForm()
    {
        var formObj={};
        var dom;

        if(!$doms.eulaCheckbox[0].checked)
        {
            alert('您必須同意遵守活動相關規範才能參加活動');
            return;
        }

        formObj.inform_allowed = $doms.informCheckbox[0].checked? 'true': 'false';

        formObj.gender = $doms.fields.genderSelect.val();
        if(!formObj.gender)
        {
            alert('請選擇您的性別');
            return;
        }


        dom = $doms.fields.lastName[0];
        if(PatternSamples.onlySpace.test(dom.value))
        {
            alert('請輸入您的姓氏'); dom.focus(); return;
        }else formObj.last_name = dom.value;

        dom = $doms.fields.firstName[0];
        if(PatternSamples.onlySpace.test(dom.value))
        {
            alert('請輸入您的名字'); dom.focus(); return;
        }else formObj.first_name = dom.value;

        dom = $doms.fields.email[0];
        if(!PatternSamples.email.test(dom.value))
        {
            alert('請輸入正確的電子郵件信箱'); dom.focus(); return;
        }
        else formObj.email = dom.value;

        dom = $doms.fields.phone[0];
        if(!PatternSamples.phone.test(dom.value))
        {
            alert('請輸入正確的手機號碼'); dom.focus(); return;
        }
        else formObj.phone = dom.value;

        var addressValue = FormHelper.getAddressValue($doms.fields.addressCounty, $doms.fields.addressZone);

        if(!addressValue.county)
        {
            alert('請選擇您居住的縣市'); return;
        }

        if(!addressValue.zone)
        {
            alert('請選擇您居住的地區'); return;
        }

        formObj.address_county = addressValue.county;
        formObj.address_zone = addressValue.zone;


        dom = $doms.fields.addressDetail[0];
        if(PatternSamples.onlySpace.test(dom.value))
        {
            alert('請輸入詳細的地址'); dom.focus(); return;
        }else formObj.address_detail = dom.value;

        return formObj;

    }

}());