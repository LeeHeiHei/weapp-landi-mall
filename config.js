/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
var host = 'https://api.it120.cc/lhh';

var config = {

  // 下面的地址配合云端 Demo 工作
  api: {
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
    sendTemplatMsg: `${host}/template-msg/put`,

    //获取广告列表
    getBannerList: `${host}/banner/list`,

    //获取分类列表
    getGoodsCategory: `${host}/shop/goods/category/all`,

    //获取公告
    getNotice: `${host}/notice/list`,
  }
};

module.exports = config;
