// components/TabInput/TabInput.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        tabs: {
            type: Array,
            value: [],
        },
    },

    /**
     * 组件的初始数据
     */
    data: {
        DianJiIndex: 0,
    },

    /**
     * 组件的方法列表
     */
    // 组件中的方法 要写在 methods中
    methods: {
        DianJi(e) {
            const index = e.currentTarget.dataset.index;
            //点击事件触发的时候   this.triggerEvent() 会将事件传递给父组件进而改变父数组
            //格式 this.triggerEvent("父组件自定义事件名称",要传递的参数)
            this.triggerEvent("DianJiFu", index);
            /*   //这样写 也可以改变 点击后  综合 销量 售价的样式 
                    //但是 此方法只是在data中生成一个新的数组 没有改变父类的组件的 isActive
                  let tabs = this.data.tabs;
                  tabs.forEach((v, i)=> i === index ? v.isActive = true : v.isActive = false);
                  this.setData({
                      tabs
                  }) */
        },
    },
});