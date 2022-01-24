// pages/goods_detail/index.js
import { request } from "../../request/index.js";
import regeneratorRuntime from "../../lib/runtime/runtime";
Page({
    /**
     * 页面的初始数据
     */
    data: { goodsDetailObj: {} },
    GoodsInfo: {},
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        const goods_id = options.goods_id;
        console.log(goods_id);
        this.getGoodsDetail(goods_id);
    },
    //获得商品
    getGoodsDetail(goods_id) {
        request({
            url: "/goods/detail",
            data: { goods_id }, //这是为啥嘞
        }).then((result) => {
            console.log(result);
            this.GoodsInfo = result.data.message; //GoodsInfo是全局的变量
            this.setData({
                goodsDetailObj: {
                    //此步目的不用向后端申请很多数据 申请需要的数据
                    goods_name: result.data.message.goods_name,
                    goods_price: result.data.message.goods_price,
                    //正则表达式 改变图片格式
                    goods_introduce: result.data.message.goods_introduce.replace(
                        "/.webp/g",
                        ".jpg"
                    ),
                    pics: result.data.message.pics,
                },
            });
        });
    },
    /* 方法二   */
    /*    //es7 解码
                              async getGoodsDetail(goods_id) {
                                  const result = await request({
                                      url: "/goods/detail",
                                      data: { goods_id }, //这是为啥嘞
                                  });
                                  this.GoodsInfo = result.data.message;
                                  this.setData({
                                      goodsDetailObj: {
                                          //此步目的不用向后端申请很多数据
                                          goods_name: result.data.message.goods_name,
                                          goods_price: result.data.message.goods_price,
                                          //正则表达式 改变图片格式
                                          goods_introduce: result.data.message.goods_introduce,
                                          pics: result.data.message.pics,
                                      },
                                  });
                              }, */
    FangDa(e) {
        // map() 集合格式  重新给图片一个数组
        const urls = this.GoodsInfo.pics.map((v) => v.pics_mid);
        //接收传递来的照片url
        console.log("FangDa" + e.currentTarget.dataset.url);
        const current = e.currentTarget.dataset.url;
        /*    wx.previewImage({
                     current: '',
                     urls: [],
                     success: (result) => {
                       
                     },
                     fail: () => {},
                     complete: () => {}
                   }); */
        wx.previewImage({
            current: current,
            urls: urls,
        });
    },
    /* 点击 加入购物车
        1 先绑定点击事件
        2 获取缓存中的购物车数据 数组格式
        3 先判断 当前的商品是否已经存在于 购物车
        4 已经存在 修改商品数据 执行购物车数量++重新把购物车数组 填充回缓存中
        5 不存在于购物车的数组中 直接给购物车数组添加一个新元素 新元素 带上 购买数量属性 num 重新把购物车数组 填充回缓存中
        6 弹出提示 */
    handleCartAdd() {
        let cart = wx.getStorageSync("cart") || [];
        //||[]确保是一个数组
        let index = cart.findIndex((v) => v.goods_id === this.GoodsInfo.goods_id);
        /* index 不存在是反回-1 存在是索引 
        this.GoodsInfo.goods_id是刚传过来的
        */
        if (index === -1) {
            this.GoodsInfo.num = 1;//手动添加属性 购物车中选中几次
            this.GoodsInfo.checked =true;//是否选中
            //添加到数组中
            cart.push(this.GoodsInfo);
        } else {
            //已经存在的数据num++
            cart[index].num++;
        }
        //将购物车数据重新加入缓存中
        wx.setStorageSync("cart", cart);
        wx.showToast({
            title: "已加入",
            icon: "true",
            duration: 1500,
            mask: true, //一段时间内只可以点击一次
        });
    },
});