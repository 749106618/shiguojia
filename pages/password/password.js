// pages/password/password.js
var Mcaptcha = require('../../utils/code.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  onReady: function () {
    var that = this;
    var num = that.getRanNum();
    // console.log(num)
    this.setData({
      num: num
    })
    new Mcaptcha({
      el: 'canvas',
      width: 90,//对图形的宽高进行控制
      height: 41,
      code: num
    });
  },
  getRanNum: function () {
    var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    var pwd = '';
    for (var i = 0; i < 4; i++) {
      if (Math.random() < 48) {
        pwd += chars.charAt(Math.random() * 48 - 1);
      }
    }
    return pwd;
  },
})
