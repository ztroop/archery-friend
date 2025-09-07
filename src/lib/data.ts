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

	// Easton Full Metal Jacket (FMJ) 4mm
	{
		material: 'carbon',
		diameter: 4.0,
		weight: 8.2,
		spine: 300,
		name: 'Easton 4MM Full Metal Jacket 300'
	},
	{
		material: 'carbon',
		diameter: 4.0,
		weight: 8.5,
		spine: 340,
		name: 'Easton 4MM Full Metal Jacket 340'
	},
	{
		material: 'carbon',
		diameter: 4.0,
		weight: 8.8,
		spine: 400,
		name: 'Easton 4MM Full Metal Jacket 400'
	},
	{
		material: 'carbon',
		diameter: 4.0,
		weight: 9.2,
		spine: 500,
		name: 'Easton 4MM Full Metal Jacket 500'
	},

	// Easton Axis Traditional Carbon Arrows
	{
		material: 'carbon',
		diameter: 5.2,
		weight: 9.5,
		spine: 300,
		name: 'Easton Axis Traditional 300'
	},
	{
		material: 'carbon',
		diameter: 5.2,
		weight: 9.8,
		spine: 340,
		name: 'Easton Axis Traditional 340'
	},
	{
		material: 'carbon',
		diameter: 5.2,
		weight: 10.2,
		spine: 400,
		name: 'Easton Axis Traditional 400'
	},
	{
		material: 'carbon',
		diameter: 5.2,
		weight: 10.8,
		spine: 500,
		name: 'Easton Axis Traditional 500'
	},

	// Easton Bloodline Carbon Arrows
	{
		material: 'carbon',
		diameter: 6.5,
		weight: 8.1,
		spine: 300,
		name: 'Easton Bloodline 300'
	},
	{
		material: 'carbon',
		diameter: 6.5,
		weight: 8.4,
		spine: 340,
		name: 'Easton Bloodline 340'
	},
	{
		material: 'carbon',
		diameter: 6.5,
		weight: 8.8,
		spine: 400,
		name: 'Easton Bloodline 400'
	},
	{
		material: 'carbon',
		diameter: 6.5,
		weight: 9.3,
		spine: 500,
		name: 'Easton Bloodline 500'
	},

	// Easton 6.5mm Match Grade
	{
		material: 'carbon',
		diameter: 6.5,
		weight: 8.9,
		spine: 250,
		name: 'Easton 6.5mm Match Grade 250'
	},
	{
		material: 'carbon',
		diameter: 6.5,
		weight: 9.2,
		spine: 300,
		name: 'Easton 6.5mm Match Grade 300'
	},
	{
		material: 'carbon',
		diameter: 6.5,
		weight: 9.5,
		spine: 340,
		name: 'Easton 6.5mm Match Grade 340'
	},
	{
		material: 'carbon',
		diameter: 6.5,
		weight: 9.8,
		spine: 400,
		name: 'Easton 6.5mm Match Grade 400'
	},
	{
		material: 'carbon',
		diameter: 6.5,
		weight: 10.2,
		spine: 500,
		name: 'Easton 6.5mm Match Grade 500'
	},

	{ material: 'carbon', diameter: 5.2, weight: 6.5, spine: 300, name: 'Gold Tip Hunter XT 300' },
	{ material: 'carbon', diameter: 5.2, weight: 7.0, spine: 340, name: 'Gold Tip Hunter XT 340' },
	{ material: 'carbon', diameter: 5.2, weight: 7.5, spine: 400, name: 'Gold Tip Hunter XT 400' },
	{ material: 'carbon', diameter: 5.2, weight: 8.0, spine: 500, name: 'Gold Tip Hunter XT 500' },

	// Black Eagle Outlaw Carbon Arrows
	{ material: 'carbon', diameter: 6.2, weight: 6.1, spine: 700, name: 'Black Eagle Outlaw 700' },
	{ material: 'carbon', diameter: 6.2, weight: 6.8, spine: 600, name: 'Black Eagle Outlaw 600' },
	{ material: 'carbon', diameter: 6.2, weight: 7.5, spine: 500, name: 'Black Eagle Outlaw 500' },
	{ material: 'carbon', diameter: 6.2, weight: 8.2, spine: 400, name: 'Black Eagle Outlaw 400' },
	{ material: 'carbon', diameter: 6.2, weight: 8.8, spine: 350, name: 'Black Eagle Outlaw 350' },
	{ material: 'carbon', diameter: 6.2, weight: 9.1, spine: 300, name: 'Black Eagle Outlaw 300' },

	// Black Eagle Spartan Arrows
	{ material: 'carbon', diameter: 5.7, weight: 6.4, spine: 500, name: 'Black Eagle Spartan 500' },
	{ material: 'carbon', diameter: 5.7, weight: 7.2, spine: 400, name: 'Black Eagle Spartan 400' },
	{ material: 'carbon', diameter: 5.7, weight: 8.1, spine: 350, name: 'Black Eagle Spartan 350' },
	{ material: 'carbon', diameter: 5.7, weight: 9.0, spine: 300, name: 'Black Eagle Spartan 300' },
	{ material: 'carbon', diameter: 5.7, weight: 10.2, spine: 250, name: 'Black Eagle Spartan 250' },
	{ material: 'carbon', diameter: 5.7, weight: 11.6, spine: 200, name: 'Black Eagle Spartan 200' },

	// Black Eagle X-Impact Arrows
	{ material: 'carbon', diameter: 4.2, weight: 5.5, spine: 900, name: 'Black Eagle X-Impact 900' },
	{ material: 'carbon', diameter: 4.2, weight: 6.0, spine: 800, name: 'Black Eagle X-Impact 800' },
	{ material: 'carbon', diameter: 4.2, weight: 6.8, spine: 700, name: 'Black Eagle X-Impact 700' },
	{ material: 'carbon', diameter: 4.2, weight: 7.5, spine: 600, name: 'Black Eagle X-Impact 600' },
	{ material: 'carbon', diameter: 4.2, weight: 8.2, spine: 500, name: 'Black Eagle X-Impact 500' },
	{ material: 'carbon', diameter: 4.2, weight: 9.0, spine: 400, name: 'Black Eagle X-Impact 400' },
	{ material: 'carbon', diameter: 4.2, weight: 9.8, spine: 350, name: 'Black Eagle X-Impact 350' },
	{ material: 'carbon', diameter: 4.2, weight: 10.5, spine: 300, name: 'Black Eagle X-Impact 300' },
	{ material: 'carbon', diameter: 4.2, weight: 10.8, spine: 250, name: 'Black Eagle X-Impact 250' },
	{ material: 'carbon', diameter: 4.2, weight: 11.0, spine: 200, name: 'Black Eagle X-Impact 200' },

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
	{ name: 'Black Eagle BEA Standard Nock', weight: 8, category: 'nock' },
	{ name: 'Black Eagle R Nock', weight: 9, category: 'nock' },
	{ name: 'Easton G Nock', weight: 8, category: 'nock' },
	{ name: 'Easton H Nock', weight: 9, category: 'nock' },
	{ name: 'Easton S Nock', weight: 7, category: 'nock' },

	// Inserts (treated as point category for weight calculations)
	{ name: 'Black Eagle .2445 Insert', weight: 15, category: 'point' },
	{ name: 'Black Eagle Spartan Stainless Insert', weight: 26, category: 'point' },
	{ name: 'Black Eagle Spartan Nock Bushing', weight: 10, category: 'point' },
	{ name: 'Easton Standard Insert', weight: 12, category: 'point' },
	{ name: 'Easton Deep Six Insert', weight: 20, category: 'point' },
	{ name: 'Easton HIT Insert', weight: 16, category: 'point' },

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

// Manufacturer spine recommendations based on draw weight and point weight
// Based on standard 28" arrow length with 100gr point weight
export const manufacturerSpineRecommendations = {
	// Black Eagle recommendations
	blackEagle: {
		outlaw: [
			{ drawWeight: [25, 29], pointWeight: [75, 100], recommendedSpine: 700 },
			{ drawWeight: [30, 34], pointWeight: [100, 125], recommendedSpine: 600 },
			{ drawWeight: [35, 39], pointWeight: [100, 125], recommendedSpine: 500 },
			{ drawWeight: [40, 44], pointWeight: [100, 125], recommendedSpine: 400 },
			{ drawWeight: [45, 49], pointWeight: [100, 125], recommendedSpine: 350 },
			{ drawWeight: [50, 65], pointWeight: [100, 125], recommendedSpine: 300 }
		],
		spartan: [
			{ drawWeight: [35, 39], pointWeight: [100, 125], recommendedSpine: 500 },
			{ drawWeight: [40, 44], pointWeight: [100, 125], recommendedSpine: 400 },
			{ drawWeight: [45, 49], pointWeight: [100, 125], recommendedSpine: 350 },
			{ drawWeight: [50, 54], pointWeight: [100, 125], recommendedSpine: 300 },
			{ drawWeight: [55, 64], pointWeight: [100, 125], recommendedSpine: 250 },
			{ drawWeight: [65, 80], pointWeight: [100, 125], recommendedSpine: 200 }
		],
		xImpact: [
			{ drawWeight: [20, 24], pointWeight: [75, 100], recommendedSpine: 900 },
			{ drawWeight: [25, 29], pointWeight: [75, 100], recommendedSpine: 800 },
			{ drawWeight: [30, 34], pointWeight: [100, 125], recommendedSpine: 700 },
			{ drawWeight: [35, 39], pointWeight: [100, 125], recommendedSpine: 600 },
			{ drawWeight: [40, 44], pointWeight: [100, 125], recommendedSpine: 500 },
			{ drawWeight: [45, 49], pointWeight: [100, 125], recommendedSpine: 400 },
			{ drawWeight: [50, 54], pointWeight: [100, 125], recommendedSpine: 350 },
			{ drawWeight: [55, 59], pointWeight: [100, 125], recommendedSpine: 300 },
			{ drawWeight: [60, 69], pointWeight: [100, 125], recommendedSpine: 250 },
			{ drawWeight: [70, 85], pointWeight: [100, 125], recommendedSpine: 200 }
		]
	},
	// Easton recommendations
	easton: {
		fmj4mm: [
			{ drawWeight: [50, 65], pointWeight: [100, 125], recommendedSpine: 300 },
			{ drawWeight: [45, 49], pointWeight: [100, 125], recommendedSpine: 340 },
			{ drawWeight: [40, 44], pointWeight: [100, 125], recommendedSpine: 400 },
			{ drawWeight: [35, 39], pointWeight: [100, 125], recommendedSpine: 500 }
		],
		axisTraditional: [
			{ drawWeight: [50, 65], pointWeight: [100, 125], recommendedSpine: 300 },
			{ drawWeight: [45, 49], pointWeight: [100, 125], recommendedSpine: 340 },
			{ drawWeight: [40, 44], pointWeight: [100, 125], recommendedSpine: 400 },
			{ drawWeight: [35, 39], pointWeight: [100, 125], recommendedSpine: 500 }
		],
		bloodline: [
			{ drawWeight: [50, 65], pointWeight: [100, 125], recommendedSpine: 300 },
			{ drawWeight: [45, 49], pointWeight: [100, 125], recommendedSpine: 340 },
			{ drawWeight: [40, 44], pointWeight: [100, 125], recommendedSpine: 400 },
			{ drawWeight: [35, 39], pointWeight: [100, 125], recommendedSpine: 500 }
		],
		matchGrade: [
			{ drawWeight: [55, 70], pointWeight: [100, 125], recommendedSpine: 250 },
			{ drawWeight: [50, 54], pointWeight: [100, 125], recommendedSpine: 300 },
			{ drawWeight: [45, 49], pointWeight: [100, 125], recommendedSpine: 340 },
			{ drawWeight: [40, 44], pointWeight: [100, 125], recommendedSpine: 400 },
			{ drawWeight: [35, 39], pointWeight: [100, 125], recommendedSpine: 500 }
		]
	}
};

// Point weight adjustment guidelines
export const pointWeightAdjustments = {
	notes: [
		'Recommendations based on 100gr point weight',
		'For heavier points (125gr+): consider stiffer spine',
		'For lighter points (75-85gr): consider weaker spine',
		'Arrow length affects spine: +1" length = ~25 spine weaker',
		'Draw length affects dynamic spine significantly'
	],
	adjustmentFactors: {
		pointWeight: {
			75: -0.05, // 5% weaker spine
			85: -0.03, // 3% weaker spine
			100: 0, // baseline
			125: 0.05, // 5% stiffer spine
			150: 0.1 // 10% stiffer spine
		},
		arrowLength: {
			26: 0.08, // 8% stiffer for shorter arrows
			27: 0.04, // 4% stiffer
			28: 0, // baseline
			29: -0.04, // 4% weaker for longer arrows
			30: -0.08, // 8% weaker
			31: -0.12, // 12% weaker
			32: -0.16 // 16% weaker
		}
	}
};
