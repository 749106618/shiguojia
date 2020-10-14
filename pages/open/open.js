// pages/open/open.js
var address = require('../js/city.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    animationAddressMenu: {},
    addressMenuIsShow: false,
    value: [0, 0, 0],
    provinces: [],
    citys: [],
    areas: [],
    areaInfo: "省-市-区",
    province: '',//省
    city: '',//市
    area: '',//县           这一行上面全是省市区三级联动
    time: "获取验证码",
    disabled: true,//true不能点
    currentTime: 60,
    user: "",
    ucode: "",        
    consignee:"",
    address:"",
    onOff:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var yq = options.inviteCode;
    var code = wx.getStorageSync('inviteCode')
    var code1,code2;
    // 初始化动画变量
    var animation = wx.createAnimation({
      duration: 500,
      transformOrigin: "50% 50%",
      timingFunction: 'ease',
    })
    this.animation = animation;
    // 默认联动显示浙江省
    var id = address.provinces[0].id
    this.setData({
      provinces: address.provinces,
      citys: address.citys[id],
      areas: address.areas[address.citys[id][0].id],
    })
    if (yq!=undefined){
      //从分享链接进来
      wx.setStorageSync('inviteCode', yq)
      yq=true
      code1 = wx.getStorageSync('inviteCode').substr(0,4)
      code2 = wx.getStorageSync('inviteCode').substr(4, 4)
    }else{
      //没有分享人
      if (code == undefined || code == null || code == '') {
        yq = false
      }else{
        //从商品详情进来
        yq = true
        code1 = wx.getStorageSync('inviteCode').substr(0, 4)
        code2 = wx.getStorageSync('inviteCode').substr(4, 4)
      }
    }
    that.setData({
      value: [0, 0, 0],
      options: options,
      yq: yq,
      code1: code1,
      code2: code2,
      onOff: true
    })
    getUserInfo1();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  onShareAppMessage: function () {

  },
  // 点击所在地区弹出选择框
  selectDistrict: function (e) {
    var that = this
    if (that.data.addressMenuIsShow) {
      return
    }
    that.startAddressAnimation(true)
  },

  // 执行动画
  startAddressAnimation: function (isShow) {
    var that = this
    if (isShow) {
      that.animation.translateY(0 + 'vh').step()
    } else {
      that.animation.translateY(40 + 'vh').step()
    }
    that.setData({
      animationAddressMenu: that.animation.export(),
      addressMenuIsShow: isShow,
    })
  },

  // 点击地区选择取消按钮
  cityCancel: function (e) {
    this.startAddressAnimation(false)
  },

  // 点击地区选择确定按钮
  citySure: function (e) {
    var that = this
    var city = that.data.city
    var value = that.data.value
    that.startAddressAnimation(false)
    // 将选择的城市信息显示到输入框
    var areaInfo = that.data.provinces[value[0]].name + ',' + that.data.citys[value[1]].name + ',' + that.data.areas[value[2]].name
    var province = that.data.provinces[value[0]].name;
    var city = that.data.citys[value[1]].name;
    var area = that.data.areas[value[2]].name;
    that.setData({
      areaInfo: areaInfo,
      province: province,
      city: city,
      area: area
    })
  },

  // 处理省市县联动逻辑
  cityChange: function (e) {
    var value = e.detail.value
    var provinces = this.data.provinces
    var citys = this.data.citys
    var areas = this.data.areas
    var provinceNum = value[0]
    var cityNum = value[1]
    var countyNum = value[2]
    if (this.data.value[0] != provinceNum) {
      var id = provinces[provinceNum].id
      this.setData({
        value: [provinceNum, 0, 0],
        citys: address.citys[id],
        areas: address.areas[address.citys[id][0].id],
      })
    } else if (this.data.value[1] != cityNum) {
      var id = citys[cityNum].id
      this.setData({
        value: [provinceNum, cityNum, 0],
        areas: address.areas[citys[cityNum].id],
      })
    } else {
      this.setData({
        value: [provinceNum, cityNum, countyNum]
      })
    }
  },
  user: function (e) {
    this.setData({
      user: e.detail.value
    })
    var reg = new RegExp('^(1[0-9])\\d{9}$');
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
  inputIn:function(e){
    var type = e.currentTarget.dataset.type
    var value = e.detail.value
    if (type =='consignee'){
      this.setData({
        consignee:value
      })
    }else{
      this.setData({
        address: value
      })
    }
  },
  sendMessage: function () {
    var that = this;
    var app = getApp();
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
  pjUserInfo:function(e){
    var that = this;
    var app = getApp();
    var user = that.data.user;
    var ucode = that.data.ucode;
    var consignee = that.data.consignee;
    var address = that.data.address;
    var areaInfo = that.data.areaInfo;
    wx.showModal({
      title: '服务条款',
      content: '开通即代表同意本站服务条款',
      success: function (res) { 
        if (res.confirm) { 
          if (user != "" && ucode != "" && consignee != "" && address != "" && areaInfo != "省-市-区") {
            that.setData({
              onOff: false
            })
            if (e.detail.userInfo) {

              wx.login({
                success: function (loginRes) {
                  wx.getUserInfo({
                    success: function (infoRes) {
                      wx.request({
                        url: app.basicurl + 'weixin/index/login',
                        method: 'post',
                        header: {
                          "Content-Type": "application/x-www-form-urlencoded"
                        },
                        data: {
                          tel: user,
                          verifyCode: ucode,
                          code: loginRes.code,//临时登录凭证
                          rawData: infoRes.rawData,//用户非敏感信息
                          signature: infoRes.signature,//签名
                          encrypteData: infoRes.encryptedData,//用户敏感信息
                          iv: infoRes.iv,
                          consignee: consignee,
                          phone: user,
                          address: address,
                          areaInfo: areaInfo
                        },
                        success: function (res) {
                          if (res.data.type == 'success') {
                            console.log('a')
                            //支付
                            wx.request({
                              url: app.basicurl + 'weixin/index/getConfig',
                              method: 'post',
                              header: {
                                "Content-Type": "application/x-www-form-urlencoded",
                              },
                              success: function (res1) {
                                var data1 = res1.data;
                                wx.request({
                                  url: app.basicurl + '/member/order/vipOrderCreate',
                                  header: { 'sid': res.data.sid },
                                  data: { 'invitationcode': wx.getStorageSync('inviteCode') },
                                  success: function (res4) {
                                    wx.request({
                                      url: app.basicurl + '/member/order/payVip',
                                      header: { 'sid': res.data.sid },
                                      data: {
                                        prepay_id: res4.data.prepay_id,
                                        nonceStr: res4.data.nonceStr
                                      },
                                      success: function (res2) {
                                        that.setData({
                                          onOff: true
                                        })
                                        var data2 = res2.data
                                        console.log(data2.timeStamp + '...' + data2.nonceStr + '...' + data2.package + '...' + data2.signType + '...' + data2.paySign)
                                        wx.requestPayment({
                                          timeStamp: data2.timeStamp,
                                          nonceStr: data2.nonceStr,
                                          package: data2.package,
                                          signType: data2.signType,
                                          paySign: data2.paySign,
                                          success: function (res3) {
                                            wx.login({
                                              success: function (loginRes1) {
                                                wx.request({
                                                  url: app.basicurl + 'weixin/index/getUserInfo',
                                                  data: { code: loginRes1.code },
                                                  success: function (res5) {
                                                    var data = res5.data;
                                                    if (data.flag == null || data.flag) {
                                                      if (data.token != null) {
                                                        wx.setStorageSync('token', data.token)
                                                        getApp().tokenInvalid();
                                                        wx.switchTab({
                                                          url: '../index_3/index_3',
                                                        })
                                                      }
                                                    } else {
                                                      wx.navigateTo({
                                                        url: '../login/login',
                                                      })
                                                    }
                                                  }
                                                })
                                              }
                                            })
                                          }, fail: function () {
                                            wx.showToast({
                                              title: '支付失败',
                                              icon: "none"
                                            })
                                          }
                                        })
                                      }
                                    })
                                  }
                                })
                              }
                            })
                          }
                          if(res.data.type=='error'){
                            wx.showToast({
                              title: res.data.msg,
                              icon:'none'
                            })
                            that.setData({
                              onOff: true
                            })
                          }
                        }
                      })
                    }
                  })
                }
              })
            } else {
              wx.showModal({
                content: "您已拒绝授权",
                showCancel: false,
                confirmText: '知道了',
                success: function (res) {
                  that.setData({
                    onOff: true
                  });
                }
              })
            }

          } else {
            wx.showToast({
              title: '请继续完善信息',
              icon: 'none'
            })
          }
        } else {
           
        }}
    })
  }
})

function getUserInfo1(){
  var that = this;
  var app = getApp();
  
  wx.login({
    success: function (res) {
      wx.request({
        url: app.basicurl + 'weixin/index/getUserInfo',
        data: { code: res.code },
        success: function (res2) {
          var data = res2.data;
          if (data.flag == null || data.flag) {
            if (data.token != null) {
              wx.setStorageSync('token', data.token);
              wx,wx.showToast({
                title: '您已经是会员了',
                icon: 'none',
                success: function(res) {
                  wx.switchTab({
                    url: '../index_3/index_3',
                  })
                }
              })
            }
          }
        }
      })//del
    }
  })
}