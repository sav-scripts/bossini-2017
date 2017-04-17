/*
* 使用者上傳作品, 將上傳的圖片和分享用圖合成後, 傳回該筆資料的唯一ID和合成後的分享圖片網址
*
* * 須檢查 fb_token 是否有效
* ** 圖片上傳後, 除了原圖 (600 x600) 和分享圖之外, 須另生成縮圖 (180 x 180) 供日後調用
*/


/* 前端送出 */
var send =
{
    "first_name": "大頭", // 名字
    "last_name": "陳", // 姓氏
    "gender": "男", // 性別  男/女

    "email": "someone@some.where", // 使用者email
    "phone": "0987654321", // 使用者手機

    "address_county": "台北市", // 地址-縣市
    "address_zone": "中山區", // 地址-區
    "address_detail": "xx路xx巷xx號", //地址-細節

    "fb_uid": "231356646542", // facebook uid
    "fb_token": "asdf89f79asfsdf678asf0sadfasf", // facebook access token

    "image_data": "somebase64string", // image data, base 64 string, jpeg 格式, 已去除開頭 "data:image/jpeg;base64," 字串,
    "description": "一些人生感言" // 使用者輸入文字
};


/* 後端回應 */
var response =
{
    "error": "some error",  // 正常執行的話傳回空值, 有錯傳回錯誤訊息 (除非我們協定過的特殊錯誤, 不然此訊息會直接 alert 給使用者)
    "serial": "0001", // 如果作品成功立案, 傳回該案的唯一ID
    "share_image_url": "http://xxx.xx/xxx.jpg" // 合成後的分享圖片, 供分享到 facebook
};