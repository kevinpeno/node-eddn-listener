"use strict"
/* globals module, require */
const promisify = require("es6-promisify")
const inflate = promisify(require("zlib").inflate)
const avj = new (require("ajv"))({"allErrors": true})
const validator = avj.compile(require("../schemas/eddn/journal"))
const validateJournal = (m) => {
	if (!validator(m)) {
		throw new Error(validator.errors[0])
	}
	else {
		return true
	}
}

function decodeMessage(message) {
	return inflate(message).then(JSON.parse)
}

function checkMessageIsJournal(message) {
	const eddnSchemaName = "http://schemas.elite-markets.net/eddn/journal/1"
	return message["$schemaRef"]
		&& message["$schemaRef"] === eddnSchemaName
		&& validateJournal(message)
}

function checkMessageHasFactions({message}) {
	return !!message
		&& (message.event === "Location" || message.event === "FSDJump")
		&& !!message.Factions
		&& message.Factions.length > 0
}

function getMessage(message) {
	return decodeMessage(message)
		.then((message) => {
			const isJournal = checkMessageIsJournal(message)
			const isLocation = checkMessageHasFactions(message)
			if (isJournal && isLocation) {
				return message
			}
			else {
				throw new Error("invalid")
			}
		})
}

function getFactionsFromLocation({message}) {
	const stations = message.StationName ? [{
		"name": message.StationName,
		"type": message.StationType,
		"system": message.StarSystem
	}] : []

	return message.Factions.map((faction) => {
		return {
			"name": faction.Name,
			"government": faction.Government,
			"allegiance": faction.Allegiance,
			"systems": [{
				"name": message.StarSystem,
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
	checkMessageHasFactions,
	getMessage,
	getFactionsFromLocation
}
