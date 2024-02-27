/*
 1. 為每一台設備準備兩個端口 port & bp-port
 2. 檢查端口是否被占用 netstat -ano | findstr {port}
 3. 利用多線程去分別為每一台設備啟動2個線程
 4. 使用docker去執行每個appium分散運算力, 任務結束後 kill docker
*/ 
const { spawn, exec, execSync } = require('child_process');

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
function getDevicesInfo(){
    try{
        let devices;
        let devices_infomation = [];
        let platform_version;
        
        exec('adb devices', {
            encoding: "utf-8"
        }, (err, result) => {
            devices = result.trim().split('\n')
            devices.shift()
            console.log(`All devices : ${devices}`)
            devices.forEach(dev => {
                let device_name = dev.split('\t')[0];
                exec(`adb -s ${device_name} shell getprop ro.build.version.release`, (err, result) => {
                    platform_version = result.trim().split('\n')
                    console.log(`Platform Version: ${platform_version}`)
                })
            });
        })
    } catch (err) {
        console.log(err)
    }
    // runCommand('adb devices')
}

getDevicesInfo();

/* start device docker container */
// docker run --privileged -d -p xxxx:4723 -v /dev/bus/usb:/dev/bus/usb -- name xxxxxxx appium/appium
function startAppium(){

}

/* stop device docker container */
// docker stop xxxxxxx
function stopAppium(){

}

/* docker exec */
function restartADB(){

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
