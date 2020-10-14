// pages/discount_record/discount_record.js
var app = getApp();
let { request } = require('../../utils/api1.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    pagesize: 15,
    isEnd: false,//是否到底
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      options:options
    })
    requestList(that)
    ye(that)
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
  },
  junpWithDrawal:function(e){
    var money = e.currentTarget.dataset.money;
    wx.navigateTo({
      url: '../withdrawal/withdrawal?moeny=' + money,
    })
  }
})

function requestList(that) {
  var param = {
    type: 2,
    state: 1,
    page: that.data.page,
    pagesize: that.data.pagesize
  }
  request.apiPost('member/amountDetail/list',param).then(res=>{
    if (res.data.code == "100") {
      app.tokenInvalid()
      that.onLoad()
    }
    var page = that.data.page;
    if (page == res.data.current) {
      that.setData({
        page: page + 1
      })
    } else {
      that.setData({
        isEnd: true,
      })
    }
    that.setData({
      dataList: res.data.data
    })
  })
}

function ye(that){
  var param = {}
  request.apiPost('member/user/getUserAmount',param).then(res=>{
    var all = res.data.userAmount.toFixed(2);
    var all1 = all.split('.')[0];
    var all2 = all.split('.')[1];
    that.setData({
      all1: all1,
      all2: all2,
      money: res.data.userAmount
    })
  })
}