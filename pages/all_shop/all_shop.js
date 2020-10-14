// pages/all_shop/all_shop.js
let {request} = require('../../utils/api1.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    styles:[],//分类列表
    Goods:[],//商品列表
    page:1,//当前页
    goodsId:'',//当前id
    imgHeader: app.imgHeader
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     
  },
  onHide(){
    this.setData({ page: 1})
  },
  //加载分类
  getGoodsStyles(){
    let self = this;
    app.showLoading()
    var param = { companyId: wx.getStorageSync('companyId')}
    request.apiGet('goods/getGoodsStyles',param).then(res=>{
      if (res.statusCode == 200) {
          console.log(res.data.list)
          self.setData({styles:res.data.list})
          return res.data.list
      }
    }).then(result=>{
      //默认用第一个分类加载商品列表
    self.defaultGoods(result[0].id,0)
      this.setData({
        goodsId:result[0].id
      })
    })
  },
  //点击加载商品
  getGoods(detail){
    console.log(detail.currentTarget.dataset)
    this.setData({
      goodsId:detail.currentTarget.dataset.id,
      page:1
    })
    var page = this.data.page
    let param = {
        style:detail.currentTarget.dataset.id,
        page:page,
        pagesize:10
    }; 
    let self = this;
    app.showLoading()
    request.apiGet('goods/getGoodsByStyle',param).then(res=>{
        console.log(res)
        if (res.statusCode == 200) {
          self.setData({
            Goods:res.data.page.records,
            page:page+1
          })
        }

    })
  },
  //加载商品
  defaultGoods(id,flag){
    // flag=1下一页分页
    var id = id
    var flag = flag
    console.log(id)
    console.log(flag)
    if (id.currentTarget){
      flag = id.currentTarget.dataset.flag
      id = id.currentTarget.dataset.id;
    }
    let param = {
      style:id,
      page:this.data.page,
      pagesize:10
    };
    let self = this;
    app.showLoading()
    request.apiGet('goods/getGoodsByStyle',param).then(res=>{
      console.log(res)
      if (res.statusCode == 200) {
        if(res.data.page.pages < self.data.page){
          return;
        }else{
          var good = res.data.page.records
          if (flag == '1') {
            var emty = self.data.Goods
            for (var i = 0; i < good.length; i++) {
              emty.push(good[i])
            }
            self.setData({
              Goods: emty,
              page: this.data.page+1
            })
          } else {
            self.setData({
              Goods: good,
              page: this.data.page+1
            })
          }
        }
      }
    })
  },
  //加入购物车
  addCard: function (e) {
    var param = {
      quantity: 1,
      id: e.currentTarget.dataset.id
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
        wx.setTabBarBadge({
          index: 2,
          text: '' + carNum1 + '',
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({ Goods:[]})
    this.getGoodsStyles()
  },
  junpDetails: function (e) {
    wx.navigateTo({
      url: '../goods_details1/goods_details1?shopId=' + e.currentTarget.dataset.id,
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('b')
    this.setData({
      page:this.data.page + 1
    })
    this.defaultGoods(this.data.goodsId,1)
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: wx.getStorageSync('shareTit'),
      path: 'pages/index_3/index_3?companyId=' + wx.getStorageSync('companyId')
    }
  }
})