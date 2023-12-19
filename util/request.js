const http = require("http");
let config = require("../config/config");
let { hideLoading } = require("./loading");


// 判断是否是JSON格式的字符串
let isJSON = (str) => {
  try {
    JSON.parse(str);
    return true;
  } catch (error) {
    return false;
  }
};

// 获取GPT返回的数据并进行处理打印
let getChatGPTMsg = (requestData, success, error, question) => {
  const options = {
    hostname: config.hostname,
    port: config.port,
    path: config.path,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(JSON.stringify(requestData)),
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      Authorization: config.apiKey,
    },
  };

  const req = http.request(options, (res) => {
    res.setEncoding("utf8");

    // 用于存储ondata响应的数据 不存储起来变量容易被抢占
    let arr = [];

    // 用于判断ondata响应的数据到哪个位置了
    let idx = 1;

    // 用于定时在控制台输出 实现打字机效果
    let strArr = [];

    // 用于判断打字机打字到哪个位置
    let strArrIdx = 0;

    // 用于抛出写入文件使用
    let resStr = "";

    let writeStr = setInterval(() => {

      // 自定义结束的值 用于判断结束打字机
      if (strArr[strArrIdx] == "status:END") {
        process.stdout.write("\n");
        clearInterval(writeStr);
        question();
        return;
      }

      if (strArrIdx >= strArr.length) {
        return;
      }

      if (strArrIdx < strArr.length) {
        process.stdout.write(strArr[strArrIdx]);
      }

      strArrIdx++;
    }, 100);

    res.on("data", (data) => {

      if (strArr.length == 0) {
        // 隐藏loading
        hideLoading()
      }

      // 目前没有用到 先留做备用
      let str = "";

      arr = arr.concat(data.split("data:"));

      for (let i = idx; i < arr.length; i++) {
        let e = arr[i];

        idx = i + 1;

        if (isJSON(e)) {
          let chunk = JSON.parse(e);
          if (chunk.choices[0].finish_reason != "stop") {
            let content = chunk.choices[0].delta.content;
            if (content) {
              str += content;
              resStr += content;
              strArr.push(content);
            }
          }

          if (chunk.choices[0].finish_reason == "stop") {
            // 自定义结束的值 用于判断结束打字机
            strArr.push("status:END");
            success(resStr);
          }
        }
      }
    });
  });

  req.on("error", (e) => {
    error(e.message);
  });

  req.write(JSON.stringify(requestData));
  req.end();
};

module.exports = getChatGPTMsg;
