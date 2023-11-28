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
