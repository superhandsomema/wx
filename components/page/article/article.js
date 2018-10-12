const statis = require('../../../utils/statis');

Component({

	/**
	 * 组件的属性列表
	 */
	properties: {
		articles: {
			type: Object,
			value: {}
		},
		type:String
	},

	/**
	 * 组件的初始数据
	 */
	data: {

	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		// tu图文消息详情跳转
		imageText: function (event) {
			let article = event.currentTarget.dataset.article,
				articles = this.properties.articles;

			statis.clickArticle(article,articles.type + '_' + articles.contentid);


			let url = encodeURIComponent(article.url);

			wx.navigateTo({
				url: '../info/info?url=' + url
			})
		},
	}
})