/**
 * @name: CommoditList
 * @author: Hahn
 * @date: 2020/6/16 11:52 下午
 * @description：CommoditList
 * @update: 2020/6/16 11:52 下午
 */

class CommoditList {
    data = []
    currentSkuList = []
    allSpecsList = []
    selectable = []

    constructor(data) {
        this.data = data
    }

  

    // 得到默认的规格数据
    _getCurrentSkuList() {
        this.currentSkuList = this.data.sku_list.map(item => item.specs);
    }

    // 得到用于处理的数组
    _transMatrix() {
        this._getCurrentSkuList();

        let transResult = {};

        this.currentSkuList.forEach(specs => {
            specs.forEach(item => {
                if (!transResult[item['key_id']]) {
                    transResult[item['key_id']] = {
                        key_id: item['key_id'],
                        key: item['key'],
                        value_list: {
                            [item['value_id']]: {
                                value_id: item['value_id'],
                                value: item['value'],
                                selected: false,
                                disabled: false
                            }
                        }
                    }
                } else if (!transResult[item['key_id']].value_list[item['value_id']]) {
                    transResult[item['key_id']].value_list[item['value_id']] = {
                        value_id: item['value_id'],
                        value: item['value'],
                        selected: false,
                        disabled: false
                    }
                }
            })
        })
        return transResult;
    }

    // 得到全部规格
    getAllSpecsList() {
        const transResult = this._transMatrix();
        this.allSpecsList = Object.keys(transResult).map(key => {
            let obj = JSON.parse(JSON.stringify(transResult[key]));
            obj.value_list = Object.keys(obj.value_list).map(vk => obj.value_list[vk]);
            return obj;
        })
        return this.allSpecsList;
    }

    // 得到全部可能的点击选项
    getSelectable() {
        if (this.allSpecsList.length === 0) {
            this.allSpecsList()
        }

        if (this.currentSkuList.length === 0) {
            this.currentSkuList = this.data.map(item => item.specs);
        }

        const rowLength = this.allSpecsList.length;

        for (let row = 0; row < rowLength; row++) {
            let {key_id, key} = this.allSpecsList[row];
            let columnList = this.allSpecsList[row].value_list;
            this.selectable[key_id] = {
                key_id,
                key,
                selectableList: {}
            }
            for (let column = 0; column < columnList.length; column++) {
                let {value_id, value} = columnList[column];
                this.selectable[key_id].selectableList[value_id] = {
                    value_id,
                    value,
                    matchItems: null
                }
            }

            this.currentSkuList.forEach(specificSpecs => {
                let matchItems = {};
                let currentVlaueId = '';
                specificSpecs.forEach(specsItem => {
                    if (specsItem.key_id !== key_id) {
                        matchItems[specsItem.key_id] = [specsItem]
                    } else {
                        currentVlaueId = specsItem.value_id;
                    }
                })

                if (!this.selectable[key_id].selectableList[currentVlaueId].matchItems) {
                    this.selectable[key_id].selectableList[currentVlaueId].matchItems = matchItems;
                } else {
                    Object.keys(this.selectable[key_id].selectableList[currentVlaueId].matchItems).forEach(k => {
                        this.selectable[key_id].selectableList[currentVlaueId].matchItems[k].push(...matchItems[k])
                    })
                }

            })
        }

        return this.selectable;
    }


}

export {
    CommoditList
}