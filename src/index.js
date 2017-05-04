/* global require, console */
"use strict"
// EDDN listener
const memcache = require("memory-cache")
const zmq = require("zeromq")
const sock = zmq.socket("sub")
const eddn = require("./libs/eddn")
const _ = require("lodash")

sock.connect("tcp://eddn-relay.elite-markets.net:9500")
sock.subscribe("")
console.log("Worker connected to port 9500")

function updateIfNeeded(a) {
	return a.map((faction) => {
		const old = memcache.get(faction.name)
		const toSave = Object.assign({}, old, faction)

		if (!_.isEqual(old, toSave)) {
			return !!memcache.put(faction.name, toSave)
		}
		else {
			return false
		}
	}).some(v => v === true)
}

function processMessage(message) {
	return eddn.getMessage(message)
		.then((topic) => {
			console.log(JSON.stringify(topic))
			const updated = updateIfNeeded(eddn.getFactionsFromLocation(topic))
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
			console.log(logTxt)
		})
		.catch((err) => {
			if (err.message !== "invalid") {
				console.log(err)
			}
		})
}

sock.on("message", processMessage)
