let modelControl = require("./modelControl");
let historyFile = require("./historyFile");
let config = require("../config/config");


class Operate {
    constructor() {
        this.operateList = [
            "模型选择",
            "查看历史记录",
            // "新开对话",
            // "继续上一次对话",
        ]
    }

    operateStrHandle() {
        let operateStr = "操作列表\n";

        let operateList = this.operateList;

        for (let i = 0; i < operateList.length; i++) {
            const e = operateList[i];
            operateStr = operateStr + "  " + i + ": " + e + "\n"
        }

        operateStr += "请输入序号进行选择(回车确认): "

        return operateStr
    }

    operateSelect(read, question) {

        let operateStr = this.operateStrHandle();
        let operateList = this.operateList;

        let _self = this
        read.question(operateStr, (answer) => {

            if (isNaN(answer)) {
                console.log("请输入正确的操作序号");
                _self.operateSelect(read, question)
                return
            }

            if (Number(answer) > operateList.length - 1) {
                console.log("请输入正确的操作序号");
                _self.operateSelect(read, question)
                return
            }

            switch (answer) {
                case "0":

                    let modelList = config.model;

                    let modelStr = modelControl.modelStrHandle(modelList)

                    modelControl.modelSelect(read, modelStr, question, modelList)

                    break;

                case "1":

                    let dirsStr = historyFile.historyDateHandle();

                    if (!dirsStr) {
                        _self.operateSelect(read, question);
                        return
                    }

                    historyFile.historyDateSelect(read, dirsStr, question)


                    break;

                default:
                    break;
            }

        });
    }
}

let operate = new Operate();

module.exports = operate