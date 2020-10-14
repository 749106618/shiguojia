// pages/goods_details1/goods_details1.js
let {request} = require('../../utils/api1.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Goods:[],
    imgHeader: app.imgHeader
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      options:options,
    })
    if (options.companyId!=undefined){
      wx.setStorageSync('companyId', options.companyId)
    }
    this.getGoodsInfo()
  },
  addCard(){
    var param = {
      quantity: 1,
      id: this.data.options.shopId
    }
    app.showLoading()
    request.apiPost2('cart/add', param).then(res => {
      if (res.type == "success") {
        wx.showToast({
          title: '添加成功',
          icon: 'success',
          duration: 2000
        })
        //设置tabBar
        var cartNum = parseInt(wx.getStorageSync('cartNum'));
        var carNum1 = cartNum + 1;
        wx.setStorageSync('cartNum', carNum1)
      }
    })
  },
  buy(){
    var param = {
      quantity: 1,
      id: this.data.options.shopId
    }
    app.showLoading()
    request.apiPost2('cart/add', param).then(res => {
      if (res.type == "success") {
        //设置tabBar
        var cartNum = parseInt(wx.getStorageSync('cartNum'));
        var carNum1 = cartNum + 1;
        wx.setStorageSync('cartNum', carNum1)
        
        wx.switchTab({
          url: '../shop_cart/shop_cart',
        })
      }
    })
  },
  junp(){
    wx.navigateTo({
      url: '../good_text/good_text',
    })
  },
  getGoodsInfo(){
    let param = {
      goodsId: this.data.options.shopId
    }
    let self = this;
    app.showLoading()
    request.apiGet('goods/goodsInfo',param).then(res=>{
      if (res.statusCode == 200) {
          console.log(res.data.goodsInfo)
          res.data.goodsInfo.showImageUrl = res.data.goodsInfo.showImageUrl.split(',')
          var reg = new RegExp('<img', 'g')
          var reg1 = new RegExp('<p', 'g')
          var nodes = res.data.goodsInfo.content;
          nodes = nodes.replace(reg, '<img style="max-width:100%;height:auto" ');
          nodes = nodes.replace(reg1, '<p style="width:100vw;"')
          self.setData({
            Goods:res.data.goodsInfo,
            nodes: nodes
          })
      }
    })
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
      path: 'pages/goods_details1/goods_details1?companyId=' + this.data.Goods.companyId + '&shopId=' + this.data.options.shopId
    }
  },
  backIndex:function(){
    wx.switchTab({
      url: '../index_3/index_3',
    })
  }
})