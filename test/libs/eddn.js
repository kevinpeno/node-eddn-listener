/* global require */
"use strict"

const test = require("blue-tape")

test("EDDN can inflate zlib messages into javascript objects", (t) => {
	const { decodeMessage } = require("../../src/libs/eddn")
	const journal = require("../data/eddn/journal/empty.json")
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

test("EDDN can filter incoming messages for journal entries", (t) => {
	const { checkMessageIsJournal } = require("../../src/libs/eddn")
	const journal = require("../data/eddn/journal/empty.json")
	const result = checkMessageIsJournal(journal)

	t.equal(result, true)
	t.end()
})

test("EDDN can filter incoming messages for Location entries", (t) => {
	const { checkMessageIsLocation } = require("../../src/libs/eddn")
	const journal = require("../data/eddn/journal/location")
	const result = checkMessageIsLocation(journal)

	t.equal(result, true)
	t.end()
})

test("EDDN can filter incoming messages for FSDJump entries", (t) => {
	const { checkMessageIsLocation } = require("../../src/libs/eddn")
	const journal = require("../data/eddn/journal/fsd-jump")
	const result = checkMessageIsLocation(journal)

	t.equal(result, true)
	t.end()
})

test("EDDN can filter incoming Location and FSDJump messages that don't have Factions", (t) => {
	const { checkMessageIsLocation } = require("../../src/libs/eddn")
	const journal = require("../data/eddn/journal/location-no-faction")
	const result = checkMessageIsLocation(journal)

	t.equal(result, false)
	t.end()
})

test("EDDN can transform message into factions", (t) => {
	const { getFactionsFromLocation } = require("../../src/libs/eddn")
	const faction = require("../data/app/faction")
	const journal = require("../data/eddn/journal/fsd-jump")
	const [result] = getFactionsFromLocation(journal)

	t.deepEqual(result, faction)
	t.end()
})

test("EDDN can transform message into factions with stations if present", (t) => {
	const { getFactionsFromLocation } = require("../../src/libs/eddn")
	const faction = require("../data/app/faction-w-station")
	const journal = require("../data/eddn/journal/location")
	const [result] = getFactionsFromLocation(journal)

	t.deepEqual(result, faction)
	t.end()
})
