//index.js
//获取应用实例
const app = getApp();

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

    lastX: 0,
    lastY: 0,
    text: "没有滑动",
    gesture: 0,
    delay: 20,
    next: 0,

    has_result: true,
    error_msg: '等待输入',
    ph: '0313',
    cc: '',
    side: 0
  },
  
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    console.log(app.globalData.userInfo)

    if (app.globalData.userInfo) (
      this.setData({
        hasUserInfo: true,
        userInfo: e.detail.userInfo,
      })
    )
  },

  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

    var d = new Date();
    var days = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];

    var m = d.getMonth() + 1;
    if (m < 10) {
      m = '0' + m;
    }

    var t = d.getDate()
    if (t < 10) {
      t = '0' + t;
    }
    this.setData({
      month: m,
      date: t,
      weekday: days[d.getDay()]
    })
  },

  bindInput: function (e) {
    var dic = new Array(0, 7, 14, 21, 28, 35, 42, 49, 56, 63, 70,
      77, 84, 91, 98, 105, 112, 119, 126, 133, 140, 147,
      153, 160, 167, 174, 181, 188, 195, 202, 209,
      215, 222, 229, 236, 242, 249, 256, 263, 270, 277, 284, 291)

    var d = new Date();
    var nm = d.getMonth() + 1;
    var nd = d.getDate()

    var x = e.detail.value;
    var err = '';

    if (x.length == 4) {
      var xm = parseInt(x.slice(0, 2));
      var xd = parseInt(x.slice(2, 4));
      console.log(1 <= xm <= 12)
      if (xm <= 12 && xd <= 31 && xm * xd) {
        if (nm < xm || (nm == xm && nd < xd)) {
          nm += 12;
        }
        var days = (nm - xm) * 30 + (nd - xd);
        if (days > 297) {
          err = '数据溢出';
        } else {
          var i;
          for (i = 0; i < dic.length; i++) {
            if (days < dic[i]) {
              var week = i - 1;
              var day = days - dic[i - 1];
              break;
            }
          }
        }
      } else {
        err = '日期错误';
      }

      this.setData({
        has_result: x ? true : false,
        error_msg: err,
        result_week: week ? week : 0,
        result_day: day ? day : 0,
        cc: '',
        ph: x
      })

      if (this.data.side != 1) {
        wx.hideKeyboard();
      }
    }
  },

  formSubmit: function (e) {
    var dic = new Array(0, 7, 14, 21, 28, 35, 42, 49, 56, 63, 70,
                        77, 84, 91, 98, 105, 112, 119, 126, 133, 140, 147,
                        153, 160, 167, 174, 181, 188, 195, 202, 209,
                        215, 222, 229, 236, 242, 249, 256, 263, 270,
                        277, 284, 291)

    var d = new Date();
    var nm = d.getMonth() + 1;
    var nd = d.getDate()

    var x = e.detail.value['x'];
    var err = '';
    if (x) {
      this.setData({
        ph: x
      })
    }
    if (x.length == 4) {
      var xm = parseInt(x.slice(0, 2));
      var xd = parseInt(x.slice(2, 4));
      if (xm <= 12 && xd <= 31 && xm * xd) {
        if (nm < xm || (nm == xm && nd < xd)) {
          nm += 12;
        }
        var days = (nm - xm) * 30 + (nd - xd);
        if (days > 297) {
          err = '数据溢出';
        } else {
          var i;
          for (i = 0; i < dic.length; i++) {
            if (days < dic[i]) {
              var week = i - 1;
              var day = days - dic[i-1];
              break;
            }
          }
        }
      } else {
        err = '日期错误';
      }
    } else {
      err = '格式错误';
    }

    this.setData({
      has_result: x? true : false,
      error_msg: err,
      result_week: week? week : 0,
      result_day: day? day : 0,
      cc: ''
    })
  },

  handletouchmove: function (event) {
    console.log(event)

    if (!this.data.hasUserInfo) {
      return;
    }

    var now = new Date();
    if (now.getTime() < this.data.next) {
      return;
    }

    if (this.data.gesture != 0) {
      return;
    }

    let currentX = event.touches[0].pageX
    let currentY = event.touches[0].pageY
    let tx = currentX - this.data.lastX
    let ty = currentY - this.data.lastY

    //左右方向滑动
    if (Math.abs(tx) > Math.abs(ty)) {
      if (tx < -15) {
        console.log("向左滑动");
        //this.setData({
        //  side: 2
        //})
      }
      else if (tx > 15) {
        console.log("向右滑动");
        //this.setData({
        //  side: 1
        //})
      }
    }

    //上下方向滑动
    else {
      var now = new Date();
      if (ty < -15) {
        console.log("向上滑动");
        if (this.data.side != 0) {
          this.setData({
            side: 1,
            next: now.getTime() + 1200
          })
        }
        this.data.delay = 11;
      }
      else if (ty > 15) {
        console.log("向下滑动");
        if (true) {
          this.setData({
            side: 2,
            next: now.getTime() + 1200
          })
        }
      }
    }

    //将当前坐标进行保存以进行下一次计算
    this.data.lastX = currentX;
    this.data.lastY = currentY;
  },

  handletouchtart: function (event) {
    console.log(event);
    if (this.data.delay == 20) {
      this.data.lastX = event.touches[0].pageX;
      this.data.lastY = event.touches[0].pageY;
    } else if (this.data.delay > 10) {
      this.data.delay = 0;
      this.data.lastX = event.touches[0].pageX;
      this.data.lastY = event.touches[0].pageY;
    } else {
      this.data.delay++;
    }
  },

  handletouchend: function (event) {
    this.data.gesture = 0;
    console.log(event);
    console.log("没有滑动");
    this.data.delay = 11;
  },
})
