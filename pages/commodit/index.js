

Page({
    data: {
        backStyle: 'simple',
        fixed: true,
        type: '',
    },

    async onLoad(e) {


        switch (e.type) {
            case 'daodian':
                this.data.type = 'daodian'
                break
            case 'waimai':
                this.data.type = 'waimai'
                break
            case 'tiqian':
                this.data.type = 'tiqian'
                break
            default:
                break
        }

        this.setData({
            type: this.data.type
        })
    }

})