// pages/login/login.js
const app = getApp();
const {request} = require('../../utils/api1.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    time: "获取验证码",
    disabled: true,//true不能点
    currentTime: 60,
    user: "",
    ucode: "",
    y:false,//是否为分享链接进入
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    if(options.scene){
      var scene = decodeURIComponent(options.scene)
      that.setData({yCode:scene,y:true})
    }
    //先调用一下getUserInfo接口 已注册跳转首页
    wx.login({
      success: function (res) {
        var param = { code: res.code }
        request.apiGet('/weixin/getUserInfo', param).then(res1 => {
          var flag = res1.data.flag;
          if (flag) {
            wx.switchTab({
              url: '../index_3/index_3',
            })
          }
        })
      }
    })
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

  },
  pjUserInfo: function (e) {
    var that = this;
    console.log(e)
    if (e.detail.userInfo) {
      if (that.data.user != "" && that.data.ucode != ""){
        wx.login({
          success: function (loginRes) {
            console.log(loginRes)
            wx.getUserInfo({
              success: function (infoRes) {
                console.log(infoRes)
                var param = {
                  tel: that.data.user,
                  verifyCode: that.data.ucode,
                  code: loginRes.code,//临时登录凭证
                  rawData: infoRes.rawData,//用户非敏感信息
                  signature: infoRes.signature,//签名
                  encrypteData: infoRes.encryptedData,//用户敏感信息
                  iv: infoRes.iv
                }
                request.apiPost('weixin/index/login',param).then(res=>{
                  if(res.data.type=='error'){
                    wx.showToast({
                      title: res.data.msg,
                      icon:'none'
                    })
                  }else{
                    wx.login({
                      success: function (loginRes1) {
                        wx.request({
                          url: app.basicurl + 'weixin/index/getUserInfo',
                          data: { code: loginRes1.code },
                          success: function (res2) {
                            console.log(res2)
                            var data = res2.data;
                            if (data.flag == null || data.flag) {
                              if (data.token != null) {
                                wx.setStorageSync('token', data.token)
                                wx.switchTab({
                                  url: '../index_3/index_3',
                                })
                              }
                            } else {
                              wx.navigateTo({
                                url: '../open/open',
                              })
                            }
                          }
                        })
                      }
                    })
                  }
                })
              }
            })
          }
        })
      }else{
        wx.showToast({
          title: '请填写正确的手机号和验证码',
          icon:'none'
        })
      }
    } else {
      wx.showModal({
        content: "您已拒绝授权",
        showCancel: false,
        confirmText: '知道了',
        success: function (res) {
          
        }
      })
    }
  },
  sendMessage:function(){
    var that = this;
    var currentTime = that.data.currentTime;
    var disabled = that.data.disabled;
    if (!disabled) {
      that.setData({
        time: currentTime + '秒',
        disabled: true
      })
      var interval = setInterval(function () {
        that.setData({
          time: (currentTime - 1) + '秒'
        })
        currentTime--;
        if (currentTime <= 0) {
          clearInterval(interval)
          that.setData({
            time: '重新获取',
            currentTime: 60,
            disabled: false
          })
        }
      }, 1000)
      wx.request({
        url: app.basicurl + 'getVerifyCode',
        method: 'post',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: { tel: that.data.user },
        success: function (res) {
          // console.log(res)
        }
      })
    }
  },
  usercls: function () {
    this.setData({
      user: "",
      disabled: true
    })
  },
  user: function (e) {
    this.setData({
      user: e.detail.value
    })
    var reg = new RegExp('^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\\d{8}$');
    var userInput = reg.test(e.detail.value)
    if (userInput) {
      this.setData({
        disabled: false
      })
    } else {
      this.setData({
        disabled: true
      })
    }
  },
  ucode: function (e) {
    this.setData({
      ucode: e.detail.value
    })
  },
})