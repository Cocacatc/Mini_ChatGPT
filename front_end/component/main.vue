<style type="text/css">
  .msgCss {
    font-size: 16px;
    font-weight: 500;
  }
</style>

<template>
    <div id="app">
        <el-config-provider namespace="ep">
            <!-- 设置head -->
            <el-menu class="menu" mode="horizontal">
            <el-menu-item index="1"
                style="color: rgb(0, 0, 0); font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; font-size: larger;">Mini-ChatGPT</el-menu-item>
            <el-menu-item index="2">
                <el-button @click="visible = true" type="primary" style="background-color: lightskyblue;">Start</el-button>
            </el-menu-item>
            <el-menu-item index="3">
                <!-- <el-button @click="visible11 = true" type="success">Orders</el-button> -->
            </el-menu-item>
            </el-menu>
            <!-- 设置side -->
            <div>
                <div style="width: 160px; height: auto;">
                    <el-menu
                    class="el-menu-vertical-demo"
                    >
                    <el-menu-item index="1">
                        <template #title>Navigator One</template>
                    </el-menu-item>
                    <el-menu-item index="2">
                        <template #title>Navigator Two</template>
                    </el-menu-item>
                    <el-menu-item index="3">
                        <template #title>Navigator Three</template>
                    </el-menu-item>
                    </el-menu>
                </div>


                <!-- 设置对话框 -->
                <el-dialog :visible.sync="visible" title="对话框" width="70%">
                    <!-- Chat Box -->
                    <div style="height: 500px; overflow-y: auto;" id="bigBox">
                        <div v-for="(item, index) in list" class="msgCss" :style="{textAlign: item.align}">
                            <span v-if="item && item.align == 'left'">
                            <div class="robotBox">
                                <img style="
                                width: 50px;
                                height: 50px;
                                vertical-align: middle;
                                border-radius: 50%;
                                padding-right: 10px;
                            " src=".\image\robot.jpg" alt="" />
                                <span v-if="item && item.link == ''" class="robotText">{{item.text}}</span>
                                <span v-if="item && item.link">: <a :href="item.link" target="_blank">{{item.text}}</a></span>
                            </div>
                            </span>
                            <span v-if="item && item.align == 'right'">
                            <div class="userBox">
                                <span class="userText">{{item.text}}</span>
                                <img style="
                                width: 50px;
                                height: 50px;
                                vertical-align: middle;
                                border-radius: 50%;
                                padding-right: 10px;
                                padding-left: 10px;
                            " src=".\image\user.jpg" alt="" />
                            </div>
                            </span>
                        </div>
                    </div>
                    <!-- input area -->
                    <div style="margin-top: 15px">
                    <el-input placeholder="请输入内容" v-model="input3" class="input-with-select" :autofocus="true" ref="serachBox">
                        <el-button :loading="loading" @keydown.enter.native="handleMsg" slot="append" type="primary"
                        @click="handleMsg">send</el-button>
                    </el-input>
                    </div>
                </el-dialog>
            </div>
        </el-config-provider>
    </div>
</template>



<!-- 导入依赖  -->
<script src="https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/vue-router@3.1.5/dist/vue-router.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/vuex@3.1.2/dist/vuex.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/axios@0.19.2/dist/axios.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/echarts@4.6.0/dist/echarts.simple.min.js"></script>
<script>
  if (typeof Vue == "undefined") {
    document.write(
      unescape(
        "%3Cscript src='vendor/vue.min.js' type='text/javascript'%3E%3C/script%3E"
      )
    );
  }
  if (typeof VueRouter == "undefined") {
    document.write(
      unescape(
        "%3Cscript src='vendor/vue-router.min.js' type='text/javascript'%3E%3C/script%3E"
      )
    );
  }
  if (typeof Vuex == "undefined") {
    document.write(
      unescape(
        "%3Cscript src='vendor/vuex.min.js' type='text/javascript'%3E%3C/script%3E"
      )
    );
  }
  if (typeof axios == "undefined") {
    document.write(
      unescape(
        "%3Cscript src='vendor/axios.min.js' type='text/javascript'%3E%3C/script%3E"
      )
    );
  }
</script>


<!-- import JavaScript -->
<script src="https://unpkg.com/element-ui/lib/index.js"></script>
<script>
  //创建vue框架
  new Vue({
    el: "#app",
    data: function () {
      return {
        visible: false,
        input3: "",
        list: [],
        loading: false,
      };
    },
    created: function () {
      document.addEventListener("keydown", (e) => {
        let key = window.event.keyCode;
        if (key == 13 && !this.loading) {
          // 13是enter键的键盘码 如果等于13 就调用click的登录方法
          this.handleMsg();
        }
      });
    },
    methods: {
      visible11() {
        this.visible = true;
        this.$nextTick(() => {
          this.$refs.serachBox.focus();
        });
      },
      async handleMsg() {
        console.log(this.input3, "发送信息");
        if (this.input3 !== "") {
          this.loading = true;
          await this.list.push({ align: "right", text: this.input3 });
          await this.scrollTop11();
          this.getMsg();
          this.input3 = "";
        }
      },
      getMsg() {
        // 处理自己的接口请求 返回需要的数据
        axios
          .post("http://127.0.0.1:8000/server",
            { info: this.input3 }
          )
          .then(async (response) => {
            console.log(response);
            if (response.status == 200) {
              const msg = response.data;
              let listMsg = {
                align: "left",
                text: msg[0].answer,
                link: "", 
              };
              await this.list.push(listMsg);
              await this.scrollTop11();
            }
            this.loading = false;
          })
          .catch(function (error) {
            console.log(error);
            this.loading = false;
          });
      },
      // 处理滚动条一直保持最上方
      scrollTop11() {
        let div = document.getElementById("bigBox");
        div.scrollTop = div.scrollHeight;
      },
    },
  });
</script>

<style>
.robotBox{
  width: 100%;
  float: left;
  position: relative;
}
.robotText{
  padding: 5px 10px;
  background-color: #ffffff;
  font-size: 14px;
  border-radius: 2px;
}
.userBox{
  width: 100%;
  float: right;
  position: relative;
}
.userText{
  padding: 10px 5px;
  background-color: #98E165;
  font-size: 14px;
  border-radius: 2px;
}
</style>