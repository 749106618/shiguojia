var app = getApp();
let {request} = require('../../utils/api1.js')
Page({
  data: {
    winHeight: "", //窗口高度
    currentTab: 0, //预设当前项的值
    navbarTitle: ["全部","待付款", "待发货", "待收货", "已完成"],
    orderType: ['all','unpaid', 'unshipped', 'shipped', 'confir'],
    scrollLeft: 0, //tab标题的滚动条位置
    expertList: [],
    page: 1,
    pagesize: 10,
    isEnd: false,//是否到底
    ab: true,
    imgHeader: app.imgHeader,
    onshow:false,
  },
  onLoad: function (options) {
    var that = this;
    //  高度自适应
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR - 100;
        that.setData({
          winHeight: calc
        });
      }
    });
    var type = options.type;
    if (type == undefined || type == null || type == '') {
      type = 'unpaid'
    }
    var ab;
    if (type =='unshipped'){
      ab=false
    }
    that.setData({
      options: options,
      type: type,
      navbarActiveIndex: Number(options.index),
      ab: ab
    })
    if(options.index!=null){
      that.setData({
        currentTab:options.index
      })
    }
  },
  onShow:function(){
    // if(this.data.onshow){
    //   var that = this;
    //   orederList(that)
    // }
  },
  // 滚动切换标签样式
  switchTab: function (e) {
    var that = this;
    this.setData({
      page: 1,
      pagesize: 10,
      isEnd: false,
      dataList:[]
    })
    //e.detail.current现在是在哪一个选项卡里面 
    switch (e.detail.current) {
      case 0:
        this.setData({
          currentTab: e.detail.current,
          type: 'all',
          expertList: [],
          ab:true,
          whitehide:0
        });
        orederList(that)
        break;
      case 1:
        this.setData({
          currentTab: e.detail.current,
          expertList: [],
          type: 'unpaid',
          ab: false,
          whitehide: 1
        });
        orederList(that)
        break;
      case 2:
        this.setData({
          currentTab: e.detail.current,
          expertList: [],
          type: 'unshipped',
          ab: true,
          whitehide: 1
        });
        orederList(that)
        break;
      case 3:
        this.setData({
          currentTab: e.detail.current,
          expertList: [],
          type: 'shipped',
          ab: true,
          whitehide: 1
        });
        orederList(that)
        break;
      case 4:
        this.setData({
          currentTab: e.detail.current,
          expertList: [],
          type: 'confir',
          ab: true,
          whitehide: 0
        });
        orederList(that)
    }
    this.checkCor();
  },
  onUnload() {
    wx.reLaunch({
      url: '../user_index/user_index'
    })
  },
  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    var cur = e.target.dataset.current;
    if (this.data.currentTaB == cur) {
      return false;
    } else {
      this.setData({
        currentTab: cur
      })
    }
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。                                currentTab值？
  checkCor: function () {
    if (this.data.currentTab > 3) {
      this.setData({
        scrollLeft: 300
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
  },
  //订单点击事件
  info(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var status = e.currentTarget.dataset.status;
    var operationurl = this.data.operationurl;
    console.log(operationurl[index].substr(0, 9))
    wx.navigateTo({
      url: operationurl[index] + '&status=' + status + '&index='+index,
    })
  },
  //彩色按钮点击事件
  button:function(e){
    var index = e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.id;
    var operationurl1 = this.data.operationurl1;
    var that = this;
    if (operationurl1[index] == "../index_3/index_3") {
      wx.switchTab({
        url: '../index_3/index_3',
      })
    } else if (operationurl1[index] == "确认收货"){
      confirm(that, id, index)
    } else if (operationurl1[index] == "申请退款") {
      unshippedOrderRefund(that, id, index)
    }else{
      wx.navigateTo({
        url: operationurl1[index] + '&index='+index,
      })
    }
  },
  //白色按钮点击事件
  button1:function(e){
    var that = this;
    var index = e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.id;
    var operationurl2 = this.data.operationurl2;
    if (operationurl2[index] =="../index_3/index_3"){
      wx.switchTab({
        url: '../index_3/index_3',
      })
    } else if (operationurl2[index] == "取消订单"){
      cancel(that,id,index)
    }else{
      wx.navigateTo({
        url: operationurl2[index],
      })
    }
  },
  //页面上拉触底事件的处理函数
  onReachBottom: function () {
    var that = this;
    var flag = '1'
    orederList(that,flag)
  },
  onShareAppMessage:function(){
    return {
      title: wx.getStorageSync('shareTit'),
      path: 'pages/index_3/index_3?companyId=' + wx.getStorageSync('companyId')
    }
  }
})
//加载
function orederList(that,flag) {
  var type = that.data.type
  if (that.data.isEnd) {
    wx.hideLoading();
    return
  }else{
    app.showLoading()
    var param = { page: that.data.page, pagesize: that.data.pagesize, type: type }
    request.apiPost2('/order/orderlist', param).then(res => {
      var res1 = res.page.records;
      var status = []// 循环的是右上角的状态(可能出现的bug:加载下一页的状态可能存在误差)
      var showoperation = []//色彩a标签的文字
      var showoperation1 = []//白色a标签的文字
      var operationurl = []//触发订单点击事件
      var operationurl1 = []//彩色button
      var operationurl2 = []//白色button 点击事件
      var whitehide;//隐藏白色按钮
      for (var i = 0; i < res1.length; i++) {
        // 循环的是右上角的状态
        if (res1[i].paymentStatus == "refunding") {
          showoperation.push("查看详情")
          status.push("售后中")
          showoperation1.push("联系客服 ")
          whitehide = 0;
          operationurl.push("../order_details/order_details?orderId=" + res1[i].id + '&postid=' + res1[i].trackingNo + "&type=" + res1[i].deliveryCorp + "&signA=" + res1[i].signA)
          operationurl1.push("../order_details/order_details?orderId=" + res1[i].id + '&postid=' + res1[i].trackingNo + "&type=" + res1[i].deliveryCorp + "&signA=" + res1[i].signA);
        }
        else if (res1[i].paymentStatus == "refunded") {
          showoperation.push("查看详情")
          status.push("已售后")
          whitehide = 1;
          showoperation1.push("再去逛逛")
          operationurl.push("../order_details/order_details?orderId=" + res1[i].id)
          operationurl1.push("../order_details/order_details?orderId=" + res1[i].id)
          operationurl2.push("../index_3/index_3")
        }
        //待评价，售后服务
        else if (res1[i].orderStatus == "confirmed") {
          showoperation.push("售后服务")
          status.push("已确认")
          whitehide = 0;
          showoperation1.push("售后服务")
          operationurl.push("../refund/refund?orderId=" + res1[i].id)
          operationurl1.push("../refund/refund?orderId=" + res1[i].id)
        }
        //已取消
        else if (res1[i].orderStatus == "cancelled") {
          showoperation.push("重选商品")
          status.push("已取消")
          whitehide = 0;
          showoperation1.push("查看详情")
          operationurl.push("../ order_details / order_details ? orderId = " + res1[i].id)
          operationurl1.push("../index_3/index_3")
        }
        //已完成
        else if (res1[i].orderStatus == "completed") {
          showoperation.push("再去逛逛")
          status.push("已完成")
          whitehide = 0;
          showoperation1.push("查看详情")
          operationurl.push("../order_details/order_details?orderId=" + res1[i].id)
          operationurl1.push("../index_3/index_3")
        }
        //待付款
        else if (res1[i].paymentStatus == "unpaid") {
          showoperation.push("立即支付")
          status.push("待付款")
          whitehide = 1;
          showoperation1.push("取消订单")
          operationurl.push("../go_pay/go_pay?orderId=" + res1[i].id)
          operationurl1.push("../go_pay/go_pay?orderId=" + res1[i].id)
          operationurl2.push('取消订单')
        }
        //待发货
        else if (res1[i].shippingStatus == "unshipped" && res1[i].paymentStatus == "paid") {
          showoperation.push("申请退款")
          status.push("待发货")
          whitehide = 0;
          showoperation1.push("售后")
          operationurl.push("../order_details/order_details?orderId=" + res1[i].id)
          operationurl1.push("申请退款")
        }
        //已发货
        else if (res1[i].shippingStatus == "shipped" && res1[i].orderStatus == "unconfirmed") {
          showoperation.push("确认收货")
          status.push("待收货")
          whitehide = 0;
          showoperation1.push("确认收货")
          operationurl.push("../order_details/order_details?orderId=" + res1[i].id + '&postid=' + res1[i].trackingNo + "&type=" + res1[i].deliveryCorp + "&signA=" + res1[i].signA)
          operationurl1.push("确认收货")
        }
      }
      var page = that.data.page;
      var dataList = that.data.dataList
      var s = that.data.showoperation;
      var s1 = that.data.showoperation1;
      var o = that.data.operationurl;
      var o1 = that.data.operationurl1;
      var o2 = that.data.operationurl2;
      var st = that.data.status;
      console.log(page)
      console.log(res.page.pages)
      if (flag=='1'&&page <= res.page.pages){
        //分页
        if (page < res.page.pages) {
          //有下一页
          var data = dataList;
          for (var i = 0; i < res1.length-1; i++) {
            data.push(res1[i])
            s.push(showoperation[i])
            s1.push(showoperation1[i])
            o.push(operationurl[i])
            o1.push(operationurl1[i])
            o2.push(operationurl2[i])
            st.push(status[i])
          }
          that.setData({
            dataList: data,
            page: page + 1,
            showoperation: s,
            showoperation1: s1,
            operationurl: o,
            operationurl1: o1,
            operationurl2: o2,
            status: st,
          })
        }else if(page = res.page.pages){
          //无下一页
          console.log('end'+page)
          var data = dataList;
          for (var i = 0; i < res1.length; i++) {
            data.push(res1[i])
            s.push(showoperation[i])
            s1.push(showoperation1[i])
            o.push(operationurl[i])
            o1.push(operationurl1[i])
            o2.push(operationurl2[i])
            st.push(status[i])
          }
          that.setData({
            dataList: data,
            showoperation: s,
            showoperation1: s1,
            operationurl: o,
            operationurl1: o1,
            operationurl2: o2,
            status: st,
            isEnd:true
          })
        }
      }else{
        that.setData({
          status: status,
          onshow: true,
          dataList: res1,
          page: page + 1,
          showoperation: showoperation,
          showoperation1: showoperation1,
          operationurl: operationurl,
          operationurl1: operationurl1,
          operationurl2: operationurl2,
        })
        if(page >= res.page.pages){
          that.setData({
            isEnd:true
          })
        }
      }
     
      wx.setStorageSync('refunList', res1)
    })
  }
}

//取消订单
function cancel(that, id ,index) {
  var param = { orderId:id}
  var dataList = that.data.dataList
  request.apiGet2('/order/cancel',param).then(res=>{
    wx.showToast({
      title: '取消成功',
      icon:'none'
    })
    dataList.splice(index, 1);
    that.setData({
      dataList: dataList
    })
  })
}

//确认收货
function confirm(that, id, index) {
  var param = { orderId:id}
  request.apiGet2('order/confirm',param).then(res=>{
    console.log(res)
    if (res.data.type =="success"){
      that.setData({
        currentTab: 4
      })
    }
  })
}

//待发货取消订单
function unshippedOrderRefund(that, id, index){
  var param = { orderId: id, clientName: 'SGJ'}
  request.apiGet2('order/unshippedOrderRefund',param).then(res=>{
    console.log(res)
    if (res.data.type == "success") {
      that.setData({
        currentTab: 4
      })
    }
  })
}