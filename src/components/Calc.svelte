<script>
	import { WaCalculator } from '@glaivepro/wa-calculator'
	import FrInput from './FrInput.svelte'

	// Local calc options
	/** @type string|null */
	let discipline = '200m'
	let venueType = 'outdoor'
	let gender = 'm'

	const calc = new WaCalculator({edition: '2022'})

	// Update options in the calc when any local option changes
	$: calc.setOptions({venueType})
	$: calc.setOptions({gender})
	$: calc.setOptions({discipline})

	// List for the discipline dropdown
	/** @type string[] */
	let disciplines = []

	// When gender or venueType changes -> load the new discipline list
	$: gender, venueType, disciplines = calc.getDisciplines()

	// Set the initial discipline if it's available
	if (disciplines.length)
		discipline = disciplines[0]

	// Result for which the score should be calculated
	/** @type number|null */
	let result = null

	// The score
	/** @type number|null */
	let score = null

	// Recalculate score when venueType, gender, discipline or result changes
	$: venueType, gender, discipline, score = calc.evaluate(result)
</script>

<section>
	<div class="radio">
		<input type="radio" bind:group={venueType} value="outdoor">Outdoor
		<input type="radio" bind:group={venueType} value="indoor">Indoor
	</div>

	<div class="radio">
		<input type="radio" bind:group={gender} value="m">M
		<input type="radio" bind:group={gender} value="f">F
	</div>

	<select bind:value={discipline} >
		{#each disciplines as disc}
			<option value={disc}>{disc}</option>
		{/each}
	</select>

	<FrInput bind:value={result} />

	Score: {score || ''}
</section>

<style>
	section {
		max-width: 20rem;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
</style>
