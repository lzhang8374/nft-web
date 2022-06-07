<template>
  <div class="header">

    <div class="header-logo">
      <img src="../../assets/img/header_logo.png">
    </div>

    <div class="header-user">
      <!-- 全屏显示 -->
      <div @click='handleFullScreen'>
        <el-tooltip effect='dark' :content='fullscreen ? `取消全屏` : `全屏`' placement='bottom'>
          <i/>
        </el-tooltip>
      </div>
      <el-dropdown trigger='click' @command='handleCommand'>
        <span class="header-username">
          {{ username }}
          <i class="el-icon-caret-bottom"></i>
        </span>
        <el-dropdown-menu slot='dropdown'>
          <el-dropdown-item divided command='updatePassword'>修改密码</el-dropdown-item>
          <el-dropdown-item divided command='logout'>退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <el-dialog title="修改密码" :visible="visible" @close="closeDialog" append-to-body destroy-on-close>
      <div>
        <el-form :rules="rules" ref="form" :model="form" label-width="100px">
          <el-form-item label="用户名">
            <el-input v-model="username" disabled></el-input>
          </el-form-item>
          <el-form-item label="旧密码" prop="oldPassword">
            <el-input placeholder="请输入旧密码" v-model.trim="form.oldPassword" type="psssword" show-password></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword">
            <el-input placeholder="请输入新密码" v-model.trim="form.newPassword" type="psssword" show-password></el-input>
          </el-form-item>
          <el-form-item label="确认新密码" prop="confirmPassword">
            <el-input placeholder="请再次输入新密码" v-model.trim="form.confirmPassword" type="psssword" show-password>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <div>
        <el-button @click="confirm" type="primary">确定</el-button>
        <el-button @click="closeDialog">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {putMethod,postMethod,getMethod} from '../../api/index.js';
  import bus from '../common/bus';
  import Cookies from 'js-cookie';


  export default {
    data() {
      var validateInput = (rule, value, callback) => {
        if (!this.checkSpecialKey(value)) {
          callback(new Error("不能含有空格字符！！"));
        } else {
          callback();
        }
      };
      return {
        collapse: false,
        fullscreen: false,
        username: 'none',

        form: {
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        },

        visible: false,

        rules: {
          oldPassword: [{
            required: true,
            message: '请输入旧密码',
            trigger: 'blur'
          }, {
            min: 6,
            message: '密码长度不能小于6位',
            trigger: 'blur'
          }, {
            validator: validateInput,
            trigger: 'input'
          }],
          newPassword: [{
            required: true,
            message: '请输入新密码',
            trigger: 'blur'
          }, {
            min: 6,
            message: '密码长度不能小于6位',
            trigger: 'blur'
          }, {
            validator: validateInput,
            trigger: 'input'
          }],
          confirmPassword: [{
            required: true,
            message: '请再次输入新密码',
            trigger: 'blur'
          }, {
            min: 6,
            message: '密码长度不能小于6位',
            trigger: 'blur'
          }, {
            validator: validateInput,
            trigger: 'input'
          }],
        },
      };
    },

    created() {
      this.getCurrentUserInfo()
      // this.getUserPermissionCodeList()
    },
    methods: {
      getCurrentUserInfo() {
        getMethod('/sys/getCurrentUserInfo').then(res => {
          if (res.code != 0) {
            return this.$message.error(res.msg)
          } else {
            Cookies.set("currentUserInfo", res.data)
            this.username = res.data.realName || 'none'
          }
        }).catch(err => {})
      },
      getUserPermissionCodeList() {
        getMethod('/sys/getUserPermissionCodeList').then(res => {
          if (res.code != 0) {
            return this.$message.error(res.msg)
          } else {
            window.SITE_CONFIG['permissions'] = res.data
          }
        }).catch(err => {})
      },
      // 用户名下拉菜单选择事件
      handleCommand(command) {
        if (command === 'logout') {
          this.logout()
        } else if (command === 'updatePassword') {
          this.openUpdatePasswordDialog()
        }
      },

      async logout() {
        await getMethod('/sys/logout');
        Cookies.remove('currentUserInfo')
        Cookies.remove('token');
        localStorage.removeItem('crumbsTab');
        this.$router.push('/login');
      },

      openUpdatePasswordDialog() {
        this.visible = true
      },

      closeDialog() {
        this.visible = false
        this.form.oldPassword = ''
        this.form.newPassword = ''
        this.form.confirmPassword = ''
      },

      confirm() {
        this.$refs.form.validate(valid => {
          if (valid) {
            if (this.form.newPassword != this.form.confirmPassword) {
              return this.$message.error("两次输入的新密码不一致")
            }
            this.$http.post('/sys/updatePassword', this.form).then(res => {
              if (res.data.code != 0) {
                return this.$message.error(res.data.msg)
              }
              this.$message.success(res.data.msg)
              this.logout()
            })
          }
        })
      },
      // 全屏事件
      handleFullScreen() {
        const element = document.documentElement;
        if (this.fullscreen) {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
          }
        } else {
          if (element.requestFullscreen) {
            element.requestFullscreen();
          } else if (element.webkitRequestFullScreen) {
            element.webkitRequestFullScreen();
          } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
          } else if (element.msRequestFullscreen) {
            // IE11
            element.msRequestFullscreen();
          }
        }
        this.fullscreen = !this.fullscreen;
      },
      //校验空格字符
      checkSpecialKey(str) {
        let spaceStr = str.split(" ");
        if (spaceStr.length != 1) {
          return false;
        }
        return true;
      },
    }
  };
</script>
<style lang="scss" scoped>
  .header {
    background-color: var(--global-background-color);
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5), 0 0 6px rgba(0, 0, 0,0.5);
    z-index: 5;

    .header-logo {
      display: flex;
      align-items: center;
      padding-left: 20px;
      >img{
        height: 40px;
      }
    }

    .header-user {
      padding:0px 20px 0px 20px;

      .header-username {
        color: var(--global-font-color);
      }
    }
  }
</style>
