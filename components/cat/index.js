import {Cat} from "../../model/Cat";

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        total: Number
    },

    /**
     * 组件的初始数据
     */
    data: {
        isCat: false,
        catList: [],


    },

    lifetimes: {
        async attached() {
        }
    },

    /**
     * 组件的方法列表
     */
    methods: {

        // 添加商品
        upDataCat(e) {

            const cat = new Cat()
            const commoditList = cat.getCommoditData()

            let count = 0;

            let fristId = ''
            let fristTitle = ''
            let secondId = 0
            let secondTitle = ''
            commoditList.forEach(item => {

                fristId = item.id
                fristTitle = item.title

                if (item.id === e.target.dataset.item.fristId) {

                    item.items.forEach(value => {

                        secondId = value.id
                        secondTitle = value.title

                        for (let i = 0; i < value.sku_list.length; i++) {

                            if (value.sku_list[i].id === e.target.dataset.item.id) {

                                value.sku_list[i].num = e.detail.count
                                cat.item = value.sku_list[i]

                                cat.item.fristId = fristId
                                cat.item.fristTitle = fristTitle
                                cat.item.secondId = secondId
                                cat.item.secondTitle = secondTitle

                                cat.item.num = e.detail.count

                            }

                            count += value.sku_list[i].num

                        }

                    })

                    if (item.id === e.target.dataset.item.fristId) {
                        item.num = count
                    }
                }
            })


            let num = 0
            commoditList.forEach(s => {
                s.items.forEach(value => {
                    if (value.id === e.target.dataset.item.secondId) {
                        value.sku_list.forEach(i => {
                            num += i.num
                            value.num = num
                        })
                    }
                })
            })

            cat.saveData(cat)
            cat.setCommoditData(commoditList)

            let catList = cat.getCatData()

            this.setData({
                catList: catList,
            })

            this.triggerEvent('upDataCat')
        },

        // 购物车
        catTap() {


            this.data.isCat = false

            let that = this

            // 因为lin-ui有事件冲突所以使用骚操作
            let timer = setTimeout(function () {

                that.setData({
                    isCat: true
                })

                clearTimeout(timer)
            }, 0 * 1000)
        },

        // 打开购物车
        openCatTap() {
            let cat = new Cat()
            let catList = cat.getCatData()


            this.data.isCat = !this.data.isCat
            this.setData({
                isCat: this.data.isCat,
                catList: catList,
            })
        },

        // 关闭购物车
        clearTap() {
            this.data.isCat = false
            this.setData({
                isCat: false
            })
        },

        // 清除数据
        clearDataTap() {
            this.triggerEvent('clearDataTap')
        }

    }
})
