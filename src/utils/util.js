/**
 * @param {String} str
 * @description 判断一个字符串是否是json格式
 */
export const isJSON = function isJSON(str) {
    if (typeof str == 'string') {
        try {
            JSON.parse(str);
            return true;
        } catch(e) {
            // console.log(e);
            return false;
        }
    }
    console.log('It is not a string!')
}

/**
 * @param {String} str
 * @description HTML转义
 */
export const htmlTransfer = function escape2Html(str) {
 var arrEntities={'lt':'<','gt':'>','nbsp':' ','amp':'&','quot':'"'};
 return str.replace(/&(lt|gt|nbsp|amp|quot);/ig,function(all,t){return arrEntities[t];});
}
