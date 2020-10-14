//线上 https://www.wjfresh.com/sgjMinprogram/
//线上 https://www.wjfresh.com/minprogram/
//测试http://test.blzaixian.com/mall/
//周http://192.168.0.107/minprogram/
//flie
App({
  basicurl: "https://www.wjfresh.com/sgjMinprogram/",
  orderBasicurl:"https://www.wjfresh.com/order/",
  imgHeader:'https://www.wjfresh.com/',
  
  // 加载
  showLoading: function (title = '加载中') {
    wx.showLoading({
      title: title,
      icon: 'loading',
      mask: true
    });
  },

  // 隐藏加载
  hideLoading: function () {
    wx.hideLoading();
  },
  /// 文字提示弹窗
  showToast: function (msg) {
    if (msg == undefined) {
      wx.showToast({
        title: '网络繁忙，稍后重试',
        icon: 'none',
        mask: true
      })
    } else if (typeof msg == 'string') {
      wx.showToast({
        title: msg,
        icon: 'none',
        mask: true
      })
    }
  },

  /// 获取页面
  invokePage: function (name, handler) {
    let pages = getCurrentPages().reverse();
    for (var i = 0; i < pages.length; i++) {
      if (pages[i].route == `pages/${name}/${name}`) {
        handler(pages[i])
        break
      }
    }
  },
  onLaunch: function () {
  },
  globalData: {
    userInfo: null
  },
  //token失效
  tokenInvalid: function (aa,thad){
    var that = this;
    wx.login({
      success: function (res) {
        wx.request({
          url: that.basicurl + 'weixin/index/getUserInfo',
          data: { code: res.code },
          success: function (res2) {
            var data = res2.data;
            if (data.flag==null||data.flag){
              //不是第一次
              if (data.token != null) {
                wx.setStorageSync('token', data.token)
                if(aa==1){
                  if (JSON.parse(thad.data.popupWindow1)) {
                    wx.request({
                      url: that.basicurl + '/member/coupon/receivecoupon',
                      header: {
                        'token': wx.getStorageSync('token')
                      },
                      success: function (res) {
                        put('juan', 'juan', '86400')//缓存一天
                        thad.setData({
                          popupWindow: false
                        })
                        wx.navigateTo({
                          url: '../shopping_list/shopping_list',
                        })
                      }
                    })
                  }
                }
              }
            }else{
              //第一次进入
              // wx.navigateTo({
              //   url: '../open/open',
              // })
            }
          }
        })//del
      }
    })
  },
  //分享
  // share:function(that){
  //   wx.request({
  //     url: this.basicurl + 'member/user/findUser',
  //     header: {
  //       'token': wx.getStorageSync('token')
  //     },
  //     success: function (res) {
  //       if (res.data.code == "100") {
  //         app.tokenInvalid()
  //         that.onLoad()
  //       }
  //       that.setData({
  //         fundList: res.data
  //       })
  //     }
  //   })
  // }
})

function put(key, val, time) {
  wx.setStorageSync(key, val)
  var seconds = parseInt(time);
  if (seconds > 0) {
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000 + seconds;
    wx.setStorageSync(key + 'dtime', timestamp + "")
  } else {
    wx.removeStorageSync(key + 'dtime')
  }
}