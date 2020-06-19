/**
 * @name: Cat
 * @author: Hahn
 * @date: 2020/6/17 3:14 下午
 * @description：Cat
 * @update: 2020/6/17 3:14 下午
 */

class Cat{
    item = {}
    catList = []

    // 保存购物车和商品数据
    saveData(cat){

        // 得到sku的购物车
        this.catList = this.getCatData()

        let dataList = []

        if (this.catList.length > 0){
            for (let i = 0; i < this.catList.length ; i++) {

                if (this.catList[i].id === cat.item.id){
                    this.catList[i] = cat.item

                }else {
                    // dataList.push(cat.item)
                }
                dataList.push(this.catList[i])
            }
            dataList.push(cat.item)
        }else {
            dataList.push(cat.item)
        }


        var data = dataList.filter((x, index,self)=>{
            var list = []
            dataList.forEach((item,i) => {
                list.push(item.id)
            })
            return list.indexOf(x.id) === index
        })

        var list = []
        data.forEach(s=>{
            if (s.num > 0){
                list.push(s)
            }
        })

        wx.setStorageSync('cat', list)
    }

    // 清除购物车和商品数据
    clearData(){
        const commoditList = this.getCommoditData()
        commoditList.forEach(s => {
            s.items.forEach(value => {
                value.sku_list.forEach(i => {
                    i.num = 0
                })
                value.num = 0
            })
            s.num = 0
        })
        this.setCommoditData(commoditList)
        wx.removeStorageSync('cat')
        // wx.removeStorageSync('commodit')
    }

    // 得到购物车
    getCatData(){
       return wx.getStorageSync('cat')
    }

    // 保存商品数据
    setCommoditData(commodit){
        wx.setStorageSync('commodit', commodit)
    }

    // 得到商品数据
    getCommoditData(){
        return wx.getStorageSync('commodit')
    }

    // 得到商品总价
    getTotal(){
        let cat = wx.getStorageSync('cat')
        var num = 0.00
        cat.forEach(s=>{
            var number = (s.price*100) * s.num
            num += number
        })
        return String(num/100)
    }
}

export {
    Cat
}