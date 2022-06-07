// let fieldName = {
//     type: 'input',
//     field: 'title',
//     value: '',
//     title: '字段名称',
// };

// let tipInfo = {
//     type: 'input',
//     field: 'info',
//     value: '',
//     title: '提示信息',
// };

// let control = {
//     type: 'Struct',
//     field: '_control',
//     value: [],
//     title: '联动数据',
//     props: {
//         defaultValue: [],
//         validate(val) {
//             if (!Array.isArray(val)) return false;
//             if (!val.length) return true;
//             return !val.some(({rule}) => {
//                 return !Array.isArray(rule);
//             });
//         }
//     }
// };

// let other = {
//     type: 'col',
//     props: {
//         span: 24
//     },
//     children: [
//         {
//             type: 'el-button',
//             props: {
//                 type: 'primary',
//                 size: 'mini',
//                 icon: 'el-icon-delete',
//             },
//             inject: true,
//             on: {
//                 click({$f}) {
//                     const rule = $f.activeRule;
//                     if (rule) {
//                         rule.__fc__.updateKey();
//                         rule.value = undefined;
//                         rule.__fc__.$api.sync(rule);
//                     }
//                 },
//             },
//             native: true,
//             children: ['清空值']
//         }, {
//             type: 'el-button',
//             props: {
//                 type: 'success',
//                 size: 'mini',
//                 icon: 'el-icon-refresh',
//             },
//             inject: true,
//             on: {
//                 click({$f}) {
//                     const rule = $f.activeRule;
//                     if (rule) {
//                         rule.__fc__.updateKey(true);
//                         rule.__fc__.$api.sync(rule);
//                     }
//                 },
//             },
//             native: true,
//             children: ['刷新']
//         },
//     ]
// };

// let config = []
//     .concat(field).concat(fieldName).concat(tipInfo)
//     .concat(control).concat(other);

// export default function field() {
//     return []
//     .concat(field).concat(fieldName).concat(tipInfo)
//     .concat(control).concat(other);
// }

export default function field(yourFields) {
  let fields = {
      type: 'select',
      field: 'field',
      value: '',
      title: '字段 ID',
      props: {
        filterable:true,
        allowCreate:true
      },
      options: [],
  };
  if(yourFields!=undefined&&yourFields!=null){
    fields.options = yourFields
  }
    return [
        {
            ...fields
        }, {
            type: 'input',
            field: 'title',
            value: '',
            title: '字段名称',
        }, {
            type: 'input',
            field: 'info',
            value: '',
            title: '提示信息',
        }, {
            type: 'Struct',
            field: '_control',
            value: [],
            title: '联动数据',
            props: {
                defaultValue: [],
                validate(val) {
                    if (!Array.isArray(val)) return false;
                    if (!val.length) return true;
                    return !val.some(({rule}) => {
                        return !Array.isArray(rule);
                    });
                }
            }
        }, {
            type: 'col',
            props: {
                span: 24
            },
            children: [
                {
                    type: 'el-button',
                    props: {
                        type: 'primary',
                        size: 'mini',
                        icon: 'el-icon-delete',
                    },
                    inject: true,
                    on: {
                        click({$f}) {
                            const rule = $f.activeRule;
                            if (rule) {
                                rule.__fc__.updateKey();
                                rule.value = undefined;
                                rule.__fc__.$api.sync(rule);
                            }
                        },
                    },
                    native: true,
                    children: ['清空值']
                }, {
                    type: 'el-button',
                    props: {
                        type: 'success',
                        size: 'mini',
                        icon: 'el-icon-refresh',
                    },
                    inject: true,
                    on: {
                        click({$f}) {
                            const rule = $f.activeRule;
                            if (rule) {
                                rule.__fc__.updateKey(true);
                                rule.__fc__.$api.sync(rule);
                            }
                        },
                    },
                    native: true,
                    children: ['刷新']
                },
            ]
        }
    ];
}
