// pages/confirm_order/confirm_order.js
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
    youf: 0,
    couponId: '',
    order_create: [],//确认订单接口返回值
    backurl: '',//返回地址
    memo:'',//买家留言
    check: 1,//1配送 2自提
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      options: options,
      imgHeader: app.imgHeader,
      address: wx.getStorageSync('address'),
      dTel: wx.getStorageSync('dTel')
    })
  },
  onShow:function(){
    var app = getApp();
    var that = this;
    confirm(that, that.data.check)
  },
  onShareAppMessage: function () {
    return {
      title: wx.getStorageSync('shareTit'),
      path: 'pages/index_3/index_3?companyId=' + wx.getStorageSync('companyId')
    }
  },
  //买家留言
  setFont:function(e){
    var memo = e.detail.value
    this.setData({ memo: memo})
  },
  //自提/配送
  changeType: function (e) {
    var that = this;
    var type = parseInt(e.currentTarget.dataset.check);
    //注释内容为未调接口前的切换自提时的价格计算
    // var freight = this.data.conData.order.freight;//邮费
    // var amountPayable = this.data.amountPayable//订单价格
    // var bb = 'conData.order.freight'
    if (type == 1 && that.data.check!=1){
      //配送
      confirm(that, type)
      this.setData({
        // [bb]: this.data.freight,
        // amountPayable: this.data.conData.order.amountPayable,
        check: type,
      })
    }
    if (type == 2 && that.data.check != 2){
      //自提
      // var price = parseFloat((amountPayable - freight).toPrecision(12));
      // if (price <= 0) {
      //   price = 0
      // }
      confirm(that, type)
      this.setData({
        // freight: freight,
        // amountPayable: price,
        // [bb]: 0,
        check: type,
      })
    }
  },
  //切换地址
  junpReceivingAddress: function () {
    var data = this.data
    var couponId = data.conData.couponCode;
    if (couponId){
      couponId = data.conData.couponCode.id
    }else{
      couponId=''
    }
    wx.navigateTo({
      url: '../receiving_address/receiving_address?orderId=' + data.options.orderId + "&flag=1&a=1&couponId=" + couponId,
    })
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
      if (that.data.options.couponId == undefined) {
        couponId = ''
      } else {
        couponId = that.data.options.couponId
      }
      if (that.data.conData.couponCode != null && that.data.conData.couponCode != undefined) {
        couponId = that.data.conData.couponCode.id;
      }
      var receiverId = '';
      if (that.data.options.receiverId == undefined) {
        receiverId = ''
      } else {
        receiverId = that.data.options.receiverId
      }
      if (that.data.conData.receiver != null && that.data.conData.receiver != undefined) {
        receiverId = that.data.conData.receiver.id;
      }
      var shippingMethodName
      if (that.data.check == '2') {
        shippingMethodName = 2
      } else {
        shippingMethodName = 1
      }
      var param = {
        receiverId: receiverId,
        orderId: that.data.options.orderId,
        couponId: couponId,
        clientName:'SGJ',
        memo:that.data.memo,
        companyId: wx.getStorageSync('companyId'),
        shippingMethodName: shippingMethodName
      }
      app.showLoading()
      request.apiPost2('/order/create',param).then(res=>{
        //修改tabBar
        var cartNum = parseInt(wx.getStorageSync('cartNum'));
        var carNum1 = cartNum - that.data.conData.order.quantity;
        wx.setStorageSync('cartNum', carNum1)
        if (res.type == "success") {
          //可能存在Content-Type请求头方式报错
          var param1 = { url: String(that.route).replace(/pages/, '..')}
          app.showLoading()
          request.apiPost('weixin/getConfig', param1).then(res1=>{
            console.log(res1)
            var data1 = res1.data;
            //这里可以修改成res.
            var param2 = {
              prepay_id: res.prepay_id,
              nonceStr: res.nonceStr,
              clientName: 'SGJ'
            }
            app.showLoading()
            request.apiGet2('/order/pay', param2).then(res2=>{
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
  },
  junpShopList: function () {
    wx.navigateTo({
      url: '../shopping_list/shopping_list?orderId=' + this.data.options.orderId + '&receiverId=' + this.data.options.receiverId + '&flag=1&check=' + this.data.check + '&shippingMethodName='+ this.data.check,
    })
  }
})

//加载
function confirm(that, shippingMethodName) {
  var couponId = '';
  if (that.data.options.couponId == undefined) {
    couponId = ''
  }else{
    couponId = that.data.options.couponId
  }
  var receiverId = '';
  if (that.data.options.receiverId == undefined) {
    receiverId = ''
  } else {
    receiverId = that.data.options.receiverId
  }
  var param = { 
    orderId: that.data.options.orderId, 
    receiverId: receiverId, 
    couponId: couponId, 
    shippingMethodName: shippingMethodName
  }
  app.showLoading()
  request.apiGet2('order/info',param).then(res=>{
    var add = 0;
    if (res.data.receiver == undefined || res.data.receiver == null) {
      add = 1;
    }
    var name, txt, tel;
    if (add == 1) {
      name = ""
      tel = ""
      txt = "请点击这里设置地址"
      youf = 0
    } else {
      name = "收货人: " + res.data.receiver.consignee;
      tel = res.data.receiver.phone
      txt = res.data.receiver.area + res.data.receiver.address
    }
    that.setData({
      conData: res.data,
      amountPayable: res.data.order.amountPayable,
      name: name,
      tel: tel,
      txt: txt,
    })
    // receiverId: res.data.receiver.id
    if (that.data.txt != null || that.data.txt != undefined || that.data.txt != "") {
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
    }
  })
}

//修改购物车商品数量
function updateCart(id, quantity, that, app, index) {
  wx.request({
    url: app.basicurl + '/member/order/edit',
    method: 'post',
    data: { orderId: that.data.options.orderId, quantity: quantity, id: that.data.conData.order.orderItems[index].shopinfo.shopId },
    header: {
      "Content-Type": "application/x-www-form-urlencoded",
      'token': wx.getStorageSync('token')
    },
    success: function (res) {
      if (res.data.code == "100") {
        app.tokenInvalid()
        that.onLoad()
      }
      var quantity = "conData.order.orderItems[" + index + "].quantity"
      var amountPayable = "conData.order.amountPayable"
      var orderprice = (parseFloat(res.data.orderItem.subtotal) - parseFloat(that.data.conData.order.freight)).toFixed(2)
      that.setData({
        [quantity]: res.data.orderItem.quantity,
        [amountPayable]: res.data.effectivePrice,
        orderprice: orderprice
      })
    }
  })
}