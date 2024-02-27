this.desired_caps = {
    'platformName': 'Android',  # 被测手机是安卓
    'platformVersion': platformVersion,  # 手机安卓版本
    'deviceName': deviceName,  # 设备名，安卓手机可以随意填写
    'appPackage': 'com.mobivans.onestrokecharge',  # 启动APP Package名称
    'appActivity': 'com.mobivans.onestrokecharge.activitys.MainActivity',  # 启动Activity名称
    'unicodeKeyboard': True,  # 使用自带输入法，输入中文时填True
    'resetKeyboard': True,  # 执行完程序恢复原来输入法
    'noReset': True,  # 不要重置App
    'newCommandTimeout': 60000,
    'udid': deviceName
    # 'automationName': 'UiAutomator1'
}

/* testing logic */
function business(){

}