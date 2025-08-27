<script lang="ts">
	import type { ArrowConfiguration } from '../types';
	import { calculateOptimalPointWeight } from '../calculations';

	export let config: Partial<ArrowConfiguration>;

	let desiredGPP = 7.5;
	let shootingStyle: 'target' | 'hunting' | 'traditional' = 'target';
	let broadheadWeight = 125;

	$: optimalPointWeight =
		config.drawWeight &&
		config.drawLength &&
		config.shaftWeight &&
		config.arrowLength &&
		config.nockWeight &&
		config.fletchingWeight
			? calculateOptimalPointWeight(
					config.drawWeight,
					config.drawLength,
					desiredGPP,
					config.shaftWeight,
					config.arrowLength,
					config.nockWeight,
					config.fletchingWeight
				)
			: null;

	function getPointWeightRecommendations() {
		if (!config.drawWeight || !config.drawLength) return [];

		const baseRecommendations = [];

		// Based on shooting style
		if (shootingStyle === 'target') {
			baseRecommendations.push({
				weight: 100,
				purpose: 'Target/3D Competition',
				description: 'Fast, flat trajectory for precise target work',
				pros: ['Maximum speed', 'Flat trajectory', 'Less wind drift'],
				cons: ['Less forgiving', 'Requires perfect form', 'Lower penetration']
			});
			baseRecommendations.push({
				weight: 125,
				purpose: 'General Target Practice',
				description: 'Balanced performance for recreational shooting',
				pros: ['Good speed', 'Forgiving', 'Versatile'],
				cons: ['Moderate in all aspects']
			});
		}

		if (shootingStyle === 'hunting') {
			baseRecommendations.push({
				weight: 125,
				purpose: 'Light Game Hunting',
				description: 'Good balance of speed and penetration',
				pros: ['Decent speed', 'Good penetration', 'Versatile'],
				cons: ['May lack penetration on large game']
			});
			baseRecommendations.push({
				weight: 150,
				purpose: 'Medium to Large Game',
				description: 'Enhanced penetration for ethical harvests',
				pros: ['Excellent penetration', 'Better FOC', 'Quieter'],
				cons: ['Slower speed', 'More arc']
			});
			baseRecommendations.push({
				weight: 200,
				purpose: 'Large/Dangerous Game',
				description: 'Maximum penetration and momentum',
				pros: ['Maximum penetration', 'High momentum', 'Very quiet'],
				cons: ['Significant speed loss', 'High arc']
			});
		}

		if (shootingStyle === 'traditional') {
			baseRecommendations.push({
				weight: 150,
				purpose: 'Traditional Shooting',
				description: 'Classic weight for traditional archery',
				pros: ['Good penetration', 'Forgiving', 'Quiet'],
				cons: ['Moderate speed']
			});
			baseRecommendations.push({
				weight: 190,
				purpose: 'Heavy Traditional',
				description: 'Maximum traditional performance',
				pros: ['Excellent penetration', 'Very quiet', 'High FOC'],
				cons: ['Slow speed', 'High trajectory']
			});
		}

		return baseRecommendations;
	}

	$: recommendations =
		config.drawWeight && config.drawLength && shootingStyle ? getPointWeightRecommendations() : [];

	function calculateBroadheadMatch() {
		if (!config.pointWeight || !broadheadWeight) return null;

		const difference = Math.abs(config.pointWeight - broadheadWeight);
		let status = 'good';
		let message = 'Perfect match - no tuning needed';

		if (difference > 25) {
			status = 'warning';
			message = 'Significant difference - expect impact shift';
		} else if (difference > 10) {
			status = 'caution';
			message = 'Minor difference - slight tuning may be needed';
		}

		return { difference, status, message };
	}

	$: broadheadMatch = config.pointWeight && broadheadWeight ? calculateBroadheadMatch() : null;

	function getTrajectoryComparison() {
		if (!config.pointWeight) return [];

		const weights = [100, 125, 150, 200];
		return weights.map((weight) => {
			const speedMultiplier = Math.sqrt(400 / (400 + (weight - 125) * 2)); // Simplified calculation
			const relativeSpeed = Math.round(speedMultiplier * 100);
			const drop20 = Math.round((1 / speedMultiplier) * 3); // Simplified drop calculation

			return {
				weight,
				relativeSpeed,
				drop20,
				isSelected: weight === config.pointWeight
			};
		});
	}

	$: trajectoryComparison = config.pointWeight ? getTrajectoryComparison() : [];
</script>

<div class="space-y-6">
	<div class="text-center">
		<h2 class="mb-2 text-2xl font-bold text-gray-800">🔺 Point Weight Recommendations</h2>
		<p class="text-gray-600">
			Find the optimal point weight for your shooting style and performance goals
		</p>
	</div>

	<!-- Shooting Style Selection -->
	<div class="rounded-lg bg-blue-50 p-6">
		<h3 class="mb-4 text-lg font-medium text-gray-700">🎯 Shooting Style</h3>
		<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
			<label class="relative">
				<input type="radio" bind:group={shootingStyle} value="target" class="sr-only" />
				<div
					class="cursor-pointer rounded-lg border-2 p-4 transition-all
					{shootingStyle === 'target'
						? 'border-blue-500 bg-blue-100'
						: 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'}"
				>
					<div class="mb-2 flex items-center justify-between">
						<span class="font-semibold">Target/3D</span>
						{#if shootingStyle === 'target'}
							<span class="text-blue-600">✓</span>
						{/if}
					</div>
					<p class="text-sm text-gray-600">
						Precision shooting, competition, recreational target practice
					</p>
				</div>
			</label>

			<label class="relative">
				<input type="radio" bind:group={shootingStyle} value="hunting" class="sr-only" />
				<div
					class="cursor-pointer rounded-lg border-2 p-4 transition-all
					{shootingStyle === 'hunting'
						? 'border-green-500 bg-green-100'
						: 'border-gray-200 hover:border-green-300 hover:bg-green-50'}"
				>
					<div class="mb-2 flex items-center justify-between">
						<span class="font-semibold">Hunting</span>
						{#if shootingStyle === 'hunting'}
							<span class="text-green-600">✓</span>
						{/if}
					</div>
					<p class="text-sm text-gray-600">Bowhunting, maximum penetration, ethical harvests</p>
				</div>
			</label>

			<label class="relative">
				<input type="radio" bind:group={shootingStyle} value="traditional" class="sr-only" />
				<div
					class="cursor-pointer rounded-lg border-2 p-4 transition-all
					{shootingStyle === 'traditional'
						? 'border-amber-500 bg-amber-100'
						: 'border-gray-200 hover:border-amber-300 hover:bg-amber-50'}"
				>
					<div class="mb-2 flex items-center justify-between">
						<span class="font-semibold">Traditional</span>
						{#if shootingStyle === 'traditional'}
							<span class="text-amber-600">✓</span>
						{/if}
					</div>
					<p class="text-sm text-gray-600">
						Traditional archery, instinctive shooting, historical accuracy
					</p>
				</div>
			</label>
		</div>
	</div>

	<!-- Optimal Point Weight for Desired GPP -->
	<div class="rounded-lg bg-green-50 p-6">
		<h3 class="mb-4 text-lg font-medium text-gray-700">⚖️ GPP-Based Recommendation</h3>
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			<div>
				<label for="desiredGPP" class="mb-2 block font-medium text-gray-700"> Desired GPP </label>
				<input
					id="desiredGPP"
					type="number"
					min="5"
					max="12"
					step="0.1"
					bind:value={desiredGPP}
					class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-500"
				/>
				<div class="mt-1 text-xs text-gray-500">Speed: 6-7 • Balanced: 7-9 • Heavy: 9+</div>
			</div>

			{#if optimalPointWeight}
				<div class="rounded-lg bg-white p-4">
					<div class="text-center">
						<div class="mb-1 text-3xl font-bold text-green-600">
							{Math.round(optimalPointWeight)}gr
						</div>
						<div class="text-sm text-gray-600">Optimal Point Weight</div>
						<div class="mt-1 text-xs text-gray-500">
							For {desiredGPP} GPP with your setup
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>

	<!-- Point Weight Recommendations -->
	{#if recommendations.length > 0}
		<div class="rounded-lg border bg-white p-6">
			<h3 class="mb-4 text-lg font-medium text-gray-700">💡 Recommended Weights</h3>
			<div class="space-y-4">
				{#each recommendations as rec (rec.weight)}
					<div
						class="cursor-pointer rounded-lg border p-4 hover:bg-gray-50"
						on:click={() => (config.pointWeight = rec.weight)}
						on:keydown={(e) => e.key === 'Enter' && (config.pointWeight = rec.weight)}
						role="button"
						tabindex="0"
					>
						<div class="mb-2 flex items-center justify-between">
							<div>
								<span class="text-lg font-semibold text-gray-800">{rec.weight}gr</span>
								<span class="ml-2 text-sm text-gray-600">{rec.purpose}</span>
							</div>
							{#if config.pointWeight === rec.weight}
								<span class="text-green-600">✓</span>
							{/if}
						</div>
						<p class="mb-3 text-sm text-gray-600">{rec.description}</p>
						<div class="grid grid-cols-1 gap-4 text-xs md:grid-cols-2">
							<div>
								<span class="font-medium text-green-600">Pros:</span>
								<ul class="ml-2 text-gray-600">
									{#each rec.pros as pro, i (i)}
										<li>• {pro}</li>
									{/each}
								</ul>
							</div>
							<div>
								<span class="font-medium text-orange-600">Cons:</span>
								<ul class="ml-2 text-gray-600">
									{#each rec.cons as con, i (i)}
										<li>• {con}</li>
									{/each}
								</ul>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Broadhead Matching -->
	{#if shootingStyle === 'hunting'}
		<div class="rounded-lg bg-red-50 p-6">
			<h3 class="mb-4 text-lg font-medium text-gray-700">🗡️ Broadhead Weight Matching</h3>
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				<div>
					<label for="broadheadWeight" class="mb-2 block font-medium text-gray-700">
						Broadhead Weight (grains)
					</label>
					<input
						id="broadheadWeight"
						type="number"
						min="75"
						max="300"
						step="5"
						bind:value={broadheadWeight}
						class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-red-500 focus:ring-2 focus:ring-red-500"
					/>
				</div>

				{#if broadheadMatch && config.pointWeight}
					<div class="rounded-lg bg-white p-4">
						<div class="text-center">
							<div
								class="mb-1 text-2xl font-bold
								{broadheadMatch.status === 'good'
									? 'text-green-600'
									: broadheadMatch.status === 'caution'
										? 'text-yellow-600'
										: 'text-red-600'}"
							>
								{broadheadMatch.difference}gr
							</div>
							<div class="mb-2 text-sm text-gray-600">Weight Difference</div>
							<div
								class="text-xs
								{broadheadMatch.status === 'good'
									? 'text-green-600'
									: broadheadMatch.status === 'caution'
										? 'text-yellow-600'
										: 'text-red-600'}"
							>
								{broadheadMatch.message}
							</div>
						</div>
					</div>
				{/if}
			</div>

			<div class="mt-4 rounded-lg bg-white p-4">
				<h4 class="mb-2 font-medium text-gray-700">🎯 Matching Guidelines</h4>
				<ul class="space-y-1 text-sm text-gray-600">
					<li>• <strong>0-10gr difference:</strong> Minimal impact, may not need retuning</li>
					<li>
						• <strong>10-25gr difference:</strong> Slight impact shift, minor tuning recommended
					</li>
					<li>
						• <strong>25gr+ difference:</strong> Significant impact change, full retuning needed
					</li>
					<li>
						• <strong>Pro tip:</strong> Practice with field points matching your broadhead weight
					</li>
				</ul>
			</div>
		</div>
	{/if}

	<!-- Trajectory Comparison -->
	{#if trajectoryComparison.length > 0}
		<div class="rounded-lg bg-purple-50 p-6">
			<h3 class="mb-4 text-lg font-medium text-gray-700">📈 Trajectory Comparison</h3>
			<div class="overflow-x-auto">
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b">
							<th class="p-2 text-left">Point Weight</th>
							<th class="p-2 text-left">Relative Speed</th>
							<th class="p-2 text-left">20yd Drop</th>
							<th class="p-2 text-left">Best For</th>
						</tr>
					</thead>
					<tbody>
						{#each trajectoryComparison as traj (traj.weight)}
							<tr class="border-b {traj.isSelected ? 'bg-purple-100' : ''}">
								<td class="p-2 font-medium">{traj.weight}gr</td>
								<td class="p-2">{traj.relativeSpeed}%</td>
								<td class="p-2">{traj.drop20}"</td>
								<td class="p-2 text-gray-600">
									{#if traj.weight <= 100}
										Target, 3D competition
									{:else if traj.weight <= 125}
										General purpose, versatile
									{:else if traj.weight <= 150}
										Hunting, good penetration
									{:else}
										Large game, maximum penetration
									{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	{/if}

	<!-- Educational Content -->
	<div class="rounded-lg bg-yellow-50 p-6">
		<h3 class="mb-3 text-lg font-medium text-gray-700">📚 Point Weight Effects</h3>
		<div class="grid grid-cols-1 gap-4 text-sm text-gray-600 md:grid-cols-2">
			<div>
				<h4 class="mb-2 font-medium">Performance Impact:</h4>
				<ul class="space-y-1">
					<li>• <strong>Heavier Points:</strong> Slower speed, better penetration</li>
					<li>• <strong>Lighter Points:</strong> Faster speed, flatter trajectory</li>
					<li>• <strong>FOC:</strong> Heavier points increase front-of-center</li>
					<li>• <strong>Stability:</strong> Higher FOC generally more stable</li>
				</ul>
			</div>
			<div>
				<h4 class="mb-2 font-medium">Tuning Considerations:</h4>
				<ul class="space-y-1">
					<li>• <strong>Dynamic Spine:</strong> Heavier points weaken effective spine</li>
					<li>• <strong>Broadhead Matching:</strong> Critical for hunting accuracy</li>
					<li>• <strong>Kinetic Energy:</strong> Balance of speed and weight</li>
					<li>• <strong>Momentum:</strong> Weight more important than speed</li>
				</ul>
			</div>
		</div>
	</div>
</div>
