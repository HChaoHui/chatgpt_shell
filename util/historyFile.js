const fs = require('fs');
const path = require('path');

let config = require("../config/config")

class HistoryFile {
    constructor() {
        this.historyPath = config.historyFilePath;
        this.nowDirName = "";
        this.nowFileName = "";
        this.initHistoryPath()
    }

    initHistoryPath() {
        this.createDir(this.historyPath)
    }

    createFile(name) {

        let newData = [];

        let jsonData = JSON.stringify(newData);

        // 获取今天的时间
        let nowDate = this.getNowDate();

        // 判断今天的文件夹是否存在 不存在则创建
        this.createDir(this.historyPath + "/" + nowDate);

        let filePath = path.join(__dirname, '../' + this.historyPath + "/" + nowDate, name + '.json');

        fs.writeFile(filePath, jsonData, 'utf8', (err) => {
            if (err) {
                console.error(err);
                return;
            }
        });

    }

    createDir(dirName) {

        let dirPath = path.join(__dirname, '../' + dirName)

        if (!fs.existsSync(dirPath)) {
            fs.mkdir(dirPath, (err) => {
                if (err) {
                    console.error(err);
                }
            })
        }

    }

    getNowDate() {
        const currentDate = new Date();

        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');

        const formattedDate = `${year}-${month}-${day}`;

        return formattedDate
    }

    getDirList() {
        let dirPath = path.join(__dirname, '../' + this.historyPath)

        try {
            const dirs = fs.readdirSync(dirPath);
            return dirs
        } catch (err) {
            console.error(err);
        }

    }

    historyDateHandle() {
        let dirStr = "请选择记录日期\n"

        let dirs = this.getDirList()

        if (dirs.length <= 0) {

            console.log("暂无历史记录, 请重新选择\n");

            return false
        }

        for (let i = 0; i < dirs.length; i++) {
            const e = dirs[i];
            dirStr = dirStr + "  " + i + ": " + e + "\n"
        }

        dirStr += "请输入序号进行选择(回车确认): "

        return dirStr
    }

    historyDateSelect(read, dirsStr, question) {
        let _self = this
        let dirs = this.getDirList()
        read.question(dirsStr, (answer) => {

            if (isNaN(answer)) {
                console.log("请输入正确的日期序号");
                _self.historyDateSelect(read, dirsStr, question)
                return
            }

            if (Number(answer) > dirs.length - 1) {
                console.log("请输入正确的日期序号");
                _self.historyDateSelect(read, dirsStr, question)
                return
            }

            for (let k = 0; k < dirs.length; k++) {

                const j = dirs[k];

                if (answer == k) {
                    console.log("当前选择日期:" + j);
                    _self.historyFileNameSelect(read, j, question, dirsStr)
                }

            }

        });
    }

    getFileNameList(dirName) {
        let filePath = path.join(__dirname, '../' + this.historyPath + "/" + dirName)

        try {
            const files = fs.readdirSync(filePath);
            return files
        } catch (err) {
            console.error(err);
        }

    }

    historyFilesNameHandle(files) {

        let filesStr = "请选择记录文件\n"

        if (files.length <= 0) {

            console.log("该日期暂无记录, 请重新选择\n");

            return false
        }

        for (let i = 0; i < files.length; i++) {
            const e = files[i];
            filesStr = filesStr + "  " + i + ": " + e + "\n"
        }

        filesStr += "请输入序号进行选择(回车确认): "

        return filesStr
    }

    historyFileNameSelect(read, dirName, question, dirsStr) {

        let _self = this

        let files = this.getFileNameList(dirName);

        let filesStr = this.historyFilesNameHandle(files)

        if (!filesStr) {
            _self.historyDateSelect(read, dirsStr, question)
        }

        read.question(filesStr, (answer) => {

            if (isNaN(answer)) {
                console.log("请输入正确的记录序号");
                _self.historyFileNameSelect(read, dirName, question)
                return
            }

            if (Number(answer) > files.length - 1) {
                console.log("请输入正确的记录序号");
                _self.historyFileNameSelect(read, dirName, question)
                return
            }

            for (let k = 0; k < files.length; k++) {

                const j = files[k];

                if (answer == k) {
                    console.log("当前选择得文件记录为:" + j);
                    console.log("现已承接上下文, 若需要查看详细记录内容，请去对应文件夹查看");

                    let messages = this.readHistoryFile(dirName, j)

                    question(messages)
                    // _self.historyFileNameSelect(read, j, question)
                }

            }

        });

    }

    readHistoryFile(dirName, fileName) {

        this.nowDirName = dirName;
        this.nowFileName = fileName

        let filePath = path.join(__dirname, '../' + this.historyPath + "/" + dirName + "/" + fileName)

        try {
            // 读取JSON文件
            const data = fs.readFileSync(filePath, 'utf8');

            // 解析JSON数据
            const jsonData = JSON.parse(data);

            return jsonData

        } catch (err) {
            console.error(err);
        }
    }

    writeHistoryFile(messages) {

        if (!this.nowFileName) {

            // 获取今天的时间
            let nowDate = this.getNowDate();

            // 判断今天的文件夹是否存在 不存在则创建
            this.createDir(this.historyPath + "/" + nowDate);

            this.nowDirName = nowDate;

            this.nowFileName = messages[0].content + ".json";
        }

        let filePath = path.join(__dirname, '../' + this.historyPath + "/" + this.nowDirName + "/" + this.nowFileName)

        const jsonData = JSON.stringify(messages);

        try {

            fs.writeFileSync(filePath, jsonData);

        } catch (err) {
            console.error('写入JSON文件时出错：', err);
        }

    }

}

let historyFile = new HistoryFile();

module.exports = historyFile