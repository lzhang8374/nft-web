/**************************************
 *@method formatTime(时间格式化)
 *@param：    value
 *@param：    value指的是需要格式化的中国标准时间；
 *@description ：
 * 格式化之后的格式为:yy-mm-dd hh:mm:ss;
 *@author :sunpengwei
 ******************************************************/
function formatTime(value) {
	// console.log(row.genTime);
	var time = new Date(value);
	var y = time.getFullYear(); //年
	var m = time.getMonth() + 1; //月
	var d = time.getDate(); //日
	var h = time.getHours(); //时
	var mm = time.getMinutes(); //分
	var s = time.getSeconds(); //秒
	h = h < 10 ? '0' + h : h;
	m = m < 10 ? '0' + m : m;
	d = d < 10 ? '0' + d : d;
	mm = mm < 10 ? '0' + mm : mm;
	s = s < 10 ? '0' + s : s;
	return (y + '-' + m + '-' + d + ' ' + h + ':' + mm + ':' + s);
}

function formatTimeDate(value) {

	if (typeof(value) == 'string' && value.indexOf(' ') != -1) {
		return value.split(' ')[0];
	}

	// console.log(row.genTime);
	var time = new Date(value);
	var y = time.getFullYear(); //年
	var m = time.getMonth() + 1; //月
	var d = time.getDate(); //日
	var h = time.getHours(); //时
	var mm = time.getMinutes(); //分
	var s = time.getSeconds(); //秒
	h = h < 10 ? '0' + h : h;
	m = m < 10 ? '0' + m : m;
	d = d < 10 ? '0' + d : d;
	mm = mm < 10 ? '0' + mm : mm;
	s = s < 10 ? '0' + s : s;
	return (y + '-' + m + '-' + d);
}
function formatTimeDatePoint(value) {

	if (typeof(value) == 'string' && value.indexOf(' ') != -1) {
		return value.split(' ')[0];
	}

	// console.log(row.genTime);
	var time = new Date(value);
	var y = time.getFullYear(); //年
	var m = time.getMonth() + 1; //月
	var d = time.getDate(); //日
	var h = time.getHours(); //时
	var mm = time.getMinutes(); //分
	var s = time.getSeconds(); //秒
	h = h < 10 ? '0' + h : h;
	m = m < 10 ? '0' + m : m;
	d = d < 10 ? '0' + d : d;
	mm = mm < 10 ? '0' + mm : mm;
	s = s < 10 ? '0' + s : s;
	return (y + '.' + m + '.' + d);
}

function formatTimeSeconds(value) {
	// console.log(row.genTime);
	var time = new Date(value);
	var y = time.getFullYear(); //年
	var m = time.getMonth() + 1; //月
	var d = time.getDate(); //日
	var h = time.getHours(); //时
	var mm = time.getMinutes(); //分
	var s = time.getSeconds(); //秒
	h = h < 10 ? '0' + h : h;
	m = m < 10 ? '0' + m : m;
	d = d < 10 ? '0' + d : d;
	mm = mm < 10 ? '0' + mm : mm;
	s = s < 10 ? '0' + s : s;
	return (y + '-' + m + '-' + d + ' ' + h + ':' + mm);
}

function formatDate(value) {
	// console.log(row.genTime);
	var time = new Date(value);
	var y = time.getFullYear(); //年
	var m = time.getMonth() + 1; //月
	var d = time.getDate(); //日
	var h = time.getHours(); //时
	var mm = time.getMinutes(); //分
	var s = time.getSeconds(); //秒
	h = h < 10 ? '0' + h : h;
	m = m < 10 ? '0' + m : m;
	d = d < 10 ? '0' + d : d;
	return (y + '-' + m + '-' + d);
}

function formatDate1(value) {
	// console.log(row.genTime);
	var time = value!=null ? new Date(value) : new Date();
	var y = time.getFullYear(); //年
	var m = time.getMonth() + 1; //月
	var d = time.getDate(); //日
	m = m < 10 ? '0' + m : m;
	d = d < 10 ? '0' + d : d;
	return (y + '/' + m + '/' + d);
}

/**
 *倒计时
 */
function time_down(id, endDateStr, callback, timeOut1) {
	//结束时间
	var endDate = new Date(endDateStr);
	//当前时间
	var nowDate = new Date();
	//相差的总秒数
	var totalSeconds = parseInt((endDate - nowDate) / 1000);
	//天数
	// var days = Math.floor(totalSeconds / (60 * 60 * 24));
	//取模（余数）
	var modulo = totalSeconds % (60 * 60 * 24);
	//小时数
	// var hours = Math.floor(modulo / (60 * 60));
	modulo = modulo % (60 * 60);
	//分钟
	var minutes = Math.floor(modulo / 60);
	//秒
	var seconds = modulo % 60;
	//输出到页面
	// document.getElementById(id).innerHTML = "还剩:" + days + "天" + hours + "小时" + minutes + "分钟" + seconds + "秒";
	document.getElementById(id).innerHTML = '剩余:' + minutes + '分钟' + seconds + '秒';
	// this.timeDownData = minutes + "分钟" + seconds + "秒";
	//延迟一秒执行自己
	if (minutes < 1 && seconds < 1) {
		clearInterval(timeOut1);
		callback(true);
	} else {
		var timeOut = null;
		timeOut = setTimeout(function() {
			time_down(id, endDateStr, callback, timeOut);
		}, 1000);
	}

}

const permission = {
	formatTime: formatTime,
	formatTimeDate: formatTimeDate,
	formatTimeSeconds: formatTimeSeconds,
	formatDate: formatDate,
	formatDate1: formatDate1,
	time_down: time_down,
	formatTimeDatePoint: formatTimeDatePoint,
}
// module.exports = permission;
export default permission;
