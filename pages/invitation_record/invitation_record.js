// pages/invitation_record/invitation_record.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    pagesize: 10,
    isEnd: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      options:options
    })
    dataList(that);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: wx.getStorageSync('shareTit'),
      path: 'pages/open/open?inviteCode=' + wx.getStorageSync('inviteCode')
    }
  }
})

function dataList (that) {
  wx.request({
    url: app.basicurl +'/member/invitationregister/list',
    header:{
      'token':wx.getStorageSync('token')
    },
    data: { page: that.data.page, pagesize: that.data.pagesize},
    success:function(res){
      var data = res.data;
      var all = (parseInt(data.invitedEarning) * parseInt(data.count)).toFixed(2);
      var all1 = all.split('.')[0];
      var all2 = all.split('.')[1];
      that.setData({
        dataList: data,
        all1: all1,
        all2: all2
      })
    }
  })
}