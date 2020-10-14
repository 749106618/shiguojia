// pages/index_3/index_3.js
let {
  request
} = require('../../utils/api1.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    options: {},
    dataList: [],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    circular: false,
    interval: 3000,
    duration: 1000,
    popupWindow: false,
    page: 1,
    pagesize: 5,
    isEnd: false,
    start: "加载中..", //下拉菜单
    isstart: false,
    openimg: "20200315/1584264145169.png",
    offimg: "20200315/1584264145169.png",
    token: false, //token状态
    codeType:0,//0隐藏 1显示
    isNewUser:false,
    coup:false,//单独店铺进来 控制图片显隐
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var app = getApp()
    wx.setStorageSync('shareTit', "侍果家");
    wx.getSystemInfo({
      success: function(res) {
        var x = res.windowWidth - 60;
        var y = res.windowHeight - 120;
        that.setData({
          x: x,
          y: y,
          imgHeader: app.imgHeader,
          options: options
        })
      },
    })
    if(options!=undefined){
      if (options.companyId){
        wx.setStorageSync('companyId', options.companyId)
      }
      if(options.coup){
        that.setData({
          coup:true
        })
      }
      // scene#SGJ73513007 广电店的key
      if(options.scene){
        var scene = decodeURIComponent(options.scene)
        var companyId = scene.split(',')[0];
        var coup;
        var param = {key:companyId}
        request.apiPost('/weixin/getScene',param).then(res=>{
          if (res.scene != "" && res.scene != null && res.scene != undefined) {
            var s = JSON.parse(res.scene);
            wx.setStorageSync('companyId', s.companyId);
          }
        })
        if(scene.split(',')[1]!=undefined){
          that.setData({coup:true})
        }else{
          that.setData({coup:false})
        }
      }
    }
  },
  //分享二维码
  createPoster: function() {
    var that = this;
    var jsonObject = { "companyId": wx.getStorageSync('companyId')}
    var param = { jsonObject: JSON.stringify(jsonObject)}
    request.apiPost('/weixin/setScene', param).then(res=>{
      // 小程序带参res.key
      var param1 = {
        page: String(that.route),
        scene: res.key,
        width: '300',
        auto_color: 'false',
        line_color: '{"r":0,"g":0,"b":0}',
        is_hyaline: 'false',
        companyId: wx.getStorageSync('companyId')
      };
      app.showLoading();
      request.apiPost('weixin/getWXACodeUnlimit', param1).then(res1 => {
        console.log(res1)
        that.setData({
          rqCode: res1.img,
          codeType: 1,
        })
      })
    })
  },
  codehide:function(){
    this.setData({ codeType:0})
  },
  onShow: function() {
    var that = this;
    wx.getStorage({
      key: 'token',
      success: function (res) {
        that.setData({
          token: true
        })
      },
      fail: function (res) {
        that.setData({
          token: false
        })
      }
    })
    wx.getStorage({
      key: 'isNewUser',
      success: function(res) {
        that.setData({
          isNewUser: res.data
        })
      },
      fail: function (res) {
        that.setData({
          isNewUser: false
        })
      }
    })
    wx.getLocation({
      type: 'wgs84',
      success: (res) => {
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy
        var map = {
          latitude: latitude,
          longitude: longitude
        }
        this.setData({
          latitude: latitude,
          longitude: longitude,
          map: map
        })
        goodList(that);
      },
      fail:(res)=>{
        goodList(that);
      }
    })
  },
  onShareAppMessage: function() {
    return {
      title: wx.getStorageSync('shareTit'),
      path: 'pages/index_3/index_3?companyId=' + wx.getStorageSync('companyId')
    }
  },
  //跳转详情页
  junpDetails: function(e) {
    wx.navigateTo({
      url: '../goods_details1/goods_details1?shopId=' + e.currentTarget.dataset.id,
    })
  },
  //添加购物车
  addCard: function(e) {
    var param = {
      quantity: 1,
      id: e.currentTarget.dataset.id
    }
    app.showLoading();
    request.apiPost2('cart/add', param).then(res => {
      if (res.type == "success") {
        wx.showToast({
          title: '添加成功',
          icon: 'success',
          duration: 2000
        })
        //加入购物车成功修改tabBar数据
        var cartNum = parseInt(wx.getStorageSync('cartNum'));
        var carNum1 = cartNum + 1
        wx.setStorageSync('cartNum', carNum1)
        wx.setTabBarBadge({
          index: 2, //图标下标是从0开始，2代表第3个图标
          text: '' + carNum1 + '',
        })
      }
    })
  },
  juan: function() {
    var token = wx.getStorageSync('token');
    this.setData({
      popupWindow: false
    })
  },
  //领券
  junpSplist: function() {
    var that = this;
    var thad = this
    var token = that.data.token;
    var juan = get('juan'); //时效缓存
    console.log(juan)
    console.log(token)
    if (token) {
      //领卷
      if (juan == null || juan == undefined) {
        this.setData({
          popupWindow: false
        })
        if (JSON.parse(this.data.popupWindow1)) {
          var param = {}
          app.showLoading()
          request.apiGet('coupon/receivecoupon', param).then(res => {
            console.log('领劵')
            put('juan', 'juan', '86400') //缓存一天
            that.setData({
              popupWindow: false
            })
            wx.navigateTo({
              url: '../shopping_list/shopping_list',
            })
          })
        }
      }else{
        this.setData({
          popupWindow: false
        })
        wx.navigateTo({
          url: '../shopping_list/shopping_list',
        })
      }
    } else {
      //没有token去授权
      this.setData({
        popupWindow: false
      })
      wx.navigateTo({
        url: '../get_phone/get_phone',
      })
    }
  },
  //广电店领券
  coup:function(){
    var that = this;
    var param = {
      token:wx.getStorageSync('token'),
      couponId:'f6007a26-acff-4cb2-a616-6339c35972e3',
      companyId:wx.getStorageSync('companyId')
    }
    request.apiPost('coupon/provideCoupon',param).then(res=>{
      wx.navigateTo({
        url: '../shopping_list/shopping_list',
      })
      that.setData({coup:false})
    })
  },
  hideCoup:function(){
    this.setData({ coup:false})
  },
  junp:function(){
    wx.setStorageSync('isNewUser', false)
    wx.navigateTo({
      url: '../shopping_list/shopping_list',
    })
  },
  juanNone:function(){
    this.setData({ isNewUser:false})
  },
  junpUrl: function(e) {
    var url = e.currentTarget.dataset.caption;
    var url1 = url.split('/')[0]
    if (url1 == 'http:' || url1 == 'https:') {
      wx.navigateTo({
        url: '../junp/junp?pUrl=' + url,
      })
    } else if (url1 == '..') {
      wx.navigateTo({
        url: url,
      })
    } else {
      console.log(url)
    }
  },
  //切换店铺
  opens: function(e) {
    switch (e.currentTarget.dataset.item) {
      case "1":
        if (this.data.isstart) {
          this.setData({
            isstart: false,
          });
        } else {
          this.setData({
            isstart: true,
          });
        }
        break;
    }
  },
  onclicks1: function(e) {
    var that = this
    var index = e.currentTarget.dataset.index;
    let name = this.data.dataList.companies[index].name;
    wx.setStorageSync('companyId', this.data.dataList.companies[index].id) //门店id
    this.setData({
      isstart: false,
      isfinish: false,
      isdates: false,
      start: this.data.dataList.companies[index].name,
      finish: "目的地"
    })
    qList(that)
  }
})

//加载
function goodList(that, index) {
  var index = index;
  if (index == undefined) {
    index = 0
  }
  if (that.data.isend) {
    return
  }
  var companyId;
  var companyId1 = wx.getStorageSync('companyId')
  if (companyId1 != undefined || companyId1 != null) {
    companyId = companyId1
  }
  wx.getStorage({
    key: 'token',
    success: function (res) {
      that.setData({
        token : true
      })
    }
  })
  var token = ''
  if(that.data.token){
    token = wx.getStorageSync('token')
  }
  let param = {
    companyId: companyId,
    longitude: that.data.longitude,
    latitude: that.data.latitude,
    isSwitch:false,//不清空购物车
    token: token,
    that:that
  }
  app.showLoading()
  request.apiPost('index/showIndex', param).then(res => {
    wx.setStorageSync('cartNum', res.cartNum)
    if (res.cartNum!=0){
      wx.setTabBarBadge({
        index: 2, //图标下标是从0开始，2代表第3个图标
        text: '' + res.cartNum + '',
      })
    }else{
      wx.setTabBarBadge({
        index: 2,
        text: '0',
      })
    }
    var juan = get('juan');
    wx.setStorageSync('address', res.company.address)
    wx.setStorageSync('dTel', res.company.tel)
    if (juan != null && juan != undefined) {
      that.setData({
        dataList: res,
        popupWindow: false,
        start: res.company.name,
      })
    } else {
      wx.setStorageSync('companyId', res.company.id)
      that.setData({
        dataList: res,
        start: res.company.name,
        popupWindow: JSON.parse(res.popupWindow),
        popupWindowImg: res.popupWindowImg,
        popupWindow1: JSON.parse(res.popupWindow),
      })
    }
  })
}

//切换店铺
function qList(that){
  var companyId;
  var companyId1 = wx.getStorageSync('companyId')
  if (companyId1 != undefined || companyId1 != null) {
    companyId = companyId1
  }
  wx.getStorage({
    key: 'token',
    success: function (res) {
      that.setData({
        token: true
      })
    }
  })
  var token = ''
  if (that.data.token) {
    token = wx.getStorageSync('token')
  }
  let param = {
    companyId: companyId,
    longitude: that.data.longitude,
    latitude: that.data.latitude,
    isSwitch: true,//清空购物车
    token: token
  }
  app.showLoading()
  request.apiPost('index/showIndex', param).then(res => {
    wx.setTabBarBadge({
      index: 2,
      text: '0',
    })
    wx.setStorageSync('cartNum', 0)
    var juan = get('juan');
    if (juan != null && juan != undefined) {
      that.setData({
        dataList: res,
        popupWindow: false,
        start: res.company.name,
      })
    } else {
      wx.setStorageSync('companyId', res.company.id)
      that.setData({
        dataList: res,
        start: res.company.name,
        popupWindow: JSON.parse(res.popupWindow),
        popupWindowImg: res.popupWindowImg,
        popupWindow1: JSON.parse(res.popupWindow),
      })
    }
  })
}

function put(key, val, time) {
  wx.setStorageSync(key, val)
  var seconds = parseInt(time);
  if (seconds > 0) {
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000 + seconds;
    wx.setStorageSync(key + 'dtime', timestamp + "")
  } else {
    wx.removeStorageSync(key + 'dtime')
  }
}

function get(key, def) {
  var deadtime = parseInt(wx.getStorageSync(key + 'dtime'))
  if (deadtime) {
    if (parseInt(deadtime) < Date.parse(new Date()) / 1000) {
      if (def) {
        return def;
      } else {
        return;
      }
    }
  }
  var res = wx.getStorageSync(key);
  if (res) {
    return res;
  } else {
    return def;
  }
}