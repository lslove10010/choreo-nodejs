const { execSync } = require("child_process");
const { existsSync } = require("fs");
const fs = require("fs");
const os = require("os");
const path = require("path");
const express = require("express");

const app = express(); // 创建 express 应用

// 日志记录函数
function logMessage(message) {
    const logFile = path.join(__dirname, "script.log");
    fs.appendFileSync(logFile, `[${new Date().toISOString()}] ${message}\n`);
    console.log(message);
}

// 第一步：查看系统架构
const arch = os.arch(); // 'x64', 'arm64'
const platform = os.platform(); // 'linux', 'darwin', 'win32'
logMessage(`系统架构：${arch}`);
logMessage(`系统平台：${platform}`);

// 根据架构选择对应的gost下载地址
const gostUrl = `https://github.com/go-gost/gost/releases/download/v3.0.0-nightly.20250218/gost_3.0.0-nightly.20250218_linux_amd64.tar.gz`;
const downloadPath = path.join(__dirname, "gost_3.0.0-nightly.20250218_linux_amd64.tar.gz");
const gostBinary = path.join(__dirname, "gost");

// 检测gost文件是否存在
if (!existsSync(gostBinary)) {
    logMessage("正在下载gost...");
    try {
        // 使用 wget 下载文件
        execSync(`wget -O ${downloadPath} ${gostUrl}`);
        logMessage("下载完成，正在解压...");
        // 解压下载文件
        execSync(`tar zxvf ${downloadPath}`);
        // 授予可执行权限
        execSync(`chmod +x gost`);
        logMessage("gost下载并解压完成，已授予可执行权限。");
    } catch (err) {
        logMessage(`下载或解压gost时发生错误：${err.message}`);
    }
} else {
    logMessage("gost二进制文件已存在，跳过下载步骤。");
}

// 无论gost文件是否存在，继续运行后面的代码
try {
    logMessage("正在安装pm2...");
    execSync("npm install pm2");
    logMessage("pm2安装完成。");

    // 使用 pm2 的完整路径
    const pm2Path = path.join(__dirname, "node_modules", ".bin", "pm2");
    logMessage("正在启动 gost-client...");
    execSync(`${pm2Path} start ./client.sh --name "gost-client" && ${pm2Path} save`);
    logMessage("gost-client 已通过 pm2 启动。");
} catch (err) {
    logMessage(`启动 gost-client 时发生错误：${err.message}`);
}

// 启动一个静态伪装页面
const staticFilePath = path.join(__dirname, "public");
app.use(express.static(staticFilePath)); // 提供静态文件服务

const PORT = 31000;
app.listen(PORT, () => {
    logMessage(`伪装页面正在运行在 http://localhost:${PORT}`);
});
