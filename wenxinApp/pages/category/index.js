// pages/category/index.js
import { request } from "../../request/index.js";

Page({
    /**
     * 页面的初始数据
     */
    data: {
        /*  左侧 */
        leftMenuList: [],
        /* 右侧 */
        rightContent: [],
        /*  被点击的大类的索引 */
        DianJiIndex: 0,
        //设置右侧内容距离顶部的距离 要每次点击都要设置
        scrollTop: 0,
    },
    /**
     * 生命周期函数--监听页面加载
     */
    Cates: [],
    onLoad: function(options) {
        /*1. web中的本地存储和 小程序中的本地存储的区别
                    1 写代码的方式不一样了 
                        web: localStorage.setItem("key","value") localStorage.getItem("key")
                    小程序中: wx.setStorageSync("key", "value"); wx.getStorageSync("key");
                    2:存的时候 有没有做类型转换
                    web: 不管存入的是什么类型的数据，最终都会先调用以下 toString(),把数据变成了字符串 再存入进去
                    小程序: 不存在 类型转换的这个操作 存什么类似的数据进去，获取的时候就是什么类型
                2. 先判断一下本地存储中有没有旧的数据
                {time:Date.now(),data:[...]}
                3.没有旧数据 直接发送新请求 
                4.有旧的数据 同时 旧的数据也没有过期 就使用 本地存储中的旧数据即可
                */
        //  1 获取本地存储中的数据  (小程序中也是存在本地存储 技术)
        const Cates = wx.getStorageSync("cates");
        //   2 判断
        if (!Cates) {
            /*  即是Cates为空 发送请求 */
            //不存在发送请求
            this.getCates();
        } else {
            //有旧的数据定义过期时间
            if (Date.now() - Cates.time > 1000 * 10) {
                this.getCates();
            } else {
                console.log("使用的是旧的数据");
                /*  有旧的数据时间没有过期 */
                this.Cates = Cates.data; //使用旧的数据
                //给左右两侧重新赋值 为什么有这步：因为请求方法getCates()中有
                let leftMenuList = this.Cates.map((v) => v.cat_name);
                let rightContent = this.Cates[0].children;
                this.setData({
                    leftMenuList,
                    rightContent,
                });
            }
        }
    },
    async getCates() {
        request({
            //简化：url
            //url: "https://api-hmugo-web.itheima.net/api/public/v1/categories",
            //原因可以在 request/index.js中对路径进行封装
            url: "/categories",
        }).then((result) => {
            this.Cates = result.data.message;
            //保存旧数据  { time: Date.now(),data:this.Cates } 记住格式
            wx.setStorageSync("cates", { time: Date.now(), data: this.Cates });
            let leftMenuList = this.Cates.map((v) => v.cat_name);
            let rightContent = this.Cates[0].children;
            this.setData({
                leftMenuList,
                rightContent,
            });
        });

        //es7 中的简化写法
        /*  const result = await request({ url: "/categories" });
                    this.Cates = result.data.message;
                    //保存旧数据  { time: Date.now(),data:this.Cates } 记住格式
                    wx.setStorageSync("cates", { time: Date.now(), data: this.Cates });
                    let leftMenuList = this.Cates.map((v) => v.cat_name);
                    let rightContent = this.Cates[0].children;
                    this.setData({
                        leftMenuList,
                        rightContent,
                    }); */
    },
    handleIndex(e) {
        /*  点击函数; */

        const index = e.currentTarget.dataset.index;
        let rightContent = this.Cates[index].children; /* 设置右侧索引 */
        this.setData({
            DianJiIndex: index,
            rightContent,
            //设置右侧scroll-view 到顶部的距离
            scrollTop: 0,
        });
    },
});