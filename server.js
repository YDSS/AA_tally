const fs = require('fs');
const path = require('path');

const Koa = require("koa");
const app = new Koa();

const Router = require("koa-router");
const router = new Router();

const port = 3001;
const dataFilePath = path.resolve('public/consumeData.js');

// 添加账单数据的接口
router.post("/add", async function(ctx) {
    
});

// 更新账单数据的接口
router.get("update", async function(ctx) {
    
});

app.use(router.routes()).use(router.allowedMethods());
app.listen(port);
