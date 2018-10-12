const statis = require('../utils/statis');

module.exports = Behavior({

    behaviors: [],
    properties: {},

    data: {
        pageLoadTime: 0 //页面加载时间
    },

    load() {
        //页面初次加载时记录
        this.data.pageLoadTime = (new Date()).valueOf();
    },

    ready() {

    },

    methods: {
    }
});