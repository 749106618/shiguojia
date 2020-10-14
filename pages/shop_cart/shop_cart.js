// pages/shop_cart/shop_cart.js
var {request} = require('../../utils/api1.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cartItems: [],//购物车数据
    ids: [],//结算时需要的list集合
    select: [],//勾选的商品1选择0未选中
    price: 0,//价格
    allcolor: 1,//全部选择的颜色
    startX: 0, //开始坐标 删除
    startY: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var app = getApp();
    var that = this;
    that.setData({
      imgHeader: app.imgHeader
    })
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
    var that = this;
    var app = getApp();
    //商品详情不能直接设置tabBar所以跳转过来显示
    var cartNum = parseInt(wx.getStorageSync('cartNum'));
    var carNum1 = cartNum;
    wx.setTabBarBadge({
      index: 2,
      text: '' + carNum1 + '',
    })
    shopCard(that, app);
  },
  //跳转
  junpGoodsDetails: function () {
    wx.switchTab({
      url: '../index_3/index_3',
    })
  },
  //删除商品
  del: function (e) {
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    var that = this;
    var app = getApp();
    var thad = this;
    var cartItems = that.data.cartItems
    var select = that.data.select
    var param = { id: id}
    var quantity = cartItems[index].quantity;//当前商品数量(修改tabBar用)
    app.showLoading()
    request.apiGet2('/cart/delete',param).then(res=>{
      var data = res.data;
      if (data.type == "success") {
        cartItems.splice(index, 1)
        select.splice(index, 1)
        that.setData({
          cartItems: cartItems,
          select: select
        })
      }
    })
    //设置tabBar
    var cartNum = parseInt(wx.getStorageSync('cartNum'));
    var carNum1 = cartNum - quantity;
    wx.setStorageSync('cartNum', carNum1)
    wx.setTabBarBadge({
      index: 2,
      text: '' + carNum1 + '',
    })
  },
  //加减购物车商品数量
  min: function (e) {
    var that = this;
    var thad = this;
    var app = getApp();
    var id = e.currentTarget.dataset.id;
    var index = parseInt(e.currentTarget.dataset.index);
    var quantity = that.data.cartItems[index].quantity;
    var sel = that.data.select[index];//勾选商品的状态
    if (quantity > 1) {
      quantity -= 1;

      var param = { id: id, quantity: quantity}
      app.showLoading()
      request.apiPost2('/cart/edit',param).then(res=>{
        //请求成功之后修改appData里面的数据
        var num = "cartItems[" + index + "].quantity"
        that.setData({
          [num]: quantity,
        })
        //如果是选中状态变换数量需要更改价格
        if (sel != 0 || sel != '0') {
          var price = that.data.price;//商品总价
          var dprice = that.data.cartItems[index].price;//当前勾选的商品价格
          var p = parseFloat((price - dprice).toPrecision(12))
          that.setData({
            price: p
          })
        }
      })
      //设置tabBar
      var cartNum = parseInt(wx.getStorageSync('cartNum'));
      var carNum1 = cartNum - 1;
      wx.setStorageSync('cartNum', carNum1)
      wx.setTabBarBadge({
        index: 2,
        text: '' + carNum1 + '',
      })
    }
  },
  add: function (e) {
    var that = this;
    var thad = this;
    var app = getApp();
    var index = parseInt(e.currentTarget.dataset.index);
    var id = e.currentTarget.dataset.id;
    var quantity = that.data.cartItems[index].quantity;
    var sel = that.data.select[index];//勾选商品的状态
    quantity += 1
    var param = { id: id, quantity: quantity}
    app.showLoading()
    request.apiPost2('/cart/edit',param).then(res=>{
      //请求成功之后修改appData里面的数据
      var num = "cartItems[" + index + "].quantity"
      that.setData({
        [num]: quantity,
      })
      //如果是选中状态变换数量需要更改价格
      if (sel != 0 || sel != '0') {
        var price = that.data.price;//商品总价
        var dprice = that.data.cartItems[index].price;//当前勾选的商品价格
        var p = parseFloat((price + dprice).toPrecision(12))
        that.setData({
          price: p
        })
      }
    })
    //设置tabBar
    var cartNum = parseInt(wx.getStorageSync('cartNum'));
    var carNum1 = cartNum + 1;
    wx.setStorageSync('cartNum', carNum1)
    wx.setTabBarBadge({
      index: 2,
      text: '' + carNum1 + '',
    })
  },
  //勾选商品
  pitchOn: function (e) {
    var that = this;
    var index = parseInt(e.currentTarget.dataset.index);
    var id = e.currentTarget.dataset.id
    var sel = that.data.select[index];//勾选商品的状态
    var select = that.data.select;//商品是否勾选的数组
    var price = that.data.price;//商品总价
    var quantity = that.data.cartItems[index].quantity;//当前勾选的商品数量
    var dprice = that.data.cartItems[index].price;//当前勾选的商品价格
    var ids = that.data.ids;//点击结算需要的id集合
    var price1 = 0;
    if (sel == 0 || sel == '0') {
      //没有勾选，选中，增加价格，id集合增加id
      select[index] = 1;
      price1 = parseFloat((price + quantity * dprice).toPrecision(12));
      ids.push(id)
    } else {
      //已经勾选,取消选中，减少价格，id集合减少id
      select[index] = 0;
      price1 = parseFloat(( price - quantity * dprice).toPrecision(12))
      //取消勾选删除ids内的当前
      var b = ids.indexOf(id)
      ids.splice(b, 1)
    }

    that.setData({
      select: select,
      price: price1,
      ids: ids
    })
  },
  //全选
  pitchOnAll: function (e) {
    var that = this;
    var select = that.data.select;
    var num = 0;
    var lenght1 = 0;
    var sel0 = [];//未选中状态数组
    var sel1 = [];//选中状态数组
    var cartItems = that.data.cartItems;
    var price = 0;//总价
    var quantity = [];  //商品数量集合
    var ids = [];
    var idnull = [];
    for (var i = 0; i < select.length; i++) {
      num += select[i]
      lenght1 += 1
      sel0.push(0);
      sel1.push(1);
      ids.push(cartItems[i].id)
      //总价计算
      price += cartItems[i].price * cartItems[i].quantity
    }
    if (num < lenght1) {
      //没有全部选中，全选，增加价格
      that.setData({
        select: sel1,
        price: price.toFixed(2),
        ids: ids,
        allcolor: 0
      })
    } else {
      //已经全部选中，取消全选,价格变成0
      that.setData({
        select: sel0,
        price: 0,
        ids: idnull,
        allcolor: 1
      })
    }
  },
  //结算
  settleBtn: function (e) {
    var that = this;
    var thad = this;
    var app = getApp();
    var ids = that.data.ids;
    if (ids.length == 0) {
      wx.showToast({
        title: '您还没有勾选商品',
        icon: 'none'
      })
    } else {
      var param = { ids: ids}
      app.showLoading()
      request.apiPost2('/order/build',param).then(res=>{
        that.setData({
          select: [],
          price: 0,
          ids: [],
          allcolor: 1
        })
        if (res.type == 'success') {
          wx.navigateTo({
            url: '../confirm_order/confirm_order?orderId=' + res.order.id,
          })
        }
      })
    }
  },
  juan: function () {
    this.setData({
      frist: false
    })
  },
  junpSplist: function () {
    this.setData({
      frist: false
    })
    wx.navigateTo({
      url: '../shopping_list/shopping_list',
    })
  },
  //手指触摸动作开始 记录起点X坐标
  touchstart: function (e) {
    //开始触摸时 重置所有删除
    this.data.cartItems.forEach(function (v, i) {
      if (v.isTouchMove)//只操作为true的
        v.isTouchMove = false;
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      cartItems: this.data.cartItems
    })
  },
  //滑动事件处理
  touchmove: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index,//当前索引
      startX = that.data.startX,//开始X坐标
      startY = that.data.startY,//开始Y坐标
      touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
      //获取滑动角度
      angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
    that.data.cartItems.forEach(function (v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false
        else //左滑
          v.isTouchMove = true
      }
    })
    //更新数据
    that.setData({
      cartItems: that.data.cartItems
    })
  },
  /**
  * 计算滑动角度
  * @param {Object} start 起点坐标
  * @param {Object} end 终点坐标
  */
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  }
})

//加载购物车
function shopCard(that, app) {
  var thad = that;
  var param = {}
  app.showLoading()
  request.apiGet2('/cart/list',param).then(res=>{
    var data = res.data;
    if (data.code == 100) {
      app.tokenInvalid(thad)
      that.onLoad()
    }
    var select = [];
    
    var b = data.cart
    if(b){
      var a = b.cartItems
      for (var i = 0; i < data.cart.cartItems.length; i++) {
        select.push(0)
        a[i].isTouchMove = false
      }
      that.setData({
        cartItems: data.cart.cartItems,
        select: select,
        price: 0,
        ids: []
      })
    }else{
      that.setData({
        cartItems: [],
        select: [],
        price: 0,
        ids: []
      })
    }
    
  })
}