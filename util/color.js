const chalk = require('chalk')
/**
 * Get text with color
 * @param  {String} text
 * @param  {String} color
 * @return  {String} Return text with color
 */
module.exports = color = (text, color) => !color ? chalk.green(text) : chalk.keyword(color)(text)
