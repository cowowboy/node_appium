const {remote} = require('webdriverio');

const capabilities = {
  'appium:platformName': 'Android',
  'appium:automationName': 'UiAutomator2',
  'appium:deviceName': 'ZDD69XBMEMCU6L7H',
  'appium:appPackage': 'com.android.settings',
  'appium:appActivity': '.Settings',
  'appium:platformVersion': '13',
};

const wdOpts = {
  hostname: process.env.APPIUM_HOST || '127.0.0.1',
  port: parseInt(process.env.APPIUM_PORT, 10) || 4723,
  logLevel: 'info',
  capabilities,
};

async function runTest() {
  const driver = await remote(wdOpts);
  let source = driver.getPageSource();
  // console.log(source)
  try {
    const batteryItem = await driver.$('//*[@text="Battery"]');
    await batteryItem.click();
  } finally {
    await driver.pause(1000);
    await driver.deleteSession();
  }
}

runTest().catch(console.error);