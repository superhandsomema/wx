
const config = require('../config');

class DataLoader {


    static getInstance() {
        if (!this.instance) {
            this.instance = new DataLoader();
        }

        return this.instance;
    }


    /**
     * 显示loading效果
     * @param loadingText
     */
    showLoading(loadingText = '加载中') {
        wx.showLoading({
            title: loadingText,
            mask: true
        });
    }

    hideLoading() {
        wx.hideLoading();
    }

    /**
     *
     * 请求接口获得数据
     *
     * @param api 接口路径
     * @param {Number} page 页码
     * @param data 参数
     * @param method HTTP方法
     * @param {boolean} isOLdHost 是否是老的域名
     * @returns {Promise<any>}
     */
    load(api,page = 1,data = {},method = 'GET',isOLdHost = false) {

        let self = this,
            pages = getCurrentPages();

        if (data == null) {
            data = {};
        }

        data.v = config.version;
        data.pid = config.appId;
        data.promote = wx.getStorageSync('channel');
        data.page = page;

        data.path = pages[pages.length-1].route;

        return new Promise( (resolve,reject) => {

            self.showLoading();

            wx.request({
                url: config.apiHost(isOLdHost) + api,
                method,
                data,
                success(response) {
                    resolve(response.data);
                },
                fail(error) {
                    reject(error);
                },
                complete() {
                    self.hideLoading();
                }
            });
        });
    }

    /**
     * 通用发起数据请求
     * @param api
     * @param data
     * @param method
     * @param {boolean} isOldHost
     * @returns {Promise<any>}
     */
    request(api,data,method = 'GET',isOldHost = false ) {

        if (data == null) {
            data = {};
        }
        data.v = config.version;
        data.pid = config.appId;

        return new Promise( (resolve,reject) => {
            wx.request({
                url: config.apiHost(isOldHost) + api,
                method,
                data,
                success(response) {
                    resolve(response.data);
                },
                fail(error) {
                    reject(error);
                }
            });
        });
    }
};

module.exports = DataLoader.getInstance();