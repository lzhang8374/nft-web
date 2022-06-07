import Cookies from 'js-cookie';

export default {
  modify:modify
}

/**
 * @description 生成规则特殊配置
 * @param {Object} ruleString 生成规则
 */
function modify(ruleString){
  let rule = JSON.parse(ruleString)
  rule.forEach(item=>{
    if(item.effect&&item.effect.fetch&&item.effect.fetch.headers){
      item.effect.fetch.headers.token = Cookies.get('token') || ''
      item.effect.fetch.parse = function get(res){
        if(!res||!res.data||res.data==null){
          return [];
        }

        let options=[];
        res.data.forEach(item=>{
          let option={
            label:item.label,
            value:item.vaule,
          };
          options.push(option);
        });
        return options;
      }
    }
  })
  return rule
}
