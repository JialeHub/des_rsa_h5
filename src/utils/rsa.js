import store from "@/store";

/**
 * @param n 被检测数
 * @param test_divisor 测试除数
 * @return Boolean
 * @description 判断是否为素数
 * */
export const prime = (n, test_divisor = 2) => {
  if (Math.sqrt(n) < test_divisor) return true;//开平方根
  else if (n % test_divisor === 0) return false;
  else return prime(n, test_divisor + 1) //递归检验
};

/**
 * @return Array 生成素数数组
 * @description 生成素数数组
 * */
export const prime_array = (start = 2, end = 99) => {
  let res = []
  for (let i = start; i <= end; i++) {
    if (prime(i)) res.push(i)
  }
  if (store.getters.con) console.log('[' + start + ',' + end + ']之间生成素数数组为：', res)
  return res
};

/**
 * @param
 * @return Number d
 * @description 根据e*d mod s = 1,找出d
 * */
export const find_d = (e, s, len = 100000000) => {
  for (let d = 0; d <= len; d++) {
    if ((e * d) % s === 1) {
      if (store.getters.con) console.log('e,s分别为： e=', e, ', s=', s, '；根据 (e*d) % s === 1 得到 d：', d)
      return d
    }
  }
};

/**
 * @param a
 * @param b
 * @param ori 记录原始数据，不用传
 * @return Number e
 * @description 求两个数的最大公约数
 * */
export const gcd = (a, b, ori) => {
  if (!ori) ori = {a, b}
  if (b === 0) {
    if (store.getters.con) console.log(ori.a + '和' + ori.b + '的最大公约数为：', a)
    return a
  } else return gcd(b, a % b, ori) //回调
};

/**
 * @param s
 * @param m 随机选取开头
 * @param n 随机选取结尾
 * @return Number e
 * @description 找出与s互质的数e
 * */
export const co_prime = (s, m = 1, n = 100) => {
  let e = NaN
  // eslint-disable-next-line no-constant-condition
  while (true) {
    e = Math.floor(Math.random() * (m - n) + n);
    if (gcd(e, s) === 1) break //如果最大公约数为1，则退出循环返回e
  }
  if (store.getters.con) console.log('与' + s + '互质的数e为：', e)
  return e
};

/**
 * @param m
 * @param d
 * @param n
 * @return Number e
 * @description 求(m^d)%n，大数幂取模
 * */
export const bigint_mod = (a, n, m, ori) => {
  if (!ori) ori = {a, n, m}
  let mod = 1;
  while (n) {
    if (n & 0x01) {
      mod = (mod * a) % m;
    }
    a = (a * a) % m;
    n >>= 1;
  }
  if (store.getters.con) console.log('(' + ori.a + ' ^ ' + ori.n + ')' + ' % ' + ori.m + ' = ', mod)
  return mod;
};

/**
 * @return Number d
 * @description 生成公钥和私钥
 * */
export const generate_pbk_pvk = (start = 2, end = 99) => {
  let primeArr = prime_array(start, end )
  let p = primeArr[Math.floor((Math.random() * primeArr.length))] //随机选取
  let q = primeArr[Math.floor((Math.random() * primeArr.length))] //随机选取
  if (store.getters.con) console.log("随机生成两个素数p和q分别为： p=", p, " q=", q)
  let n = p * q
  let s = (p - 1) * (q - 1)
  if (store.getters.con) console.log("n = p*q = ", n)
  let e = co_prime(s)
  let d = find_d(e, s)
  console.log("公钥: n=", n, "  e=", e)
  console.log("私钥: n=", n, "  d=", d)
  let jsonData = {
    publicKey: {n, e},
    privateKey: {n, d},
    allKey: {n, e, d},
  }
  console.log('JSON：', JSON.stringify(jsonData));
  return JSON.stringify(jsonData)
};


/**
 * @param M 明文
 * @param key 公钥{n:Number,e:Number}
 * @return Number B
 * @description 加密
 * */
export const encryption = (M, key) => {
  // let B = Math.pow(M,key['e']) % key['n'] //大整数无法直接运算，
  let B = bigint_mod(M, key['e'], key['n']) //大数幂求模
  if (store.getters.con) console.log('加密成功：' + M + ' => ' + B);
  return B
};


/**
 * @param m 密文
 * @param key 公钥{n:Number,d:Number}
 * @return Number d
 * @description 解密
 * */
export const decode = (m, key) => {
  // let C = Math.pow(m,key['d']) % key['n'] //大整数无法直接运算，
  let C = bigint_mod(m, key['d'], key['n']) //大数幂求模
  if (store.getters.con) console.log('解密成功：' + m + ' => ' + C);
  return C
};
