const fetch = require('node-fetch')
/**
 * Get base64 from url
 * @param {String} url
 */
module.exports = getBase64 = (url) => new Promise((resolve, reject) => {
    fetch(url, { headers: { 'User-Agent': 'okhttp/4.5.0' } })
        .then((response) => response.buffer())
        .then((result) => resolve(`data:${result.headers.get('content-type')};base64,` + result.toString('base64')))
        .catch((err) => {
            console.error(err)
            reject(err)
        })
})
