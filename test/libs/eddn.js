/* global require */
"use strict"

const test = require("blue-tape")

test("EDDN can filter incoming messages for journal entries", (t) => {
	const { checkMessageIsJournal } = require("../../src/libs/eddn")
	const journal = require("../data/eddn/journal/empty.json")
	const result = checkMessageIsJournal(journal)

	t.equal(result, true)
	t.end()
})

test("EDDN can filter incoming messages for Location entries", (t) => {
	const { checkMessageIsLocation } = require("../../src/libs/eddn")
	const journal = require("../data/eddn/journal/location.json")
	const result = checkMessageIsLocation(journal)

	t.equal(result, true)
	t.end()
})

test("EDDN can filter incoming messages for FSDJump entries", (t) => {
	const { checkMessageIsLocation } = require("../../src/libs/eddn")
	const journal = require("../data/eddn/journal/fsd-jump.json")
	const result = checkMessageIsLocation(journal)

	t.equal(result, true)
	t.end()
})

test("EDDN can filter incoming Location and FSDJump messages that don't have Factions", (t) => {
	const { checkMessageIsLocation } = require("../../src/libs/eddn")
	const journal = require("../data/eddn/journal/location-no-faction.json")
	const result = checkMessageIsLocation(journal)

	t.equal(result, false)
	t.end()
})
