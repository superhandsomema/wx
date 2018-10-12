
const clone = require('../../../vendor/lodash.clone/index');

Component({

    /**
     * 组件的属性列表
     */
    properties: {
        topic: {
            type: Object,
            value: {},
            observer(newValue) {
                this.setData({
                    topicData: clone(newValue)
                })
            }            
        },

    },

    /**
     * 组件的初始数据
     */
    data: {
        topicData: {}
    },

    ready() {
	
    },

    /**
     * 组件的方法列表
     */
    methods: {
    }
});