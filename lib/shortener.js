const fetch = require('node-fetch')
module.exports = shortener = (url) => new Promise((resolve, reject) => {
    console.log('Creating short url...')
    fetch(`https://tinyurl.com/api-create.php?url=${url}`)
        .then(response => response.text())
        .then(json => {
            resolve(json)
        })
        .catch((err) => {
            reject(err)
        })
})
