const d = new Date();

let m = d.getMonth() + 1;
if (m < 10) {
  m = '0' + m;
}

let t = d.getDate();
if (t < 10) {
  t = '0' + t;
}

today.value = '' + m + t;
/* date.placeholder = m + t; */

date.oninput = function () {
  if (this.value.length >= 4) {
    this.value = this.value.slice(0, 4);
    if (parseInt(date.value) > 1231)
      this.value = '1231';
    cal(this, result)
  }
}

date.onblur = function () {
  if (this.value.length > 0) {
    while (this.value.length < 4)
      this.value = '0' + this.value;
    if (parseInt(date.value.slice(0, 2)) < 1)
      this.value = m + this.value.slice(2, 4);
    if (parseInt(date.value.slice(2, 4)) > 31)
      this.value = this.value.slice(0, 2) + t;
    cal(this, result)
  }
}

date.onfocus = function () {
  this.value = '';
}


today.onblur = function () {
  while (this.value.length < 4)
    this.value = '0' + this.value;
}

function cal(e, t) {
  const dic = [0, 7, 14, 21, 28, 35, 42, 49, 56, 63, 70,
    77, 84, 91, 98, 105, 112, 119, 126, 133, 140, 147,
    153, 160, 167, 174, 181, 188, 195, 202, 209,
    215, 222, 229, 236, 242, 249, 256, 263, 270, 277, 284, 291];

  var d = new Date();
  var nm = d.getMonth() + 1;
  var nd = d.getDate()

  var x = e.value;
  var err = '';


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

  if (err) {
    t.value = err;
  } else {
    t.value = week + 'w ' + day + 'd';
  }

  e.placeholder = e.value;
  e.value = '';
}