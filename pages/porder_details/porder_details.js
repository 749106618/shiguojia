// pages/porder_details/porder_details.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    log: false,//false订单 true物流
    onOff: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var pENUM = {
      AAEWEB: "AAE",
      CAE: "民航",
      ARAMEX: "Aramex",
      ND56: "能达",
      DHL: "DHL",
      PEISI: "配思航宇",
      DPEX: "DPEX",
      EFSPOST: "平安快递",
      DEXP: "D速",
      CHINZ56: "秦远物流",
      EMS: "EMS",
      QCKD: "全晨",
      EWE: "EWE",
      QFKD: "全峰",
      FedEx: "FedEx",
      APEX: "全一",
      FEDEXIN: "FedEx国际",
      RFD: "如风达",
      PCA: "PCA",
      SFC: "三态",
      TNT: "TNT",
      STO: "申通",
      UPS: "UPS",
      SFWL: "盛丰",
      ANJELEX: "安捷",
      SHENGHUI: "盛辉",
      ANE: "安能",
      SDEX: "顺达快递",
      ANEEX: "安能快递",
      SFEXPRESS: "顺丰",
      ANXINDA: "安信达",
      SUNING: "苏宁",
      EES: "百福东方",
      SURE: "速尔",
      HTKY: "百世快递",
      HOAU: "天地华宇",
      BSKY: "百世快运",
      TTKDEX: "天天",
      FLYWAYEX: "程光",
      VANGEN: "万庚",
      DTW: "大田",
      WANJIA: "万家物流",
      DEPPON: "德邦",
      EWINSHINE: "万象",
      GCE: "飞洋",
      GZWENJIE: "文捷航空",
      PHOENIXEXP: "凤凰",
      XBWL: "新邦",
      FTD: "富腾达",
      XFEXPRESS: "信丰",
      GSD: "共速达",
      BROADASIA: "亚风",
      GTO: "国通",
      YIEXPRESS: "宜送",
      BLACKDOG: "黑狗",
      QEXPRESS: "易达通",
      HENGLU: "恒路",
      ETD: "易通达",
      HYE: "鸿远",
      UC56: "优速",
      HQKY: "华企",
      CHINAPOST: "邮政包裹",
      JOUST: "急先达",
      YFHEX: "原飞航",
      TMS: "加运美",
      YTO: "圆通",
      JIAJI: "佳吉",
      YADEX: "源安达",
      JIAYI: "佳怡",
      YCGWL: "远成",
      KERRY: "嘉里物流",
      YFEXPRESS: "越丰",
      HREX: "锦程快递",
      YTEXPRESS: "运通",
      PEWKEE: "晋越",
      YUNDA: "韵达",
      JD: "京东",
      ZJS: "宅急送",
      KKE: "京广",
      ZMKMEX: "芝麻开门",
      JIUYESCM: "九曳",
      COE: "中国东方",
      KYEXPRESS: "跨越速运",
      CRE: "中铁快运",
      FASTEXPRESS: "快捷",
      ZTKY: "中铁物流",
      BLUESKY: "蓝天",
      ZTO: "中通",
      LTS: "联昊通",
      LBEX: "龙邦",
      ZTO56: "中通快运",
      CNPL: "中邮",
      YIMIDIDA: "壹米滴答",
      PJKD: "品骏快递",
      RRS: "日日顺物流",
      HTKY: "汇通快递",
      YXWL: "宇鑫物流",
      INTMAIL: "邮政国际包裹",
      DJ56: "东骏快捷"
    }
    that.setData({
      options: options,
      pENUM: pENUM
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    requestData(that)
  },
  //修改订单地址
  updateOrderddress:function(){
    var status = this.data.status
    if (status){
      wx.navigateTo({
        url: '../receiving_address/receiving_address?updateOrderddress=1&orderId=' + this.data.options.orderId,
      })
    }else{
      wx.showToast({
        title: '已经操作过的订单不可以修改地址哦',
        icon:'none'
      })
    }
    
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: wx.getStorageSync('shareTit'),
      path: 'pages/open/open?inviteCode=' + wx.getStorageSync('inviteCode')
    }
  },
  //确认收水果
  confirm:function(){
    var that = this;
    var bUrl = '/member/order/vipConfirm'
    confirmCancel(that,bUrl);
  },
  //点击显示弹窗
  cancel:function(){
    var that = this;
    that.setData({
      onOff:false
    })
    wx.request({
      url: app.basicurl +'/member/order/getVipCancelSize',
      header:{'token':wx.getStorageSync('token')},
      success: res => {
        console.log(res)
        that.setData({
          onOff: true,
          cFlag: true,
          cenList:res.data
        })
      }
    })
  },
  //确认放弃
  cancel1:function(){
    var that = this;
    var size = parseInt(that.data.cenList.size)
    
    if (size<=3){
      var bUrl = '/member/order/vipCancel'
      confirmCancel(that, bUrl);
    }else{
      wx.showToast({
        title: '您本年度放弃的次数不足',
        icon:'none'
      })
    }
  },
  //取消放弃
  cancel2:function(){
    this.setData({
      cFlag: false
    })
  },
  log_order: function () {
    var that = this;
    var log = that.data.log;
    if (log) {
      //物流转订单
      that.setData({
        onOff: false,
      })
      requestData(that)
      that.setData({
        log: false,
        log1: true,
      })
    } else {
      //订单转物流
      var postid, type, postidtext, typetext;
      var postid1 = that.data.options.postid.split('~');
      var type1 = that.data.options.type.split('~');
      postid = postid1[0]
      var t = type1[0]
      type = that.data.pENUM[type1[0]]
      that.setData({
        type1: type,
        postid1: postid1,
        log: true,
        log1: false,
        onOff: false,
      })
      requerData(that, postid, t)
    }
  },
  //复制文字
  copyText: function (e) {
    console.log(e)
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功',
              icon: 'none'
            })
          }
        })
      }
    })
  },
})

function confirmCancel(that, bUrl){
  wx.request({
    url: app.basicurl+bUrl,
    header:{'token':wx.getStorageSync('token')},
    data: { orderId:that.data.options.orderId},
    success:function(res){
      console.log(res)
      if(res.data.type=='success'){
        wx.navigateBack({
          delta: 1 
        })
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    }
  })
}

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
  wx.request({
    url: app.basicurl + '/member/order/info',
    header: {
      'token': wx.getStorageSync('token')
    },
    data: { orderId: that.data.options.orderId },
    success: function (res) {
      console.log(res)
      var data = res.data;
      if (data.code == "100") {
        app.tokenInvalid()
        that.onLoad()
      }
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
          deliveryCorptext = that.data.pENUM[data.order.deliveryCorp]
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
        var paymentStatus = data.order.paymentStatus
        var orderStatus = data.order.orderStatus
        var status = true;
        console.log(paymentStatus + '      ' + orderStatus)
        if (paymentStatus == 'paid' || orderStatus == 'cancelled'){
          status=false
        }else{
          status=true
        }
        console.log(status);
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
          deliveryCorptext: deliveryCorptext,
          trackingNo: trackingNo,
          freight: freight,
          onOff: true,
          log1: log1,
          status: status
        })
      }
    }
  })
}

//物流
function requerData(that, postid, t) {
  wx.request({
    url: app.basicurl + 'member/order/queryWlInfo',
    data: { postid: postid, type: t, signA: that.data.options.signA },
    success: function (res) {
      console.log(res)
      var data = JSON.parse(res.data);
      that.setData({
        logList: data.result,
        onOff: true,
      })
    }
  })
}