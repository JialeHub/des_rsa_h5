import store from '@/store'
// DES模块

/**
 * @param ss 字符串
 * @param step 步长
 * @return {Object} 32+32=64bit
 * @description 字符串分组
 * */
export const group = (ss, step) => {
  let r = [];

  function doGroup(s) {
    if (!s) return;
    r.push(s.substr(0, step));
    s = s.substr(step);
    doGroup(s)
  }

  doGroup(ss);
  return r;
}

/**
 * @param str 字符串(4个16bit以内字符)
 * @param bit64 是否转为64位(往前补0)，否则为60位
 * @return {Object} 32+32=64bit
 * @description 字符串转二进制
 * */
export const toBin = (str, bit64 = true) => {
  str = str + ''
  let result = [];
  let list = str.split("");
  list.forEach((item, index) => {
    if (index !== 0) {
      result.push(",");
    }
    let binStr = item.charCodeAt().toString(2);
    result.push(binStr);
  })
  if (bit64) {
    let res = result.join("").split(',').map(item => item.padStart(16,'0')).join("")
    if (store.getters.con) console.log('字符串转64位二进制：', str, '=>', res)
    return res
  } else {
    if (store.getters.con) console.log('字符串转60位二进制：', str, '=>', result.join(""))
    return result.join("");
  }
}

/**
 * @param str 字符串
 * @param bit64 是否转为64位(往前补0)，否则为60位
 * @return {Object} 32+32=64bit
 * @description 二进制转字符串
 * */
export const toStr = (str, bit64 = true) => {
  if (bit64) str = group(str, 64 / 4).map(item => item.replace(/\b(0+)/gi,"")).join(",");
  else str = str + '';
  let result = [];
  let list = str.split(",");
  for (let i = 0; i < list.length; i++) {
    let item = list[i];
    let asciiCode = parseInt(item, 2);
    let charValue = String.fromCharCode(asciiCode);
    result.push(charValue);
  }
  if (store.getters.con) {
    if (bit64) console.log('64位二进制转字符串：', str, '=>', result.join(""));
    else console.log('60位二进制转字符串：', str, '=>', result.join(""));
  }
  return result.join("");
}

/**
 * @param m 二进制明文(64bit)
 * @return {Object} 32+32=64bit
 * @description 初始置换
 * */
export const IP = (m) => {
  let map = [
    58, 50, 42, 34, 26, 18, 10, 2,
    60, 52, 44, 36, 28, 20, 12, 4,
    62, 54, 46, 38, 30, 22, 14, 6,
    64, 56, 48, 40, 32, 24, 16, 8,
    57, 49, 41, 33, 25, 17, 9, 1,
    59, 51, 43, 35, 27, 19, 11, 3,
    61, 53, 45, 37, 29, 21, 13, 5,
    63, 55, 47, 39, 31, 23, 15, 7,
  ]
  let mArr = m.split('')
  let resArr = []
  map.forEach(item => {
    resArr.push(mArr[item - 1])
  })
  let all = resArr.join('');
  let L0 = group(all, all.length / 2)[0]
  let R0 = group(all, all.length / 2)[1]
  let mIP = {all, L0, R0}
  if (store.getters.con) console.log('初始置换IP:', m, '=>：', mIP)
  return mIP
};

/**
 * @param k 二进制密钥(64bit)
 * @return {Object} 28+28=56bit 8bit校验
 * @description 置换PC-1
 * */
export const PC_1 = (k) => {
  let map = [
    57, 49, 41, 33, 25, 17, 9,
    1, 58, 50, 42, 34, 26, 18,
    10, 2, 59, 51, 43, 35, 27,
    19, 11, 3, 60, 52, 44, 36,
    63, 55, 47, 39, 31, 23, 15,
    7, 62, 54, 46, 38, 30, 22,
    14, 6, 61, 53, 45, 37, 29,
    21, 13, 5, 28, 20, 12, 4
  ]
  let kArr = k.split('')
  let resArr = []
  let resVerifyArr = '' //校验位
  map.forEach(item => {
    resArr.push(kArr[item - 1])
  })
  for (let i = 0; i < k.length; i++) {
    if ((i + 1) % 8 === 0) resVerifyArr += k[i]
  }
  let all = resArr.join('');
  let C0 = group(all, all.length / 2)[0]
  let D0 = group(all, all.length / 2)[1]
  let res = {all, C0, D0, resVerifyArr}
  if (store.getters.con) console.log('密钥PC-1置换:', k, '=>：', res)
  return res
};

/**
 * @param CDn 二进制密钥(28+28=56bit)
 * @param n 轮数(1-16)
 * @return {String} 第n轮子密钥 48bit
 * @description 置换PC-2
 * */
export const PC_2 = (CDn, n = 'n') => {
  let map = [
    14, 17, 11, 24, 1, 5, 3, 28,
    15, 6, 21, 10, 23, 19, 12, 4,
    26, 8, 16, 7, 27, 20, 13, 2,
    41, 52, 31, 37, 47, 55, 30, 40,
    51, 45, 33, 48, 44, 49, 39, 56,
    34, 53, 46, 42, 50, 36, 29, 32
  ]
  let kArr = CDn.split('')
  let resArr = []
  map.forEach(item => {
    resArr.push(kArr[item - 1])
  })
  let Kn = resArr.join('');
  if (store.getters.con) console.log('PC_2置换，第' + n + '轮子密钥:', CDn, '=>：', Kn)
  return Kn
};

/**
 * @param cdn 二进制密钥(28bit)
 * @param n 轮数(1-16)
 * @return {String} 第n轮子C/D密钥 28bit
 * @description 左移h位
 * */
export const hLeft = (cdn, n) => {
  let map = [
    1, 1, 2, 2, 2, 2, 2, 2,
    1, 2, 2, 2, 2, 2, 2, 1
  ]
  let res = (cdn + cdn.slice(0, map[n - 1])).slice(map[n - 1]);
  if (store.getters.con) console.log('第' + n + '轮左移', map[n - 1], '位:', cdn, '=>：', res)
  return res
};

/**
 * @param LRn 32位报文
 * @param n 轮数(1-16)
 * @return {String} 48位扩展报文
 * @description 扩展置换E
 * */
export const E = (LRn, n) => {
  let res =
    LRn[31] + LRn.slice(0, 4) + LRn[4] +
    LRn[3] + LRn.slice(4, 8) + LRn[8] +
    LRn[7] + LRn.slice(8, 12) + LRn[12] +
    LRn[11] + LRn.slice(12, 16) + LRn[16] +
    LRn[15] + LRn.slice(16, 20) + LRn[20] +
    LRn[19] + LRn.slice(20, 24) + LRn[24] +
    LRn[23] + LRn.slice(24, 28) + LRn[28] +
    LRn[27] + LRn.slice(28, 32) + LRn[0]
  if (store.getters.con) console.log('扩展置换E，第' + n + '轮扩展:', LRn, '=>：', res)
  return res
};

/**
 * @param a 48bit
 * @param b 48bit
 * @param n 轮数(1-16)
 * @return {String} 48bit ^ 48bit = 48bit
 * @description 异或运算
 * */
export const XOR = (a, b, n) => {
  let aArr = a.split('')
  let bArr = b.split('')
  let res = []
  aArr.forEach((item, index) => {
    res.push(item ^ bArr[index])
  })
  if (store.getters.con) console.log('异或运算，第' + n + '轮:', a, '^', b, '=>：', res.join(''))
  return res.join('')
};

/**
 * @param groupEK 8组6位，数组传入
 * @param n 轮数(1-16)
 * @return {String} 8组4位,32位字符串输出
 * @description S盒变换
 * */
export const SBox = (groupEK, n) => {
  let SBoxValue = [
    [
      [14, 4, 13, 1, 2, 15, 11, 8, 3, 10, 6, 12, 5, 9, 0, 7],
      [0, 15, 7, 4, 14, 2, 13, 1, 10, 6, 12, 11, 9, 5, 3, 8],
      [4, 1, 14, 8, 13, 6, 2, 11, 15, 12, 9, 7, 3, 10, 5, 0],
      [15, 12, 8, 2, 4, 9, 1, 7, 5, 11, 3, 14, 10, 0, 6, 13]
    ],
    [
      [15, 1, 8, 14, 6, 11, 3, 4, 9, 7, 2, 13, 12, 0, 5, 10],
      [3, 13, 4, 7, 15, 2, 8, 14, 12, 0, 1, 10, 6, 9, 11, 5],
      [0, 14, 7, 11, 10, 4, 13, 1, 5, 8, 12, 6, 9, 3, 2, 15],
      [13, 8, 10, 1, 3, 15, 4, 2, 11, 6, 7, 12, 0, 5, 14, 9]
    ],
    [
      [10, 0, 9, 14, 6, 3, 15, 5, 1, 13, 12, 7, 11, 4, 2, 8],
      [13, 7, 0, 9, 3, 4, 6, 10, 2, 8, 5, 14, 12, 11, 15, 1],
      [13, 6, 4, 9, 8, 15, 3, 0, 11, 1, 2, 12, 5, 10, 14, 7],
      [1, 10, 13, 0, 6, 9, 8, 7, 4, 15, 14, 3, 11, 5, 2, 12]
    ],
    [
      [7, 13, 14, 3, 0, 6, 9, 10, 1, 2, 8, 5, 11, 12, 4, 15],
      [13, 8, 11, 5, 6, 15, 0, 3, 4, 7, 2, 12, 1, 10, 14, 9],
      [10, 6, 9, 0, 12, 11, 7, 13, 15, 1, 3, 14, 5, 2, 8, 4],
      [3, 15, 0, 6, 10, 1, 13, 8, 9, 4, 5, 11, 12, 7, 2, 14]
    ],
    [
      [2, 12, 4, 1, 7, 10, 11, 6, 8, 5, 3, 15, 13, 0, 14, 9],
      [14, 11, 2, 12, 4, 7, 13, 1, 5, 0, 15, 10, 3, 9, 8, 6],
      [4, 2, 1, 11, 10, 13, 7, 8, 15, 9, 12, 5, 6, 3, 0, 14],
      [11, 8, 12, 7, 1, 14, 2, 13, 6, 15, 0, 9, 10, 4, 5, 3]
    ],
    [
      [12, 1, 10, 15, 9, 2, 6, 8, 0, 13, 3, 4, 14, 7, 5, 11],
      [10, 15, 4, 2, 7, 12, 9, 5, 6, 1, 13, 14, 0, 11, 3, 8],
      [9, 14, 15, 5, 2, 8, 12, 3, 7, 0, 4, 10, 1, 13, 11, 6],
      [4, 3, 2, 12, 9, 5, 15, 10, 11, 14, 1, 7, 6, 0, 8, 13]
    ],
    [
      [4, 11, 2, 14, 15, 0, 8, 13, 3, 12, 9, 7, 5, 10, 6, 1],
      [13, 0, 11, 7, 4, 9, 1, 10, 14, 3, 5, 12, 2, 15, 8, 6],
      [1, 4, 11, 13, 12, 3, 7, 14, 10, 15, 6, 8, 0, 5, 9, 2],
      [6, 11, 13, 8, 1, 4, 10, 7, 9, 5, 0, 15, 14, 2, 3, 12]
    ],
    [
      [13, 2, 8, 4, 6, 15, 11, 1, 10, 9, 3, 14, 5, 0, 12, 7],
      [1, 15, 13, 8, 10, 3, 7, 4, 12, 5, 6, 11, 0, 14, 9, 2],
      [7, 11, 4, 1, 9, 12, 14, 2, 0, 6, 10, 13, 15, 3, 5, 8],
      [2, 1, 14, 7, 4, 10, 8, 13, 15, 12, 9, 0, 3, 5, 6, 11]
    ]
  ]
  let res = []
  groupEK.forEach((item, index) => {
    let i = parseInt((item[0] + item[5]), 2);
    let j = parseInt(item.slice(1, 5), 2);
    res.push(SBoxValue[index][i][j].toString(2).padStart(4, '0'))
  })
  if (store.getters.con) console.log('S盒运算，第' + n + '轮:', groupEK, '=>：', res.join(''))
  return res.join('')
};

/**
 * @param SRes S盒处理结果，32bit
 * @param n 轮数(1-16)
 * @return {String} 32bit
 * @description 置换P
 * */
export const P = (SRes, n) => {
  let map = [
    16, 7, 20, 21, 29, 12, 28, 17,
    1, 15, 23, 26, 5, 18, 31, 10,
    2, 8, 24, 14, 32, 27, 3, 9,
    19, 13, 30, 6, 22, 11, 4, 25,
  ]
  let SArr = SRes.split('')
  let resArr = []
  map.forEach(item => {
    resArr.push(SArr[item - 1])
  })
  if (store.getters.con) console.log('第' + n + '轮S盒结果P置换:', SRes, '=>：', resArr.join(''))
  return resArr.join('')
};

/**
 * @param m 经过16轮处理左右互换 64bit
 * @return {Object} C 64bit密文
 * @description 逆初始置换
 * */
export const IP_1 = (m) => {
  let k = [
    40, 8, 48, 16, 56, 24, 64, 32,
    39, 7, 47, 15, 55, 23, 63, 31,
    38, 6, 46, 14, 54, 22, 62, 30,
    37, 5, 45, 13, 53, 21, 61, 29,
    36, 4, 44, 12, 52, 20, 60, 28,
    35, 3, 43, 11, 51, 19, 59, 27,
    34, 2, 42, 10, 50, 18, 58, 26,
    33, 1, 41, 9, 49, 17, 57, 25,
  ]
  let mArr = m.split('')
  let resArr = []
  k.forEach(item => {
    resArr.push(mArr[item - 1])
  })
  if (store.getters.con) console.log('初始置换IP:', m, '=>：', resArr.join(''))
  return resArr.join('')
};

/**
 * @param type 0加密 1解密
 * @param Key 密钥
 * @param M 需要加密的明文/需要解密的密文
 * @return {Object} C 64bit密文
 * @description 逆初始置换
 * */
export const cryptogram = (type = 0, Key, M) => {
  let keyBin = toBin(Key) //密钥转64位二进制k
  let kPC_1 = PC_1(keyBin) //PC_1置换密钥
  let mBin = type === 0 ? toBin(M) : M //明文M转64位二进制m
  let mIP = IP(mBin); //初始置换IP(m)
  let KArr = []
  //子密钥处理
  let CArr = []
  let DArr = []
  for (let i = 0; i < 16; i++) {
    if (i === 0) {
      CArr.push(hLeft(kPC_1['C0'], i + 1))
      DArr.push(hLeft(kPC_1['D0'], i + 1))
    } else {
      CArr.push(hLeft(CArr[i - 1], i + 1))
      DArr.push(hLeft(DArr[i - 1], i + 1))
    }
    KArr.push(PC_2(CArr[i] + DArr[i], i + 1)) //PC-2置换 //56->48位子密钥
  }
  //报文处理
  let RArr = []
  let LArr = []
  for (let i = 0; i < 16; i++) {
    if (i === 0) {  //报文每轮的加密处理
      LArr.push(mIP['R0']) //32位报文
      let groupEK = group(XOR(E(mIP['R0'], i + 1), KArr[type === 0 ? i : 15 - i], i + 1), 6) //48位分8组
      let fRK = P(SBox(groupEK, i + 1), i + 1)
      RArr.push(XOR(mIP['L0'], fRK, i + 1)) //处理
    } else {
      LArr.push(RArr[i - 1]) //32位报文
      let groupEK = group(XOR(E(RArr[i - 1], i + 1), KArr[type === 0 ? i : 15 - i], i + 1), 6) //48位分8组
      let fRK = P(SBox(groupEK, i + 1), i + 1) //f处理
      RArr.push(XOR(LArr[i - 1], fRK, i + 1)) //异或处理
    }
  }
  if (store.getters.con) console.log('经过16轮后，报文左右处理后分别为：', LArr[LArr["length"] - 1], RArr[RArr["length"] - 1])
  let MArr = RArr[RArr["length"] - 1] + LArr[LArr["length"] - 1]
  let C = type===0? IP_1(MArr) : toStr(IP_1(MArr))
  if (store.getters.con) console.warn(type === 0 ? '加密成功！' : '解密成功', M, '=>', C)
  return C;
}
