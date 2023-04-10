import config from './config.js'

/**
 * @param {string} timeStr
 */
export function parse(timeStr) {
	const tokens = tokenize(timeStr)

	let seconds = 0

	// Accumulator while we don't know the denomination (e.g. 10: is different in 10:00:00 vs 10:00)
	let acc = 0

	tokens.forEach(token => {
		// Always assume previously accumulated tokens were 60x more valuable
		// E.g. from 10:22 we had 10 already and now will do 10*60 to add 22.
		acc *= 60

		const tokenConfig = config.tokens[token.separator]

		// If we recognize the separator, add the value directly to seconds
		// E.g. 24m -> 24*60 seconds
		if (tokenConfig)
			seconds += parseFloat(token.number) * tokenConfig.seconds
		else
			acc += parseFloat(token.number) // Otherwise just put it in accumulator
	})

	seconds += acc

	return seconds
}

/**
 * @param {string} timeStr
 */
function tokenize(timeStr) {
	const tokens = []
	const decimalSeparator = getDecimalSeparator(timeStr)

	let number = ''
	let separator = ''
	for (let i = 0; i < timeStr.length; i++) {
		let char = timeStr[i]

		// If char is not a part of a number, add it to the separator
		if (decimalSeparator !== char && !/[\d]/.test(char)) {
			separator += char

			continue
		}

		// When encountering a digit, check if we have to flush the prev tokens
		if (separator) {
			tokens.push({number, separator})

			// And reset the containers
			number = ''
			separator = ''
		}

		// Normalize decimal separators for JS
		if (',' === char)
			char = '.'

		// Add digit to number
		number += char
	}

	// Flush the last tokens if any
	if (number)
		tokens.push({number, separator})

	return tokens
}

/**
 * @param {string} timeStr
 * @returns ?string
 */
function getDecimalSeparator(timeStr) {
	// If comma exists, it is the decimal separator
	if (timeStr.includes(','))
		return ','

	// Dot can be the dec separator if there's exactly one of them
	if (1 === (timeStr.match(/\./g) || []).length)
		return '.'

	return null
}
