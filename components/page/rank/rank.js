const dataLoader = require('../../../common/dataLoader');
const clone = require('../../../vendor/lodash.clone/index');
const statis = require('../../../utils/statis');

Component({

    /**
     * 组件的属性列表
     */
    properties: {
        ranks: {
            type: Object,
            value: {},
            observer(newValue) {
                this.setData({
                    ranksData: clone(newValue)
                })
            }
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        ranksData: {},
        currentTabIndex: 0,
        winHeight: 100,//窗口高度
    },

    /**
     * 页面布局加载完成
     */
    ready() {
        this.heightNow();
    },

    /**
     * 组件的方法列表
     */
    methods: {
        switchNav(e) {
            let index = e.target.dataset.current;
            this.setData({
                currentTabIndex: index,
            });
        },
        // 滚动切换标签样式
        switchTab(event) {
            let index = event.detail.current;
            statis.request({
                spot: 'RANKING_LIST' + index,
            });
            this.setData({
                currentTabIndex: index,
            })
        },
        /**
         * 计算高度
         */
        heightNow() {
            let curPage = this
            wx.getSystemInfo({
                success: function (res) {
                    let clientHeight = res.windowHeight,
                        clientWidth = res.windowWidth,
                        rpxR = 750 / clientWidth;
                    let calc = clientHeight * rpxR;
                    curPage.setData({
                        winHeight: calc
                    });
                    wx.pageScrollTo({
                        scrollTop: 0
                    })
                }
            });
        },
        /**
         * 页面拖到最底部时触发，加载下一页
         * @param event
         */
        onScrollToLower(event) {
            let index = event.currentTarget.dataset.index,
                rank = this.data.ranksData.arr[index],
                self = this;

            if (!('page' in rank)) {
                rank.page = 1;
                rank.more = true;
            }

            if (rank.more) {
                dataLoader.load('api/pageparts',rank.page + 1,{
                    contentid: rank.id,
                    onepage: 10,
                    type: 'Rankinglistparts'
                }).then( data => {
                    let ranks = self.data.ranksData,
                        newRank = rank.content.concat(data.data.content);

                    ranks.arr[index].page = rank.page + 1;
                    ranks.arr[index].content = newRank;
                    ranks.arr[index].more = data.more;

                    self.setData({
                        'ranksData' :ranks
                    });
                });
            }
        }
    }
});