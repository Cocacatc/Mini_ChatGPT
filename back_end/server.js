//引入express
const express = require('express');
const mysql = require("mysql");
const bodyparser = require('body-parser');
const { request } = require('express');
//创建应用对象
const app = express();
app.use(bodyparser.json())
//设置响应头
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Content-Type', 'application/json;charset=utf-8');
    next();
});
//链接数据库
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '@hjbj141737889',
    port: '3306',
    database: 'dialog_messag'
});
connection.connect();



var currentConnection = 0;
const maxConnection = 3;
var num = 0;
var id = 0;

app.post('/dialog', (request, response) => {
    //检测并发连接数，并返回报文
    if (currentConnection >= maxConnection) {
        response.send(JSON.stringify({ code: 403, msg: "Server is full." }));
        return;
    }
    currentConnection++;
    //获取number属性
    let sql3 = 'SELECT number FROM reply WHERE question=\"' + request.body.info + "\"";
    connection.query(sql3, (err, result) => {
        if (err) {
            console.log('[query]-:' + err);
        } else {
            if(JSON.stringify(result) == "[]"){
                return;
            }
            console.log(result);
            num = JSON.parse(JSON.stringify(result))[0].number + 1;
        }
    });
    //获取id属性
    let sql4 = 'SELECT id FROM reply WHERE question=\"' + request.body.info + "\"";
    connection.query(sql4, (err, result) => {
        if (err) {
            console.log('[query]-:' + err);
        } else {
            if(JSON.stringify(result) == "[]"){
                return;
            }
            console.log(result);
            id = (JSON.parse(JSON.stringify(result))[0].id);
            //更新number
            let sql2 = 'UPDATE reply SET number='+ num +' WHERE id=' + id;
            console.log(sql2);
            connection.query(sql2,(err,result)=>{
                if(err) {
                    console.log(err);
                    return
                }           
                console.log(result); // 打印添加结果
            })
        }
    });
    //返回消息
    let sql1 = 'SELECT answer FROM reply WHERE question=\"' + request.body.info + "\"";
    connection.query(sql1, (err, result) => {
        if (err) {
            console.log('[query]-:' + err);
        } else {
            if(JSON.stringify(result) == "[]"){
                result.push({answer:"Sorry,this question is not stored in database. QWQ"});
            }
            console.log(result);
            response.setHeader('Access-Control-Allow-Origin', '*');
            currentConnection--;
            response.send(JSON.stringify(result));
        }
    });
})

app.post('/data',(request,response) => {
    let sql1 = 'SELECT * FROM reply ';
    connection.query(sql1, (err, result) => {
        if (err) {
            console.log('[query]-:' + err);
        } else {
            console.log(result);
            response.setHeader('Access-Control-Allow-Origin', '*');
            response.send(JSON.stringify(result));
        }
    });
})

app.listen(8000, () => {
    console.log("服务已启动，8000端口监听中...");
})