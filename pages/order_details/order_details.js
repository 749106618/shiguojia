// pages/order_details/order_details.js
var app = getApp();
let {request} = require('../../utils/api1.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgHeader: app.imgHeader,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var oImg = '';
    //订单状态改变图片改变
    var status = options.status;
    if (status =='待发货'){
      oImg = '../image/o_daifahuo.png'
    } else if (status == '待付款'){
      oImg = '../image/o_daifahuo.png'
    } else if (status == '已发货') {
      oImg = '../image/o_yifahuo.png'
    } else if (status == '已取消') {
      oImg = '../image/o_yiquxiao.png'
    } else{
      oImg = '../image/o_yiwancheng.png'
    }
    
    that.setData({
      options: options,
      oImg: oImg
    })
    requestData(that)
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
    return {
      title: wx.getStorageSync('shareTit'),
      path: 'pages/index_3/index_3?companyId=' + wx.getStorageSync('companyId')
    }
  },
  //复制文字
  copyText: function (e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功',
              icon:'none'
            })
          }
        })
      }
    })
  },
  cecel:function(e){
    var param = { orderId: this.data.options.orderId, clientName: 'SGJ' }
    app.showLoading()
    request.apiGet2('order/unshippedOrderRefund', param).then(res => {
      let pages = getCurrentPages();
      let prevPage = pages[pages.length - 2];
      prevPage.setData({
        currentTab: 4,
      })
      wx.navigateBack({
        delta: 1
      })
    })
  },
  // 拨打电话
  createPoster: function (e) {
    var phone = e.currentTarget.dataset.phone
    wx.showModal({
      title: '确认操作',
      content: '确认拨打' + phone +'电话',
      success: function (res) {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: phone,
          })
        }
      }
    })
  },
  tap:function(e){
    var that = this;
    var type = e.currentTarget.dataset.type;
    if (type =='confirm'){
      confirm(that)
    }
  },
  junp:function(e){
    var that = this;
    var url = e.currentTarget.dataset.url;
    if (url =='../index_3/index_3'){
      wx.switchTab({
        url: url,
      })
    }else{
      wx.navigateTo({
        url: url + '?orderId=' + that.options.orderId + '&index=' + that.options.index,
      })
    }
  }
})

//订单
function requestData(that) {
  var page;//跳转的页面 或请求名称
  var pages;
  var parameter; // 参数内容
  var parameters;
  var ajaxmethod; // 调用的ajax方法
  var timeDiff;//头部提示文字
  var h3text;//头部h3文字
  var aui_payment_prev = 1;//左边button显示 1显示
  var aui_hide = 1;
  var aui_payment = '付款';//右边button文字
  var aui_payment_prev_text = '取消订单';//左边button文字
  var deliveryCorp = 1;//控制物流显隐
  var trackingNo;//物流编号
  var deliveryCorptext;//从物流枚举取值
  var freight;//邮费
  var param = { orderId: that.data.options.orderId}
  app.showLoading()
  request.apiGet2('/order/info',param).then(res=>{
    var data = res.data
    if (data.type == 'success') {
      //待付款
      if (data.after) {
        timeDiff = "剩余" + data.timeDiff + "自动关闭";
        page = "../go_pay/go_pay";
        parameter = "orderId=" + that.data.options.orderId;
        ajaxmethod = "b";
      } else if (data.order.paymentStatus == "unpaid" && data.order.orderStatus == "unconfirmed") {
        timeDiff = "请尽快支付"
        page = "../go_pay/go_pay";
        parameter = "orderId=" + that.data.options.orderId;
        ajaxmethod = "b";
      }
      //已退款
      if (data.order.paymentStatus == "refunded") {
        timeDiff = ""
        h3text = "退款已完成";
        aui_payment_prev = 0;
        aui_payment = '再去逛逛'
        page = "../index_3/index_3";
        parameter = "";
      }
      //已取消
      if (data.order.orderStatus == "cancelled") {
        timeDiff = ""
        h3text = "订单已关闭";
        aui_payment_prev = 0;
        aui_payment = '再去逛逛'
        page = "../index_3/index_3";
        parameter = "";
      }
      //已完成
      if (data.order.orderStatus == "completed") {
        timeDiff = ""
        h3text = "订单已完成";
        aui_payment_prev = 0;
        aui_payment = '再去逛逛'
        page = "../index_3/index_3";
        parameter = "";
      }
      //退款中
      if (data.order.paymentStatus == "refunding") {
        timeDiff = ""
        h3text = "等待卖家处理退款";
        aui_payment_prev = 0;
        aui_hide = 0;
      }
      //待发货
      if (data.order.shippingStatus == "unshipped" && data.order.paymentStatus == "paid") {
        h3text = "等待卖家发货";
        timeDiff = ""
        aui_payment_prev_text = '提醒发货'
        aui_payment = '退款'
        ajaxmethod = "c";
        page = "../refund/refund";
        parameter = "orderId=" + that.data.options.orderId;
      }
      //待收货
      if (data.order.shippingStatus == "shipped" && data.order.paymentStatus == "paid" && !(data.order.orderStatus == "completed" || data.order.orderStatus == "cancelled")) {
        h3text = "卖家已发货！";
        timeDiff = "";
        aui_payment_prev_text = '确认收货';
        aui_payment = '查看物流';
        ajaxmethod = "d";
        page = "../logistics/logistics";
        parameter = "postid=" + data.order.trackingNo + "&type=" + data.order.deliveryCorp + "&signA=" + data.order.signA;
      }
      //已完成
      if (data.order.paymentStatus == "paid" && data.order.orderStatus == "confirmed" && !(data.order.orderStatus == "completed" || data.order.orderStatus == "cancelled")) {
        h3text = "订单已确认收货！";
        timeDiff = "您可以在7天以内进行评论。";
        aui_payment_prev_text = '售后服务';
        aui_payment = '评价';
        ajaxmethod = "a";
        page = "../review_entry/review_entry";
        pages = "../refund/refund";
        parameter = "";
        parameters = "orderId=" + that.data.options.orderId;
      }
      //是否有物流
      if (data.order.deliveryCorp == "" || data.order.deliveryCorp == null || data.order.deliveryCorp == undefined) {
        deliveryCorp = 0;
      } else {
        trackingNo = data.order.trackingNo
      }
      if (data.order.freight == "" || data.order.freight == null || data.order.freight == undefined) {
        freight = '￥0.00';
      } else {
        freight = "¥" + Number(data.order.freight);
      }
      var log1;
      //物流icon
      if (data.order.trackingNo != undefined) {
        log1 = true
      } else {
        log1 = false
      }
      that.setData({
        dataList: data,
        page: page,
        pages: pages,
        parameter: parameter,
        parameters: parameters,
        ajaxmethod: ajaxmethod,
        timeDiff: timeDiff,
        h3text: h3text,
        aui_payment_prev: aui_payment_prev,
        aui_hide: aui_hide,
        aui_payment: aui_payment,
        aui_payment_prev_text: aui_payment_prev_text,
        deliveryCorp: deliveryCorp,
        trackingNo: trackingNo,
        freight: freight,
        log1: log1
      })
    }
  })
}

//确认收货
function confirm(that) {
  var param = { orderId: that.data.options.orderId}
  app.showLoading()
  request.apiGet2('order/confirm', param).then(res => {
    console.log(res)
    if (res.data.type == "success") {
      var pages = getCurrentPages();
      var currPage = pages[pages.length - 1];
      var prevPage = pages[pages.length - 2];     //获取上一个页面
      prevPage.setData({                          //修改上一个页面的变量
        currentTab: 4
      })
      wx.navigateBack(); 
    }
  })
}