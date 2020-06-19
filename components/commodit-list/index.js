// components/commodit-list/index.js
import {Cat} from "../../model/Cat";

const constants = require('../../utils/constants.js');
// 右侧每一类的 bar 的高度（固定）
const RIGHT_BAR_HEIGHT = 30;
// 右侧每个子类的高度（固定）
const RIGHT_ITEM_HEIGHT = 140;
// 左侧每个类的高度（固定）
const LEFT_ITEM_HEIGHT = 60


Component({
    /**
     * 组件的属性列表
     */
    properties: {},

    /**
     * 组件的初始数据
     */
    data: {
        // //是否显示下面的购物车
        // //购物车的商品
        // myCat: [],
        // // 购物车的数量
        // num: 0,

        //模拟 数据
        constants: [],
        // 左 => 右联动 右scroll-into-view 所需的id
        toView: null,
        // 当前左侧选择的
        currentLeftSelect: null,
        // 右侧每类数据到顶部的距离（用来与 右 => 左 联动时监听右侧滚动到顶部的距离比较）
        eachRightItemToTop: [],
        leftToTop: 0,


        isShowCommodit: false,
        isShowSpec: false,
        popupData: [],
        popupDataId: '',
        isCat: false,
        catList: [],
        total: 0.00,
    },


    lifetimes: {
        async attached() {

        },

    },

    /*组件所在页面的生命周期 */
    pageLifetimes: {
        show: function () {
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


            //高度大小
            wx.getSystemInfo({
                success: function (res) {
                    var height = res.windowHeight - h - pt - 50

                    const cat = new Cat()


                    let data = []
                    if (cat.getCommoditData().length > 0){
                        data = cat.getCommoditData()
                    }else {
                        cat.setCommoditData(constants.constants)
                        data = constants.constants
                    }



                    that.setData({
                        height: height,
                        constants: data,
                        currentLeftSelect: data[0].id,
                        eachRightItemToTop: that.getEachRightItemToTop()
                    })
                }
            });

        },
    },


    /**
     * 组件的方法列表
     */
    methods: {

        // 获取每个右侧的 bar 到顶部的距离，用来做后面的计算。
        async getEachRightItemToTop() {
            var obj = {};
            var totop = 0;
            // 右侧第一类肯定是到顶部的距离为 0
            obj[constants.constants[0].id] = totop
            // 循环来计算每个子类到顶部的高度
            for (let i = 1; i < (constants.constants.length + 1); i++) {
                totop += (RIGHT_BAR_HEIGHT + constants.constants[i - 1].items.length * RIGHT_ITEM_HEIGHT)
                // 这个的目的是 例如有两类，最后需要 0-1 1-2 2-3 的数据，所以需要一个不存在的 'last' 项，此项即为第一类加上第二类的高度。
                obj[constants.constants[i] ? constants.constants[i].id : 'last'] = totop
            }
            return obj
        },


        // 监听右侧的滚动事件与 eachRightItemToTop 的循环作对比 从而判断当前可视区域为第几类，从而渲染左侧的对应类。
        async right(e) {

            for (let i = 0; i < this.data.constants.length; i++) {
                let data = await this.data.eachRightItemToTop
                let left = data[this.data.constants[i].id]
                let right = data[this.data.constants[i + 1] ? this.data.constants[i + 1].id : 'last']

                if (e.detail.scrollTop < right && e.detail.scrollTop >= left) {

                    this.setData({
                        currentLeftSelect: this.data.constants[i].id,
                        leftToTop: LEFT_ITEM_HEIGHT * i
                    })
                }
            }
        },


        // 左侧类的点击事件，点击时，右侧会滚动到对应分类
        async left(e) {

            this.setData({
                toView: e.target.id || e.target.dataset.id,
                currentLeftSelect: e.target.id || e.target.dataset.id
            })
        },

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
                const commoditList = cat.getCommoditData()

                let catList = cat.getCatData()
                if (catList.length > 0) {
                    this.data.isCat = true
                } else {
                    this.data.isCat = false
                }

                let total = cat.getTotal()
                this.setData({
                    constants: commoditList,
                    isCat: this.data.isCat,
                    total: total
                })
            }

        },


        // 规格更新
        upDataCat() {
            const cat = new Cat()
            const commoditList = cat.getCommoditData()

            let catList = cat.getCatData()
            if (catList.length > 0) {
                this.data.isCat = true
            } else {
                this.data.isCat = false
            }

            let total = cat.getTotal()
            this.setData({
                constants: commoditList,
                isCat: this.data.isCat,
                total: total
            })
        },

        //
        moreTap(e) {

        },

        // 清除数据
        clearDataTap() {
            0
            const cat = new Cat()
            cat.clearData()

            const commoditList = cat.getCommoditData()

            let catList = cat.getCatData()
            if (catList.length > 0) {
                this.data.isCat = true
            } else {
                this.data.isCat = false
            }

            this.setData({
                constants: commoditList,
                isCat: this.data.isCat,
                total: 0
            })
        },

        // 搜索
        searchTap() {
            wx.navigateTo({
                url: '../search/index'
            })

        },

    }
})
