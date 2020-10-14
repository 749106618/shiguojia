// pages/activity/activity.js
var app = getApp()
let { request } = require('../../utils/api1.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    w:2000,
    check:1,
    userImg:'../image/header.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this;
    var query = wx.createSelectorQuery();
    query.select('.swipper').boundingClientRect(function (rect) {
      // console.log(rect.width)
      var width = rect.width;
      var w = width * 2 + 150
      console.log(w)
      that.setData({
        w: w
      })
    }).exec();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    dataList(that)
  },
  onShareAppMessage:function(){
    return {
      title: wx.getStorageSync('shareTit'),
      path: 'pages/open/open?inviteCode=' + wx.getStorageSync('inviteCode')
    }
  },
  check:function(e){
    var check = e.currentTarget.dataset.check;
    if(check=='1'){
      check=1
    }else{
      check=2
    }
    this.setData({
      check:check
    })
  }
})

function dataList(that){
  var param,param1 = {}
  request.apiPost('member/amountDetail/revenueSummary',param).then(res =>{
    console.log(res)
    var data = res.data;
    var cP = parseFloat((data.consumptionIncome_Proportion * 100).toPrecision(12))
    that.setData({
      dataList: data,
      cp: cP
    })
  })
  request.apiGet('member/user/findUser',param1).then(res=>{
    console.log(res)
    if (res.data.code == "100") {
      app.tokenInvalid()
    }
    that.setData({
      fundList: res.data,
      userImg: res.data.userinfo.userImgAddress
    })
  })
}
