
const util = require('../utils/util');

/**
 * 专门解析应用参数的
 */
class ApplicationParams {

    constructor(options) {
        /**
         * APP传入的参数
         * @type {string}
         */
        this.query = '';

        /**
         * 渠道参数
         * @type {string}
         */
        this.promote = '';

        /**
         * 二跳参数
         * @type {object}
         */
        this.directOpenParams = null;


        /**
         * 通过分享进入的用户参数
         * @type {object}
         */
        this.shareUserInfo = null;

        this.options = options;
    }

    /**
     * 获得APP传入的参数
     * @returns {string}
     */
    getQuery() {
        if (!this.query) {
            if (this.options.query) {
                if (options.query.scene) {
                    //从二维码中获得参数
                    this.query = util.parseUrl(decodeURIComponent(options.query.scene));
                } else {
                    this.query = options.query;
                }
            }
        }

        return this.query;
    }

    /**
     * 获得渠道
     * @returns {string}
     */
    getPromote() {

        if (this.promote == null) {
            let query = this.getQuery();

            if (query['c']) {
                this.promote = query.c;
            }
            this.promote = wx.getStorageSync('channel');
        }

        return this.promote;
    }

    /**
     * 二跳参数
     * @returns {object}
     */
    getDirectOpenParams() {

        if (!this.directOpenParams) {

            let query = this.getQuery(),
                arrQuery = [];

            for (let item in query) {
                let cpTag = item.substr(0, 2).toLowerCase();
                if (cpTag === "c_") {
                    let key = item.substr(2, item.length - 1);
                    arrQuery.push(key + "=" + _query[item])
                }
            }

            let pathUrl = '?' + arrQuery.join('&');

            if (query.g) {
                this.directOpenParams = {
                    gameId: query.g,
                    pathUrl: pathUrl
                }
            }
        }

        return this.directOpenParams;
    }

    getShareParams() {

    }
}