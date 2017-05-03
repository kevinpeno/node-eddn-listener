"use strict"
/* globals module, require */
const promisify = require("es6-promisify")
const inflate = promisify(require("zlib").inflate)

function decodeMessage(message) {
	return inflate(message).then(JSON.parse)
}

function checkMessageIsJournal(message) {
	const eddnSchemaName = "http://schemas.elite-markets.net/eddn/journal/1"
	return message["$schemaRef"]
		&& message["$schemaRef"] === eddnSchemaName
}

function checkMessageIsLocation(message) {
	return !!message.message
		&& (message.message.event === "Location" || message.message.event === "FSDJump")
		&& !!message.message.Factions
		&& message.message.Factions.length > 0
}

function getMessage(message) {
	return decodeMessage(message)
		.then((message) => {
			const isJournal = checkMessageIsJournal(message)
			const isLocation = checkMessageIsLocation(message)
			if (isJournal && isLocation) {
				return message
			}
			else {
				throw new Error("invalid")
			}
		})
}

function getFactionsFromLocation(location) {
	const stations = location.message.StationName ? [{
		"name": location.message.StationName,
		"type": location.message.StationType,
		"system": location.message.StarSystem
	}] : []

	return location.message.Factions.map((faction) => {
		return {
			"name": faction.Name,
			"government": faction.Government,
			"allegiance": faction.Allegiance,
			"systems": [{
				"name": location.message.StarSystem,
				"state": faction.FactionState,
				"influence": faction.Influence
			}],
			stations
		}
	})
}

module.exports = {
	decodeMessage,
	checkMessageIsJournal,
	checkMessageIsLocation,
	getMessage,
	getFactionsFromLocation
}
