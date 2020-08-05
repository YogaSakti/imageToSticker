const TikTokScraper = require('tiktok-scraper');
const { getBase64 } = require("./fetcher");
const util = require('util');
const videoUrlLink = require('video-url-link');
const igGetInfo = util.promisify(videoUrlLink.instagram.getInfo);
const twtGetInfo = util.promisify(videoUrlLink.twitter.getInfo);

const tiktok = (url) => new Promise(async (resolve, reject) => {
    await TikTokScraper.getVideoMeta(url, { noWaterMark: true, hdVideo: true })
        .then(async (result) => {
            console.log('Get Video From', '@' + result.authorMeta.name, 'ID:', result.id)
            const fileName = result.authorMeta.name + '.' + result.id + '.mp4'
            if (result.videoUrlNoWaterMark !== '') {
                const redEmperor1337 = await getBase64(result.videoUrlNoWaterMark)
                result.fileName = fileName
                result.videobase64 = redEmperor1337
                result.NoWaterMark = true
                resolve(result)
            } else {
                const redEmperor1337 = await getBase64(result.videoUrl)
                result.fileName = fileName
                result.videobase64 = redEmperor1337
                result.NoWaterMark = false
                resolve(result)
            }
        }).catch((err) => {
            reject(err)
        });
})

const instagram = (url) => new Promise(async (resolve, reject) => {
        await igGetInfo(url, {})
            .then((result) => {
                const videoLink = result.list.map(x => x.video)
                if (!videoLink[0]) return reject('Not a video')
                console.log('Found ' + videoLink.length + ' video')
                resolve(videoLink)
            }).catch((err) => {
                reject(err)
            });
    })

const twitter = (url) => new Promise(async (resolve, reject) => {
    await twtGetInfo(url, {})
        .then((content) => {
            resolve(content.variants)
        })
        .catch((err) => {
            reject(err)
        })
})

module.exports = { tiktok, instagram, twitter}

// tiktok('https://www.tiktok.com/@mlly27/video/6852548044492180738')