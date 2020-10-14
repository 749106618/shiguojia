// pages/withdrawal/withdrawal.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    options: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var app = getApp();
    var money = options.moeny;
    that.setData({
      options: options
    })
    if(money!=undefined||money!=null){
      if(money>100){
        money=100;
        var a = "options.money"
        that.setData({
          [a]: money
        })
      }
    }
    wx.request({
      url: app.basicurl + 'member/user/findUser',
      header: {
        'token': wx.getStorageSync('token')
      },
      success: function (res) {
        if (res.data.code == "100") {
          app.tokenInvalid()
          that.onLoad()
        }
        that.setData({
          fundList: res.data
        })
      }
    })
  },
  onShareAppMessage: function () {
    return {
      title: wx.getStorageSync('shareTit'),
      path: 'pages/open/open?inviteCode=' + wx.getStorageSync('inviteCode')
    }
  },
  //金额输入
  money: function (e) {
    var moeny = e.detail.value;
    var maxmoeny = this.data.options.moeny;

    moeny = moeny.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    moeny = moeny.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');

    if (moeny.indexOf(".") < 0 && moeny != "") {
      moeny = parseFloat(moeny);
    } else if (moeny.indexOf(".") == 0) {
      moeny = moeny.replace(/[^$#$]/g, "0.");
      moeny = moeny.replace(/\.{2,}/g, ".");
    }
    if (parseFloat(moeny) > parseFloat(maxmoeny)) {
      moeny = maxmoeny
    }
    // if(){

    // }
    this.setData({
      moeny: moeny
    })
  },
  //点击全部提现
  all: function () {
    var moeny = this.data.options.moeny;
    this.setData({
      moeny: moeny
    })
  },
  //提现
  withdrawal: function () {
    var that = this;
    var app = getApp();
    var money = that.data.moeny;
    if (money == '0' || money == undefined) {
      wx.showToast({
        title: '请核对好提现金额',
        icon: 'none'
      })
    } else {
      tixian(that, app)
    }
  }
})

function tixian(that, app) {
  wx.request({
    url: app.basicurl + '/member/amountDetail/withdraw',
    method: 'post',
    header: {
      "Content-Type": "application/x-www-form-urlencoded",
      'token': wx.getStorageSync('token')
    },
    data: { money: String(that.data.moeny) },
    success: function (res) {
      var data = res.data;
      if (data.code == "100") {
        app.tokenInvalid()
        that.onLoad()
      }
      console.log(res)
      if (data.type == 'success') {
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 2000,
          success: function () {
            setTimeout(function () {
              wx.navigateTo({
                url: '../write_detailed/write_detailed',
              })
            }, 2000)
          }
        })
      } else {
        wx.showToast({
          title: data.msg,
          icon: 'none'
        })
      }
    }
  })
}
