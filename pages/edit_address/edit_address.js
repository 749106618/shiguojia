// pages/edit_address/edit_address.js
var address = require('../js/city.js');
let { request } = require('../../utils/api1.js')
let amapFile = require('../../utils/amap-wx.js')
let config = require('../../utils/config.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    animationAddressMenu: {},
    addressMenuIsShow: false,
    value: [0, 0, 0],
    provinces: [],
    citys: [],
    areas: [],
    province: '',//省
    city: '',//市
    area: '',//县           这一行上面全是省市区三级联动
    phone: '',//手机号
    consignee: '',//收货人姓名
    address: '',//详细地址
    options: {},
    footerTxt:'确认添加',
    isDefualtAdd: 0,//是否默认地址
    tips: {},//高德地图api
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // 初始化动画变量
    var animation = wx.createAnimation({
      duration: 500,
      transformOrigin: "50% 50%",
      timingFunction: 'ease',
    })
    this.animation = animation;
    // 默认联动显示浙江省
    var id = address.provinces[0].id
    this.setData({
      provinces: address.provinces,
      citys: address.citys[id],
      areas: address.areas[address.citys[id][0].id],
    })
    // 巨坑 10表示选中浙江省
    this.setData({
      value: [0, 0, 0],
      options: options
    })
    if (that.data.options.id != null) {
      editList(that)
    }
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
  // 点击所在地区弹出选择框
  selectDistrict: function (e) {
    var that = this
    if (that.data.addressMenuIsShow) {
      return
    }
    that.startAddressAnimation(true)
  },

  // 执行动画
  startAddressAnimation: function (isShow) {
    var that = this
    if (isShow) {
      that.animation.translateY(0 + 'vh').step()
    } else {
      that.animation.translateY(40 + 'vh').step()
    }
    that.setData({
      animationAddressMenu: that.animation.export(),
      addressMenuIsShow: isShow,
    })
  },

  // 点击地区选择取消按钮
  cityCancel: function (e) {
    this.startAddressAnimation(false)
  },

  // 点击地区选择确定按钮
  citySure: function (e) {
    var that = this
    var city = that.data.city
    var value = that.data.value
    that.startAddressAnimation(false)
    // 将选择的城市信息显示到输入框
    var areaInfo = that.data.provinces[value[0]].name + ',' + that.data.citys[value[1]].name + ',' + that.data.areas[value[2]].name
    var province = that.data.provinces[value[0]].name;
    var city = that.data.citys[value[1]].name;
    var area = that.data.areas[value[2]].name;
    that.setData({
      areaInfo: areaInfo,
      province: province,
      city: city,
      area: area
    })
  },
  //默认地址点击
  check: function () {
    var isDefualtAdd = this.data.isDefualtAdd;
    if (isDefualtAdd == 0) {
      isDefualtAdd = 1
    } else {
      isDefualtAdd = 0
    }
    this.setData({
      isDefualtAdd: isDefualtAdd
    })
  },
  // 处理省市县联动逻辑
  cityChange: function (e) {
    var value = e.detail.value
    var provinces = this.data.provinces
    var citys = this.data.citys
    var areas = this.data.areas
    var provinceNum = value[0]
    var cityNum = value[1]
    var countyNum = value[2]
    if (this.data.value[0] != provinceNum) {
      var id = provinces[provinceNum].id
      this.setData({
        value: [provinceNum, 0, 0],
        citys: address.citys[id],
        areas: address.areas[address.citys[id][0].id],
      })
    } else if (this.data.value[1] != cityNum) {
      var id = citys[cityNum].id
      this.setData({
        value: [provinceNum, cityNum, 0],
        areas: address.areas[citys[cityNum].id],
      })
    } else {
      this.setData({
        value: [provinceNum, cityNum, countyNum]
      })
    }
  },
  //获取焦点
  hd:function(e){
    this.setData({
      ac: e.currentTarget.dataset.ac
    })
  },
  //输入框输入
  onChange(e) {
    // event.detail 为当前输入的值
    console.log(e);
    let temp = {}
    console.log(e.detail);
    temp[e.currentTarget.dataset.type] = e.detail.value
    this.setData(temp)
  },
  //腾讯地图API数据回填方法
  // backfill: function (e) {
  //   var id = e.currentTarget.id;
  //   for (var i = 0; i < this.data.suggestion.length;i++){
  //     if(i == id){
  //       this.setData({
  //         address: this.data.suggestion[i].title,
  //         isShow:false
  //       });
  //     }  
  //   }
  // },
  bindSearch: function(e){
    var keywords = e.target.dataset.keywords;
    this.setData({
      address:keywords,
      isShow:false
    })
  },
  //触发关键词输入提示事件
  bindInput: function(e) {
    // let temp = {}
    // console.log(e.detail);
    // temp[e.currentTarget.dataset.type] = e.detail.value
    // this.setData(temp)
    var that = this;
    that.setData({
      address:e.detail.value,
    })
    var keywords = e.detail.value; 
    var key = config.Config.key;
    var myAmapFun = new amapFile.AMapWX({key: 'f58a1a3f72aa6d781e57bb869e00cf1d'});
    myAmapFun.getInputtips({
      keywords: keywords,
      location: '',
      success: function(data){
        if(data && data.tips){
          that.setData({
            tips: data.tips,
            isShow:true
          });
        }
      }
    })
  },
  
  addres: function () {
    //北京市/北京市市辖区/西城区
    var that = this;
    var app = getApp();
    var receiver = {};
    var id = that.data.options.id;
    receiver.phone = that.data.phone;
    receiver.consignee = that.data.consignee;
    receiver.address = that.data.address;
    receiver.area = that.data.areaInfo
    receiver.isDefault = that.data.isDefualtAdd == 0 ? false : true;
    if (receiver.phone == '' || receiver.consignee == '' || receiver.area == undefined || receiver.address == '') {
      wx.showToast({
        title: '请继续完善信息',
        icon: 'none'
      })
    } else {
      var xrtext = /^0?(13|14|15|16|18|17|19)[0-9]{9}$/;
      if (xrtext.test(receiver.phone)) {
        if (id == null || id == '' || id == undefined) {
          saveaddress(that, app, receiver);
        }
        else {
          receiver.id = id;
          updateaddress(that, app, receiver)
        }
      } else {
        wx.showToast({
          title: '手机号码格式错误',
          icon: 'none'
        })
      }
    };
  }
})

//添加地址
function saveaddress(that, app, receiver) {
  var param = JSON.stringify(receiver)
  app.showLoading()
  request.apiPost1('receiver/save',param).then(res=>{
    var data = that.data;
    if (data.options.orderId != null && data.options.orderId != "" & data.options.orderId != undefined && data.options.flag != null && data.options.flag != "" & data.options.flag != undefined) {
      wx.navigateBack({
        delta: 1
      })
    } else {
      wx.navigateBack({
        delta: 1
      })
    }
  })
}
//修改地址
function updateaddress(that, app, receiver) {
  var param = JSON.stringify(receiver)
  app.showLoading()
  request.apiPost1('receiver/update',param).then(res=>{
    var data = that.data;
    if (data.options.orderId != null && data.options.orderId != "" & data.options.orderId != undefined && data.options.flag != null && data.options.flag != "" & data.options.flag != undefined) {
      wx.navigateBack({
        delta: 1
      })
    } else {
      wx.navigateBack({
        delta: 1
      })
    }
  })
}

//加载
function editList(that) {
  wx.setNavigationBarTitle({
    title: '修改地址'
  })
  var param = { id: that.options.id}
  app.showLoading()
  request.apiGet('receiver/get',param).then(res=>{
    var data = res.data;
    if (data.code == "100") {
      app.tokenInvalid()
      that.onLoad()
    }
    var isDefualtAdd;
    if (data.receiver.isDefault) {
      isDefualtAdd = 1
    } else {
      isDefualtAdd = 0
    }
    that.setData({
      phone: data.receiver.phone,
      consignee: data.receiver.consignee,
      address: data.receiver.address,
      areaInfo: data.receiver.area,
      footerTxt: '确认修改',
      isDefualtAdd: isDefualtAdd
    })
  })
}