let readline = require("readline");

// 配置文件
let config = require("./config/config");

// 请求
let getChatGPTMsg = require("./util/request");

// 操作方法
let operate = require("./util/operate")

// 模型选择器
let modelControl = require("./util/modelControl");

// loading
let { showLoading } = require("./util/loading");

// 历史记录控制器
let historyFile = require("./util/historyFile");

// 对话框
let read = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})

// 消息记录存储
let messages = []

console.log('\x1b[36m', "欢迎使用ChatGPT终端版\n 作者: NOVCH");

let question = (msgs) => {

    // 为问题添加颜色
    console.log('\x1b[35m', "");

    if (msgs) {
        messages = msgs
    }

    if (config.isNewIn) {
        operate.operateSelect(read, question);
        config.isNewIn = false
    }

    read.question('请输入：', (e) => {

        if (e == "stop") {
            read.close();
            return
        }

        if (e == "操作") {
            operate.operateSelect(read, question);
            return
        }

        messages.push({
            "role": "user",
            "content": e
        })

        // 为答案添加颜色
        console.log("\x1b[32m", "");

        showLoading()

        get(messages)

    })
}

question()

read.on('close', function () {
    process.exit(0);
});


let get = (messages) => {

    modelControl.setRequestData({
        messages,
    })

    getChatGPTMsg(modelControl.getRequestData(), function (str) {
        messages.push({
            "role": "system",
            "content": str
        })
        historyFile.writeHistoryFile(messages)

    }, function (e) {
        console.error(`请求遇到问题：${e.message}`);
        get(messages)
    }, question)

}  