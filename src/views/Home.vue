<template>
  <div class="home">
    <div class="box">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>DES加密/解密实验</span>
          <div class="" style="float: right; padding: 3px 0">
            控制台输出：
            <el-switch v-model="con" />
          </div>
        </div>
        <div class="cryptogramBox">
          <div class="l">
            <div class="lt1">🔒 要加密的明文/要解密的密文：</div>
            <el-input type="textarea" :rows="10" placeholder="请输入要加密的明文/要解密的密文" v-model="M"/>
            <div class="lt2">🔑 密钥：</div>
            <el-input type="text" placeholder="请输入密钥" v-model="Key"/>
          </div>
          <div class="c">
            <el-button @click="cryptogram(0)" type="primary" class="btn">加密 👉</el-button>
            <el-button @click="cryptogram(1)" type="primary" class="btn">解密 👉</el-button>
          </div>
          <div class="r">
            <div class="rt1">🚩 结果：</div>
            <el-input type="textarea" :rows="16" placeholder="结果" v-model="C" />
          </div>
        </div>
      </el-card>
    </div>
    <div class="bottom">
      <span class="msg">作者：罗嘉乐(数软1185)</span>
      <span class="msg">|</span>
      <span class="msg">20181192****</span>
      <span class="msg">|</span>
      <span class="msg">2020.10 - 2020.12</span>
      <span class="msg">|</span>
      <span class="msg rsa"><router-link to="/rsa">RSA加密/解密实验 >></router-link></span>
    </div>
  </div>
</template>

<script>
  import {cryptogram, group} from "@/utils/des";

  export default {
    name: 'Home',
    data() {
      return {
        M: '海洋大学', //明文
        Key: '罗嘉乐乐', //密钥
        C: ''
      };
    },
    computed:{
      con:{
        get(){
          return this.$storeGet.con;
        },
        set(v){
          this.$storeSet('setConsole',v)
        }
      }
    },
    methods: {
      cryptogram(type) {
        let t1 = new Date()
        let K = this.key
        let C = ""

        let MM = this.M
        let len = type === 0 ? 64 * 64 * 4 : 64 * 64 * 64 * 2 //分组加密解密长度
        for (let i = 0; i < MM.length / len; i++) {
          let M = type === 0 ? group(MM.substring(i * len, (i + 1) * len), 4) : group(MM.substring(i * len, (i + 1) * len), 64)
          M.forEach(item => {
            C += cryptogram(type, this.fill(K), type === 0 ? this.fill(item) : item).replace(/₢/g, '');
          })
          console.log(new Date(), C);
        }

        this.C = C

        let t2 = new Date()
        console.log('Time:', t2 - t1);
        this.$message({ message: (type===0?'加密':'解密')+'成功！用时'+(t2-t1)+'ms', type: 'success' });
        return C
      },
      fill(str) {
        return group(str, 4).map(item => item.padStart(4, '₢')).join('')
      }
    },
    mounted() {

    },
  }
</script>

<style lang="scss">
  .home {
    background-image: linear-gradient(to top, #48c6ef 0%, #6f86d6 100%) !important;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .rsa{
      a{
        color: white;
        font-weight: 600;
      }
      a:hover{
        color: #4BC1ED;
      }
    }
    .bottom{
      position: absolute;
      bottom: 0;
      min-width: 1100px;
      padding-top: 4px;
      padding-bottom: 6px;
      width: 100%;
      background-color: rgba(50,50,50,.8  );
      color: rgba(255,255,255,0.9);
      text-align: center;
      .msg{
        text-align: center;
        font-size: 14px;
        margin-left: 20px;
      }
    }
    .box{
      width: 66%;
      .box-card{
        width: 100%;
        height: 100%;
        .cryptogramBox{
          display: flex;
          .l{
            flex: 1 1 50%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            .lt1,.lt2{
              text-align: left;
              width: 100% ;
              padding-bottom: 10px;
            }
            .lt2{
              margin-top: 30px;
            }
          }
          .c{
            margin: 0 10px;
            flex: 0 0 auto;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            .btn{
              margin: 10px;
            }
          }
          .r{
            flex: 1 1 50%;
            .rt1{
              margin-bottom: 10px;
            }
          }
        }
      }
    }
  }
</style>
