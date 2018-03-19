/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
var host = 'https://api.it120.cc/lhh';

var config = {

  // 下面的地址配合云端 Demo 工作
  service: {
    host,
    // 获取参数
    getValue: `${host}/config/get-value`,

    // 登录
    login: `${host}/user/wxapp/login`,

    // 验证Token
    checkToken: `${host}/user/check-token`,

    // 用户注册
    register: `${host}/user/wxapp/register/complex`,

    // 发送模板消息
    sendTemplatMsg: `${host}/template-msg/put`
  }
};

module.exports = config;
