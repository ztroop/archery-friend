<script lang="ts">
	import type { ArrowConfiguration } from '../types';

	export let config: Partial<ArrowConfiguration>;
	export let totalWeight: number;
	export let gpp: number;

	function getGPPStatus(gpp: number) {
		if (gpp < 5) return { level: 'danger', color: 'red', message: 'DANGER: Risk of bow damage!' };
		if (gpp < 6)
			return { level: 'warning', color: 'yellow', message: 'WARNING: Below recommended minimum' };
		if (gpp <= 8)
			return {
				level: 'good',
				color: 'green',
				message: 'OPTIMAL: Great balance of speed and safety'
			};
		if (gpp <= 10) return { level: 'safe', color: 'blue', message: 'SAFE: Quiet and forgiving' };
		return { level: 'heavy', color: 'purple', message: 'HEAVY: Very quiet but slow' };
	}

	function getGPPRecommendations(gpp: number) {
		if (gpp < 5) {
			return [
				'Immediately increase arrow weight',
				'Add heavier point weight',
				'Consider longer/heavier shaft',
				'Do not shoot until corrected!'
			];
		}
		if (gpp < 6) {
			return [
				'Increase arrow weight for safety',
				'Consider 25-50gr heavier points',
				'Monitor bow for stress signs',
				'Acceptable for experienced shooters only'
			];
		}
		if (gpp <= 8) {
			return [
				'Excellent balance achieved',
				'Good speed with safety margin',
				'Suitable for hunting and target',
				'Monitor arrow flight for tuning'
			];
		}
		if (gpp <= 10) {
			return [
				'Very safe setup',
				'Excellent for beginners',
				'Quieter shooting',
				'Good penetration for hunting'
			];
		}
		return [
			'Maximum safety margin',
			'Very quiet shooting',
			'Reduced arrow speed',
			'Excellent for close-range hunting'
		];
	}

	$: gppStatus = gpp ? getGPPStatus(gpp) : null;
	$: recommendations = gpp ? getGPPRecommendations(gpp) : [];
</script>

<div class="space-y-6">
	<div class="text-center">
		<h2 class="mb-2 text-2xl font-bold text-gray-800">🔋 GPP Calculator</h2>
		<p class="text-gray-600">
			Ensure your arrow weight is safe for your bow with visual safety indicators
		</p>
	</div>

	<!-- Input Section -->
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
		<div class="rounded-lg bg-blue-50 p-6">
			<label for="drawWeight" class="mb-3 block text-lg font-medium text-gray-700">
				Bow Draw Weight
			</label>
			<div class="flex items-center space-x-4">
				<input
					id="drawWeight"
					type="number"
					min="15"
					max="100"
					step="1"
					bind:value={config.drawWeight}
					class="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
					placeholder="50"
				/>
				<span class="text-lg font-medium text-gray-600">lbs</span>
			</div>
		</div>

		<div class="rounded-lg bg-green-50 p-6">
			<label for="totalWeight" class="mb-3 block text-lg font-medium text-gray-700">
				Total Arrow Weight
			</label>
			<div class="flex items-center space-x-4">
				<input
					id="totalWeight"
					type="number"
					min="200"
					max="1000"
					step="1"
					value={totalWeight}
					class="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-lg focus:border-green-500 focus:ring-2 focus:ring-green-500"
					placeholder="425"
				/>
				<span class="text-lg font-medium text-gray-600">grains</span>
			</div>
			<p class="mt-2 text-sm text-gray-500">
				💡 Calculated automatically in the Weight Calculator tab
			</p>
		</div>
	</div>

	<!-- GPP Result Display -->
	{#if gpp && gppStatus}
		<div class="rounded-lg bg-gray-50 p-8">
			<div class="mb-6 text-center">
				<div
					class="mb-2 text-6xl font-bold
					{gppStatus.color === 'red'
						? 'text-red-600'
						: gppStatus.color === 'yellow'
							? 'text-yellow-600'
							: gppStatus.color === 'green'
								? 'text-green-600'
								: gppStatus.color === 'blue'
									? 'text-blue-600'
									: 'text-purple-600'}"
				>
					{gpp.toFixed(2)}
				</div>
				<div class="mb-2 text-xl text-gray-600">Grains Per Pound</div>
				<div
					class="text-lg font-medium
					{gppStatus.color === 'red'
						? 'text-red-700'
						: gppStatus.color === 'yellow'
							? 'text-yellow-700'
							: gppStatus.color === 'green'
								? 'text-green-700'
								: gppStatus.color === 'blue'
									? 'text-blue-700'
									: 'text-purple-700'}"
				>
					{gppStatus.message}
				</div>
			</div>

			<!-- Visual Indicator Bar -->
			<div class="mb-6">
				<div class="relative h-8 overflow-hidden rounded-full bg-gray-200">
					<!-- Danger Zone -->
					<div class="absolute top-0 left-0 h-full bg-red-500" style="width: 20%;"></div>
					<!-- Warning Zone -->
					<div class="absolute top-0 h-full bg-yellow-500" style="left: 20%; width: 10%;"></div>
					<!-- Optimal Zone -->
					<div class="absolute top-0 h-full bg-green-500" style="left: 30%; width: 30%;"></div>
					<!-- Safe Zone -->
					<div class="absolute top-0 h-full bg-blue-500" style="left: 60%; width: 20%;"></div>
					<!-- Heavy Zone -->
					<div class="absolute top-0 h-full bg-purple-500" style="left: 80%; width: 20%;"></div>

					<!-- Current GPP Indicator -->
					<div
						class="absolute top-0 h-full w-1 border border-white bg-black"
						style="left: {Math.min(95, Math.max(2, (gpp / 12) * 100))}%;"
					></div>
				</div>

				<!-- Scale Labels -->
				<div class="mt-1 flex justify-between text-xs text-gray-600">
					<span>0</span>
					<span>5</span>
					<span>6</span>
					<span>8</span>
					<span>10</span>
					<span>12+</span>
				</div>
			</div>

			<!-- Zone Legend -->
			<div class="grid grid-cols-2 gap-2 text-xs md:grid-cols-5">
				<div class="flex items-center space-x-1">
					<div class="h-3 w-3 rounded bg-red-500"></div>
					<span>Danger (&lt;5)</span>
				</div>
				<div class="flex items-center space-x-1">
					<div class="h-3 w-3 rounded bg-yellow-500"></div>
					<span>Warning (5-6)</span>
				</div>
				<div class="flex items-center space-x-1">
					<div class="h-3 w-3 rounded bg-green-500"></div>
					<span>Optimal (6-8)</span>
				</div>
				<div class="flex items-center space-x-1">
					<div class="h-3 w-3 rounded bg-blue-500"></div>
					<span>Safe (8-10)</span>
				</div>
				<div class="flex items-center space-x-1">
					<div class="h-3 w-3 rounded bg-purple-500"></div>
					<span>Heavy (10+)</span>
				</div>
			</div>
		</div>

		<!-- Recommendations -->
		<div
			class="rounded-lg border-2 bg-white p-6
			{gppStatus.color === 'red'
				? 'border-red-200'
				: gppStatus.color === 'yellow'
					? 'border-yellow-200'
					: gppStatus.color === 'green'
						? 'border-green-200'
						: gppStatus.color === 'blue'
							? 'border-blue-200'
							: 'border-purple-200'}"
		>
			<h3 class="mb-4 text-lg font-medium text-gray-700">📋 Recommendations</h3>
			<ul class="space-y-2">
				{#each recommendations as rec, i (i)}
					<li class="flex items-start space-x-2">
						<span
							class="mt-0.5 text-sm
							{gppStatus.color === 'red'
								? 'text-red-600'
								: gppStatus.color === 'yellow'
									? 'text-yellow-600'
									: gppStatus.color === 'green'
										? 'text-green-600'
										: gppStatus.color === 'blue'
											? 'text-blue-600'
											: 'text-purple-600'}">•</span
						>
						<span class="text-sm text-gray-700">{rec}</span>
					</li>
				{/each}
			</ul>
		</div>
	{/if}

	<!-- Quick GPP Reference -->
	<div class="rounded-lg bg-indigo-50 p-6">
		<h3 class="mb-4 text-lg font-medium text-gray-700">⚡ Quick GPP Reference</h3>
		<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
			<div class="rounded-lg bg-white p-4">
				<h4 class="mb-2 font-medium text-green-600">Speed Focused (6-7 GPP)</h4>
				<ul class="space-y-1 text-sm text-gray-600">
					<li>• Maximum arrow speed</li>
					<li>• Flatter trajectory</li>
					<li>• Requires perfect form</li>
					<li>• Competition/3D archery</li>
				</ul>
			</div>
			<div class="rounded-lg bg-white p-4">
				<h4 class="mb-2 font-medium text-blue-600">Balanced (7-9 GPP)</h4>
				<ul class="space-y-1 text-sm text-gray-600">
					<li>• Good speed & forgiveness</li>
					<li>• Versatile performance</li>
					<li>• Most popular choice</li>
					<li>• All-around shooting</li>
				</ul>
			</div>
			<div class="rounded-lg bg-white p-4">
				<h4 class="mb-2 font-medium text-purple-600">Heavy (9+ GPP)</h4>
				<ul class="space-y-1 text-sm text-gray-600">
					<li>• Maximum penetration</li>
					<li>• Very quiet shooting</li>
					<li>• Forgiving to shoot</li>
					<li>• Hunting/traditional</li>
				</ul>
			</div>
		</div>
	</div>

	<!-- Educational Content -->
	<div class="rounded-lg bg-yellow-50 p-6">
		<h3 class="mb-3 text-lg font-medium text-gray-700">📚 Why GPP Matters</h3>
		<div class="grid grid-cols-1 gap-4 text-sm text-gray-600 md:grid-cols-2">
			<div>
				<h4 class="mb-2 font-medium">Bow Safety & Longevity:</h4>
				<ul class="space-y-1">
					<li>• Too light arrows can damage your bow</li>
					<li>• Minimum 5 GPP prevents dry-fire damage</li>
					<li>• Higher GPP reduces stress on bow components</li>
					<li>• Manufacturer warranties often specify minimum GPP</li>
				</ul>
			</div>
			<div>
				<h4 class="mb-2 font-medium">Performance Trade-offs:</h4>
				<ul class="space-y-1">
					<li>• Lower GPP = faster arrows, less forgiveness</li>
					<li>• Higher GPP = slower arrows, more penetration</li>
					<li>• Sweet spot varies by bow type and use</li>
					<li>• Consider your skill level and shooting goals</li>
				</ul>
			</div>
		</div>

		<div class="mt-4 rounded-lg border-l-4 border-yellow-500 bg-white p-3">
			<p class="text-sm">
				<strong>Remember:</strong> GPP is just one factor. Arrow tuning, spine match, and consistent
				form are equally important for accuracy and safety!
			</p>
		</div>
	</div>
</div>
