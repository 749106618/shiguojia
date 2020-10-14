// pages/goods_details/goods_details.js
var app = getApp()
const auth = require('../../utils/auth.js');
let { request } = require('../../utils/api1.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderType: ['微信支付', '余额支付'],
    addressMenuIsShow: false,
    animationAddressMenu: {},
    buyType: 0,
    juantxt: '优惠券',
    ballleft: -20,
    screenWidth: 0,
    shareview: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // 初始化动画变量
    var animation = wx.createAnimation({
      duration: 500,
      transformOrigin: "50% 50%",
      timingFunction: 'ease',
    })
    this.animation = animation;
    wx.getSystemInfo({
      success: function (res) {
        var x = res.windowWidth - 60;
        var y = res.windowHeight - 120;
        that.setData({
          x: x,
          y: y,
        })
      },
    })
    that.setData({
      options: options
    })
    if (options.scene) {
      var key = decodeURIComponent(options.scene)
      //从小程序码进来的
      var param = { key: key}
      request.apiPost('/weixin/index/getScene',param).then(res=>{
        if (res.data.scene != "" && res.data.scene != null && res.data.scene != undefined) {
          var scene = JSON.parse(res.data.scene)
          var a = 'options.shopId';
          wx.setStorageSync('inviteCode', scene.inviteCode)
          that.setData({
            [a]: scene.shopid
          })
          dataList(that)
        } else {
          wx.switchTab({
            url: '../index_3/index_3',
          })
        }
      })
    } else {
      //没有扫码进来的
      dataList(that)
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that =this;
    order_add(that)
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: wx.getStorageSync('shareTit'),
      path: this.route + '?shopId=' + this.data.shopId + '&inviteCode=' + wx.getStorageSync('inviteCode')
    }
  },
  tabShow: function () {
    var that = this
    this.setData({
      hua: 'hua1'
    })
    order_add(that)
  },
  tabHide: function () {
    this.setData({
      tab: false,
      hua: 'hua2'
    })
  },
  junpReceivingAddress: function () {
    var data = this.data
    wx.navigateTo({
      url: '../receiving_address/receiving_address?orderId=' + data.orderList.order.id + "&flag=1&couponId=" + data.options.receiverId + '&shopId=' + data.shopId,
    })
  },
  junpShopList: function () {
    var data = this.data
    wx.navigateTo({
      url: '../shopping_list/shopping_list?orderId=' + data.orderList.order.id + '&receiverId=' + data.orderList.receiverId + '&flag=1&gd=1',
    })
  },
  /// 创建海报
  createPoster: function () {
    var td = this.data
    var that = this;
    var jsonObject = {
      "shopid": td.options.shopId,
      "inviteCode": wx.getStorageSync('inviteCode')
    };
    that.setData({
      onOff: false
    })
    var param = { jsonObject: JSON.stringify(jsonObject)}
    request.apiPost('/weixin/index/setScene',param).then(res=>{
      //小程序带参 res.data.key
      var param1 = {
        shopId: that.data.options.shopId,
        page: "pages/goods_details/goods_details",
        scene: res.data.key,
        width: '300',
        auto_color: 'false',
        line_color: '{"r":0,"g":0,"b":0}',
        is_hyaline: 'false'
      }
      request.apiPost('/shop/getWXACodeUnlimit',param1).then(res=>{
        if (res1.data.code == 100) {
          app.tokenInvalid();
        }
        that.setData({
          shareImg: res1.data.img,
          onOff: true,
          shareview: true
        })
      })
    })
  },
  hideshareview: function () {
    this.setData({
      shareview: false,
    })
  },
  //保存图片
  saveImg: function () {
    var that = this;
    that.setData({
      onOff: false
    })
    console.log("onSavePicClick");
    var downloadUrl = that.data.shareImg;
    console.log("downloadUrl=" + downloadUrl);

    if (!wx.saveImageToPhotosAlbum) {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
      return;
    }

    // 可以通过 wx.getSetting 先查询一下用户是否授权了 "scope.writePhotosAlbum" 这个 scope  
    wx.getSetting({
      success(res) {
        console.log("getSetting: success");
        if (!res.authSetting['scope.writePhotosAlbum']) {
          console.log("1-没有授权《保存图片》权限");

          // 接口调用询问  
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              console.log("2-授权《保存图片》权限成功");
              downloadImage(downloadUrl, that);
            },
            fail() {
              // 用户拒绝了授权  
              console.log("2-授权《保存图片》权限失败");
              // 打开设置页面  
              wx.openSetting({
                success: function (data) {
                  console.log("openSetting: success");
                },
                fail: function (data) {
                  console.log("openSetting: fail");
                }
              });
            }
          })
        } else {
          console.log("1-已经授权《保存图片》权限");
          downloadImage(downloadUrl, that)
        }
      },
      fail(res) {
        console.log("getSetting: success");
        console.log(res);
      }
    })
  },
  addCard: function () {
    var that = this;
    var thad = this;
    wx.request({
      url: app.basicurl + '/member/cart/add',
      method: 'post',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'token': wx.getStorageSync('token')
      },
      data: { quantity: 1, id: that.data.options.shopId },
      success: function (res) {
        var data = res.data;
        if (data.code == "100") {
          app.tokenInvalid(thad)
          that.onLoad()
        }
        if (data.type == "success") {
          wx.showToast({
            title: '添加成功',
            icon: 'success',
            duration: 2000
          })
        }
      }
    })
  },
  //创建订单-支付
  payclick: function () {
    var that = this;
    var useBalance;
    // useBalance true余额支付 false微信支付
    if (that.data.buyType == 0) {
      useBalance = false
    } else {
      useBalance = true
    }
    var txt = that.data.txt;
    if (txt == '') {
      wx.showToast({
        title: '请选择地址',
        icon: "none"
      })
    } else {
      that.setData({
        flag: 1,
      })
      var receiverId = that.data.options.receiverId;
      var couponId = that.data.couponId;
      if (receiverId == undefined) {
        if (that.data.conData.receiver == undefined) {
          receiverId = ''
        } else {
          receiverId = that.data.conData.receiver.id
        }
      }
      if (couponId == undefined) {
        couponId = ''
      }
      wx.request({
        url: app.basicurl + '/member/order/create',
        method: 'post',
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          'token': wx.getStorageSync('token')
        },
        data: { receiverId: receiverId, orderId: that.data.conData.order.id, useBalance: useBalance, couponId: couponId },
        success: function (res) {
          var data = res.data;
          if (data.code == "100") {
            app.tokenInvalid()
            that.onLoad()
          }
          if (data.type == "success") {
            that.setData({
              order_create: data,
            })
            if (useBalance == false) {
              wx.request({
                url: app.basicurl + 'weixin/index/getConfig',
                method: 'post',
                data: { url: String(that.route).replace(/pages/, '..') },
                header: {
                  "Content-Type": "application/x-www-form-urlencoded",
                },
                success: function (res1) {
                  var data1 = res1.data;

                  wx.request({
                    url: app.basicurl + '/member/order/pay',
                    header: { 'token': wx.getStorageSync('token') },
                    data: {
                      prepay_id: that.data.order_create.prepay_id,
                      nonceStr: that.data.order_create.nonceStr
                    },
                    success: function (res2) {
                      var data2 = res2.data
                      console.log(data2.timeStamp + '...' + data2.nonceStr + '...' + data2.package + '...' + data2.signType + '...' + data2.paySign)
                      wx.requestPayment({
                        timeStamp: data2.timeStamp,
                        nonceStr: data2.nonceStr,
                        package: data2.package,
                        signType: data2.signType,
                        paySign: data2.paySign,
                        success: function (res) {
                          wx.navigateTo({
                            url: '../order_list/order_list?type=unshipped&index=2',
                          })
                        }, fail: function () {
                          wx.showToast({
                            title: '支付失败',
                            icon: "none"
                          })
                          wx.navigateTo({
                            url: '../order_list/order_list?type=unpaid&index=1',
                          })
                        }
                      })
                    }
                  })

                }
              })
            } else {
              wx.showToast({
                title: '支付成功',
              })
              wx.navigateTo({
                url: '../order_list/order_list?type=unshipped&index=2',
              })
            }
          }
          else {
            wx.showToast({
              title: data.msg,
              icon: "none",
              duration: 2000,
              success: function () {
                wx.navigateTo({
                  url: '../order_list/order_list?type=unpaid&index=1',
                })
              }
            })

          }
        }
      })
    }
  },
  //支付方式滚动
  bindChange: function (e) {
    const val = e.detail.value
    this.setData({
      buyType: val[0],
    })
  },
  // 点击选择确认按钮
  cityCancel: function (e) {
    this.startAddressAnimation(false)
  },
  // 点击支付方式弹出选择框
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
})

function dataList(that) {
  wx.request({
    url: app.basicurl + 'shop/goodsInfo',
    data: {
      shopid: that.data.options.shopId
    }, success: function (res) {
      if (res.data.code == "100") {
        app.tokenInvalid()
        that.onLoad()
      }
      var array = res.data.goodsInfo.showImageUrl.split(",");//轮播图
      var reg = new RegExp('<img', 'g')
      var reg1 = new RegExp('<p', 'g')
      var nodes = res.data.goodsInfo.content;
      nodes = nodes.replace(reg, '<img style="width:100%;height:auto" ');
      nodes = nodes.replace(reg1, '<p style="width:100%;margin:0 auto;"')
      var price = res.data.goodsInfo.price.toFixed(2);
      var price1 = price.split('.')[0];
      var price2 = price.split('.')[1];
      var profitRatio = parseFloat(res.data.profit_ratio) * price;
      var profit_ratio1 = profitRatio.toFixed(2).toString().split('.')[0];
      var profit_ratio2 = profitRatio.toFixed(2).toString().split('.')[1];
      that.setData({
        goodsInfo: res.data.goodsInfo,
        imgUrls: array,
        commentcount: res.data.commentcount,
        recommendlist: res.data.recommendlist,
        nodes: nodes,
        recommendImg: res.data.goodsInfo.recommendImg,
        onOff: true,
        price1: price1,
        price2: price2,
        profit_ratio1: profit_ratio1,
        profit_ratio2: profit_ratio2,
        shopId: res.data.goodsInfo.shopId,
      })
    }
  })
}

function order_add(that) {
  that.setData({
    onOff: false
  })
  wx.request({
    url: app.basicurl + '/member/order/buy',
    method: 'post',
    data: { shopId: that.data.goodsInfo.shopId },
    header: {
      "Content-Type": "application/x-www-form-urlencoded",
      'token': wx.getStorageSync('token')
    },
    success: function (res) {
      if (res.data.code == 100 || res.data.code == '100') {
        app.tokenInvalid()
        wx.navigateTo({
          url: '../goods_details/goods_details?shopId=' + that.data.goodsInfo.shopId,
        })
      }
      that.setData({
        orderList: res.data
      })
      var receiverId = that.data.options.receiverId
      var couponId = that.data.options.couponId
      if (receiverId == undefined) {
        receiverId = ''
      }
      if (couponId = undefined) {
        couponId = ''
      }
      wx.request({
        url: app.basicurl + '/member/order/info',
        method: 'get',
        data: { orderId: res.data.order.id, receiverId: receiverId, couponId: couponId },
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          'token': wx.getStorageSync('token')
        },
        success: function (res1) {
          var add = 0;
          if (res1.data.receiver == undefined || res1.data.receiver == null) {
            add = 1;
          }
          var name, txt, tel;
          if (add == 1) {
            name = "请点击这里设置地址"
            tel = ""
            txt = ""
            youf = 0
          } else {
            name = "收货人: " + res1.data.receiver.consignee;
            tel = res1.data.receiver.phone
            txt = res1.data.receiver.area + res1.data.receiver.address
          }
          that.setData({
            conData: res1.data,
            name: name,
            tel: tel,
            txt: txt,
            onOff: true,
            tab: true
          })
          // receiverId: res1.data.receiver.id
          if (that.data.txt != null || that.data.txt != undefined || that.data.txt != "") {
            var youf;
            var address1 = String(that.data.txt);
            var address = address1.split("/")[0]
            if (address == "西藏自治区" || address == "内蒙古自治区" || address == "新疆维吾尔自治区" || address == "吉林省" || address == "黑龙江") {
              youf = res1.data.order.freight
            } else {
              youf = 0
            }
            var orderprice = (parseFloat(that.data.conData.order.amountPayable) - parseFloat(that.data.conData.order.freight)).toFixed(2)
            that.setData({
              youf: youf,
              orderprice: orderprice,
              onOff: true,
            })
          }
        }
      })
    }
  })
}

// 下载文件 
function downloadImage(imageUrl, that) {
  wx.downloadFile({
    url: imageUrl,
    success: function (res) {
      console.log("下载文件：success");
      console.log(res);

      // 保存图片到系统相册  
      wx.saveImageToPhotosAlbum({
        filePath: res.tempFilePath,
        success(res) {
          console.log("保存图片：success");
          wx.showToast({
            title: '保存成功',
          });
          that.setData({
            onOff: true
          })
        },
        fail(res) {
          console.log("保存图片：fail");
          console.log(res);
          that.setData({
            onOff: true
          })
        }
      })
    },
    fail: function (res) {
      console.log("下载文件：fail");
      console.log(res);
      that.setData({
        onOff: true
      })
    }
  })
}