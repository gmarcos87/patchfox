/**
 * COMPONENT "PUBLIC VIEW"
 * 
 * OBJECTIVE:
 * Provide a public view of your feed.
 * 
 * This is a Mithril.
 */

import {getDriver} from "../drivers/driver.js"
import Message from "./messages/message.js"

export class PublicView {
    constructor() {
        this.driver = getDriver()
        this.msgs = []
    }

    async oninit() {
        this.msgs = await this.driver.public({limit: 10, reverse: true})
        console.log(this.msgs)
        m.redraw()
    }

    view() {
        return m("div", [
            m("h1", "Public"),
            m("div.is-message-thread", [
                this.msgs.map(msg => (m(Message, {msg})))
            ])
        ])
    }
}
