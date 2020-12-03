<template>
  <div class="rsa">
    <div class="box">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>RSA加密/解密实验</span>
          <div class="" style="float: right; padding: 3px 0">
            控制台输出：
            <el-switch v-model="con"/>
          </div>
        </div>
        <div class="cryptogramBox">
          <div class="l">
            <div class="lt1">🔒 要加密的明文/要解密的密文/生成密钥的区间：</div>
            <el-input type="textarea" :rows="10" placeholder="请输入要加密的明文/要解密的密文" v-model="M"/>
            <div class="lt2">🔑 JSON格式密钥(加密公钥，解密私钥)：</div>
            <el-input type="text" placeholder="请输入密钥" v-model="Key"/>
          </div>
          <div class="c">
            <el-button @click="generateKey" type="primary" class="btn" size="mini">随机生成 <br>密钥对🔑</el-button>
            <el-button @click="encryption" type="primary" class="btn">加密 👉</el-button>
            <el-button @click="decode" type="primary" class="btn">解密 👉</el-button>
          </div>
          <div class="r">
            <div class="rt1">🚩 结果：</div>
            <el-input type="textarea" :rows="16" placeholder="结果" v-model="C"/>
          </div>
        </div>
      </el-card>
    </div>
    <div class="bottom">
      <span class="msg">作者：罗嘉乐(数软1185)</span>
      <span class="msg">|</span>
      <span class="msg">201811921416</span>
      <span class="msg">|</span>
      <span class="msg">2020.10 - 2020.12</span>
      <span class="msg">|</span>
      <span class="msg des"><router-link to="/">DES加密/解密实验 >></router-link></span>
    </div>
  </div>
</template>

<script>
  import {generate_pbk_pvk, encryption, decode} from "@/utils/rsa"
  import {isEmpty} from "@/utils/common";

  export default {
    name: "Rsa",
    data() {
      return {
        M: '2,99', //明文
        Key: '', //密钥
        C: '',
        start: 2,//偶数寻找左端
        end: 99//偶数寻找右端
      }
    },
    mounted() {

    },
    computed: {
      con: {
        get() {
          return this.$storeGet.con;
        },
        set(v) {
          this.$storeSet('setConsole', v)
        }
      }
    },
    methods: {
      generateKey() {
        let t1 = new Date()
        let se = this.M.split(',')
        if (se.length >= 2) {
          this.start = parseInt(eval(se[0])) ;
          this.end = parseInt(eval(se[1]));
        }
        this.C = generate_pbk_pvk(this.start, this.end)
        let failFlag = true
        while (failFlag) {
          this.C = generate_pbk_pvk(this.start, this.end)
          failFlag = isEmpty(JSON.parse(this.C)['allKey']['n']) || isEmpty(JSON.parse(this.C)['allKey']['e']) || isEmpty(JSON.parse(this.C)['allKey']['d']) || JSON.parse(this.C)['allKey']['e']===1
        }
        let t2 = new Date()
        this.$message({message: '密钥已生成！用时' + (t2 - t1) + 'ms', type: 'success'});
        console.log('Time:', t2 - t1);
      },
      encryption() {
        let t1 = new Date()
        this.C = encryption(this.M, JSON.parse(this.Key))
        let t2 = new Date()
        this.$message({message: '加密成功！用时' + (t2 - t1) + 'ms', type: 'success'});
        console.log('Time:', t2 - t1);
      },
      decode() {
        let t1 = new Date()
        this.C = decode(this.M, JSON.parse(this.Key))
        let t2 = new Date()
        this.$message({message: '加密成功！用时' + (t2 - t1) + 'ms', type: 'success'});
        console.log('Time:', t2 - t1);
      },
    },
  }
</script>

<style lang="scss">
  .rsa {
    width: 100%;
    background-image: linear-gradient(to top, #48c6ef 0%, #6f86d6 100%) !important;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .des {
      a {
        color: white;
        font-weight: 600;
      }

      a:hover {
        color: #4BC1ED;
      }
    }

    .bottom {
      position: absolute;
      bottom: 0;
      padding-top: 4px;
      padding-bottom: 6px;
      width: 100%;
      background-color: rgba(50, 50, 50, .8);
      min-width: 1100px;
      color: rgba(255, 255, 255, 0.9);
      text-align: center;

      .msg {
        text-align: center;
        font-size: 14px;
        margin-left: 20px;
      }
    }

    .box {
      width: 66%;

      .box-card {
        width: 100%;
        height: 100%;

        .cryptogramBox {
          display: flex;

          .l {
            flex: 1 1 50%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            .lt1, .lt2 {
              font-size: 14px;
              text-align: left;
              width: 100%;
              padding-bottom: 10px;
            }

            .lt2 {
              margin-top: 30px;
            }
          }

          .c {
            margin: 0 10px;
            flex: 0 0 auto;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            .btn {
              text-align: center;
              margin: 10px;
            }
          }

          .r {
            flex: 1 1 50%;

            .rt1 {
              margin-bottom: 10px;
            }
          }
        }
      }
    }
  }
</style>
