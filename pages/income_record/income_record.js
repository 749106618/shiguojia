// pages/income_record/income_record.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal: false,
    page: 1,
    pagesize: 10,
    isEnd: false,
    state: 1,//1余额 2虚拟币
    onOff: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      options:options
    })
    dataList(that)
  },
  onShow: function () {

  },
  onShareAppMessage: function () {
    return {
      title: wx.getStorageSync('shareTit'),
      path: 'pages/open/open?inviteCode=' + wx.getStorageSync('inviteCode')
    }
  },
  // 外面的弹窗
  btn: function () {
    this.setData({
      showModal: true
    })
  },

  // 禁止屏幕滚动
  preventTouchMove: function () {
  },

  // 弹出层里面的弹窗
  ok: function () {
    this.setData({
      showModal: false
    })
  }
})

function dataList(that) {
  wx.request({
    url: app.basicurl + '/member/amountDetail/list',
    header: {
      "Content-Type": "application/x-www-form-urlencoded",
      'token': wx.getStorageSync('token')
    },
    method: 'post',
    data: {
      page: that.data.page,
      pagesize: that.data.pagesize,
      state: that.data.state
    },
    success: function (res) {
      console.log(res)
      that.setData({
        dataList: res.data
      })
    }
  })
}