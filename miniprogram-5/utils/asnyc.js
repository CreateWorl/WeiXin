//封装原生方法
//获取劝限的方法
export const getSetting = () => {
    return new Promise((resolve, reject) => {
        wx.getSetting({
            success: (result) => {
                resolve(result);
            },
            fail: (err) => {
                reject(err);
            },
        });
    });
};
//获取用户的收货地址
export const chooseAddress = () => {
    return new Promise((resolve, reject) => {
        wx.chooseAddress({
            success: (result) => {
                resolve(result);
            },
            fail: (err) => {
                reject(err);
            },
        });
    });
};
//诱导打开授权页面
export const openSetting = () => {
    return new Promise((resolve, reject) => {
        wx.openSetting({
            success: (result) => {
                resolve(result);
            },
            fail: (err) => {
                reject(err);
            },
        });
    });
};
//promise 形式的 showModel
export const showModel = ({ content }) => {
    return new Promise((resolve, reject) => {
        wx.showModal({
            title: "提示",
            content: content,
            showCancel: true,
            cancelText: "取消",
            cancelColor: "#000000",
            confirmText: "确定",
            confirmColor: "#3CC51F",
            success: (result) => {
                //success(result){}如果这样写 this 无法穿透
                resolve(result); //成功获取 resolve 返回result
            },
            fail: (err) => {
                reject(err); //失败获取 reject  返回err
            },
        });
    });
};