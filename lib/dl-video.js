const TikTokScraper = require('tiktok-scraper');
const { getBase64, fetchJson, fetchText } = require("./fetcher");
const util = require('util');
const videoUrlLink = require('video-url-link');
const { throws } = require('assert');
const igGetInfo = util.promisify(videoUrlLink.instagram.getInfo);
const twtGetInfo = util.promisify(videoUrlLink.twitter.getInfo);

const tiktok = (url) => new Promise(async (resolve, reject) => {
    await TikTokScraper.getVideoMeta(url, { noWaterMark: true, hdVideo: true })
        .then(async (result) => {
            console.log('Get Video From', '@' + result.authorMeta.name, 'ID:', result.id)
            if (result.videoUrlNoWaterMark !== '') {
                result.urlbase64 = await getBase64(result.videoUrlNoWaterMark)
                result.NoWaterMark = true
                resolve(result)
            } else {
                result.urlbase64 = await getBase64(result.videoUrl)
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

// const facebook = (fburl) => new Promise(async (resolve, reject) => {
//     const getvid = 'https://fastvid.com/service.php'
//     await fetchText(getvid, {
//             method: 'POST',
//             headers: {
//                 'Accept': 'application/json, text/javascript, */*;',
//                 'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4209.3 Mobile Safari/537.36',
//                 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
//                 'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
//                 'Origin': 'https://fastvid.com',
//                 'Referer': 'https://fastvid.com/'
//             },
//             redirect: 'follow',
//             body: `url=${fburl}`
//         })
//         .then((res) => {
//             let json = JSON.parse(res)
//             if (json.type !== 'success') return reject(json.message)
//             resolve({
//                 title: json.title,
//                 hd: json.hd_download_url,
//                 sd: json.sd_download_url
//             })
//         }).catch((err) => {
//             reject(err)
//         });
// });

const facebook = (url) => new Promise(async (resolve, reject) => {
    const keepsaveit = 'http://keepsaveit.com/api/'
    const apikey = '3tgDBIOPAPl62b0zuaWNYog2wvRrc4V414AjMi5zdHbU4a'
    await fetchJson(keepsaveit + '?api_key=' + apikey + '&url=' + url, {
            method: 'GET'
        })
        .then((result) => {
            const key = result.code
            switch (key) {
                case 200:
                    return resolve(result)
                    break;
                case 212:
                    return reject('Access block for you, You have reached maximum 5 limit per minute hits, please stop extra hits.')
                    break;
                case 101:
                    return reject('API Key error : Your access key is wrong')
                    break;
                case 102:
                    return reject('Your Account is not activated.')
                    break;
                case 103:
                    return reject('Your account is suspend for some resons.')
                    break;
                case 104:
                    return reject('API Key error : You have not set your api_key in parameters.')
                    break;
                case 111:
                    return reject('Full access is not allow with DEMO API key.')
                    break;
                case 112:
                    return reject('Sorry, Something wrong, or an invalid link. Please try again or check your url.')
                    break;
                case 113:
                    return reject('Sorry this website is not supported.')
                    break;
                case 404:
                    return reject('The link you followed may be broken, or the page may have been removed.')
                    break;
                case 405:
                    return reject('You can\'t download media in private profile. Looks like the video you want to download is private and it is not accessible from our server.')
                    break;
            }
        }).catch((err) => {
            console.error(err)
            reject(err)
        });
    })

module.exports = { tiktok, instagram, twitter, facebook}