// pages/go_pay/go_pay.js
let { request } = require('../../utils/api1.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    options: {},
    conData: {},
    name: "",
    txt: "",
    tel: "",
    discountId: "",
    orderprice: '',
    imgHeader: getApp().imgHeader
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var app = getApp();
    var that = this;
    that.setData({
      options: options
    })
    confirm(that, app)
  },
  onShareAppMessage: function () {
    return {
      title: wx.getStorageSync('shareTit'),
      path: 'pages/index_3/index_3?companyId=' + wx.getStorageSync('companyId')
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  //支付
  zhezshow1: function () {
    var that = this;
    var app = getApp()
    var txt = that.data.txt;
    if (txt == '') {
      wx.showToast({
        title: '请选择地址',
        icon: "none"
      })
    } else {
      var couponId = '';
      if (that.data.conData.couponCode != null && that.data.conData.couponCode != undefined) {
        couponId = that.data.conData.couponCode.id;
      }

      if (couponId == undefined) {
        couponId = ''
      }
      var receiverId = that.data.options.receiverId;
      if (receiverId==undefined){
        receiverId==''
      }
      var param = {
        receiverId: receiverId,
        orderId: that.data.options.orderId,
        couponId: couponId,
        clientName: 'SGJ',
        companyId: wx.getStorageSync('companyId')
      }
      app.showLoading()
      request.apiPost2('/order/create', param).then(res => {
        if (res.type == "success") {
          //可能存在Content-Type请求头方式报错
          var param1 = { url: String(that.route).replace(/pages/, '..') }
          app.showLoading()
          request.apiPost('weixin/getConfig', param1).then(res1 => {
            console.log(res1)
            var data1 = res1.data;
            //这里可以修改成res.
            var param2 = {
              prepay_id: res.prepay_id,
              nonceStr: res.nonceStr,
              clientName: 'SGJ'
            }
            app.showLoading()
            request.apiGet2('/order/pay', param2).then(res2 => {
              console.log(res)
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
            })
          })
        }
        else {
          wx.showToast({
            title: data.msg,
            icon: "none"
          })
        }
      })
    }
  }
})

//加载
function confirm(that, app) {
  var couponId = '';
  if (that.data.options.couponId == undefined) {
    couponId = ''
  } else {
    couponId = that.data.options.couponId
  }
  var receiverId = '';
  if (that.data.options.receiverId == undefined) {
    receiverId = ''
  } else {
    receiverId = that.data.options.receiverId
  }
  var param = { orderId: that.data.options.orderId, receiverId: receiverId, couponId: couponId}
  app.showLoading()
  request.apiGet2('/order/info',param).then(res=>{
    var adddrees = res.data.order.receiver;
    var name, txt, tel;
    if (res.data.order.consignee == null || res.data.order.consignee == undefined) {
      name = "请点击这里设置地址"
      tel = ""
      txt = ""
    } else {
      name = "收货人: " + res.data.order.consignee;
      tel = res.data.order.phone
      txt = res.data.order.address
    }
    that.setData({
      conData: res.data,
      name: name,
      tel: tel,
      txt: txt,
      discountId: res.data.couponCodes.id,
      youf: youf
    })
    var youf;
    var address1 = String(that.data.txt);
    var address = address1.split("/")[0]
    if (address == "西藏自治区" || address == "内蒙古自治区" || address == "新疆维吾尔自治区" || address == "吉林省" || address == "黑龙江") {
      youf = res.data.order.freight
    } else {
      youf = 0
    }

    var orderprice = (parseFloat(that.data.conData.order.amountPayable) - parseFloat(that.data.conData.order.freight)).toFixed(2)
    that.setData({
      youf: youf,
      orderprice: orderprice
    })
  })
}

//修改购物车商品数量
function updateCart(id, quantity, that, app) {
  requset.apiPost('/member/order/edit',param).then(res=>{
    if (res.data.code == "100") {
      app.tokenInvalid()
      that.onLoad()
    }
    var quantity = "conData.order.orderItems[" + 0 + "].quantity"
    var amountPayable = "conData.order.amountPayable"
    var orderprice = (parseFloat(res.data.orderItem.subtotal) - parseFloat(that.data.conData.order.freight)).toFixed(2)
    that.setData({
      [quantity]: res.data.orderItem.quantity,
      [amountPayable]: res.data.effectivePrice,
      orderprice: orderprice
    })
  })
}