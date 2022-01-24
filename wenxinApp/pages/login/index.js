Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },
    getUserProfile(e) {
        console.log(e)
            // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
            // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
        wx.getUserProfile({
            desc: '用于获取个人资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
            success: (res) => {
                wx.setStorageSync("userInfo", res.userInfo), //存缓存中
                    wx.navigateBack({
                        delta: 1 //返回的页面数(此处返回一个页面)， 如果 delta 大于现有页面数， 则返回到首页。
                    })
            },
        })
    },

})