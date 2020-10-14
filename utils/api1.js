let config = getApp();
const request = {
  //普通post请求
  apiPost: (url, param = {}) => {
    return new Promise((resolve, reject) => {
      let token = wx.getStorageSync('token');
      wx.request({
        url: config.basicurl + url ,
        data: param,
        method: 'POST',
        header: {
          "X-Requested-With": "XMLHttpRequest",
          "Content-Type": "application/x-www-form-urlencoded",
          "appVersion": "1.0.9",
          'token' : token
        },
        success: (res) => {
          console.log(res)
          wx.hideLoading();
          let result = res.data;
          let code = result.code;
          if (code == 0) {
            resolve(result)
          } else if (code == 100){
            getUserInfo(param.that)
          }else {
            wx.showModal({
              title: '提示',
              content: res.data.msg,
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  //wx.navigateBack()
                }
              }
            })
          }
        },
        fail: (res) => {
          wx.hideLoading();
          console.info(res)
          if (res.errMsg) {
            wx.showToast({
              title: '请检查网络链接状态',
              icon: 'none',
              duration: 2000
            })
            return;
          }
          wx.showModal({
            title: '提示',
            content: '系统请求',
            showCancel: false,
          })
        }
      })
    })
  },
  //"Content-Type": "application/json",
  apiPost1: (url, param = {}) => {
    return new Promise((resolve, reject) => {
      let token = wx.getStorageSync('token');
      wx.request({
        url: config.basicurl + url,
        data: param,
        method: 'POST',
        header: {
          "X-Requested-With": "XMLHttpRequest",
          "Content-Type": "application/json",
          "appVersion": "1.0.9",
          'token': token
        },
        success: (res) => {
          console.log(res)
          wx.hideLoading();
          let result = res.data;
          let code = result.code;
          if (code == 0) {
            resolve(result)
          } else if (code == 100) {
            getUserInfo()
          }else {
            wx.showModal({
              title: '提示',
              content: res.data.message,
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  //wx.navigateBack()
                }
              }
            })
          }
        },
        fail: (res) => {
          wx.hideLoading();
          console.info(res)
          if (res.errMsg) {
            wx.showToast({
              title: '请检查网络链接状态',
              icon: 'none',
              duration: 2000
            })
            return;
          }
          wx.showModal({
            title: '提示',
            content: '系统请求',
            showCancel: false,
          })
        }
      })
    })
  },
  //"订单post请求",
  apiPost2: (url, param = {}) => {
    return new Promise((resolve, reject) => {
      let token = wx.getStorageSync('token');
      wx.request({
        url: config.orderBasicurl + url,
        data: param,
        method: 'POST',
        header: {
          "X-Requested-With": "XMLHttpRequest",
          "Content-Type": "application/x-www-form-urlencoded",
          "appVersion": "1.0.9",
          'token': token
        },
        success: (res) => {
          console.log(res)
          wx.hideLoading();
          let result = res.data;
          let code = result.code;
          if (code == 0) {
            resolve(result)
          } else if (code == 100) {
            getUserInfo()
          }else {
            wx.showModal({
              title: '提示',
              content: res.data.msg,
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  //wx.navigateBack()
                }
              }
            })
          }
        },
        fail: (res) => {
          wx.hideLoading();
          console.info(res)
          if (res.errMsg) {
            wx.showToast({
              title: '请检查网络链接状态',
              icon: 'none',
              duration: 2000
            })
            return;
          }
          wx.showModal({
            title: '提示',
            content: '系统请求',
            showCancel: false,
          })
        }
      })
    })
  },
  //订单post请求 "Content-Type": "application/json",
  apiPost4: (url, param = {}) => {
    return new Promise((resolve, reject) => {
      let token = wx.getStorageSync('token');
      wx.request({
        url: config.orderBasicurl + url,
        data: param,
        method: 'POST',
        header: {
          "X-Requested-With": "XMLHttpRequest",
          "Content-Type": "application/json",
          "appVersion": "1.0.9",
          'token': token
        },
        success: (res) => {
          console.log(res)
          wx.hideLoading();
          let result = res.data;
          let code = result.code;
          if (code == 0) {
            resolve(result)
          } else if (code == 100) {
            getUserInfo()
          }else {
            wx.showModal({
              title: '提示',
              content: res.data.message,
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  //wx.navigateBack()
                }
              }
            })
          }
        },
        fail: (res) => {
          wx.hideLoading();
          console.info(res)
          if (res.errMsg) {
            wx.showToast({
              title: '请检查网络链接状态',
              icon: 'none',
              duration: 2000
            })
            return;
          }
          wx.showModal({
            title: '提示',
            content: '系统请求',
            showCancel: false,
          })
        }
      })
    })
  },
  //普通get请求
  apiGet: (url, param = {}) => {
    return new Promise((resolve, reject) => {
      wx.showLoading({
        title: '加载中...',
        mask: false
      })
      let token = wx.getStorageSync('token');
      wx.request({
        url: config.basicurl + url ,
        data: param,
        header: {
          "X-Requested-With": "XMLHttpRequest",
          "appVersion": "1.0.9",
          'token': token
        },
        success: (res) => {
          console.log(res)
          wx.hideLoading();
          let code = res.data.code;
          if (code == 0) {
            resolve(res)
          } else if (code == 100) {
            getUserInfo()
          } else {
            wx.showModal({
              title: '提示',
              content: res.data.message,
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  if (url == 'user/getSms') {
                    return;
                  }
                  wx.navigateBack()
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          }
        },
        fail: (res) => {
          wx.hideLoading();
          console.info(res)
          if (res.errMsg) {
            wx.showToast({
              title: '请检查网络链接状态',
              icon: 'none',
              duration: 2000
            })
            return;
          }
          wx.showModal({
            title: '提示',
            content: '系统异常，请联系管理员',
            showCancel: false
          })
        }
      })
    })
  },
  //订单get请求
  apiGet2: (url, param = {}) => {
    return new Promise((resolve, reject) => {
      wx.showLoading({
        title: '加载中...',
        mask: false
      })
      let token = wx.getStorageSync('token');
      wx.request({
        url: config.orderBasicurl + url,
        data: param,
        header: {
          "X-Requested-With": "XMLHttpRequest",
          "appVersion": "1.0.9",
          'token': token
        },
        success: (res) => {
          console.log(res)
          wx.hideLoading();
          let code = res.data.code;
          if (code == 0) {
            resolve(res)
          } else if (code == 100) {
            getUserInfo()
          } else {
            wx.showModal({
              title: '提示',
              content: res.data.message,
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  if (url == 'user/getSms') {
                    return;
                  }
                  wx.navigateBack()
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          }
        },
        fail: (res) => {
          wx.hideLoading();
          console.info(res)
          if (res.errMsg) {
            wx.showToast({
              title: '请检查网络链接状态',
              icon: 'none',
              duration: 2000
            })
            return;
          }
          wx.showModal({
            title: '提示',
            content: '系统异常，请联系管理员',
            showCancel: false
          })
        }
      })
    })
  }
}

function getUserInfo(that){
  wx.login({
    success: function (res) {
      var param = { code: res.code }
      request.apiGet('/weixin/getUserInfo', param).then(res1 => {
        var flag = res1.data.flag;
        if (flag) {
          wx.setStorageSync('token', res1.data.token)
          that.onLoad();
        } else {
          wx.navigateTo({
            url: '../get_phone/get_phone',
          })
        }
      })
    }
  })
}

module.exports = {
  request
}