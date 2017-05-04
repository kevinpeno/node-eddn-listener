/* global require */
"use strict"

const test = require("blue-tape")

test("EDDN can inflate zlib messages into javascript objects", (t) => {
	const { decodeMessage } = require("../../src/libs/eddn")
	const journal = require("../data/eddn/journal/fsd-jump")
	const zlib = require("zlib")
	const zlibedJournal = zlib.deflateSync(JSON.stringify(journal))

	return decodeMessage(zlibedJournal)
		.then((result) => {
			return t.deepEqual(result, journal)
		})
})

test("EDDN::getMessage will return valid messages", (t) => {
	const { getMessage } = require("../../src/libs/eddn")
	const journal = require("../data/eddn/journal/fsd-jump")
	const zlib = require("zlib")
	const zlibedJournal = zlib.deflateSync(JSON.stringify(journal))

	return getMessage(zlibedJournal)
		.then((result) => {
			return t.deepEqual(result, journal)
		})
})

test("EDDN::getMessage will not resolve if doesn't meet requirements", (t) => {
	const { getMessage } = require("../../src/libs/eddn")
	const journal = require("../data/eddn/journal/docked.json")
	const zlib = require("zlib")
	const zlibedJournal = zlib.deflateSync(JSON.stringify(journal))

	return getMessage(zlibedJournal)
		.catch((err) => {
			return t.ok(err)
		})
})

test("EDDN can filter incoming FSDJump messages that don't have Factions", (t) => {
	const { checkMessageHasFactions } = require("../../src/libs/eddn")
	const journal = require("../data/eddn/journal/fsd-jump-no-faction")
	const result = checkMessageHasFactions(journal)

	t.equal(result, false)
	t.end()
})

test("EDDN can transform message into factions", (t) => {
	const { getFactionsFromLocation } = require("../../src/libs/eddn")
	const faction = require("../data/app/faction")
	const journal = require("../data/eddn/journal/fsd-jump")
	const [result] = getFactionsFromLocation(journal)

	t.equals(result.systems.length, 1)
	t.deepEqual(result, faction)
	t.end()
})
