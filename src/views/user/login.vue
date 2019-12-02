<template>
  <!-- <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <h3 class="title">{{ title }}</h3>
      <el-form-item prop="userName">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          v-model="loginForm.username"
          type="text"
          placeholder="用户名"
        />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :type="pwdType"
          v-model="loginForm.password"
          placeholder="密码"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="pwdType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>
      <Verify
        style="margin-bottom:20px;"
        @success="verify('success')"
        @error="verify('error')"
        :barSize="{ width: '100%', height: '40px' }"
        :type="3"
        :showButton="false"
      ></Verify>
      <el-form-item>
        <el-button
          :loading="loading"
          type="primary"
          style="width:100%;"
          @click.native.prevent="handleLogin"
        >
          登录
        </el-button>
      </el-form-item>
    </el-form>
  </div> -->
  <div class="login">
    <div class="login-bg">
      <img :src="loginbg" />
    </div>
    <div class="content">
      <div class="content-logo">
        <div class="title">
          <img class="title-logo" :src="titleLogo" alt="" />
          <img class="logo" :src="logo" alt />
        </div>
      </div>
      <div class="content-login">
        <div class="login-form" @keyup.enter="handleLogin">
          <div class="form-title">
            <div class="form-rectangle">
              <div class="form-triangle-left"></div>
              <a>用户登陆</a>
              <div class="form-triangle-right"></div>
            </div>
          </div>
          <el-form
            :model="loginForm"
            :rules="loginRules"
            ref="loginForm"
            class="my-form"
          >
            <el-form-item prop="username">
              <el-input
                type="text"
                placeholder="请输入用户名"
                v-model="loginForm.username"
              ></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                type="password"
                placeholder="请输入密码"
                v-model="loginForm.password"
              ></el-input>
            </el-form-item>
            <Verify
              class="my-verfiy"
              @success="verify('success')"
              @error="verify('error')"
              :barSize="{ width: '100%', height: '40px' }"
              :type="3"
              :showButton="false"
            ></Verify>
            <el-form-item>
              <el-button @click="handleLogin">登 录</el-button>
            </el-form-item>
          </el-form>

        </div>
      </div>
      <div class="download">
        <div class="download-content">
          <img class="app" :src="app" alt="" />
          <div><svg-icon iconClass="安卓"></svg-icon> 安卓下载</div>
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="base">
        <span v-for="item in base" :key="item.name"
          >{{ item.name }}: {{ item.text }}</span
        >
      </div>
      <div class="contact">
        <span v-for="item in contact" :key="item.name">
          {{ item.name }}: {{ item.text }}
        </span>
      </div>
    </div>
  </div>
</template>
<script>
import { title } from 'config';
import Verify from 'vue2-verify';
const logo = require('@/assets/images/login/logo.png');
const titleLogo = require('assets/images/sj/kuangshan .png');
const loginbg = require('@/assets/images/login/background.png');
const app = require('@/assets/images/login/app.png');
export default {
  name: 'Login',
  components: {
    Verify,
  },
  data() {
    return {
      title,
      loginbg,
      logo,
      titleLogo,
      app,
      loginForm: {
        username: '',
        password: '',
      },
      verifyStatus: false,
      loginRules: {
        username: [
          { required: true, trigger: 'blur', message: '请输入用户名' },
        ],
        password: [{ required: true, trigger: 'blur', message: '请输入密码' }],
      },
      loading: false,
      pwdType: 'password',
      redirect: undefined,
      base: [
        {
          name: '建设单位',
          text: '重庆市规划和自然资源局',
        },
        {
          name: '技术支持',
          text: '重庆市地理信息和遥感应用中心 重庆地质矿产研究院',
        },
      ],
      contact: [
        { name: '联系电话', text: '023-67033881' },
        { name: '地址', text: '重庆市渝北区龙山街道龙山大道339号' },
      ],
    };
  },
  methods: {
    verify(text) {
      if (text === 'success') {
        this.verifyStatus = true;
      } else {
        this.verifyStatus = false;
      }
    },
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = '';
      } else {
        this.pwdType = 'password';
      }
    },
    handleLogin() {
      if (!this.verifyStatus) {
        this.$message({
          message: '请先完成验证',
          type: 'error',
        });
        return;
      }
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch('LOGIN', this.loginForm)
            .then(res => {
              const { type } = res;
              this.loading = false;
              if (type === 1) {
                this.$router.push('/sj');
              } else if (type === 2) {
                this.$router.push('qx');
              } else if (type === 3) {
                this.$router.push('/dc');
              } else {
                this.$message({
                  type: 'error',
                  message: '未知用户类型',
                });
                return false;
              }
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss">
$bg: #2d3a4b;
$light_gray: #eee;

/* reset element-ui css */
// .login-container {
//   .el-input {
//     display: inline-block;
//     height: 47px;
//     width: 85%;
//     input {
//       background: transparent;
//       border: 0px;
//       -webkit-appearance: none;
//       border-radius: 0px;
//       padding: 12px 5px 12px 15px;
//       color: $light_gray;
//       height: 47px;
//       &:-webkit-autofill {
//         -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
//         -webkit-text-fill-color: #fff !important;
//       }
//     }
//   }
//   .el-form-item {
//     border: 1px solid rgba(255, 255, 255, 0.1);
//     background: rgba(0, 0, 0, 0.1);
//     border-radius: 5px;
//     color: #454545;
//   }
// }
</style>

<style rel="stylesheet/scss" lang="scss">
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
// .login-container {
//   position: fixed;
//   height: 100%;
//   width: 100%;
//   background-color: $bg;
//   .login-form {
//     position: absolute;
//     left: 0;
//     right: 0;
//     width: 520px;
//     max-width: 100%;
//     padding: 35px 35px 15px 35px;
//     margin: 120px auto;
//   }
//   .tips {
//     font-size: 14px;
//     color: #fff;
//     margin-bottom: 10px;
//     span {
//       &:first-of-type {
//         margin-right: 16px;
//       }
//     }
//   }
//   .svg-container {
//     padding: 6px 5px 6px 15px;
//     color: $dark_gray;
//     vertical-align: middle;
//     width: 30px;
//     display: inline-block;
//   }
//   .title {
//     font-size: 26px;
//     font-weight: 400;
//     color: $light_gray;
//     margin: 0px auto 40px auto;
//     text-align: center;
//     font-weight: bold;
//   }
//   .show-pwd {
//     position: absolute;
//     right: 10px;
//     top: 7px;
//     font-size: 16px;
//     color: $dark_gray;
//     cursor: pointer;
//     user-select: none;
//   }
// }
.login {
  width: 100%;
  .login-bg {
    width: 100%;
    height: calc(100vh - 80px);
    margin-bottom: 80px;
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
    img {
      width: 100%;
      height: 100%;
      display: block;
    }
  }
  .content {
    width: 100%;
    height: calc(100vh - 90px);
    display: flex;
    flex-direction: column;
    .content-logo {
      width: 100%;
      height: 20%;
      display: flex;
      align-items: flex-end;
      .title {
        margin-left: 20%;
        display: flex;
        align-items: center;
      }
      .title-logo {
        height: 60px;
        // margin-left: 20%;
      }
    }
    .content-login {
      width: 100%;
      height: 70%;
      display: flex;
      align-items: center;
      .login-form {
        margin-left: 60%;
        width: 360px;
        height: 400px;
        background-color: #fff;
        .form-title {
          width: 100%;
          height: 54px;
          background-color: #eef2f7;
          display: flex;
          align-items: center;
          justify-content: center;
          .form-rectangle {
            width: 240px;
            height: 54px;
            background-color: #0094ec;
            color: #fff;
            font-size: 22px;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: relative;
            .form-triangle-left:before {
              content: '';
              display: block;
              width: 0;
              height: 0;
              border-width: 0px 30px 54px 0px;
              border-style: none solid solid;
              border-color: transparent transparent #eef2f7;
            }
            .form-triangle-right:before {
              content: '';
              display: block;
              width: 0;
              height: 0;
              border-width: 0px 0px 54px 30px;
              border-style: none solid solid;
              border-color: transparent transparent #eef2f7;
            }
          }
        }
        .my-form {
          box-sizing: border-box;
          width: 360px;
          height: 340px;
          padding: 45px 15px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          .el-form-item {
            margin-bottom: 20px;
          }
          .el-form-item.is-success .el-input__inner:focus {
            border-color: #0094ec;
            color: #0094ec;
          }
          .el-input__inner:focus {
            border-color: #0094ec;
            color: #0094ec;
          }
          .el-form-item.is-success .el-input__inner {
            border-color: #e2eaf5;
          }
          .el-button {
            width: 100%;
            height: 45px;
            background-color: #0094ec;
            color: #fff;
            margin-top: 40px;
            font-size: 16px;
            font-weight: normal;
            border: none;
          }
          .my-verfiy {
            .verify-left-bar {
              border-color: #0094ec !important;
              background-color: rgba(0, 149, 236, 0.5);
            }
            .verify-move-block {
              background-color: #0094ec !important;
              border: 1px solid #0094ec;
              top: -1px;
              box-shadow: none;
            }
          }
        }
      }
    }
    .download {
      display: flex;
      justify-content: flex-end;
      padding: 0 10px 10px 0;
      .download-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .app {
          width: 100px;
          height: 100px;
          margin-bottom: 3px;
        }
      }
    }
  }
  .footer {
    position: absolute;
    bottom: 0;
    height: 90px;
    width: 100%;
    background-color: #007bd9;
    text-align: center;
    font-size: 12px;
    color: #b7eaff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .base {
      margin-bottom: 15px;
      span {
        padding: 0 15px;
      }
    }
    .contact {
      span {
        padding: 0px 15px;
      }
    }
  }
}
</style>
