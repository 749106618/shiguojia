// pages/receiving_address/receiving_address.js
let { request } = require('../../utils/api1.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  
  data: {
    imgHeader: getApp().imgHeader,
  },
  // keyframes, keyOut
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options==undefined){
      options={}
    }
    this.setData({
      options: options
    })
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    var app = getApp();
    addList(that, app)
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
  keyframes:function(e){
    var index = parseInt(e.currentTarget.dataset.index)
    var k = 'addList[' + index +'].kyes'
    this.setData({
      [k]:'keyframes',
      optiy:true,
      index:index
    })
  },
  keyOut:function(){
    var addList = this.data.addList;
    var index = this.data.index;
    var k = 'addList[' + index + '].kyes';
    this.setData({
      [k]:'keyOut',
      optiy: false,
    })
  },
  //删除地址
  deladdress:function(){
    var that = this;
    var app = getApp();
    var index = this.data.index;
    var param = {
      id: that.data.addList[index].id
    }
    app.showLoading()
    request.apiPost('receiver/delete',param).then(res=>{
        var addList = that.data.addList;
        var index = that.data.index;
        var k = 'addList[' + index + '].kyes';
        that.setData({
          [k]: 'keyOut',
          optiy: false,
        })
      var addList = that.data.addList
      addList.splice(index, 1)
      that.setData({
        addList: addList
      })
    })
  },
  //设置默认地址
  isDefualtAdd:function(){
    var that = this;
    var app = getApp();
    var index = this.data.index;
    var receiver = {};
    var isd = that.data.addList[index].isDefualtAdd;
    if (isd){
      isd=false
    }else{
      isd=true
    }
    receiver.id = that.data.addList[index].id
    receiver.phone = that.data.addList[index].phone;
    receiver.consignee = that.data.addList[index].consignee;
    receiver.address = that.data.addList[index].address;
    receiver.area = that.data.addList[index].areaInfo
    receiver.isDefault = isd;
    var param = JSON.stringify(receiver)
    app.showLoading()
    request.apiPost1('receiver/update',param).then(res=>{
      if (res.type == 'success') {
        wx.showToast({
          title: '修改成功',
          icon: 'none',
        })
        wx.navigateBack({
          delta: 1
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    })
  },
  //新增
  junpEditAddress: function () {
    var data = this.data;
    if (data.options.orderId != null && data.options.orderId != "" & data.options.orderId != undefined && data.options.flag != null && data.options.flag != "" & data.options.flag != undefined) {
      wx.navigateTo({
        url: '../edit_address/edit_address?orderId=' + data.options.orderId + "&flag=" + data.options.flag + '&shopId=' + data.options.shopId,
      })
    } else {
      wx.navigateTo({
        url: '../edit_address/edit_address',
      })
    }
  },
  //修改
  editaddress: function () {
    var index = this.data.index;
    var id = this.data.addList[index].id
    var data = this.data;
    if (data.options.orderId != null && data.options.orderId != "" & data.options.orderId != undefined && data.options.flag != null && data.options.flag != "" & data.options.flag != undefined) {
      wx.navigateTo({
        url: '../edit_address/edit_address?orderId=' + data.options.orderId + "&id=" + id + "&flag=" + data.options.flag+"&a=" + data.options.a,
      })
    } else {
      wx.navigateTo({
        url: '../edit_address/edit_address?id=' + id,
      })
    }
  },
  //点击地址
  junpEditAddress1: function (e) {
    var index = e.currentTarget.dataset.index;
    var data = this.data;
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    var updateOrderddress = data.options.updateOrderddress;
    if (updateOrderddress){
      //修改特权订单地址
      var param = {
        receiverid: data.addList[index].id,
        orderid: data.options.orderId
      }
      app.showLoading()
      request.apiPost('/order/updateOrderddress',param).then(res=>{
        if (res.data.type == "success") {
          wx.navigateBack({
            delta: 1
          })
        } else {
          wx.showToast({
            title: '网络不太好',
            icon: 'none'
          })
        }
      })
    }else{
      if (data.options.orderId != null && data.options.orderId != "" & data.options.orderId != undefined && data.options.flag != null && data.options.flag != "" & data.options.flag != undefined) {
        if (data.options.flag == "1") {
          if (data.options.a == '1') {
            //订单详情
            var a = 'options.orderId'
            var b = 'options.couponId'
            var c = 'options.receiverId'
            var d = 'options.shopId'
            prevPage.setData({
              [a]: data.options.orderId,
              [b]: data.options.couponId,
              [c]: data.addList[index].id,
              [d]: data.options.shopId
            })
            wx.navigateBack({
              delta: 1
            })
          } else {
            //返回商品详情
            var a = 'options.orderId'
            var b = 'options.couponId'
            var c = 'options.receiverId'
            prevPage.setData({
              [a]: data.options.orderId,
              [b]: data.options.couponId,
              [c]: data.addList[index].id,
            })
            wx.navigateBack({
              delta: 1
            })
          }
        } else {
          //runfund
          var c = 'options.orderId'
          var d = 'options.receiverId'
          prevPage.setData({
            [a]: data.options.orderId,
            [b]: data.addList[index].id,
          })
          wx.navigateBack({
            delta: 1
          })
        }
      }
    }
  },
})

function addList(that, app) {
  var param = {}
  app.showLoading()
  request.apiGet('receiver/list',param).then(res=>{
    var adata = res.data.list;
    for (var i = 0; i < res.data.list.length; i++) {
      adata[i].kyes = 'keyNone'
    }
    that.setData({
      addList: adata
    })
  })
}