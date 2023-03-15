//引入express
const express = require('express');
const mysql = require("mysql");
const bodyparser = require('body-parser');

//创建应用对象
const app = express();
app.use(bodyparser.json())

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


// var sql = 'SELECT * FROM reply';

var currentConnection = 0;
const maxConnection = 3;

app.post('/server', (request, response) => {
    if (currentConnection >= maxConnection) {
        response.send(JSON.stringify({ code: 403, msg: "Server is full." }));
        return;
    }
    currentConnection++;
    let sql1 = 'SELECT answer FROM reply WHERE question=\"' + request.body.info + "\"";
    // let sql2 = 'UPDATE reply SET number=? where question=?'
    // let sqlParams = [2,"\""+request.body.info+"\""]
    // if(!JSON.stringify(result) == "[]"){
    //     connection.query(sql2,sqlParams,(err,result)=>{
    //         if(err) {
    //             console.log(err);
    //             return
    //         }           
    //         console.log(result); // 打印添加结果
    //     })
    // }
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

app.listen(8000, () => {
    console.log("服务已启动，8000端口监听中...");
})