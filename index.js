const { create, decryptMedia } = require('@open-wa/wa-automate')
const moment = require('moment')
const {tiktok, instagram, twitter, facebook} = require('./lib/dl-video')
const urlShortener = require('./lib/shortener')
const color = require("./lib/color")

const serverOption = {
    headless: true,
    qrRefreshS: 20,
    qrTimeout: 0,
    authTimeout: 0,
    autoRefresh: true,
    cacheEnabled: false,
    chromiumArgs: [
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
}

const opsys = process.platform;
if (opsys === "win32" || opsys === "win64") {
    serverOption['executablePath'] = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
} else if (opsys === "linux") {
    serverOption['browserRevision'] = '737027';
} else if (opsys === "darwin") {
    serverOption['executablePath'] = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
}

const startServer = async (from) => {
create('Imperial', serverOption)
        .then(client => {
            console.log('[DEV] Red Emperor')
            console.log('[SERVER] Server Started!')

            // Force it to keep the current session
            client.onStateChanged(state => {
                console.log('[Client State]', state)
                if (state === 'CONFLICT') client.forceRefocus()
            })

            client.onMessage((message) => {
                msgHandler(client, message)
            })
        })
}

async function msgHandler (client, message) {
    try {
        const { type, body, id, from, t, sender, isGroupMsg, chat, caption, isMedia, mimetype, quotedMsg } = message
        const { pushname } = sender
        const { formattedTitle } = chat
        const time = moment(t * 1000).format('DD/MM HH:mm:ss')
        const commands = ['#menu','#help','#sticker', '#stiker', '#tiktok', '#ig', '#instagram', '#twt', '#twitter', '#fb', '#facebook']
        const cmds = commands.map(x => x + '\\b').join('|')
        const cmd = type === 'chat' ? body.match(new RegExp(cmds, 'gi')) : type === 'image' && caption ? caption.match(new RegExp(cmds, 'gi')) : ''

        if (cmd) {
            if (!isGroupMsg) console.log(color('[EXEC]'), color(time, 'yellow'), color(cmd[0]), 'from', color(pushname))
            if (isGroupMsg) console.log(color('[EXEC]'), color(time, 'yellow'), color(cmd[0]), 'from', color(pushname), 'in', color(formattedTitle))
            const args = body.trim().split(' ')
            const isUrl = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi);
            switch (cmd[0]) {
                case '#menu':
                case '#help':
                    client.sendText(from, 'Menu: \n1. #sticker / #stiker: kirim gambar dengan caption atau balas gambar yang sudah dikirim. \n2. #sticker / #stiker spasi url gambar (contoh: #stiker https://avatars2.githubusercontent.com/u/24309806) \n3. #tiktok spasi url (contoh: #tiktok https://www.tiktok.com/@yogaGanteng/video/685521...)')
                    break
                case '#sticker':
                case '#stiker':
                    if (isMedia) {
                        const mediaData = await decryptMedia(message)
                        const imageBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                        await client.sendImageAsSticker(from, imageBase64)
                    } else if (quotedMsg && quotedMsg.type == 'image') {
                        const mediaData = await decryptMedia(quotedMsg)
                        const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`
                        await client.sendImageAsSticker(from, imageBase64)
                    } else if (args.length == 2) {
                        const url = args[1]
                        if (url.match(isUrl)) {
                            await client.sendStickerfromUrl(from, url, {method: 'get'})
                                .then(r => { if (!r) client.sendText(from, 'Maaf, link yang kamu kirim tidak memuat gambar.') })
                                .catch(err => console.log('Caught exception: ', err))
                        } else {
                            client.sendText(from, 'Maaf, link yang kamu kirim tidak valid.')
                        }
                    } else {
                        client.sendText(from, 'Tidak ada gambar! Untuk membuat sticker kirim gambar dengan caption #stiker')
                    }
                    break
                case '#tiktok':
                    if (args.length == 2) {
                        const url = args[1]
                        if (!url.match(isUrl) && !url.includes('tiktok.com')) return client.sendText(from, 'Maaf, link yang kamu kirim tidak valid')
                        await tiktok(url)
                            .then((videoMeta) => {
                                const filename = videoMeta.authorMeta.name + '.mp4'
                                client.sendFile(from, videoMeta.videobase64, filename, videoMeta.NoWaterMark ? '' : '⚠ Video tanpa watermark tidak tersedia.')
                                    .then(() => client.sendText(from, `Metadata:\nUsername: ${videoMeta.authorMeta.name} \nMusic: ${videoMeta.musicMeta.musicName} \nView: ${videoMeta.playCount.toLocaleString()} \nLike: ${videoMeta.diggCount.toLocaleString()} \nComment: ${videoMeta.commentCount.toLocaleString()} \nShare: ${videoMeta.shareCount.toLocaleString()} \nCaption: ${videoMeta.text.trim() ? videoMeta.text : '-'} \n\nDonasi: bantu aku beli dimsum dengan menyawer melalui https://saweria.co/donate/yogasakti atau mentrakteer melalui https://trakteer.id/red-emperor \nTerimakasih.`))
                                    .catch(err => console.log('Caught exception: ', err))
                            }).catch((err) => {
                                client.sendText(from, 'Gagal mengambil metadata, link yang kamu kirim tidak valid')
                            });
                    }
                    break
                case '#ig':
                case '#instagram':
                    if (args.length == 2) {
                        const url = args[1]
                        if (!url.match(isUrl) && !url.includes('instagram.com')) return client.sendText(from, 'Maaf, link yang kamu kirim tidak valid')
                        instagram(url)
                            .then(async (videoMeta) => {
                                const content = []
                                for (var i = 0; i < videoMeta.length; i++) {
                                    await urlShortener(videoMeta[i])
                                        .then((result) => {
                                            console.log('Shortlink: ' + result.shortLink)
                                            content.push(`${i+1}. ${result.shortLink}`)
                                        }).catch((err) => {
                                            client.sendText(from, `Error, ` + err)
                                        });
                                }
                                client.sendText(from, `Link Download:\n${content.join('\n')}`)
                            }).catch((err) => {
                                console.error(err)
                                if (err == 'Not a video') return client.sendText(from, `Error, tidak ada video di link yang kamu kirim`)
                                client.sendText(from, `Error, user private atau link salah`)
                            });
                    }
                    break
                case '#twt':
                case '#twitter':
                    if (args.length == 2) {
                        const url = args[1]
                        if (!url.match(isUrl) && !url.includes('twitter.com') || url.includes('t.co')) return client.sendText(from, 'Maaf, url yang kamu kirim tidak valid')
                        twitter(url)
                            .then(async (videoMeta) => {
                                const find = videoMeta.findIndex(x => x.content_type === 'application/x-mpegURL')
                                    .then((res) => res.splice(find, 1))
                                    .then((res) => res.sort((a, b) => b.bitrate - a.bitrate))
                                    .then(async () => {
                                        try {
                                            const result = await urlShortener(content[0].url)
                                            console.log('Shortlink: ' + result.shortLink)
                                            client.sendText(from, `Link Download: ${result.shortLink}`)
                                        } catch (err) {
                                            client.sendText(from, `Error, ` + err)
                                        }
                                    })
                            }).catch((err) => {
                                console.log(err)
                                client.sendText(from, `Maaf, link tidak valid atau tidak ada video di link yang kamu kirim`)
                            });
                    }
                    break
                    case '#fb':
                    case '#facebook':
                        if (args.length == 2) {
                            const url = args[1]
                            if (!url.match(isUrl) && !url.includes('facebook.com')) return client.sendText(from, 'Maaf, url yang kamu kirim tidak valid')
                            facebook(url)
                                .then(async (videoMeta) => {
                                    const {hd, sd} = videoMeta
                                    try {
                                        const shorthd = await urlShortener(hd)
                                        console.log('Shortlink: ' + shorthd.shortLink)
                                        const shortsd = await urlShortener(sd)
                                        console.log('Shortlink: ' + shortsd.shortLink)
                                        client.sendText(from, `Link Download: \nHD Quality: ${shorthd.shortLink} \nSD Quality: ${shortsd.shortLink}`)
                                    } catch (err) {
                                        client.sendText(from, `Error, ` + err)
                                    }
                                })
                                .catch((err) => {
                                    client.sendText(from, `Error, url tidak valid atau tidak memuat video`)
                                })
                        }
                        break
            }
        } else {
            if (!isGroupMsg) console.log('[RECV]', color(time, 'yellow'), 'Message from', color(pushname))
            if (isGroupMsg) console.log('[RECV]', color(time, 'yellow'), 'Message from', color(pushname), 'in', color(formattedTitle))
        }
    } catch (err) {
        console.log(color('[ERROR]', 'red'), err)
    }
}

process.on('Something went wrong', function (err) {
    console.log('Caught exception: ', err);
  });

startServer()
