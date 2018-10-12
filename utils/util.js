const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const randomNum = n => {
  var rnd = "";
  for (var i = 0; i < n; i++)
    rnd += Math.floor(Math.random() * 10);
  return rnd;
}

const parseUrl = url => {
  var result = {};
  var query = url.split("?")[1];
  var queryArr = query.split("&");
  queryArr.forEach(function (item) {
    var _arr = item.split("=")
    var key = _arr[0];
    var value = _arr[1];
    result[key] = value;
  });
  return result;
}

module.exports = {
  formatTime: formatTime,
  randomNum: randomNum,
  parseUrl: parseUrl,
  randomArea: function randomNum(minNum, maxNum) {
    switch (arguments.length) {
      case 1:
        return parseInt(Math.random() * minNum + 1, 10);
        break;
      case 2:
        return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
        break;
      default:
        return 0;
        break;
    }
  } 
}
