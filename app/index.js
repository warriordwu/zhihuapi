const Koa = require('koa');
const koaBody = require('koa-body');
const koaStatic = require('koa-static');
const error = require('koa-json-error');
const parameter = require('koa-parameter');
const mongoose = require('mongoose');
const path = require('path');
const app = new Koa();
const routing = require('./routes');
const { connectionStr } = require('./config');

mongoose.connect(connectionStr, { useNewUrlParser: true }, () => console.log('MongoDB 连接成功了！')); // monggo 连接数据库
mongoose.connection.on('error', console.error); // monggose 错误处理

app.use(koaStatic(path.join(__dirname, 'public')));// 静态资源中间件
app.use(error({
  postFormat: (e, { stack, ...rest }) => process.env.NODE_ENV === 'production' ? rest : { stack, ...rest } // 生产环境不返回堆栈信息
}));
app.use(koaBody({
  multipart: true, // 支持文件上传
  formidable: {
    uploadDir: path.join(__dirname, '/public/uploads'),// 设置文件上传路径
    keepExtensions: true, // 保持文件的后缀
  },
}));
app.use(parameter(app)); // 校验请求参数
routing(app);// 路由

app.listen(3000, () => console.log('程序启动在 3000 端口了'));