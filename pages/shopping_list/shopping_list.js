// pages/shopping_list/shopping_list.js
var app = getApp();
let {request} = require('../../utils/api1.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navbarActiveIndex: 0,
    navbarTitle: [
      "有效券",
      "无效券"
    ],
    pHeight: "",
    effective: true,//true未使用 false无效卷
    pageNo: 1,
    pageSize: 4,
    isEnd: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 设置swiper高度
    var winHeight = wx.getSystemInfoSync().windowHeight;
    this.setData({
      pHeight: winHeight
    })
    var that = this;
    var app = getApp();
    that.setData({
      options: options
    })
    if (options.flag != undefined) {
      conData(that);
    } else {
      dataList(that);
    }
  },
  onShareAppMessage: function () {
    return {
      title: wx.getStorageSync('shareTit'),
      path: 'pages/index_3/index_3?companyId=' + wx.getStorageSync('companyId')
    }
  },
  onNavBarTap: function (event) {
    // 获取点击的navbar的index
    let navbarTapIndex = event.currentTarget.dataset.navbarIndex
    // 设置data属性中的navbarActiveIndex为当前点击的navbar
    var effective;
    if (navbarTapIndex == 0) {
      effective = true;
    } else {
      effective = false;
    }
    this.setData({
      navbarActiveIndex: navbarTapIndex,
      effective: effective,
      pageNo: 1,
      pagesize: 10,
      isEnd: false,
      dataList:[]
    });
    var that = this;
    if (that.data.options.flag == undefined) {
      dataList(that)
    }
  },
  onBindAnimationFinish: function ({ detail }) {
    // 设置data属性中的navbarActiveIndex为当前点击的navbar
    var effective;
    if (detail.current == 0) {
      effective = true;
    } else {
      effective = false;
    }
    this.setData({
      navbarActiveIndex: detail.current,
      effective: effective,
      pageNo: 1,
      pagesize: 10,
      isEnd: false,
      dataList:[]
    })
    var that = this;
    if (that.data.options.flag == undefined) {
      dataList(that)
    }
  },
  //上拉
  onReachBottom: function () {
    var that = this;
    if (that.data.options.flag == undefined) {
      dataList(that);
    }
  },
  //点击优惠券(带参)
  junp: function (e) {
    var id = this.data.options.orderId;
    var gd = this.data.options.gd;
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    if (gd != undefined && gd != null){
      var type = e.currentTarget.dataset.type
      var discount = e.currentTarget.dataset.discount
      if (type =='discount'){
        type='折'
        discount = discount*10
      }else{
        type='￥'
      }
      var juantxt = discount + type
      var couponId = 'options.couponId'
      prevPage.setData({
        orderId: this.data.options.orderId,
        [couponId]: e.currentTarget.dataset.id,
        receiverId: this.data.options.receiverId,
        hua: 'hua1',
        juantxt: juantxt,
        check: this.data.options.check
      })
      wx.navigateBack({
        delta: 1
      })
    }else if (id != undefined && id != null) {
      var couponId = 'options.couponId'
      prevPage.setData({
        orderId: this.data.options.orderId,
        [couponId]: e.currentTarget.dataset.id,
        receiverId: this.data.options.receiverId,
        juantxt: juantxt,
        check: this.data.options.check
      })
      wx.navigateBack({
        delta: 1
      })
      // wx.navigateTo({
      //   url: '../confirm_order/confirm_order?orderId=' + this.data.options.orderId + "&couponId=" + e.currentTarget.dataset.id + "&receiverId=" + this.data.options.receiverId
      // })
    }
  },
  junpAll:function(e){
    wx.switchTab({
      url: '../all_shop/all_shop',
    })
  }
})

function dataList(that) {
  if (that.data.isEnd) {
    return
  }else{
    var param = { pageNo: that.data.pageNo, pageSize: that.data.pageSize, effective: that.data.effective }
    app.showLoading()
    request.apiGet('/coupon/list',param).then(res=>{
      var page = that.data.pageNo;
      var dataList = that.data.dataList;
      if(dataList==undefined){
        dataList=[]
      }
      var endDate,beginDate;
      var a = res.data.page.records;
      var ee,bb;//end_date begin_date
      if (page < res.data.page.pages) {
        for (var i = 0; i < a.length; i++){
          endDate = (a[i].end_date).substr(0, 10);
          beginDate = (a[i].begin_date).substr(0, 10);
          a[i].end_date = endDate
          a[i].begin_date = beginDate
          dataList.push(a[i])
        }
        that.setData({
          dataList:dataList,
          pageNo: page + 1
        })
      } else if(page = res.data.page.pages) {
        for (var i = 0; i < a.length; i++){
          endDate = (a[i].end_date).substr(0, 10);
          beginDate = (a[i].begin_date).substr(0, 10);
          a[i].end_date = endDate
          a[i].begin_date = beginDate
          dataList.push(a[i])
        }
        that.setData({
          dataList:dataList,
          isEnd: true,
        })
      }else{
        that.setData({
          page: page + 1,
          dataList:a,
        })
        if(page >= res.data.page.pages){
          that.setData({
            isEnd:true,
          })
        }
      }
    })
  }
}

function conData(that) {
  if (that.data.isEnd) {
    return
  }
  var param = { 
    pageNo: that.data.pageNo, 
    pageSize: that.data.pageSize, 
    orderId: that.data.options.orderId,
    shippingMethodName: that.data.options.shippingMethodName
  }
  app.showLoading()
  request.apiGet('/coupon/effectiveList',param).then(res=>{
    that.setData({
      dataList: res.data,
    })
    var endDate, beginDate;
    var a = res.data.list;
    for (var i = 0; i < a.length; i++) {
      endDate = (a[i].end_date).substr(0, 10);
      beginDate = (a[i].begin_date).substr(0, 10);
      var ee = 'dataList.list[' + i + '].end_date'
      var bb = 'dataList.list[' + i + '].begin_date'
      console.log(endDate)
      that.setData({
        [ee]: endDate,
        [bb]: beginDate
      })
    }
  })
}