const { create } = require('@open-wa/wa-automate')
const { color } = require('./util')
const clientOptions = require('./util').options
const msgHandler = require('./handler/message')

const startServer = () => {
    create('Imperial', clientOptions(true))
        .then((client) => {
            console.log('[Dev]', color('Red Emperor', 'yellow'))
            console.log('[SERVER] Server Started!')

            // Force it to keep the current session
            client.onStateChanged((state) => {
                console.log('[State]', state)
                if (state === 'CONFLICT') client.forceRefocus()
            })

            // listening on message
            client.onMessage((message) => {
                client.getAmountOfLoadedMessages() // Cut message Cache if cache more than 3K
                    .then((msg) => {
                        if (msg >= 3000) {
                            console.log('[SYS]', color(`Loaded Message Reach ${msg}, cuting message cache...`, 'yellow'))
                            client.cutMsgCache()
                        }
                    })
                // Message Handler
                msgHandler(client, message)
            })

            // listen group invitation
            client.onAddedToGroup(({ id, groupMetadata: { gid }, contact: { name } }) =>
                client.getGroupMembersId(gid)
                    .then((ids) => {
                    // conditions if the group members are less than 10 then the bot will leave the group
                        if (ids.length <= 10) {
                            client.sendText(gid, 'Sorry, the minimum group member is 10 user to use this bot. Bye~')
                            client.leaveGroup(gid)
                            client.deleteChat(id)
                        } else {
                            client.sendText(id, `Hello group members *${name}*, thank you for inviting this bot, to see the bot menu send *#menu*`)
                        }
                    }))

            // listen paricipant event on group (wellcome message)
            // client.onGlobalParicipantsChanged((event) => {
            //     if (event.action === 'add') client.sendTextWithMentions(event.chat, `Hello, Welcome to the group @${event.who.replace('@c.us', '')} \n\nHave fun with us✨`)
            // })
        })
        .catch((err) => new Error(err))
}

startServer()
