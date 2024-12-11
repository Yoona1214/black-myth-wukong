import type { Config } from 'tailwindcss';
import { addIconSelectors } from '@iconify/tailwind';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {}
	},

	plugins: [addIconSelectors(['lucide'])]
} satisfies Config;
