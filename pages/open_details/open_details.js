// pages/open_details/open_details.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    onOff:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    dataList(that);
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

  }
})

function dataList (that) {
  wx.request({
    url: app.basicurl +'/shop/showVipGoods',
    success:function(res){
      console.log(res);
      that.setData({
        onOff:true,
        dataList: res.data
      })
    }
  })
}