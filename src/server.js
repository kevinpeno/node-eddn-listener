/* global require, console */
"use strict"

// Web server
const express = require("express")
const PORT = 8080

const app = express()
app.get("/", (req, res) => {
	res.send("Hello world\n")
})

app.listen(PORT)
console.log(`Running on http://localhost: ${PORT}`)

// EDDN listener
const memcache = require("memory-cache")
const zlib = require("zlib")
const zmq = require("zeromq")
const sock = zmq.socket("sub")
const eddn = require("./libs/eddn")
const _ = require("lodash")

sock.connect("tcp://eddn-relay.elite-markets.net:9500")
sock.subscribe("")
console.log("Worker connected to port 9500")

function updateIfNeeded(a) {
	const b = memcache.get(a.message.StarSystem)

	if (_.eq(a, b)) {
		return false
	}
	else {
		return !!memcache.put(a.message.StarSystem, a.message.Factions)
	}
}

sock.on("message", message => {
	const topic = JSON.parse(zlib.inflateSync(message))

	if (eddn.checkMessageIsJournal(topic) && eddn.checkMessageIsLocation(topic)) {
		const updated = updateIfNeeded(topic)
		const factions = topic.message.Factions.sort((a, b) => {
			return b.Influence - a.Influence
		})
		const factionsText = factions.reduce((acc, faction) => {
			const influencePct = Math.floor(faction.Influence * 100)
			return acc + `${faction.Name}: ${influencePct}%\n`
		}, "")

		const logTxt = `${topic.message.event} event for "${topic.message.StarSystem}"
Factions:

${factionsText}
Updated: ${updated.toString()}

`
		memcache.put(topic.message.StarSystem, factions)
		console.log(logTxt)
	}
})
