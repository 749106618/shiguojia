// pages/get_phone/get_phone.js
let { request } = require('../../utils/api1.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var app = getApp();
    app.showLoading();
    wx.login({
      success: res => {
        app.hideLoading();
        that.setData({
          code: res.code
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  junpIndex:function(){
    wx.switchTab({
      url: '../index_3/index_3',
    })
  },
  getPhoneNumber: function (e) {
    var that = this;
    console.log(e)
    
  },
  bindGetUserInfo:function(e){
    var that = this;
    var detail = e.detail
    console.log(e)
    if (e.detail.errMsg == "getUserInfo:ok") {
      var param = {
        code:that.data.code,
        rawData: detail.rawData,
        signature: detail.signature,
        encrypteData: detail.encryptedData,
        iv:detail.iv,
        tel:'',
      }
      request.apiPost('/weixin/login',param).then(res=>{
        var sid = res.sid;
        if(sid!=null&&sid!=undefined){
          wx.setStorageSync('wxUserName', res.wxUserinfo.nickName)
          wx.setStorageSync('wxUserAvatarUrl', res.wxUserinfo.avatarUrl)
          wx.setStorageSync('token', res.token)
          wx.setStorageSync('isNewUser', res.isNewUser)
          if (res.isNewUser){
            wx.switchTab({
              url: '../index_3/index_3',
            })
          }else{
            wx.navigateBack({
              delta: 1
            })
          }
        }
      })
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})