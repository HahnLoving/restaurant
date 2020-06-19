// components/commodit-list/index.js
import {Cat} from "../../model/Cat";

const constants = require('../../utils/constants.js');

Component({
    /**
     * 组件的属性列表
     */
    properties: {},

    /**
     * 组件的初始数据
     */
    data: {

        //模拟 数据
        constants: [],

        isShowCommodit: false,
        isShowSpec: false,
        popupData: [],
        popupDataId: '',
        isCat: false,
        catList: [],
        total: 0.00,
        name: '',
    },


    lifetimes: {
        async attached() {

            var that = this

            //导航栏自适应
            let systemInfo = wx.getSystemInfoSync();
            let reg = /ios/i;
            let pt = 20;//导航状态栏上内边距
            let h = 44;//导航状态栏高度
            if (reg.test(systemInfo.system)) {
                pt = systemInfo.statusBarHeight;
                h = 44;
            } else {
                pt = systemInfo.statusBarHeight;
                h = 48;
            }


            const cat = new Cat()
            //高度大小
            wx.getSystemInfo({
                success: function (res) {
                    var height = res.windowHeight - h - pt - 50

                    // cat.setCommoditData(constants.constants)

                    let catList = cat.getCatData()
                    if (catList.length > 0) {
                        that.data.isCat = true
                    } else {
                        that.data.isCat = false
                    }

                    let data = []

                    if (cat.getCommoditData().length > 0) {
                        data = cat.getCommoditData()
                    } else {
                        cat.setCommoditData(constants.constants)
                        data = constants.constants
                    }

                    let total = ''
                    if (catList.length > 0) {
                        total = cat.getTotal()
                    }

                    that.data.constants = data
                    that.setData({
                        height: height,
                        isCat: that.data.isCat,
                        total: total
                    })
                }
            });


        }
    },

    /**
     * 组件的方法列表
     */
    methods: {

        // 单个sku添加删除商品
        countTap(e) {
            const cat = new Cat()

            let count = 0;
            this.data.constants.forEach(item => {

                if (item.id === e.target.dataset.id) {

                    e.target.dataset.item.sku_list[0].fristId = item.id
                    e.target.dataset.item.sku_list[0].fristTitle = item.title

                    item.items.forEach(value => {

                        e.target.dataset.item.sku_list[0].secondId = value.id
                        e.target.dataset.item.sku_list[0].secondTitle = value.title

                        if (value.sku_list[0].id === e.target.dataset.item.sku_list[0].id) {
                            value.sku_list[0].num = e.detail.count
                            value.num = e.detail.count
                        }
                        value.sku_list.forEach(s => {
                            count += s.num
                            return
                        })

                    })
                    item.num = count
                    return
                }
            })

            cat.item = e.target.dataset.item.sku_list[0]
            cat.item.num = e.detail.count

            cat.saveData(cat)
            let catList = cat.getCatData()
            if (catList.length > 0) {
                this.data.isCat = true
            } else {
                this.data.isCat = false
            }


            cat.setCommoditData(this.data.constants)
            let total = cat.getTotal()
            this.setData({
                constants: this.data.constants,
                isCat: this.data.isCat,
                total: total
            })
        },

        // 显示关闭商品详情
        commoditTap(e) {


            if (e.detail.isShowCommodit) {
                this.data.isShowCommodit = e.detail.isShowCommodit
            } else {
                this.data.isShowCommodit = !this.data.isShowCommodit
            }

            if (e.target.dataset.item === undefined) {
                this.setData({
                    isShowCommodit: this.data.isShowCommodit,
                })
            } else {
                this.setData({
                    isShowCommodit: this.data.isShowCommodit,
                    popupData: e.target.dataset.item,
                    popupDataId: e.target.dataset.badid,
                })
            }


        },

        // 商品规格
        tagTap(e) {

            this.setData({
                isShowSpec: false
            })

            let that = this

            if (e) {
                that.data.popupData = e.target.dataset.item
                that.data.popupDataId = e.target.dataset.badid
            }

            // 因为lin-ui有事件冲突所以使用骚操作
            let timer = setTimeout(function () {

                that.setData({
                    isShowSpec: true,
                    popupData: that.data.popupData,
                    popupDataId: that.data.popupDataId,
                })

                clearTimeout(timer)
            }, 0.1 * 1000)


        },

        // 商品详情加入购物车
        goToCatTap(e) {
            this.commoditTap(e)

            if (e.detail.isSpec) {
                this.tagTap()
            } else {
                const cat = new Cat()

                let catList = cat.getCatData()
                if (catList.length > 0) {
                    this.data.isCat = true
                } else {
                    this.data.isCat = false
                }

                let total = cat.getTotal()
                this.setData({
                    // constants: commoditList,
                    isCat: this.data.isCat,
                    total: total
                })

                this.search(this.data.name)
            }

        },


        // 规格更新
        upDataCat() {
            const cat = new Cat()

            let catList = cat.getCatData()
            if (catList.length > 0) {
                this.data.isCat = true
            } else {
                this.data.isCat = false
            }

            let total = cat.getTotal()
            this.setData({
                isCat: this.data.isCat,
                total: total
            })

            this.search(this.data.name)
        },

        //
        moreTap(e) {

        },

        // 清除数据
        clearDataTap() {
            0
            const cat = new Cat()
            cat.clearData()


            let catList = cat.getCatData()
            if (catList.length > 0) {
                this.data.isCat = true
            } else {
                this.data.isCat = false
            }

            this.setData({
                isCat: this.data.isCat,
                total: 0
            })

            this.search(this.data.name)
        },

        // 搜索监听
        searchTap(e) {
            this.search(e.detail.value)
        },

        // 搜索渲染搜索结果
        search(name){
            this.data.name = name

            let cat = new Cat()
            let data = []
            if (cat.getCommoditData().length > 0) {
                data = cat.getCommoditData()
            } else {
                cat.setCommoditData(constants.constants)
                data = constants.constants
            }

            let seachArr = []
            let i = 0
            data.forEach(item=>{
                seachArr[i] = {}
                seachArr[i].id = item.id
                seachArr[i].title = item.title
                seachArr[i].num = item.num
                item.items.forEach(value => {

                    if ((value.title.indexOf(name) != -1) && (name != '')){
                        let demo = value
                        seachArr[i].items = []
                        seachArr[i].items.push(demo)
                    }else {
                        seachArr[i].items = []
                    }
                })
                i++
            })


            this.setData({
                constants:seachArr
            })
        }

    }
})
