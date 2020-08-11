const fetch = require('node-fetch')

exports.getBase64 = getBase64 = (url) => new Promise((resolve, reject) => {
    fetch(url, { headers: { 'User-Agent': 'okhttp/4.5.0' } })
        .then((response) => response.buffer())
        .then((result) => {
            const videoBase64 = `data:${result.headers.get('content-type')};base64,` + result.toString('base64')
            if (result) resolve(videoBase64)
        }).catch((err) => {
            console.error(err)
            reject(err)
        })
})

exports.fetchJson = fetchJson = (url, options) => new Promise((resolve, reject) => {
    fetch(url, options)
        .then(response => response.json())
        .then(json => {
            resolve(json)
        })
        .catch((err) => {
            console.error(err)
            reject(err)
        })
})

exports.fetchText = fetchText = (url, options) => new Promise((resolve, reject) => {
    fetch(url, options)
        .then(response => response.text())
        .then(text => {
            resolve(text)
        })
        .catch((err) => {
            console.error(err)
            reject(err)
        })
})

exports.fetchMeme = fetchMeme = () => new Promise((resolve, reject) => {
    const subreddit = ['dankmemes', 'wholesomeanimemes', 'wholesomememes', 'AdviceAnimals', 'MemeEconomy', 'memes', 'terriblefacebookmemes', 'teenagers', 'historymemes']
    const randSub = subreddit[Math.random() * subreddit.length | 0]
    console.log('looking for memes on ' + randSub)
    fetch('https://meme-api.herokuapp.com/gimme/' + randSub)
        .then(response => response.json())
        .then((result) => {
            resolve(result)
        }).catch((err) => {
            console.error(err)
            reject(err)
        })
})
