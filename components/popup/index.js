// components/popup/index.js
import {Cat} from "../../model/Cat";

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        popupData: Object,
        popupDataId:String
    },

    /**
     * 组件的初始数据
     */
    data: {
        isShowCommodit: true,
        data: [],
        badId:'',
    },

    observers: {
        'popupData': function (popupData) {
            if (!popupData) {
                return
            }
            this.data = popupData
        },
        'popupDataId': function (popupDataId) {
            if (!popupDataId) {
                return
            }
            this.badId = popupDataId
        }
    },

    lifetimes: {
        async attached() {

        }
    },

    /**
     * 组件的方法列表
     */
    methods: {
        // 显示关闭商品详情
        commoditTap(e) {


            this.data.isShowCommodit = !this.data.isShowCommodit

            this.triggerEvent('commoditTap', {isShowCommodit: this.data.isShowCommodit})
        },

        // 加入购物车
        goToCatTap(){
            const cat = new Cat()
            if (this.data.sku_list.length === 1){

                const commoditList = cat.getCommoditData()

                let count = 0;
                commoditList.forEach(item => {

                    if (item.id === this.badId) {

                        this.data.sku_list[0].fristId = item.id
                        this.data.sku_list[0].fristTitle = item.title

                        item.items.forEach(value => {

                            this.data.sku_list[0].secondId = value.id
                            this.data.sku_list[0].secondTitle = value.title

                            if (value.sku_list[0].id === this.data.sku_list[0].id) {
                                value.sku_list[0].num += 1
                                value.num = value.sku_list[0].num
                                cat.item = this.data.sku_list[0]
                                cat.item.num = value.sku_list[0].num
                            }
                            value.sku_list.forEach(s=>{
                                count += s.num
                                return
                            })
                        })
                        item.num = count
                        return
                    }
                })


                cat.setCommoditData(commoditList)
                cat.saveData(cat)
                this.data.isShowCommodit = !this.data.isShowCommodit
                this.triggerEvent('goToCatTap',{isShowCommodit:this.data.isShowCommodit, isSpec:false})

            }else {
                this.data.isShowCommodit = !this.data.isShowCommodit
                this.triggerEvent('goToCatTap',{isShowCommodit:this.data.isShowCommodit, isSpec:true})
            }
        },

    }
})
