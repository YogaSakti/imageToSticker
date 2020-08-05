const fetch = require('node-fetch')

// Shortener Url using cutt.ly
// Result Status: 
// 1: the shortened link comes from the domain that shortens the link, i.e. the link has already been shortened.
// 2: the entered link is not a link.
// 3: the preferred link name is already taken
// 4: Invalid API key
// 5: the link has not passed the validation. Includes invalid characters
// 6: The link provided is from a blocked domain
// 7: OK - the link has been shortened

const apikey = '99fd739f5485d59b38faf024758b738bbeb75'

module.exports = shortener = (url) => {
    return new Promise(async (resolve, reject) => {
        console.log('Creating short url...')
        await fetch(`https://cutt.ly/api/api.php?key=${apikey}&short=${url}`)
            .then(response => response.json())
            .then(json => {
                if (json.url.status !== 7) return reject('Error Creating Short URL')
                resolve(json.url)
            })
            .catch((err) => {
                switch (json.url.status) {
                    case 1:
                        reject('the link has already been shortened')
                        break;
                    case 2:
                        reject('not a link')
                        break;
                    case 3:
                        reject('link name is already taken')
                        break;
                    case 4:
                        reject('Invalid API key')
                        break;
                    case 5:
                        reject('Includes invalid characters')
                        break;
                    case 6:
                        reject('blocked domain')
                        break;
                    default:
                        reject(err)
                        break;
                }
            });
    })
};