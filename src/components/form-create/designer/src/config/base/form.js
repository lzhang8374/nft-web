export default function form(yourTables,type) {
  let dataSource = {
      type: 'select',
      field: 'formInDatabase',
      value: '',
      emit:['change'],
      title: '关联数据表',
      options: [...yourTables],
      props: {
        disabled: type=='add'?false:true
      }
  };

  let labelPosition =  {
      type: 'radio',
      field: 'labelPosition',
      value: 'left',
      title: '标签位置',
      options: [
          {value: 'right', label: 'right'},
          {value: 'left', label: 'left'},
          {value: 'top', label: 'top'},
      ]
  };

  let labelSize = {
      type: 'radio',
      field: 'size',
      value: 'mini',
      title: '标签大小',
      options: [
          {value: 'medium', label: 'medium'},
          {value: 'small', label: 'small'},
          {value: 'mini', label: 'mini'},
      ]
  };

  let labelWidth = {
      type: 'input',
      field: 'labelWidth',
      value: '125px',
      title: '标签宽度',
  };

  let hideRequiredAsterisk = {
      type: 'switch',
      field: 'hideRequiredAsterisk',
      value: false,
      title: '隐藏必填字段的标签旁边的红色星号',
  };

  let showValidateMessage = {
      type: 'switch',
      field: 'showMessage',
      value: true,
      title: '显示校验错误信息',
  };

  let inlineMessage = {
      type: 'switch',
      field: 'inlineMessage',
      value: false,
      title: '以行内形式展示校验信息',
  };
  // let change = dataSource.on.change.bind(that)
  // dataSource.on.change = change
  // if(type == 'add'){
  //   dataSource.props.disabled = false
  // }else if(type == 'edit'){
  //   dataSource.props.disabled = true
  // }
  // if(yourTables!=undefined&&yourTables!=null&&yourTables.length!=0){
  //   dataSource.options = yourTables
  // }
    return []
    .concat(dataSource).concat(labelPosition).concat(labelSize)
    .concat(labelWidth).concat(hideRequiredAsterisk).concat(showValidateMessage)
    .concat(inlineMessage);
}
