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
        allChecked: false,
        totalPrice: 0, //选中的总价
        totalNum: 0, //选中的总数量
    },
    //监听页面显示 页面变化随时监听
    onShow() {
        // 获取缓存中的address 有""号
        const address = wx.getStorageSync("address"); //
        const cart = wx.getStorageSync("cart") || []; //这是从缓存拿到的数据  ||[]如果是空的话变成空数组
        this.setCart(cart);
        this.setData({ address });
    },
    async dianJi() {
        /* 普通的编译方式         
wx.getSetting({
success: (result1) => {
const scopeAddress = result1.authSetting["scope.address"];
if (scopeAddress === true || scopeAddress === undefined) {
wx.chooseAddress({
    success: (result2) => {
        console.log(result2);
    },
});
} else {
//诱导打开授权页面
wx.openSetting({
    success: (result3) => {
        wx.chooseAddress({
            success: (result3) => {
                console.log(result3);
            },
        });
    },
});
}
},
}); */
        //获取权限
        //es7 的编码方式
        try {
            //写个异常
            /*   const result1 = await getSetting(); // result1得到的scopeAddress判断是否有权限
       const scopeAddress = result1.authSetting["scope.address"];
       //用字符串的方式
    if (scopeAddress === true || scopeAddress === undefined) {
        const result2 = await chooseAddress(); //如果有
        console.log(result2);
    } else {
        //没有的话
        await openSetting(); // 诱导打开授权页面
        const result2 = await chooseAddress();
        console.log(result2);
    } */ //以上可以不写 官方已经修复Bug
            //调用获取收获地址 api 存入缓存中
            const address = await chooseAddress();
            wx.setStorageSync("address", address);
        } catch (error) {
            console.log(error);
        }
    },
    setCart(cart) {
        //作用 监听并改变复选框的变化
        let allChecked = false; //刚进入购物车的页面 初始化一下
        let totalPrice = 0;
        let totalNum = 0;
        allChecked = cart.every((v) => v.checked); // 判断是否全部选中
        allChecked = cart.length != 0 ? allChecked : false; //判断cart是数组是否为空
        //v是每个循环项 checked是在goods_detail加的
        //every()方法 每个返回值为真或者cart数组为空时 allCheck才为true

        //不全为真时 返回allCheck为false

        cart.forEach((v) => {
            /* forEach循环 */
            if (v.checked) {
                //计算值 当cart中的checked为真才算
                totalPrice += v.num * v.goods_price;
                totalNum += v.num;
            }
        });

        this.setData({
            //赋值
            cart,
            allChecked,
            totalNum,
            totalPrice,
        });
        wx.setStorageSync("cart", cart); //重新存入缓存
    },
    handleChecked(e) {
        //上面全部的复选框选中下面的全选复选框会选中
        const goods_id = e.currentTarget.dataset.id; //获得被修改的对象
        //goods_id对应每个商品
        /*    console.log(goods_id); */
        //获得data里面缓存的数组
        const cart = this.data.cart;
        //找到被修改的数组 的索引
        const index = cart.findIndex((v) => v.goods_id === goods_id);
        //这步是取反
        cart[index].checked = !cart[index].checked;
        this.setCart(cart);
    },

    handleQuanXuan() {
        //全选和反选
        let { cart, allChecked } = this.data;
        console.log(allChecked);
        allChecked = !allChecked;
        cart.forEach((v) => (v.checked = allChecked));
        this.setCart(cart);
    },
    async handlePlusMin(e) {
        //加减功能  注意：1.num等于1 而且用户点击的 operation 是 减的时候 要考虑是否删除
        const goods_id = e.currentTarget.dataset.id; //获取点击商品的id
        const operation = e.currentTarget.dataset.operation; //获取 点击的是加号还是减号
        console.log(goods_id);
        console.log(operation);
        const cart = this.data.cart; //获取data 存的商品数组
        const index = cart.findIndex((v) => v.goods_id === goods_id); //获得商品索引
        //注意：1.num等于1 而且用户点击的 operation 是 减的时候 要考虑是否删除
        if (cart[index].num === 1 && operation === -1) {
            //  一般的编写方式
            /* wx.showModal({
        title: "提示",
        content: "是否删除",
        showCancel: true,
        cancelText: "取消",
        cancelColor: "#000000",
        confirmText: "确定",
        confirmColor: "#3CC51F",
        success: (result) => {      //success(result){}如果这样写 this 无法穿透
            if (result.confirm) {
                cart.splice(index, 1);
                this.setCart(cart);
            }
        },
    }); */
            //es7 的编写方式
            const result = await showModel({ content: "是否删除" });
            if (result.confirm) {
                cart.splice(index, 1); //数组删除元素
                this.setCart(cart);
            }
        } else {
            cart[index].num += operation;
            this.setCart(cart);
        }
    },
    handleZhiFu() {
        //支付页面的代码
        const { address, totalNum } = this.data;
        if (!address.userName) {
            //地址
            wx.showToast({
                title: "没有地址",
                icon: "none",
            });
            return;
        }

        if (totalNum === 0) {
            //是否有商品
            wx.showToast({
                title: "没有商品",
                icon: "none",
            });

            return;
        }
        wx.navigateTo({
            url: "/pages/pay/index",
        });
    },
});