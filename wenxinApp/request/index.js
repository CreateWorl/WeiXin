/* resolve返回成功的 reject 返回不成功   params 传入的是url地址*/
// 写加载页面
let ajaxNumber = 0;
export const request = (params) => {
    ajaxNumber++;
    wx.showLoading({
        title: "加载中",
        mask: true,
        /*     success: (result) => {}, //成功执行
                        fail: () => {},         //失败执行
                        complete: () => {},     //都会执行 可以用于结束加载 */
    });
    const baseUrl = "https://api-hmugo-web.itheima.net/api/public/v1";
    return new Promise((resolve, reject) => {
        wx.request({
            ...params,
            url: baseUrl + params.url,
            /* params 传入的是url地址 */
            success: (result) => {
                resolve(result);
            },
            fail: (err) => {
                reject(err);
            },
            complete: () => {
                //主页中 有三个请求 要关闭 不要关三次
                ajaxNumber--;
                if (ajaxNumber === 0) {
                    wx.hideLoading();
                }
            },
        });
    });
};