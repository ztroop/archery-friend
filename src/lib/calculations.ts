import type { ArrowConfiguration, SpineRecommendation, SafetyCheck, ArrowMaterial } from './types';
import { spineConstants } from './data';

/**
 * Calculate recommended arrow length based on draw length and overhang
 */
export function calculateArrowLength(drawLength: number, overhang: number): number {
	return drawLength + overhang;
}

/**
 * Calculate dynamic spine recommendation based on bow setup
 */
export function calculateSpineRecommendation(
	drawWeight: number,
	drawLength: number,
	pointWeight: number,
	material: ArrowMaterial
): SpineRecommendation {
	const constants = spineConstants[material];

	// Base spine calculation using industry standard formula
	// Adjusted for point weight and draw length variations
	let baseSpine = drawWeight * 0.9 + (drawLength - 28) * 10;

	// Point weight adjustment (heavier points weaken dynamic spine)
	const pointAdjustment = (pointWeight - 125) * constants.weightFactor;
	baseSpine += pointAdjustment;

	// Material modifier
	baseSpine *= constants.baseModifier;

	// Round to nearest common spine value
	const commonSpines = [200, 250, 300, 340, 350, 400, 500, 600, 700, 800, 900];
	const recommended = commonSpines.reduce((prev, curr) =>
		Math.abs(curr - baseSpine) < Math.abs(prev - baseSpine) ? curr : prev
	);

	// Calculate acceptable range (±50 spine units typically)
	const minSpine = Math.max(200, recommended - 50);
	const maxSpine = Math.min(900, recommended + 50);

	const notes: string[] = [];

	if (pointWeight > 150) {
		notes.push('Heavy point weight - consider stiffer spine');
	}
	if (pointWeight < 100) {
		notes.push('Light point weight - spine may be too stiff');
	}
	if (drawLength > 30) {
		notes.push('Long draw length - may need stiffer spine');
	}
	if (drawLength < 26) {
		notes.push('Short draw length - may need more flexible spine');
	}

	return {
		minSpine,
		maxSpine,
		recommended,
		material,
		notes
	};
}

/**
 * Calculate total arrow weight
 */
export function calculateTotalWeight(
	shaftWeight: number,
	arrowLength: number,
	pointWeight: number,
	nockWeight: number,
	fletchingWeight: number
): number {
	const totalShaftWeight = shaftWeight * arrowLength;
	return totalShaftWeight + pointWeight + nockWeight + fletchingWeight;
}

/**
 * Calculate Grains Per Pound (GPP)
 */
export function calculateGPP(totalWeight: number, drawWeight: number): number {
	return totalWeight / drawWeight;
}

/**
 * Calculate Front of Center (FOC) percentage
 */
export function calculateFOC(
	arrowLength: number,
	pointWeight: number,
	totalWeight: number
): number {
	const balancePoint = arrowLength / 2;
	const frontWeight = pointWeight;

	// Simplified FOC calculation
	const actualBalancePoint = (frontWeight * arrowLength) / totalWeight;
	const foc = ((actualBalancePoint - balancePoint) / arrowLength) * 100;

	return Math.max(0, foc);
}

/**
 * Calculate optimal point weight for desired arrow characteristics
 */
export function calculateOptimalPointWeight(
	drawWeight: number,
	drawLength: number,
	desiredGPP: number,
	shaftWeight: number,
	arrowLength: number,
	nockWeight: number,
	fletchingWeight: number
): number {
	const desiredTotalWeight = desiredGPP * drawWeight;
	const shaftTotalWeight = shaftWeight * arrowLength;
	const fixedWeight = shaftTotalWeight + nockWeight + fletchingWeight;

	return Math.max(75, desiredTotalWeight - fixedWeight);
}

/**
 * Perform comprehensive safety checks
 */
export function performSafetyCheck(config: ArrowConfiguration): SafetyCheck {
	const gppCheck = checkGPP(config.gpp);
	const lengthCheck = checkArrowLength(config.drawLength, config.arrowLength);
	const spineCheck = checkSpine(config.drawWeight, config.drawLength, config.spineValue);

	let overall: 'safe' | 'warning' | 'danger' = 'safe';

	if (
		gppCheck.status === 'danger' ||
		lengthCheck.status === 'danger' ||
		spineCheck.status === 'danger'
	) {
		overall = 'danger';
	} else if (
		gppCheck.status === 'warning' ||
		lengthCheck.status === 'warning' ||
		spineCheck.status === 'warning'
	) {
		overall = 'warning';
	}

	return {
		gpp: gppCheck,
		arrowLength: lengthCheck,
		spine: spineCheck,
		overall
	};
}

function checkGPP(gpp: number) {
	if (gpp < 5) {
		return {
			value: gpp,
			status: 'danger' as const,
			message: 'DANGER: GPP below 5 can damage your bow and is unsafe!'
		};
	} else if (gpp < 6) {
		return {
			value: gpp,
			status: 'warning' as const,
			message: 'WARNING: GPP below 6 may reduce bow life and performance.'
		};
	} else if (gpp > 10) {
		return {
			value: gpp,
			status: 'warning' as const,
			message: 'High GPP - arrow will be slow but very quiet.'
		};
	} else {
		return {
			value: gpp,
			status: 'safe' as const,
			message: 'GPP is in the optimal range for performance and safety.'
		};
	}
}

function checkArrowLength(drawLength: number, arrowLength: number) {
	const overhang = arrowLength - drawLength;

	if (overhang < 0.5) {
		return {
			status: 'danger' as const,
			message: 'DANGER: Arrow too short! Risk of overdraw and injury.'
		};
	} else if (overhang < 1) {
		return {
			status: 'warning' as const,
			message: 'WARNING: Minimal safety margin. Ensure consistent anchor point.'
		};
	} else if (overhang > 3) {
		return {
			status: 'warning' as const,
			message: 'Arrow is quite long - will reduce speed and increase wind drift.'
		};
	} else {
		return {
			status: 'safe' as const,
			message: 'Arrow length provides good safety margin.'
		};
	}
}

function checkSpine(drawWeight: number, drawLength: number, spineValue: number) {
	// Rough spine check - this is simplified
	const estimatedOptimalSpine = drawWeight * 0.9 + (drawLength - 28) * 10;
	const difference = Math.abs(spineValue - estimatedOptimalSpine);

	if (difference > 100) {
		return {
			status: 'danger' as const,
			message: 'Spine appears significantly mismatched - poor accuracy expected.'
		};
	} else if (difference > 50) {
		return {
			status: 'warning' as const,
			message: 'Spine may not be optimal - consider tuning or different spine.'
		};
	} else {
		return {
			status: 'safe' as const,
			message: 'Spine appears well-matched to your setup.'
		};
	}
}
