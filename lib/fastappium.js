/*
 1. 為每一台設備準備兩個端口 port & bp-port
 2. 檢查端口是否被占用 netstat -ano | findstr {port}
 3. 利用多線程去分別為每一台設備啟動2個線程
 4. 使用docker去執行每個appium分散運算力, 任務結束後 kill docker
*/ 

const console = require('console');
const util = require('util');
/* allow return promise function */
const exec = util.promisify(require('child_process').exec);
const spawn = require('child_process').spawn;
const {remote} = require('webdriverio');

class Device{
    constructor(name, device_name){
        this.name = name;
        this.device_name = device_name;
    }
}

class Bank{
    
}

/* check port if occupied or not */ 
function checkPort(){

}

async function runCommand(cmd) {
    try {
      const { stdout, stderr } = await exec(cmd);
      console.log('stdout:', stdout._events.data.stdout);
    //   console.error('stderr:', stderr);
    } catch (err) {
    //   console.error(err);
    }
}


/* get current devices all information */
/* xxxxx: { xxxxx: { xxxxx: { xxxxx: { xxxxx:}
            */
async function getDevicesInfo(){
    try{
        let devices;
        let devices_infomations = {};
        let devices_infomation = {
            desired_caps:{}
        };
        let platform_version;
        
        const {stdout, stderr} = await exec('adb devices', {
            encoding: "utf-8"
        })
        devices = stdout.trim().split('\n')
        devices.shift()
        for (let i = 0; i < devices.length; i++){
            let device_name = devices[i].split('\t')[0];
            const {stdout, stderr} = await exec(`adb -s ${device_name} shell getprop ro.build.version.release`)
            platform_version = stdout.trim().split('\n')[0]
            devices_infomation.desired_caps.platformVersion = platform_version;
            devices_infomation.desired_caps.deviceName = device_name;
            devices_infomation.desired_caps.platformName = 'Android';
            devices_infomation.desired_caps.automationName = 'UiAutomator2';
            devices_infomations[device_name] = devices_infomation;
        }
        return devices_infomations;
    } catch (err) {
        console.log(err)
    }
}

/* get current devices all information */
async function getCurrentPageActivity(device_name){
    try{
        let devices;
        let page_activity;
        
        const {stdout, stderr} = await exec(`adb -s ${device_name} shell dumpsys activity top | grep ACTIVITY`, {
            encoding: "utf-8"
        })
        console.log('stdout:', stdout);
        devices = stdout.trim().split('\n')
        devices.shift()
    } catch (err) {
        console.log(err)
    }
}

/* get appium page source */
async function getPageSource(driver){
    try{
        const { writeFileSync } = require('fs');

        const { XMLParser, XMLBuilder, XMLValidator} = require("fast-xml-parser");
        const parser = new XMLParser();
        let source = await driver.getPageSource();    

        let jObj = parser.parse(source);
        
        // try {
        //     const batteryItem = await driver.$('//*[@text="Battery"]');
        //     await batteryItem.click();            
        // } finally {
        //     await driver.pause(1000);
        //     await driver.deleteSession();
        // }
        console.log(jObj);
        writeFileSync("./xml.json", JSON.stringify(jObj), 'utf8');
        console.log('Data successfully saved to disk'); 
        return source;
    } catch (err){
        console.log(err)
    }
}

async function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}


async function getData(){
    let data = await getDevicesInfo();
    console.log(data)
    let key = Object.keys(data);
    console.log(`device name info: ${key}`)

    for (let i = 0; i < key.length; i++){
        // console.log(data[key[i]])
        getCurrentPageActivity(key[i]);
    }
    console.log("start data: ", data[key[0]])
    await startAppium(data[key[0]].desired_caps);
    await sleep(15000)
    const capabilities = {
        'appium:platformName': data[key[0]].desired_caps.platformName,
        'appium:automationName': data[key[0]].desired_caps.automationName,
        'appium:deviceName': data[key[0]].desired_caps.deviceName,
        'appium:platformVersion': data[key[0]].desired_caps.platformVersion, 
    };
      
    const wdOpts = {
        hostname: process.env.APPIUM_HOST || '127.0.0.1',
        port: parseInt(process.env.APPIUM_PORT, 10) || 4723,
        logLevel: 'info',
        capabilities,
    };
    const driver = await remote(wdOpts);
    await startScreenMirror(key[0]);
    await getPageSource(driver);
}

getData();

/* start device docker container */
// docker run --privileged -d -p xxxx:4723 -v /dev/bus/usb:/dev/bus/usb -- name xxxxxxx appium/appium
/* appium -p {port} -bp {bp_port} --device-name {device_name} --platform-version {platform_version} */
async function startAppium(caps,port=4723,isDocker=false){
    if(isDocker == false){
        let cmd = 'appium ' + ' --port ' + port + ' --allow-cors'
        console.log(cmd);
        // let cmd = 'appium';
        const child = spawn("CMD", [
            '/c',
            cmd,
        ], { shell: true, detached: true, encoding: "UTF-8" });
        child.on("exit", (code) => {
            console.log(`Child process exited with code ${code}`);
        });
        child.stdout.on("data", (data) => {
            console.log(`stdout: ${data}`);
        });
        child.stderr.on("data", (data) => {
            console.log(`stderr: ${data}`);
        });
    }
}


/* stop device docker container */
// docker stop xxxxxxx
function stopAppium(){

}

/* docker exec */
function restartADB(){

}

async function startScreenMirror(device_name){
    const { spawn } = require("child_process");
    console.log("device_name: ", device_name)
    const child = spawn("powershell", [
      "..\\scrcpy-win64-v2.0\\scrcpy.exe",
      "-s",
      device_name,
    ], {encoding: "UTF-8" });
    child.on("exit", (code) => {
        console.log(`Child process exited with code ${code}`);
    });
    child.stdout.on("data", (data) => {
        console.log(`stdout: ${data}`);
    });
    child.stderr.on("data", (data) => {
        console.log(`stderr: ${data}`);
    });
}

/* for TC scripts, Device.getMain() */
function getMain(){

}

/* for TC scripts */
function uploadTestData(){

}

/* for TC scripts */
function sendAai(){

}

/* for TC scripts */
function waitForImage(){

}

/* for TC scripts */
function analyzeText(){

}

/* check all docker containers, set timeout to terminate tasks */
function monitorContainer(){

}

// 付言編碼
function encodeNum(num) {
    var str = 'abcdefghijklmnopqrstuvwxyz'
    var res = '';
    num = num.toString();
    for (let i = 0; i < num.length; i++) {
        res += str[num[i]];
    }
    return res;
}
