
const clone = require('../../../vendor/lodash.clone/index');

Component({

    /**
     * 组件的属性列表
     */
    properties: {
        topicHeight: {
            type: Object,
            value: {},
            observer(newValue) {
                this.setData({
                    topicItem: clone(newValue)
                })
            }
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        topicItem: null
    },

    /**
     * 组件的方法列表
     */
    methods: {

    }
});