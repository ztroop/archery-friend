import type { ShaftData, ComponentWeight } from './types';

// Common shaft data organized by material
export const shaftDatabase: ShaftData[] = [
	// Carbon arrows
	{
		material: 'carbon',
		diameter: 6.2,
		weight: 8.5,
		spine: 300,
		name: 'Carbon Express Maxima Red 300'
	},
	{
		material: 'carbon',
		diameter: 6.2,
		weight: 8.7,
		spine: 350,
		name: 'Carbon Express Maxima Red 350'
	},
	{
		material: 'carbon',
		diameter: 6.2,
		weight: 9.0,
		spine: 400,
		name: 'Carbon Express Maxima Red 400'
	},
	{
		material: 'carbon',
		diameter: 6.2,
		weight: 9.3,
		spine: 500,
		name: 'Carbon Express Maxima Red 500'
	},

	{
		material: 'carbon',
		diameter: 6.2,
		weight: 8.2,
		spine: 300,
		name: 'Easton 4MM Full Metal Jacket 300'
	},
	{
		material: 'carbon',
		diameter: 6.2,
		weight: 8.5,
		spine: 340,
		name: 'Easton 4MM Full Metal Jacket 340'
	},
	{
		material: 'carbon',
		diameter: 6.2,
		weight: 8.8,
		spine: 400,
		name: 'Easton 4MM Full Metal Jacket 400'
	},

	{ material: 'carbon', diameter: 5.2, weight: 6.5, spine: 300, name: 'Gold Tip Hunter XT 300' },
	{ material: 'carbon', diameter: 5.2, weight: 7.0, spine: 340, name: 'Gold Tip Hunter XT 340' },
	{ material: 'carbon', diameter: 5.2, weight: 7.5, spine: 400, name: 'Gold Tip Hunter XT 400' },
	{ material: 'carbon', diameter: 5.2, weight: 8.0, spine: 500, name: 'Gold Tip Hunter XT 500' },

	// Aluminum arrows
	{ material: 'aluminum', diameter: 6.5, weight: 10.2, spine: 300, name: 'Easton Aluminum 2016' },
	{ material: 'aluminum', diameter: 7.0, weight: 11.5, spine: 340, name: 'Easton Aluminum 2018' },
	{ material: 'aluminum', diameter: 7.5, weight: 13.0, spine: 400, name: 'Easton Aluminum 2117' },
	{ material: 'aluminum', diameter: 8.0, weight: 15.2, spine: 500, name: 'Easton Aluminum 2213' },

	// Wood arrows
	{ material: 'wood', diameter: 8.0, weight: 12.0, spine: 300, name: 'Cedar Wood Shaft 11/32"' },
	{ material: 'wood', diameter: 8.5, weight: 13.5, spine: 350, name: 'Cedar Wood Shaft 23/64"' },
	{ material: 'wood', diameter: 9.0, weight: 15.0, spine: 400, name: 'Cedar Wood Shaft 3/8"' },
	{ material: 'wood', diameter: 9.5, weight: 17.0, spine: 500, name: 'Cedar Wood Shaft 25/64"' }
];

// Component weight database
export const componentDatabase: ComponentWeight[] = [
	// Points/Tips
	{ name: '100gr Field Point', weight: 100, category: 'point' },
	{ name: '125gr Field Point', weight: 125, category: 'point' },
	{ name: '150gr Field Point', weight: 150, category: 'point' },
	{ name: '100gr Broadhead', weight: 100, category: 'point' },
	{ name: '125gr Broadhead', weight: 125, category: 'point' },
	{ name: '150gr Broadhead', weight: 150, category: 'point' },
	{ name: '75gr Point', weight: 75, category: 'point' },
	{ name: '200gr Point', weight: 200, category: 'point' },

	// Nocks
	{ name: 'Standard Plastic Nock', weight: 8, category: 'nock' },
	{ name: 'Aluminum Nock', weight: 12, category: 'nock' },
	{ name: 'Lighted Nock', weight: 25, category: 'nock' },
	{ name: 'Pin Nock', weight: 6, category: 'nock' },

	// Fletching
	{ name: '3x 4" Vanes', weight: 21, category: 'fletching' },
	{ name: '3x 3" Vanes', weight: 15, category: 'fletching' },
	{ name: '3x 2.5" Vanes', weight: 12, category: 'fletching' },
	{ name: '3x 5" Feathers', weight: 18, category: 'fletching' },
	{ name: '4x 3" Vanes', weight: 20, category: 'fletching' }
];

// Overhang explanations
export const overhangOptions = [
	{
		value: 0.5,
		label: '0.5"',
		description: 'Minimum safe overhang. Good for experienced archers with consistent form.',
		safety: 'Requires precise shooting form'
	},
	{
		value: 1.0,
		label: '1"',
		description: 'Standard recommendation. Balances safety with arrow efficiency.',
		safety: 'Safe for most archers'
	},
	{
		value: 1.5,
		label: '1.5"',
		description: 'Extra safety margin. Good for beginners or hunting situations.',
		safety: 'Very safe, recommended for beginners'
	},
	{
		value: 2.0,
		label: '2"',
		description: 'Maximum practical overhang. Reduces arrow speed but maximizes safety.',
		safety: 'Maximum safety margin'
	}
];

// Spine calculation constants
export const spineConstants = {
	carbon: {
		baseModifier: 1.0,
		weightFactor: 0.4,
		lengthFactor: 0.8
	},
	aluminum: {
		baseModifier: 0.9,
		weightFactor: 0.5,
		lengthFactor: 0.7
	},
	wood: {
		baseModifier: 0.8,
		weightFactor: 0.6,
		lengthFactor: 0.6
	}
};
