const { create, decryptMedia } = require('@open-wa/wa-automate')
const moment = require('moment')
const { tiktok, instagram, twitter, facebook } = require('./lib/dl-video')
const urlShortener = require('./lib/shortener')
const color = require('./lib/color')
const { fetchMeme } = require('./lib/fetcher')

const serverOption = {
    headless: true,
    qrRefreshS: 20,
    qrTimeout: 0,
    authTimeout: 0,
    autoRefresh: true,
    killProcessOnBrowserClose: true,
    cacheEnabled: false,
    chromiumArgs: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        // THIS MAY BREAK YOUR APP !!!ONLY FOR TESTING FOR NOW!!!
        '--aggressive-cache-discard',
        '--disable-cache',
        '--disable-application-cache',
        '--disable-offline-load-stale-cache',
        '--disk-cache-size=0'
    ]
}

const opsys = process.platform
if (opsys === 'win32' || opsys === 'win64') {
    serverOption.executablePath = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
} else if (opsys === 'linux') {
    serverOption.browserRevision = '737027'
} else if (opsys === 'darwin') {
    serverOption.executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
}

const startServer = async () => {
    create('Imperial', serverOption)
        .then(client => {
            console.log('[DEV] Red Emperor')
            console.log('[SERVER] Server Started!')
            // Force it to keep the current session
            client.onStateChanged(state => {
                console.log('[Client State]', state)
                if (state === 'CONFLICT') client.forceRefocus()
            })
            // listening on message
            client.onMessage((message) => {
                msgHandler(client, message)
            })
            // listening on Incoming Call
            // client.onIncomingCall((call) => {
            //     client.sendText(call.peerJid._serialized, 'Maaf, saya tidak bisa menerima panggilan.')
            // })
        })
}

async function msgHandler (client, message) {
    try {
        const { type, id, from, t, sender, isGroupMsg, chat, caption, isMedia, mimetype, quotedMsg } = message
        let { body } = message
        const { name } = chat
        let { pushname, verifiedName } = sender
        // verifiedName is the name of someone who uses a business account
        pushname = pushname || verifiedName
        const prefix = '#'
        body = (type == 'chat' && body.startsWith(prefix)) ? body : ((type == 'image' && caption) && caption.startsWith(prefix)) ? caption : ''
        const command = body.slice(prefix.length).trim().split(/ +/).shift().toLowerCase()
        const args = body.slice(prefix.length).trim().split(/ +/).slice(1)
        const isCmd = body.startsWith(prefix)
        const time = moment(t * 1000).format('DD/MM HH:mm:ss')
        if (!isCmd && !isGroupMsg) return console.log('[RECV]', color(time, 'yellow'), 'Message from', color(pushname))
        if (!isCmd && isGroupMsg) return console.log('[RECV]', color(time, 'yellow'), 'Message from', color(pushname), 'in', color(name))
        if (isCmd && !isGroupMsg) console.log(color('[EXEC]'), color(time, 'yellow'), color(`${command} (${args.length})`), 'from', color(pushname))
        if (isCmd && isGroupMsg) console.log(color('[EXEC]'), color(time, 'yellow'), color(`${command} (${args.length})`), 'from', color(pushname), 'in', color(name))

        // Checking function speed
        // const timestamp = moment()
        // const latensi = moment.duration(moment() - timestamp).asSeconds()
        const isUrl = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/gi)
        const uaOverride = 'WhatsApp/2.2029.4 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36'

        switch (command) {
        case 'tnc':
            client.sendText(from, 'This bot is an open-source program written in Javascript. \n\nBy using the bot you agreeing to our Terms and Conditions! \nWe do not store any of your data in our servers. We are not responsible for stickers that you create using bots, videos, images or other data that you get from this bot.')
            break
        case 'menu':
        case 'help': {
            const text = `Hi, ${pushname}! 👋️ \n\nUsable Commands!✨\n\n*Sticker Creator*\nCMD: #sticker\nDescription: Converts image into sticker, kirim gambar dengan caption #sticker atau balas gambar yang sudah dikirim dengan #sticker\n\nCMD: #sticker <url gambar>\nDescription: Converts image url into sticker\n\n*Gif Sticker*\nCMD : #gif Giphy URL\nDescription: Convert gif to sticker (but giphy only)\n\n*Downloader*\nCMD: #tiktok <post/video url>\nDescription: Return a Tiktok video\n\nCMD: #fb <post/video url>\nDescription: Return a Facebook video download link\n\nCMD: #ig <post/video url>\nDescription: Return a Instagram video download link\n\nCMD: #twt <post/video url>\nDescription: Return a Twitter video download link\n\n*Other*\nCMD: #tnc\nDescription: show the Terms and Conditions\n\nHope you have a great day!✨`
            client.sendText(from, text)
            break
        }
        case 'sticker':
        case 'stiker':
            if (isMedia) {
                const mediaData = await decryptMedia(message, uaOverride)
                const imageBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                await client.sendImageAsSticker(from, imageBase64)
            } else if (quotedMsg && quotedMsg.type == 'image') {
                const mediaData = await decryptMedia(quotedMsg)
                const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`
                await client.sendImageAsSticker(from, imageBase64)
            } else if (args.length == 1) {
                const url = args[0]
                if (!url.match(isUrl)) client.reply(from, 'Maaf, link yang kamu kirim tidak valid.', id)
                await client.sendStickerfromUrl(from, url)
                    .then((r) => {
                        if (!r && r !== undefined) client.sendText(from, 'Maaf, link yang kamu kirim tidak memuat gambar.')
                    })
            } else {
                client.reply(from, 'Tidak ada gambar! Untuk membuka daftar perintah kirim #menu', id)
            }
            break
        case 'gif':
        case 'stikergif':
        case 'stickergif':
        case 'gifstiker':
        case 'gifsticker':
            if (args.length == 1){
                const url = args[0]
                const isMediaGiphy = url.match(new RegExp(/https?:\/\/media.giphy.com\/media/, 'gi'));
                const isGiphy = url.match(new RegExp(/https?:\/\/(www\.)?giphy.com/, 'gi'));
                if(isGiphy){
                    const getGiphyCode = url.match(new RegExp(/(\/|\-)(?:.(?!(\/|\-)))+$/, 'gi'));
                    if(getGiphyCode){
                        let delChars = getGiphyCode[0].replace(/[-\/]/gi, "");
                        const smallGif = "https://media.giphy.com/media/"+delChars+"/giphy-downsized.gif";
                        await client.sendGiphyAsSticker(from, smallGif)
                        .catch((err) => {
                            console.log(err)
                        })
                    } else {
                        client.reply(from, "Gagal membuat sticker gif", id)
                    }
                } else if(isMediaGiphy){
                    const normalGif = url.match(new RegExp(/(giphy|source).(gif|mp4)/, 'gi'));
                    if(normalGif){
                        let smallGif = url.replace(normalGif[0], "giphy-downsized.gif")
                        await client.sendGiphyAsSticker(from, smallGif)
                        .catch((err) => {
                            console.log(err)
                        })
                    }
                } else {
                    client.reply(from, "Saat ini sticker gif hanya bisa menggunakan link giphy saja kak.", id)
                }
            }
            break
        case 'tiktok': {
            if (args.length !== 1) return client.reply(from, 'Maaf, link yang kamu kirim tidak valid', id)
            const url = args[0]
            if (!url.match(isUrl) && !url.includes('tiktok.com')) return client.reply(from, 'Maaf, link yang kamu kirim tidak valid', id)
            await client.sendText(from, '*Scraping Metadata...*')
            await tiktok(url)
                .then((videoMeta) => {
                    const filename = videoMeta.authorMeta.name + '.mp4'
                    const caps = `*Metadata:*\nUsername: ${videoMeta.authorMeta.name} \nMusic: ${videoMeta.musicMeta.musicName} \nView: ${videoMeta.playCount.toLocaleString()} \nLike: ${videoMeta.diggCount.toLocaleString()} \nComment: ${videoMeta.commentCount.toLocaleString()} \nShare: ${videoMeta.shareCount.toLocaleString()} \nCaption: ${videoMeta.text.trim() ? videoMeta.text : '-'} \n\nDonasi: kamu dapat membantuku beli dimsum dengan menyawer melalui https://saweria.co/donate/yogasakti atau mentrakteer melalui https://trakteer.id/red-emperor \nTerimakasih.`
                    client.sendFileFromUrl(from, videoMeta.url, filename, videoMeta.NoWaterMark ? caps : `⚠ Video tanpa watermark tidak tersedia. \n\n${caps}`, '', { headers: { 'User-Agent': 'okhttp/4.5.0' } })
                        .catch(err => console.log('Caught exception: ', err))
                }).catch(() => {
                    client.reply(from, 'Gagal mengambil metadata, link yang kamu kirim tidak valid', id)
                })
        }
            break
        case 'ig':
        case 'instagram': {
            if (args.length !== 1) return client.reply(from, 'Maaf, link yang kamu kirim tidak valid', id)
            const url = args[0]
            if (!url.match(isUrl) && !url.includes('instagram.com')) return client.reply(from, 'Maaf, link yang kamu kirim tidak valid', id)
            await client.sendText(from, '*Scraping Metadata...*')
            instagram(url)
                .then(async (videoMeta) => {
                    const content = []
                    for (let i = 0; i < videoMeta.length; i++) {
                        await urlShortener(videoMeta[i].video)
                            .then((result) => {
                                console.log('Shortlink: ' + result)
                                content.push(`${i + 1}. ${result}`)
                            }).catch((err) => {
                                client.sendText(from, 'Error, ' + err)
                            })
                    }
                    client.sendText(from, `Link Download:\n${content.join('\n')} \n\nDonasi: kamu dapat membantuku beli dimsum dengan menyawer melalui https://saweria.co/donate/yogasakti atau mentrakteer melalui https://trakteer.id/red-emperor \nTerimakasih.`)
                }).catch((err) => {
                    if (err == 'Not a video') return client.reply(from, 'Error, tidak ada video di link yang kamu kirim', id)
                    client.reply(from, 'Error, user private atau link salah', id)
                })
        }
            break
        case 'twt':
        case 'twitter': {
            if (args.length !== 1) return client.reply(from, 'Maaf, link yang kamu kirim tidak valid', id)
            const url = args[0]
            if (!url.match(isUrl) & !url.includes('twitter.com') || url.includes('t.co')) return client.reply(from, 'Maaf, url yang kamu kirim tidak valid', id)
            await client.sendText(from, '*Scraping Metadata...*')
            twitter(url)
                .then(async (videoMeta) => {
                    try {
                        if (videoMeta.type == 'video') {
                            const content = videoMeta.variants.filter(x => x.content_type !== 'application/x-mpegURL').sort((a, b) => b.bitrate - a.bitrate)
                            const result = await urlShortener(content[0].url)
                            console.log('Shortlink: ' + result)
                            client.sendFileFromUrl(from, content[0].url, 'TwitterVideo.mp4', `Link Download: ${result} \n\nDonasi: kamu dapat membantuku beli dimsum dengan menyawer melalui https://saweria.co/donate/yogasakti atau mentrakteer melalui https://trakteer.id/red-emperor \nTerimakasih.`)
                        } else if (videoMeta.type == 'photo') {
                            for (let i = 0; i < videoMeta.variants.length; i++) {
                                await client.sendFileFromUrl(from, videoMeta.variants[i], videoMeta.variants[i].split('/media/')[1], '')
                            }
                        }
                    } catch (err) {
                        client.sendText(from, 'Error, ' + err)
                    }
                }).catch(() => {
                    client.sendText(from, 'Maaf, link tidak valid atau tidak ada video di link yang kamu kirim')
                })
        }
            break
        case 'fb':
        case 'facebook': {
            if (args.length !== 1) return client.reply(from, 'Maaf, link yang kamu kirim tidak valid', id)
            const url = args[0]
            if (!url.match(isUrl) && !url.includes('facebook.com')) return client.reply(from, 'Maaf, url yang kamu kirim tidak valid', id)
            await client.sendText(from, '*Scraping Metadata...*')
            facebook(url)
                .then(async (videoMeta) => {
                    try {
                        const title = videoMeta.response.title
                        const thumbnail = videoMeta.response.thumbnail
                        const links = videoMeta.response.links
                        const shorts = []
                        for (let i = 0; i < links.length; i++) {
                            const shortener = await urlShortener(links[i].url)
                            console.log('Shortlink: ' + shortener)
                            links[i].short = shortener
                            shorts.push(links[i])
                        }
                        const link = shorts.map((x) => `${x.resolution} Quality: ${x.short}`)
                        const caption = `Text: ${title} \nLink Download: \n${link.join('\n')} \n\nDonasi: kamu dapat membantuku beli dimsum dengan menyawer melalui https://saweria.co/donate/yogasakti atau mentrakteer melalui https://trakteer.id/red-emperor \nTerimakasih.`
                        client.sendFileFromUrl(from, thumbnail, 'videos.jpg', caption)
                    } catch (err) {
                        client.reply(from, 'Error, ' + err, id)
                    }
                })
                .catch((err) => {
                    client.reply(from, `Error, url tidak valid atau tidak memuat video \n\n${err}`, id)
                })
        }
            break
        case 'mim':
        case 'memes':
        case 'meme': {
            const { title, url } = await fetchMeme()
            await client.sendFileFromUrl(from, `${url}`, 'meme.jpg', `${title}`)
            break
        }
        default:
            console.log(color('[ERROR]', 'red'), color(time, 'yellow'), 'Unregistered Command from', color(pushname))
            break
        }
    } catch (err) {
        console.log(color('[ERROR]', 'red'), err)
    }
}

startServer()
