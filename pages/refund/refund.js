// pages/refund/refund.js
var app = getApp();
var { request } = require('../..//utils/api1.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    check:1,
    imgList: [],
    imgSrc: "../image/refund.png",
    imgSrcList: [],
    imgHeader: app.imgHeader,
    check: 1,//1理赔坏果 2其他售后类型
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var dataList = wx.getStorageSync('refunList')
    that.setData({
      options:options,
      dataList: dataList
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
      path: 'pages/index_3/index_3?companyId=' + wx.getStorageSync('companyId')
    }
  },
  changeType:function(e){
    var type = parseInt(e.currentTarget.dataset.check);
    this.setData({ check: type})
  },
  //获取焦点
  hd: function (e) {
    this.setData({
      ac: e.currentTarget.dataset.ac
    })
  },
  // 输入框
  yy:function(e){
    this.setData({
      yy: e.detail.value
    })
  },
  zz:function(e){
    this.setData({
      zz: e.detail.value
    })
  },
  //选择图片
  chooseImage: function () {
    var that = this;
    var commentImg = that.data.imgSrcList;
    var count = 1;
    var app = getApp();
    wx.chooseImage({
      count: count - commentImg.length,
      success: function (res) {
        //缓存下 
        wx.showToast({
          title: '正在上传...',
          icon: 'loading',
          mask: true,
          duration: 2000,
          success: function (ress) {
            //       console.log('成功加载动画');
          }
        })
        for (var i = 0; i < res.tempFilePaths.length; i++) {
          commentImg.push(res.tempFilePaths[i])
        }
        var list = []
        for (var i = 0; i < that.data.imgSrcList.length; i++) {
          //获取图片地址 
          wx.uploadFile({
            url: 'http://www.wjfresh.com/file/uploadfile',
            filePath: that.data.imgSrcList[i],
            name: 'file',
            formData: {
              'user': 'test'
            },
            success: function (res) {
              var sss = JSON.parse(res.data)
              var imgSrc = sss.filePath;
              //输出图片地址 
              // "commentImg": that.data.imgList,
              console.log(imgSrc)
              list.push(imgSrc)
              that.setData({
                list: list
              })
            }
          })
        }
        that.setData({
          imgList: commentImg
        })
      },
    })
  },
  //删除图片
  removeImg: function (e) {
    var index = e.currentTarget.dataset.index;
    var imgList = this.data.imgList;
    imgList.splice(index, 1);
    this.setData({
      imgList: imgList
    })
  },
  refund:function(e){
    var td = this.data;
    var img;
    if (td.list==undefined){
      img=''
    }else{
      img = td.list[0]
    }
    var that = this;
    var refundinfo = {
      'refundPostid': '',
      'refundType': td.check,
      'refundRemark': td.yy,
      'refundReason':4,
      'number': '',
      'img': img,
      'tel': td.dataList[0].phone,
      'orderId': td.options.orderId,
    }
    if (refundinfo.refundType==1){
      if (refundinfo.refundRemark == '' || refundinfo.refundRemark == undefined){
        wx.showToast({
          title: '请填写问题描述',
          icon:'none'
        })
      }else{
        comitajax(refundinfo,that)
      }
    }else{
      comitajax(refundinfo, that)
    }
  }
})

//提交
function comitajax(refundinfo, that) {
  var app = getApp()
  var param = JSON.stringify(refundinfo)
  app.showLoading()
  request.apiPost4('/order/refund',param).then(res=>{
    if (res.type == "success") {
      wx.navigateTo({
        url: '../order_list/order_list?type=confir&index=4',
      })
    } else if (data.type == "error") {
      wx.showToast({
        title: res.msg,
        icon: 'none'
      })
    }
  })
}