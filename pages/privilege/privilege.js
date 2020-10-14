// pages/privilege/privilege.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    pagesize: 12,
    isEnd: false,
    onOff:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    dataList(that)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: wx.getStorageSync('shareTit'),
      path: 'pages/open/open?inviteCode=' + wx.getStorageSync('inviteCode')
    }
  },
  junpPoder:function(e){
    var orderId = e.currentTarget.dataset.id;
    var postid = e.currentTarget.dataset.postid
    var signA = e.currentTarget.dataset.signa
    var type = e.currentTarget.dataset.type
    wx.navigateTo({
      url: '../porder_details/porder_details?orderId=' + orderId + '&postid=' + postid + '&type=' + type + '&signA=' + signA,
    })
  }
})

function dataList(that) {
  wx.request({
    url: app.basicurl + '/member/order/vipOrderlist',
    header: {
      "Content-Type": "application/x-www-form-urlencoded",
      'token': wx.getStorageSync('token')
    },
    method: 'post',
    data: {
      page: that.data.page,
      pagesize: that.data.pagesize,
    },
    success: function (res) {
      var data = res.data;
      var code1 = data.inviteCode.substr(0, 4)
      var code2 = data.inviteCode.substr(4, 4)
      that.setData({
        dataList: data,
        onOff:true,
        code1:code1,
        code2:code2
      })
    }
  })
}