// pages/user/index.js
Page({
    data: {
        userInfo: {},
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        const userInfo = wx.getStorageSync("userInfo");
        this.setData({
            userInfo,
        });
    },
});