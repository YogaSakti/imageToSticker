const TikTokScraper = require('tiktok-scraper');
const { getBase64, fetchJson, fetchText } = require("./fetcher");
const util = require('util');
const videoUrlLink = require('video-url-link');
const igGetInfo = util.promisify(videoUrlLink.instagram.getInfo);
const twtGetInfo = util.promisify(videoUrlLink.twitter.getInfo);

const tiktok = (url) => new Promise(async (resolve, reject) => {
    await TikTokScraper.getVideoMeta(url, { noWaterMark: true, hdVideo: true })
        .then((result) => {
            console.log('Get Video From', '@' + result.authorMeta.name, 'ID:', result.id)
            if (result.videoUrlNoWaterMark !== '') {
                result.url = result.videoUrlNoWaterMark
                result.NoWaterMark = true
                resolve(result)
            } else {
                result.url = result.videoUrl
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
                const media = result.list.filter((x) => x.video !== undefined)
                if (!media[0]) return reject('Not a video')
                console.log('Found ' + media.length + ' video')
                resolve(media)
            }).catch((err) => {
                reject(err)
            });
    })

const twitter = (url) => new Promise(async (resolve, reject) => {
    await twtGetInfo(url, {})
        .then((content) => {
            // console.log(content)
            resolve(content)
        })
        .catch((err) => {
            reject(err)
        })
})

const facebook = (fburl) => new Promise(async (resolve, reject) => {
    const getvid = 'https://fastvid.com/service.php'
    await fetchText(getvid, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/javascript, */*;',
                'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4209.3 Mobile Safari/537.36',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
                'Origin': 'https://fastvid.com',
                'Referer': 'https://fastvid.com/'
            },
            redirect: 'follow',
            body: `url=${fburl}`
        })
        .then((res) => {
            let json = JSON.parse(res)
            if (json.type !== 'success') return reject(json.message)
            resolve({
                title: json.title,
                hd: json.hd_download_url,
                sd: json.sd_download_url
            })
        }).catch((err) => {
            reject(err)
        });
});

module.exports = { tiktok, instagram, twitter, facebook}