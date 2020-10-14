// pages/user_index/user_index.js
var { request } = require('../..//utils/api1.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  onLoad: function (options) {
    var that = this;
    // var app = getApp();
    // that.setData({
    //   options: options
    // })
    // findUser(that, app)
    this.setData({
        options: options
      })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    var app = getApp();
    var cartNum = parseInt(wx.getStorageSync('cartNum'));
    var carNum1 = cartNum;
    wx.setTabBarBadge({
      index: 2,
      text: '' + carNum1 + '',
    })
    findUser(that, app);
    wx.getStorage({
      key: 'wxUserName',
      success: function (res) {
        that.setData({
          wxUserName: res.data
        })
      },
      fail: function (res) {
        
      }
    })
    wx.getStorage({
      key: 'wxUserAvatarUrl',
      success: function (res) {
        that.setData({
          wxUserAvatarUrl: res.data
        })
      },
      fail: function (res) {
        
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: wx.getStorageSync('shareTit'),
      path: 'pages/index_3/index_3?companyId=' + wx.getStorageSync('companyId')
    }
  },
  junpOrder:function(e){
    var index = e.currentTarget.dataset.index
    var type = e.currentTarget.dataset.type
    wx.navigateTo({
      url: '../order_list/order_list?index=' + index + '&type=' + type,
    })
  },
  // 拨打电话
  createPoster:function(){
    wx.showModal({
      title: '确认操作',
      content: '确认拨打400-063-3337客服电话',
      success:function(res){
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: '400-063-3337',
          })
        }
      }
    })
  },
  //跳转页面
  junp:function(e){
    var junpUrl = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: '../'+junpUrl+'/'+junpUrl,
    })
  }
})

function findUser(that, app) {
  var param = {}
  app.showLoading()
  request.apiGet('/user/findUser',param).then(res=>{
    that.setData({
      fundList: res.data
    })
  })
}