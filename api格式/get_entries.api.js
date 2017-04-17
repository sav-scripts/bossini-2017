/*
 * 取得作品資料, 依作品上傳日期排序, 最新的作品排最前面
 */


/* 前端送出 */
var send =
{
    "page_index": 0, // 分頁索引
    "page_size": 10 // 搜尋的結果如果有多筆的話, 依據 page_size 分頁, 然後傳回 page_index 指定的的分頁的內容
};


/* 後端回應 */
var response =
{
    "error": "some error",  // 正常執行的話傳回空值, 有錯傳回錯誤訊息
    "data": // 搜尋結果 (如果是搜尋流水號的話, 資料最多只會有一筆)
        [
            {
                "serial": "0088", // 作品流水號
                "thumb_url": "http://xxxx.xx/thumbxxx.jpg", // 作品縮圖 url (尺寸 180 x 180)
                "url":  "http://xxxx.xx/imagexxx.jpg" // 作品 url (尺寸 600 x 600)
            }
            // ...以下多筆資料
        ],
    "num_pages": 12, // 搜尋結果的頁數
    "page_index": 0, // 所回應的資料的分頁索引
    "page_size": 10 // request 的 page_size, 原樣傳回
};