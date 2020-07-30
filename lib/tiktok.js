const TikTokScraper = require('tiktok-scraper');
const { getBase64 } = require("./fetcher");

module.exports = tiktok = async (url) => {
    const options = {
        noWaterMark: true,
        hdVideo: true
    }
    const videoMetadata = await TikTokScraper.getVideoMeta(url, options);
    console.log('Get Video From', '@'+videoMetadata.authorMeta.name, 'ID:', videoMetadata.id)
    const fileName = videoMetadata.authorMeta.name + '.' + videoMetadata.id + '.mp4'
    if (videoMetadata.videoUrlNoWaterMark !== '') {
        const redEmperor1337 = await getBase64(videoMetadata.videoUrlNoWaterMark)
        videoMetadata.fileName = fileName
        videoMetadata.videobase64 = redEmperor1337
        videoMetadata.NoWaterMark = true
        return videoMetadata
    } else {
        const redEmperor1337 = await getBase64(videoMetadata.videoUrl)
        videoMetadata.fileName = fileName
        videoMetadata.videobase64 = redEmperor1337
        videoMetadata.NoWaterMark = false
        return videoMetadata
    }
    

}

// tiktok('https://www.tiktok.com/@mlly27/video/6852548044492180738')