// pages/cart/index.js
import {
    getSetting,
    openSetting,
    chooseAddress,
    showModel,
} from "../../utils/asnyc.js";
Page({
    //获取用户的收货地址
    //1 绑定点击事件
    //2 调用小程序内置 api 获取用户的收货地址 wx.chooseAddress

    //2 获取 用户 对小程序 所授予 获取地址的 权限 状态 scope
    //  1 假设 用户 点击获取收货地址的提示框 确定 authSetting scope.address
    //  scope 值 true 直接调用 获取收货地址
    //  2 假设 用户 从来没有调用过 收货地址的api
    //  scope undefined 直接调用 获取收货地址
    // 3 假设 用户 点击获取收货地址的提示框 取消
    //  scope 值 false
    //  1 诱导用户 自己 打开 授权设置页面(wx.openSetting) 当用户重新给与 获取地址权限的时候
    // 2 获取收货地址
    // 4 把获取到的收货地址 存入到 本地存储中
    data: {
        address: {}, //收件人的信息
        cart: [],
        totalPrice: 0, //选中的总价
        totalNum: 0, //选中的总数量
    },
    //监听页面显示 页面变化随时监听
    onShow() {
        // 获取缓存中的address 有""号
        const address = wx.getStorageSync("address"); //
        const cart = wx.getStorageSync("cart") || []; //这是从缓存拿到的数据  ||[]如果是空的话变成空数组
        /* filter() 方法创建一个新的数组，新数组中的元素是通过检查指定数组中符合条件的所有元素。 */
        const cartCheck = cart.filter((v) => v.checked);
        // ages.filter(check)   ages代表check的参数
        //作用 监听并改变复选框的变化
        let totalPrice = 0;
        let totalNum = 0;
        //every()方法 每个返回值为真或者cart数组为空时 allCheck才为true
        //不全为真时 返回allCheck为false
        cartCheck.forEach((v) => {
            /* forEach循环 */
            //计算值 当cart中的checked为真才算
            totalPrice += v.num * v.goods_price;
            totalNum += v.num;
        });
        this.setData({
            //赋值
            cart: cartCheck,

            totalNum,
            totalPrice,
            address,
        });
    },
    async handleOrderPay() {
        try {
            // 1 判断缓存中有没有token
            const token = wx.getStorageSync("token");
            // 2 判断
            if (!token) {
                wx.navigateTo({
                    url: "/pages/auth/index",
                });
                return;
            }
            // 3 创建订单
            // 3.1 准备 请求头参数
            // const header = { Authorization: token };
            // 3.2 准备 请求体参数
            const order_price = this.data.totalPrice;
            const consignee_addr = this.data.address.all;
            const cart = this.data.cart;
            let goods = [];
            cart.forEach((v) =>
                goods.push({
                    goods_id: v.goods_id,
                    goods_number: v.num,
                    goods_price: v.goods_price,
                })
            );
            const orderParams = { order_price, consignee_addr, goods };
            // 4 准备发送请求 创建订单 获取订单编号
            const { order_number } = await request({
                url: "/my/orders/create",
                method: "POST",
                data: orderParams,
            });
            // 5 发起 预支付接口
            const { pay } = await request({
                url: "/my/orders/req_unifiedorder",
                method: "POST",
                data: { order_number },
            });
            // 6 发起微信支付
            await requestPayment(pay);
            // 7 查询后台 订单状态
            const res = await request({
                url: "/my/orders/chkOrder",
                method: "POST",
                data: { order_number },
            });
            await showToast({ title: "支付成功" });
            // 8 手动删除缓存中 已经支付了的商品
            let newCart = wx.getStorageSync("cart");
            newCart = newCart.filter((v) => !v.checked);
            wx.setStorageSync("cart", newCart);

            // 8 支付成功了 跳转到订单页面
            wx.navigateTo({
                url: "/pages/order/index",
            });
        } catch (error) {
            await showToast({ title: "支付失败" });
            console.log(error);
        }
    },
});