const fetch = require('node-fetch')

/**
 *Fetch Json from Url
 *
 *@param {String} url
 *@param {Object} options
 */
const fetchJson = (url, options) =>
    new Promise((resolve, reject) =>
        fetch(url, options)
            .then(response => response.json())
            .then(json => resolve(json))
            .catch((err) => {
                console.error(err)
                reject(err)
            })
    )

/**
 * Fetch Text from Url
 *
 * @param {String} url
 * @param {Object} options
 */
const fetchText = (url, options) =>
    new Promise((resolve, reject) =>
        fetch(url, options)
            .then(response => response.text())
            .then(text => resolve(text))
            .catch((err) => {
                console.error(err)
                reject(err)
            })
    )

module.exports = {
    fetchJson,
    fetchText
}
