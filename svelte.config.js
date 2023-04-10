import adapter from '@sveltejs/adapter-static'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		alias: {
			'$lib': 'src/lib',
			'$comp': 'src/components',
			'$style': 'src/style',
		},
	},
}

export default config
