// components/page/video.js

const clone = require('../../../vendor/lodash.clone/index');

Component({

    // behaviors: [
    //     GameBehavior
    // ],

    /**
     * 组件的属性列表
     */
    properties: {
        videos: {
            type: Object,
            value: {},
            observer(newValue) {
                this.setData({
                    videosData: clone(newValue)
                })
            }
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        videoKeyPrefix: 'game_video_',
        videosData: {},
        isVideoPlaying: false,
        currentVideoId: 0
    },

    ready() {
        // console.log('videos',this.data.videos);
        // console.log(this.data.videosData);
    },

    /**
     * 组件的方法列表
     */
    methods: {
        playVideo: function (event) {
            let video = event.currentTarget.dataset.video;
            // let videoContext = wx.createVideoContext(this.data.videoKeyPrefix + video.video_id,this);

            // getApp().statis({
            //     spot: 'CLICK',
            //     targettype: 'video',
            //     target: video.video_id
            // });

            // this.setData({
            //     isVideoPlaying: true,
            //     currentVideoId: video.video_id
            // });

            // videoContext.requestFullScreen({
            //     direction: 0
            // });
            // videoContext.play();
            if (video.wxgame && video.wxgame.g_type != 1) {
                this.onOpenGame(event);
            } else {
                this.onOpenDirectGame(event);
            }
        },

        /**
         * 关闭视频
         * @param video
         */
        closeVideo(video) {
            let videoContext = wx.createVideoContext(this.data.videoKeyPrefix + video.video_id,this);
            videoContext.pause();
            this.setData({
                isVideoPlaying: false
            })
        },

        /**
         * 视频全屏状态切换
         * @param event
         */
        onFullScreenChange (event) {
            if (event.detail.fullScreen === false) {
                let video = event.currentTarget.dataset.video;
                this.closeVideo(video);
                if (video.wxgame && video.wxgame.g_type != 1) {
                    this.onOpenGame(event);
                }
            }
        },

        /**
         * 视频播放结束时
         * @param event
         */
        onEnded(event) {
            let video = event.currentTarget.dataset.video;
            this.closeVideo(video);
            if (video.wxgame && video.wxgame.g_type != 1) {
                this.onOpenGame(event);
            }
        },

        /**
         * 获得视频的上下文
         * @param video
         * @returns {*}
         */
        getVideoContext(video) {
            let key = 'game_video_' + video.video_id;
            video.context = wx.createVideoContext(key,this);

            return video.context;
        }
    }
});