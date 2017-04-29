"use strict"
/* globals module */

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

module.exports = {
	checkMessageIsJournal,
	checkMessageIsLocation
}
