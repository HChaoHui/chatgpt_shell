let loadingTime;

let showLoading = () => {
    let loader = ['|', '/', '-', '\\'];
    let i = 0;

    loadingTime = setInterval(() => {
        process.stdout.write('\r' + loader[i++]);
        i = i % loader.length;
    }, 200);
}

let hideLoading = () => {
    clearInterval(loadingTime); // 停止 loading 效果
    process.stdout.write('\r'); // 清除 loading 效果
}

module.exports = {
    showLoading,
    hideLoading
}

