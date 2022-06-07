<template>
  <div class="factoryUnitManage-container">
    <div class="factoryUnitManage-box">
      <div class="factoryUnitManage-search-button">
        <el-button icon="el-icon-plus" type="primary" round @click="openDialog('add')">新增</el-button>
        <!-- <el-button icon="el-icon-plus" type="primary" round @click="openDialog('import')">导入</el-button> -->
      </div>
      <div class="factoryUnitManage-box2">
        <div style="width: 30%;height: 100%;padding: 5px">
          <div style="padding: 5px;box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)">
            <el-input placeholder="输入关键字进行过滤" v-model="filterText">
            </el-input>

            <el-tree class="filter-tree" :data="treeDate" :props="defaultProps" accordion
              :filter-node-method="filterNode" ref="tree" @node-click="handleNodeClick">
              <span  class="custom-tree-node" slot-scope="{ node, data }">
                      <span>{{ node.label }}</span>
                      <span style="padding-left: 5px;" v-if="node.data.unitType!=null">
                        <el-button
                          type="text"
                          size="mini"
                          icon="el-icon-edit"
                          @click="() => openDialog('edit',data)">
                        </el-button>
                        <el-button
                          type="text"
                          size="mini"
                          icon="el-icon-remove-outline"
                          @click="() => deletePU(node, data)">
                        </el-button>
                        <el-button
                          type="text"
                          size="mini"
                          icon="el-icon-circle-plus-outline"
                          @click="() => openDialog('add',data)">
                        </el-button>
                      </span>
                    </span>
            </el-tree>
          </div>
        </div>
        <div style="width: 70%;padding: 5px;height: 100%;">
          <el-tabs type="card" style="box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)">
            <el-tab-pane label="图形展示">
              <factoryTopolog :topologInfo="topologInfo"></factoryTopolog>
            </el-tab-pane>
            <el-tab-pane label="表格展示">
              <factoryTable ref="factoryTable" @getData='getData()'></factoryTable>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
    <el-dialog
		id="factoryDialog"
		width="500px"
		:title="dialogTitle"
		:visible="dialogVisible"
		@close="closeDialog">
			<productUnitAdd v-if="dialogTitle == '新增' && dialogVisible" @closeDialog="closeDialog()" :dataForm="addOrUpdateForm" @getTableList='getTableList()'></productUnitAdd>
      <productUnitEdit v-else-if="dialogTitle == '编辑' && dialogVisible" @closeDialog="closeDialog()" :dataForm="addOrUpdateForm"></productUnitEdit>
		</el-dialog>
  </div>
</template>

<script>
  import mixinViewModule from '@/mixins/view-module';
  import vPagination from '@/components/page/Pagination.vue';
  // //新增/修改/查看子组件
  import productUnitAdd from './components/productUnitAdd.vue';
  import factoryTopolog from './components/factoryTopolog.vue';
  import factoryTable from './components/factoryTable.vue';
  import productUnitEdit from'./components/productUnitEdit.vue';
  let id = 1000;
  export default {
    components: {
      vPagination,
      factoryTopolog,
      productUnitAdd,
      factoryTable,
      productUnitEdit
    },
    data() {
      return {
        //查询条件Form
        dataForm: {
          id: '',
          name: '',
          creator: '',
          createTime: '',
          updater: '',
          updateTime: '',
          code: '',
          isDeleted: '',
          unitType: '',
          parentUnitId: '',
          contractName: '',
          contractTelphone: '',
          address: '',
          longitude: '',
          latitude: '',
        },
        //新增/修改Form
        addOrUpdateForm: {
          id: '',
          name: '',
          creator: '',
          createTime: '',
          updater: '',
          updateTime: '',
          code: '',
          isDeleted: '',
          unitType: '',
          parentUnitId: '',
          contractName: '',
          contractTelphone: '',
          address: '',
          longitude: '',
          latitude: '',
        },

        dialogVisible: false,
        dialogTitle: '',
        treeDate: [],
        filterText: "",
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        topologInfo:{}
      };
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      },
    },
    created() {
      this.init()
    },
    methods: {
      //更新表格数据
      getTableList(){
        this.$refs.factoryTable.getData()
      },
      //获取当前节点
      handleNodeClick(data) {
        this.getTopolog(data)
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      //获取拓扑图信息
      getTopolog(data){
          this.$http('/unit/factoryunit/getALLTopolog/'+'10').then(res => {
            this.topologInfo = res.data.data[0]
          })
      },
      append(data) {
        const newChild = {
          id: id++,
          label: 'testtest',
          children: []
        };
        if (!data.children) {
          this.$set(data, 'children', []);
        }
        data.children.push(newChild);
      },

      remove(node, data) {
        const parent = node.parent;
        const children = parent.data.children || parent.data;
        const index = children.findIndex(d => d.id === data.id);
        children.splice(index, 1);
      },
      edit(){

      },
      //初始化
      init() {
        this.getTopologInfo()
        this.getTopolog()
      },
      //获取数据列表
      getTopologInfo() {
        this.$http('/unit/factoryunit/getALLTopolog/'+'10').then(res => {
          this.treeDate = res.data.data
        })
      },
      //重置查询条件Form
      reset() {
        this.dataForm.id = ''
        this.dataForm.staffId = ''
        this.dataForm.creator = ''
        this.dataForm.createTime = ''
        this.dataForm.updater = ''
        this.dataForm.updateTime = ''
        this.dataForm.teamId = ''
        this.dataForm.isDeleted = ''
        this.dataForm.staffName = ''
        this.getTableList();
      },
      //重置新增修改Form
      resetAddOrUpdateForm() {
        this.page = 1
        this.addOrUpdateForm = {
          id: '',
          staffId: '',
          creator: '',
          createTime: '',
          updater: '',
          updateTime: '',
          teamId: '',
          isDeleted: '',
          staffName: '',
        }
      },
      //查询按钮
      search() {
        this.page = 1
        this.getTableList();
      },

      //打开新增/修改对话框
      openDialog(type, row) {
        if (type == 'add') {
          this.dialogTitle = '新增'
          this.resetAddOrUpdateForm()
          this.dialogVisible = true
        } else if (type == 'edit') {
          var searchFrom = {
            id:row.id
          }
          this.$http.post('/unit/factoryunit/getFactoryUnitList',searchFrom).then(res=>{
            if(res.data.data[0]!=null){
              this.addOrUpdateForm = JSON.parse(JSON.stringify(res.data.data[0]))
              this.dialogTitle = '编辑'
              this.dialogVisible = true
            }
          })
        } else if (type == 'check') {
          this.dialogTitle = '查看'
          this.addOrUpdateForm = JSON.parse(JSON.stringify(row))
          this.dialogVisible = true
        }
      },
      //关闭新增/修改对话框
      closeDialog() {
        this.dialogVisible = false
        this.dialogTitle = ''
        this.getTableList()
        this.init()
      },
      //删除生产单元
      deletePU(node,row) {
        if(node.childNodes.length==0){
          this.$confirm('确认删除?', '提示', {
            cancelButtonClass: "btn-custom-cancel",
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async () => {
            this.$http('/unit/factoryunit/deleteFactoryUnit/'+row.id).then(({
              data: res
            }) => {
              if (res.code != 0) {
                return this.$message.error(res.data.msg)
              } else {
                this.init()
				this.getTableList()
                this.$message.success("删除成功!")
              }
            }).catch((err) => {})
          }).catch((err) => {})
        }else{
          this.$message.error("该节点拥有子节点，无法删除!")
        }
      },
      handleSizeChange(e) {
        this.limit = e
        this.getDataList()
      },
    }
  };
</script>

<style>
  .factoryUnitManage-box {
    background-color: #ffffff;
    width: 100%;
    height: 100%;
    padding-top: 0px 10px;
  }

  .factoryUnitManage-search-form {
    margin: 10px 10px 10px 10px;
    padding: 20px 20px 10px 20px;
    border-color: rgba(0, 0, 0, 0.1);
    border-width: 0.1px;
    border-style: solid;
  }

  .factoryUnitManage-box2 {
    height: 90%;
    display: flex;
    flex-direction: row;
  }

  .factoryUnitManage-search-button {
    display: flex;
    justify-content: flex-end;
    padding: 20px 20px 10px 20px;
    height: 4%;
  }

  .factoryUnitManage-pagination {
    display: flex;
    align-items: center;
    background-color: rgb(253, 253, 253);
    justify-content: center;
  }

  .factoryUnitManage-search-table {
    border-color: rgba(0, 0, 0, 0.1);
    margin: 10px 10px 10px 10px;
  }

  .factoryUnitManage-container {
    height: 100%;
    display: flex;
    background-color: #FFFFFF;
    margin-right: 20px;
  }

  #factoryDefinition .el-dialog__body {
    padding: 0px;
  }
</style>
