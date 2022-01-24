// pages/goods_list/index.js
import { request } from "../../request/index.js";
import regeneratorRuntime from "../../lib/runtime/runtime";
Page({
    /**
     * 页面的初始数据
     */
    data: {
        tabs: [{
                id: 0,
                name: "综合",
                isActive: true,
            },
            {
                id: 1,
                name: "销量",
                isActive: false,
            },
            {
                id: 2,
                name: "售价",
                isActive: false,
            },
        ],
        goodsList: [] /* 存放请求的数据 */ ,
    },
    //自定义的
    QueryParams: {
        query: "" /* 关键字 */ ,
        cid: "" /* 分类id */ ,
        pageNum: 1 /* 页码 */ ,
        pagesize: 10 /* 页容量 */ ,
    },
    totalPages: 1,
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.QueryParams.cid = options.cid;
        //  console.log(options);
        this.getGoodList(); //这句只会请求到一页数据
    },
    DianJiHanShu(e) {
        //单击后
        const index = e.detail; //使用 console.log(e) 可以看到e.detail
        let tab2 = this.data.tabs; //让tabs
        tab2.forEach(
            (
                v,
                i //xx.forEach((v,i)=> ) i 是索引 修改v的时候 也会导致原数组被修改
            ) => (i === index ? (v.isActive = true) : (v.isActive = false))
        );
        this.setData({
            tabs: tab2,
        });
    },
    /*  wx.request是小程序客户端与服务器端交互的接口HTTPS 请求
                                    一个微信小程序，只能同时(同时不能大于5个)有5个网络请求
                                    wx.request(OBJECT)
                                    发起网络请求
                                    url
                                    data
                                    header  
                                    method
                                    dataType
                              */
    getGoodList() {
        //获取商品列表
        request({
            url: "/goods/search" /*  地址是封装好的 */ ,
            data: this.QueryParams,
        }).then((result) => {
            const total = result.data.message.total; /* 全部数据 */
            this.totalPages = Math.ceil(
                total / this.QueryParams.pagesize
            ); /* 总页数 */
            /*  console.log(this.totalPages);
                        console.log(result); */
            this.setData({
                /* 数组拼接报错的话可以尝试下： */
                goodsList: this.data.goodsList.concat(result.data.message.goods),
            });
            wx.stopPullDownRefresh(); /* 关闭页面刷新 */
        });
    },
    /*   1 用户上滑页面 滚动条触底 开始加载下一页数据
  1 找到滚动条触底事件  微信小程序官方开发文档寻找
  2 判断还有没有下一页数据
    1 获取到总页数  只有总条数
      总页数 = Math.ceil(总条数 /  页容量  pagesize)
      总页数     = Math.ceil( 23 / 10 ) = 3
    2 获取到当前的页码  pageNum
    3 判断一下 当前的页码是否大于等于 总页数 
      表示 没有下一页数据
  3 假如没有下一页数据 弹出一个提示
  4 假如还有下一页数据 来加载下一页数据
    1 当前的页码 ++
    2 重新发送请求
    3 数据请求回来  要对data中的数组 进行 拼接 而不是全部替换！！！
 */

    onReachBottom() {
        //内置的触底函数
        if (this.QueryParams.pageNum >= this.totalPages) {
            wx.showToast({
                title: "到底了",
            });
        } else {
            this.QueryParams.pageNum++;
            this.getGoodList();
        }
    },
    /*2 下拉刷新页面
            1 触发下拉刷新事件 需要在页面的json文件中开启一个配置项
              找到 触发下拉刷新的事件
            2 重置 数据 数组 
            3 重置页码 设置为1
            4 重新发送请求
            5 数据请求回来 需要手动的关闭 等待效果 */
    onPullDownRefresh() {
        this.setData({
                goodsList: [],
            }),
            (this.QueryParams.pageNum = 1);
        this.getGoodList(); //重新获取
    },
});