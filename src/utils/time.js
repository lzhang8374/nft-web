export function  getDate(val, format) {
    var userAgent = window.navigator.userAgent;//ERROR
    var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1;
    var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器  
    var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
    if (!val) {
      return '';
    }
    if(isIE || isEdge || isIE11){
      val = val.replace(/-/g,"/");
    }
    // 如果时间戳后不是毫秒值就加000,变成毫秒值
    // if (val && val.length == 10) { val = parseInt(val+'000'); }
    if (val && val.length != 13) {
        if (val && val.length == 10) {
            val = parseInt(val+'000');
        };
        for (var i = 0; i < 13; i++) {
            if (val.length === i) {
                val = parseInt(val*(10^(13-i)));
            }
        }
    }
    var date = new Date(val);
    var o = {
        'M+' : date.getMonth()+1,                 //月份
        'd+' : date.getDate(),                    //日
        'h+' : date.getHours(),                   //小时
        'm+' : date.getMinutes(),                 //分
        's+' : date.getSeconds(),                 //秒
        'q+' : Math.floor((date.getMonth()+3)/3), //季度
        'S'  : date.getMilliseconds()             //毫秒
    };
    console.log(JSON.stringify(o))
    if(/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (date.getFullYear()+'').substr(4 - RegExp.$1.length));
    }
    for(var k in o) {
        if(new RegExp('('+ k +')').test(format)) {
            format = format.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (('00'+ o[k]).substr((''+ o[k]).length)));
        }
    }
    return format;
}
