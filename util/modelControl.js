class ModelControl {
    constructor() {
        this.requestData = {
            model: "gpt-3.5-turbo",
            presence_penalty: 0,
            stream: true,
            temperature: 0.5,
            messages: []
        }
    }

    modelStrHandle(modelList) {
        let modelStr = "模型列表\n"

        for (let i = 0; i < modelList.length; i++) {
            const e = modelList[i];
            modelStr = modelStr + "  " + i + ": " + e + "\n"
        }

        modelStr += "请输入序号进行选择(回车确认): "

        return modelStr
    }

    modelSelect(read, modelStr, question, modelList) {
        let _self = this
        read.question(modelStr, (answer) => {

            if (isNaN(answer)) {
                console.log("请输入正确的模型序号");
                _self.modelSelect(read, modelStr, question, modelList)
                return
            }

            if (Number(answer) > modelList.length - 1) {
                console.log("请输入正确的模型序号");
                _self.modelSelect(read, modelStr, question, modelList)
                return
            }

            for (let k = 0; k < modelList.length; k++) {

                const j = modelList[k];

                if (answer == k) {
                    console.log("当前选择模型:" + j);
                    _self.setRequestData({
                        model: j
                    })
                    question()
                }

            }

        });
    }

    getRequestData() {
        return this.requestData
    }

    setRequestData(obj) {
        let _self = this
        for (const key in obj) {
            if (Object.hasOwnProperty.call(obj, key)) {
                const e = obj[key];
                _self.requestData[key] = e
            }
        }
    }

}

let modelControl = new ModelControl()

module.exports = modelControl