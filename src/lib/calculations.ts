import type { ArrowConfiguration, SpineRecommendation, SafetyCheck, ArrowMaterial } from './types';
import { spineConstants, manufacturerSpineRecommendations, pointWeightAdjustments } from './data';

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
 * Get manufacturer-specific spine recommendations
 */
export function getManufacturerSpineRecommendations(
	drawWeight: number,
	pointWeight: number,
	arrowLength: number = 28
): Array<{
	manufacturer: string;
	series: string;
	recommendedSpine: number;
	confidence: 'high' | 'medium' | 'low';
	notes: string[];
}> {
	const recommendations: Array<{
		manufacturer: string;
		series: string;
		recommendedSpine: number;
		confidence: 'high' | 'medium' | 'low';
		notes: string[];
	}> = [];

	// Check Black Eagle recommendations
	Object.entries(manufacturerSpineRecommendations.blackEagle).forEach(([series, spineData]) => {
		const match = spineData.find(
			(data) =>
				drawWeight >= data.drawWeight[0] &&
				drawWeight <= data.drawWeight[1] &&
				pointWeight >= data.pointWeight[0] &&
				pointWeight <= data.pointWeight[1]
		);

		if (match) {
			const notes: string[] = [];
			let confidence: 'high' | 'medium' | 'low' = 'high';

			// Apply arrow length adjustments
			let adjustedSpine = match.recommendedSpine;
			if (arrowLength !== 28) {
				const lengthAdjustment =
					pointWeightAdjustments.adjustmentFactors.arrowLength[
						arrowLength as keyof typeof pointWeightAdjustments.adjustmentFactors.arrowLength
					];
				if (lengthAdjustment !== undefined) {
					adjustedSpine = Math.round(match.recommendedSpine * (1 + lengthAdjustment));
					notes.push(`Adjusted for ${arrowLength}" arrow length`);
					confidence = 'medium';
				}
			}

			// Apply point weight adjustments
			if (pointWeight !== 100) {
				const pointAdjustment =
					pointWeightAdjustments.adjustmentFactors.pointWeight[
						pointWeight as keyof typeof pointWeightAdjustments.adjustmentFactors.pointWeight
					];
				if (pointAdjustment !== undefined) {
					adjustedSpine = Math.round(adjustedSpine * (1 + pointAdjustment));
					notes.push(`Adjusted for ${pointWeight}gr point weight`);
					if (confidence === 'high') confidence = 'medium';
				}
			}

			recommendations.push({
				manufacturer: 'Black Eagle',
				series: series.charAt(0).toUpperCase() + series.slice(1),
				recommendedSpine: adjustedSpine,
				confidence,
				notes
			});
		}
	});

	// Check Easton recommendations
	Object.entries(manufacturerSpineRecommendations.easton).forEach(([series, spineData]) => {
		const match = spineData.find(
			(data) =>
				drawWeight >= data.drawWeight[0] &&
				drawWeight <= data.drawWeight[1] &&
				pointWeight >= data.pointWeight[0] &&
				pointWeight <= data.pointWeight[1]
		);

		if (match) {
			const notes: string[] = [];
			let confidence: 'high' | 'medium' | 'low' = 'high';

			// Apply arrow length adjustments
			let adjustedSpine = match.recommendedSpine;
			if (arrowLength !== 28) {
				const lengthAdjustment =
					pointWeightAdjustments.adjustmentFactors.arrowLength[
						arrowLength as keyof typeof pointWeightAdjustments.adjustmentFactors.arrowLength
					];
				if (lengthAdjustment !== undefined) {
					adjustedSpine = Math.round(match.recommendedSpine * (1 + lengthAdjustment));
					notes.push(`Adjusted for ${arrowLength}" arrow length`);
					confidence = 'medium';
				}
			}

			// Apply point weight adjustments
			if (pointWeight !== 100) {
				const pointAdjustment =
					pointWeightAdjustments.adjustmentFactors.pointWeight[
						pointWeight as keyof typeof pointWeightAdjustments.adjustmentFactors.pointWeight
					];
				if (pointAdjustment !== undefined) {
					adjustedSpine = Math.round(adjustedSpine * (1 + pointAdjustment));
					notes.push(`Adjusted for ${pointWeight}gr point weight`);
					if (confidence === 'high') confidence = 'medium';
				}
			}

			let seriesName = series;
			if (series === 'fmj4mm') seriesName = 'FMJ 4mm';
			else if (series === 'axisTraditional') seriesName = 'Axis Traditional';
			else if (series === 'matchGrade') seriesName = '6.5mm Match Grade';
			else seriesName = series.charAt(0).toUpperCase() + series.slice(1);

			recommendations.push({
				manufacturer: 'Easton',
				series: seriesName,
				recommendedSpine: adjustedSpine,
				confidence,
				notes
			});
		}
	});

	return recommendations.sort((a, b) => a.recommendedSpine - b.recommendedSpine);
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
	// FOC calculation: ((Balance Point - Geometric Center) / Arrow Length) * 100
	// Balance point is calculated using the moment balance equation

	// For an arrow, we need to consider the distribution of weight:
	// - Point weight is concentrated at the front tip (position 0)
	// - Shaft weight is distributed evenly along the shaft
	// - Nock and fletching weight is concentrated at the back (position = arrowLength)

	// Calculate the balance point using moments
	// Moment = weight * distance from reference point (back of arrow)
	const shaftWeight = totalWeight - pointWeight; // This includes nock and fletching

	// Assuming shaft weight is evenly distributed, its center of mass is at arrowLength/2
	// Point weight is at the front tip, distance from back = arrowLength
	const totalMoment = pointWeight * arrowLength + shaftWeight * (arrowLength / 2);
	const balancePoint = totalMoment / totalWeight;

	// Geometric center of the arrow
	const geometricCenter = arrowLength / 2;

	// FOC percentage
	const foc = ((balancePoint - geometricCenter) / arrowLength) * 100;

	return foc;
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
	const spineCheck = checkSpine(
		config.drawWeight,
		config.drawLength,
		config.spineValue,
		config.pointWeight,
		config.arrowMaterial
	);

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

function checkSpine(
	drawWeight: number,
	drawLength: number,
	spineValue: number,
	pointWeight: number,
	arrowMaterial: ArrowMaterial
) {
	// Use the proper spine recommendation calculation
	const spineRecommendation = calculateSpineRecommendation(
		drawWeight,
		drawLength,
		pointWeight,
		arrowMaterial
	);

	if (spineValue < spineRecommendation.minSpine || spineValue > spineRecommendation.maxSpine) {
		// Spine is outside the acceptable range
		const difference = Math.min(
			Math.abs(spineValue - spineRecommendation.minSpine),
			Math.abs(spineValue - spineRecommendation.maxSpine)
		);

		if (difference > 100) {
			return {
				status: 'danger' as const,
				message: 'Spine is significantly outside recommended range - poor accuracy expected.'
			};
		} else {
			return {
				status: 'warning' as const,
				message: 'Spine is outside optimal range - consider tuning or different spine.'
			};
		}
	} else {
		return {
			status: 'safe' as const,
			message: 'Spine is within the recommended range for your setup.'
		};
	}
}
