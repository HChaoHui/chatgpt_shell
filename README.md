# 基于NodeJs的ChatGPT命令行版本  
> node版本需 >= 18.16.0 小于版本需自测

1. 支持模型选择
2. 支持聊天记录存储
3. 支持选择聊天记录文件续聊

## 使用方法

1. clone 源码 `git clone https://github.com/HChaoHui/chatgpt_shell.git`  
2. cd chatgpt_shell
3. npm install
4. 打开config/config.js修改配置文件
```javascript

let config = {
  apiKey: "", // OpenAI Key
  baseUrl: "", // OpenAI URL 例如: https://api.openai.com/v1/chat/completions
  hostname: "", // OpenAI Host 例如: api.openai.com
  path: "", // OpenAI Path 例如: /v1/chat/completions
  port: "80", // 请求的端口
  model: [
    "gpt-4",
    "gpt-4-0314",
    "gpt-4-0613",
    "gpt-4-32k",
    "gpt-4-32k-0314",
    "gpt-4-32k-0613",
    "gpt-3.5-turbo",
    "gpt-3.5-turbo-0301",
    "gpt-3.5-turbo-0613",
    "gpt-3.5-turbo-1106",
    "gpt-3.5-turbo-16k",
    "gpt-3.5-turbo-16k-0613",
  ],
  historyFilePath: "history",
  isNewIn: true,
};

module.exports = config;


```
输入对应的参数、可以指定模型、历史文件夹目录
理论上中转的Key也可以使用

最后执行`npm run dev` 
