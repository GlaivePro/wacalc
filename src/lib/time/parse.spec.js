import { describe, it, expect } from 'vitest'
import { parse } from './parse.js'

describe('string parser', () => {
	it('parses integers', () => {
		expect(parse('12')).toBe(12)
	})

	it('parses decimals', () => {
		expect(parse('12.1')).toBe(12.1)
		expect(parse('12,1')).toBe(12.1)
	})

	it('parses times separated with a colon', () => {
		expect(parse('12:10')).toBe(12 * 60 + 10)
		expect(parse('12:10:15')).toBe(12 * 3600 + 10 * 60 + 15)
		expect(parse('12:10:15.14')).toBe(12 * 3600 + 10 * 60 + 15.14)
	})

	it('parses times separated with a colon', () => {
		// If dots are multiple, they are not decimal separators
		expect(parse('12.10.15')).toBe(12 * 3600 + 10 * 60 + 15)

		// If there's a comma, then the dot is not the dec sep
		expect(parse('12.10,15')).toBe(12 * 60 + 10.15)
	})

	it('parses times with named separators', () => {
		expect(parse('12m31')).toBe(12 * 60 + 31)
		expect(parse('12m31.5')).toBe(12 * 60 + 31.5)
		expect(parse('12m31s')).toBe(12 * 60 + 31)
		expect(parse('12m31.5s')).toBe(12 * 60 + 31.5)
		expect(parse('40s')).toBe(40)
		expect(parse('40.1s')).toBe(40.1)
		expect(parse('510000u')).toBe(0.51)
		expect(parse('5s30000u')).toBe(5.03)

		// Some ways to write half an hour
		expect(parse('30m')).toBe(30 * 60)
		expect(parse('30m0s')).toBe(30 * 60)
		expect(parse('30m0')).toBe(30 * 60)
		expect(parse('0.5h')).toBe(30 * 60)
		expect(parse('.5h')).toBe(30 * 60)
		expect(parse(',5h')).toBe(30 * 60)
		expect(parse('1800s')).toBe(30 * 60)
	})
})
