// pages/login/index.js
/* 引入用来发送的请求 */
import { request } from "../../request/index.js";
Page({
    /**
     * 页面的初始数据
     */
    data: {
        /*  轮播图 */
        swiperList: [],
        /*  导航栏 */
        catesList: [],
        /* 楼层 */
        floorList: [],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        /*    var reqTask = wx.request({
            url: "https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata",

            success: (result) => {
                console.log(result);
                this.setData({
                    swiperList: result.data.message,
                });
            },
        }); */
        /* 通过then接收响应结果 */
        this.getLunBo();
        this.getDaoHang();
        this.Floor();
    },
    getLunBo() {
        request({
            //简化：url
            //url: "https://api-hmugo-web.itheima.net/api/public/v1/categories",
            //原因可以在 request/index.js中对路径进行封装
            url: "/home/swiperdata",
        }).then((result) => {
            this.setData({
                swiperList: result.data.message,
            });
        });
    },
    getDaoHang() {
        request({
            //简化：url
            //url: "https://api-hmugo-web.itheima.net/api/public/v1/categories",
            //原因可以在 request/index.js中对路径进行封装
            url: "/home/catitems",
        }).then((result) => {
            this.setData({
                catesList: result.data.message,
            });
        });
    },
    Floor() {
        request({
            //简化：url
            //url: "https://api-hmugo-web.itheima.net/api/public/v1/categories",
            //原因可以在 request/index.js中对路径进行封装
            url: "/home/floordata",
        }).then((result) => {
            this.setData({
                floorList: result.data.message,
            });
        });
    },
});