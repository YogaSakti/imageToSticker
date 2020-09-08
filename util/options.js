/**
 * Get Client Options
 * @param  {Boolean} headless
 */

module.exports = options = (headless) => {
    let execPath

    if (process.platform === 'win32' || process.platform === 'win64') {
        execPath = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
    } else if (process.platform === 'linux') {
        execPath = '/usr/bin/google-chrome-stable'
    } else if (process.platform === 'darwin') {
        execPath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    }

    const options = {
        headless: headless,
        executablePath: execPath,
        qrRefreshS: 10,
        qrTimeout: 0,
        authTimeout: 0,
        autoRefresh: true,
        killProcessOnBrowserClose: true,
        cacheEnabled: false,
        chromiumArgs: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--aggressive-cache-discard',
            '--disable-cache',
            '--disable-application-cache',
            '--disable-offline-load-stale-cache',
            '--disk-cache-size=0',
        ]
    }

    return options
}
