/* eslint-disable prefer-promise-reject-errors */
const TikTokScraper = require('tiktok-scraper')
const { fetchJson } = require('./fetcher')
const util = require('util')
const videoUrlLink = require('video-url-link')
const igGetInfo = util.promisify(videoUrlLink.instagram.getInfo)
const twtGetInfo = util.promisify(videoUrlLink.twitter.getInfo)

const tiktok = (url) => new Promise((resolve, reject) => {
    TikTokScraper.getVideoMeta(url, { noWaterMark: true, hdVideo: true })
        .then(async (result) => {
            console.log('Get Video From', '@' + result.authorMeta.name, 'ID:', result.id)
            if (result.videoUrlNoWaterMark !== '') {
                result.url = result.videoUrlNoWaterMark
                result.NoWaterMark = true
            } else {
                result.url = result.videoUrl
                result.NoWaterMark = false
            }
            resolve(result)
        }).catch((err) => {
            console.error(err)
            reject(err)
        })
})

const instagram = (url) => new Promise((resolve, reject) => {
    console.log('Get Instagram video metadata....')
    igGetInfo(url, {})
        .then((result) => {
            const media = result.list.filter((x) => x.video !== undefined)
            if (!media[0]) return reject('Not a video')
            console.log('Found ' + media.length + ' video')
            resolve(media)
        }).catch((err) => {
            console.error(err)
            reject(err)
        })
})

const twitter = (url) => new Promise((resolve, reject) => {
    console.log('Get Twitter video metadata....')
    twtGetInfo(url, {})
        .then((content) => {
            resolve(content)
        })
        .catch((err) => {
            console.error(err)
            reject(err)
        })
})

const facebook = (url) => new Promise((resolve, reject) => {
    console.log('Get Facebook video metadata....')
    const keepsaveit = 'http://keepsaveit.com/api/'
    const apikey = '3tgDBIOPAPl62b0zuaWNYog2wvRrc4V414AjMi5zdHbU4a'
    fetchJson(keepsaveit + '?api_key=' + apikey + '&url=' + url, { method: 'GET' })
        .then((result) => {
            const key = result.code
            switch (key) {
            case 212:
                return reject('Access block for you, You have reached maximum 5 limit per minute hits, please stop extra hits.')
            case 101:
                return reject('API Key error : Your access key is wrong')
            case 102:
                return reject('Your Account is not activated.')
            case 103:
                return reject('Your account is suspend for some resons.')
            case 104:
                return reject('API Key error : You have not set your api_key in parameters.')
            case 111:
                return reject('Full access is not allow with DEMO API key.')
            case 112:
                return reject('Sorry, Something wrong, or an invalid link. Please try again or check your url.')
            case 113:
                return reject('Sorry this website is not supported.')
            case 404:
                return reject('The link you followed may be broken, or the page may have been removed.')
            case 405:
                return reject('You can\'t download media in private profile. Looks like the video you want to download is private and it is not accessible from our server.')
            default:
                return resolve(result)
            }
        }).catch((err) => {
            console.error(err)
            reject(err)
        })
})

module.exports = {
    tiktok,
    instagram,
    twitter,
    facebook
}
