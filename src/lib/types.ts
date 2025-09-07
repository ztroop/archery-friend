export interface ArrowConfiguration {
	id: string;
	name: string;
	drawLength: number;
	drawWeight: number;
	arrowLength: number;
	overhang: number;
	shaftWeight: number;
	pointWeight: number;
	nockWeight: number;
	fletchingWeight: number;
	arrowMaterial: ArrowMaterial;
	spineValue: number;
	shaftName?: string; // Optional shaft name for manufacturer detection
	totalWeight: number;
	gpp: number;
	foc: number;
}

export type ArrowMaterial = 'carbon' | 'aluminum' | 'wood';

export interface ShaftData {
	material: ArrowMaterial;
	diameter: number;
	weight: number; // grains per inch
	spine: number;
	name: string;
}

export interface ComponentWeight {
	name: string;
	weight: number; // grains
	category: 'point' | 'nock' | 'fletching';
}

export interface SpineRecommendation {
	minSpine: number;
	maxSpine: number;
	recommended: number;
	material: ArrowMaterial;
	notes: string[];
}

export interface SafetyCheck {
	gpp: {
		value: number;
		status: 'safe' | 'warning' | 'danger';
		message: string;
	};
	arrowLength: {
		status: 'safe' | 'warning' | 'danger';
		message: string;
	};
	spine: {
		status: 'safe' | 'warning' | 'danger';
		message: string;
	};
	overall: 'safe' | 'warning' | 'danger';
}
