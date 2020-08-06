const TikTokScraper = require('tiktok-scraper');
const { getBase64, fetchJson, fetchText } = require("./fetcher");
const util = require('util');
const cheerio = require('cheerio');
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

const facebook = (fburl) => new Promise(async (resolve, reject) => {
    const getvid = 'https://fbdown.net/download.php'
    await fetchText(getvid, {
            method: 'POST',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'user-agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4209.3 Mobile Safari/537.36',
                'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9'
            },
            redirect: 'follow',
            body: `URLz=${fburl}`
        })
        .then((text) => {
            const $ = cheerio.load(text)
            if (!$('a[id="hdlink"]').attr('href')) return reject('Url Error')
            resolve({
                hd: $('a[id="hdlink"]').attr('href'),
                sd: $('a[id="sdlink"]').attr('href')
            })
        }).catch((err) => {
            reject(err)
        });
});

module.exports = { tiktok, instagram, twitter, facebook}