<template>
  <div class="login-box">
    <div class="login-company-logo">
      <img src="../../assets/img/cslogo_blue.png">
    </div>
    <div class="login-main-box-outer">
      <div class="login-main-box-inner">
        <div class="login-main-left">
          <div class="login-title">登录</div>
          <el-form class="login-form" :model="param" :rules="rules" ref="login" label-width="0px"
            @keyup.enter.native="submitForm()">
            <el-form-item prop="username">
              <el-input v-model.trim="param.username" placeholder="请输入用户名" />
            </el-form-item>
            <el-form-item prop="password">
              <el-input placeholder="请输入密码" :type="showPwd && showPwd ? 'text' : 'password'"
                v-model.trim="param.password" @keyup.enter.native="submitForm()" />
              <span @click="showPwd = !showPwd"></span>
            </el-form-item>
            <div class="login-button">
              <el-button :loading="loading" type="primary" @click="submitForm()" :disabled="isDisabled">立即登录</el-button>
            </div>
          </el-form>
        </div>
        <div class="login-main-right">
          <img src="../../assets/img/login_mask.jpg">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    postMethod
  } from '../../api/index.js';
  import Cookies from 'js-cookie';

  export default {
    data: function() {
      var validateInput = (rule, value, callback) => {
        if (!this.checkSpecialKey(value)) {
          callback(new Error("不能含有空格字符！！"));
        } else {
          callback();
        }
      };
      return {
        isDisabled: false,
        checked: true,
        showPwd: false,
        loading: false,
        param: {
          username: '',
          password: ''
        },
        rules: {
          username: [{
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          }, {
            validator: validateInput,
            message: '不能含有空格字符！！',
            trigger: 'blur'
          }],
          password: [{
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }, {
            validator: validateInput,
            message: '不能含有空格字符！！',
            trigger: 'blur'
          }]
        }
      };
    },
    created: function() {},
    methods: {
      //登录
      async submitForm() {
        var _this = this;
        this.loading = true;
        if (!this.param.username) {
          this.$message.error('请输入账号');
          this.loading = false;
          return;
        } else if (!this.param.password) {
          this.$message.error('请输入密码');
          this.loading = false;
          return;
        }
        const res = await postMethod('/sys/login', this.param);
        try {
          if (res.code == 0) {
            localStorage.setItem('crumbsTab', JSON.stringify([]));
            Cookies.set("token", res.data.token)
            this.$router.push({
              path: '/'
            });
            this.$message.success('登录成功');
            this.loading = false;
          } else {
            this.$message.error(res.msg);
            this.loading = false;
            return false;
          }
        } catch {
          this.loading = false;
          return false;
        }
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
  .login-box {
    height: 100vh;
    background-color: rgb(235, 237, 241);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 0% 3%;
  }

  .login-company-logo {
    display: flex;
    height: 10%;
    width: 100%;
    align-items: center;
    justify-content: flex-start;

    >img {
      height: 100%;
      width: 10%;
    }
  }

  .login-main-box-outer {
    height: 80%;
    width: 60%;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    margin-top: 2%;

    .login-main-box-inner {
      height: 80%;
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      background-color: rgb(255, 255, 255);
      display: flex;
      box-shadow: 0 2px 27px 6px rgba(0, 0, 0, .12);

      .login-main-left {
        height: 100%;
        width: 35%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        padding: 5% 5%;
      }

      .login-main-right {
        width: 60%;
        height: 100%;

        >img {
          height: 100%;
          width: 100%;
        }
      }
    }
  }

  .login-title {
    height: 40%;
    width: 100%;
    font-size: 32px;
    color: rgba(125, 129, 152, 100);
    font-family: PingFangSC-Thin;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  .login-form {
    width: 100%;
    height: 55%;

    /deep/ .el-form-item {
      margin-bottom: 10%;
    }

    /deep/ .el-input__inner {
      border-top-width: 0px;
      border-right-width: 0px;
      border-left-width: 0px;
      border-radius: 0px;
    }
  }

  .login-button {
    width: 100%;

    .el-button {
      width: 100%;
    }
  }
</style>
