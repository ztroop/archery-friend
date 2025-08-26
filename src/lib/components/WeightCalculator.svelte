<script lang="ts">
	import type { ArrowConfiguration } from '../types';
	import { componentDatabase } from '../data';
	import { calculateTotalWeight, calculateFOC } from '../calculations';

	export let config: Partial<ArrowConfiguration>;
	export let arrowLength: number;
	export let totalWeight: number;
	export let foc: number;

	let customPoint = { name: 'Custom Point', weight: 125 };
	let customNock = { name: 'Custom Nock', weight: 8 };
	let customFletching = { name: 'Custom Fletching', weight: 21 };

	$: pointComponents = componentDatabase.filter((c) => c.category === 'point');
	$: nockComponents = componentDatabase.filter((c) => c.category === 'nock');
	$: fletchingComponents = componentDatabase.filter((c) => c.category === 'fletching');

	function selectComponent(component: (typeof componentDatabase)[0]) {
		if (component.category === 'point') {
			config.pointWeight = component.weight;
		} else if (component.category === 'nock') {
			config.nockWeight = component.weight;
		} else if (component.category === 'fletching') {
			config.fletchingWeight = component.weight;
		}
	}

	function getWeightDistribution() {
		if (!totalWeight) return null;

		const shaftWeight = (config.shaftWeight || 0) * arrowLength;
		return {
			shaft: {
				weight: shaftWeight,
				percentage: (shaftWeight / totalWeight) * 100
			},
			point: {
				weight: config.pointWeight || 0,
				percentage: ((config.pointWeight || 0) / totalWeight) * 100
			},
			nock: {
				weight: config.nockWeight || 0,
				percentage: ((config.nockWeight || 0) / totalWeight) * 100
			},
			fletching: {
				weight: config.fletchingWeight || 0,
				percentage: ((config.fletchingWeight || 0) / totalWeight) * 100
			}
		};
	}

	$: weightDistribution = getWeightDistribution();
</script>

<div class="space-y-6">
	<div class="text-center">
		<h2 class="mb-2 text-2xl font-bold text-gray-800">⚖️ Total Arrow Weight Calculator</h2>
		<p class="text-gray-600">Calculate total arrow weight and FOC with our component database</p>
	</div>

	<!-- Shaft Weight Input -->
	<div class="rounded-lg bg-blue-50 p-6">
		<h3 class="mb-4 text-lg font-medium text-gray-700">🏹 Shaft Information</h3>
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
			<div>
				<label for="shaftWeight" class="mb-2 block font-medium text-gray-700">
					Shaft Weight (grains per inch)
				</label>
				<input
					id="shaftWeight"
					type="number"
					min="5"
					max="20"
					step="0.1"
					bind:value={config.shaftWeight}
					class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
					placeholder="8.5"
				/>
			</div>
			<div>
				<label for="arrowLength" class="mb-2 block font-medium text-gray-700">
					Arrow Length (inches)
				</label>
				<input
					id="arrowLength"
					type="number"
					min="20"
					max="35"
					step="0.25"
					value={arrowLength}
					class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
					placeholder="29.0"
					readonly
				/>
				<p class="mt-1 text-xs text-gray-500">Calculated from Arrow Length tab</p>
			</div>
		</div>
	</div>

	<!-- Point Weight Selection -->
	<div class="rounded-lg bg-red-50 p-6">
		<h3 class="mb-4 text-lg font-medium text-gray-700">🔺 Point/Tip Selection</h3>
		<div class="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
			{#each pointComponents as component}
				<button
					class="rounded-lg border p-3 text-sm transition-all
						{config.pointWeight === component.weight
						? 'border-red-500 bg-red-100 text-red-700'
						: 'border-gray-200 hover:border-red-300 hover:bg-red-50'}"
					on:click={() => selectComponent(component)}
				>
					<div class="font-medium">{component.weight}gr</div>
					<div class="text-xs text-gray-600">{component.name}</div>
				</button>
			{/each}
		</div>

		<!-- Custom Point Weight -->
		<div class="border-t pt-4">
			<label for="customPointWeight" class="mb-2 block font-medium text-gray-700">
				Custom Point Weight (grains)
			</label>
			<input
				id="customPointWeight"
				type="number"
				min="50"
				max="300"
				step="5"
				bind:value={config.pointWeight}
				class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-red-500 focus:ring-2 focus:ring-red-500"
				placeholder="125"
			/>
		</div>
	</div>

	<!-- Nock Selection -->
	<div class="rounded-lg bg-green-50 p-6">
		<h3 class="mb-4 text-lg font-medium text-gray-700">🎯 Nock Selection</h3>
		<div class="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
			{#each nockComponents as component}
				<button
					class="rounded-lg border p-3 text-sm transition-all
						{config.nockWeight === component.weight
						? 'border-green-500 bg-green-100 text-green-700'
						: 'border-gray-200 hover:border-green-300 hover:bg-green-50'}"
					on:click={() => selectComponent(component)}
				>
					<div class="font-medium">{component.weight}gr</div>
					<div class="text-xs text-gray-600">{component.name.replace('Nock', '').trim()}</div>
				</button>
			{/each}
		</div>

		<!-- Custom Nock Weight -->
		<div class="border-t pt-4">
			<label for="customNockWeight" class="mb-2 block font-medium text-gray-700">
				Custom Nock Weight (grains)
			</label>
			<input
				id="customNockWeight"
				type="number"
				min="3"
				max="50"
				step="1"
				bind:value={config.nockWeight}
				class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-500"
				placeholder="8"
			/>
		</div>
	</div>

	<!-- Fletching Selection -->
	<div class="rounded-lg bg-purple-50 p-6">
		<h3 class="mb-4 text-lg font-medium text-gray-700">🪶 Fletching Selection</h3>
		<div class="mb-4 grid grid-cols-1 gap-3 md:grid-cols-3">
			{#each fletchingComponents as component}
				<button
					class="rounded-lg border p-3 text-sm transition-all
						{config.fletchingWeight === component.weight
						? 'border-purple-500 bg-purple-100 text-purple-700'
						: 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'}"
					on:click={() => selectComponent(component)}
				>
					<div class="font-medium">{component.weight}gr</div>
					<div class="text-xs text-gray-600">{component.name}</div>
				</button>
			{/each}
		</div>

		<!-- Custom Fletching Weight -->
		<div class="border-t pt-4">
			<label for="customFletchingWeight" class="mb-2 block font-medium text-gray-700">
				Custom Fletching Weight (grains)
			</label>
			<input
				id="customFletchingWeight"
				type="number"
				min="5"
				max="50"
				step="1"
				bind:value={config.fletchingWeight}
				class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
				placeholder="21"
			/>
		</div>
	</div>

	<!-- Results -->
	{#if totalWeight}
		<div class="rounded-lg bg-gray-50 p-6">
			<h3 class="mb-4 text-lg font-medium text-gray-700">📊 Weight Analysis</h3>

			<!-- Total Weight Display -->
			<div class="mb-6 text-center">
				<div class="mb-2 text-4xl font-bold text-blue-600">
					{totalWeight.toFixed(1)} grains
				</div>
				<div class="text-lg text-gray-600">Total Arrow Weight</div>
			</div>

			<!-- Weight Distribution -->
			{#if weightDistribution}
				<div class="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
					<div class="rounded-lg bg-white p-4 text-center">
						<div class="text-lg font-semibold text-blue-600">
							{weightDistribution.shaft.weight.toFixed(1)}gr
						</div>
						<div class="text-sm text-gray-600">Shaft</div>
						<div class="text-xs text-gray-500">
							{weightDistribution.shaft.percentage.toFixed(1)}%
						</div>
					</div>
					<div class="rounded-lg bg-white p-4 text-center">
						<div class="text-lg font-semibold text-red-600">
							{weightDistribution.point.weight}gr
						</div>
						<div class="text-sm text-gray-600">Point</div>
						<div class="text-xs text-gray-500">
							{weightDistribution.point.percentage.toFixed(1)}%
						</div>
					</div>
					<div class="rounded-lg bg-white p-4 text-center">
						<div class="text-lg font-semibold text-green-600">
							{weightDistribution.nock.weight}gr
						</div>
						<div class="text-sm text-gray-600">Nock</div>
						<div class="text-xs text-gray-500">
							{weightDistribution.nock.percentage.toFixed(1)}%
						</div>
					</div>
					<div class="rounded-lg bg-white p-4 text-center">
						<div class="text-lg font-semibold text-purple-600">
							{weightDistribution.fletching.weight}gr
						</div>
						<div class="text-sm text-gray-600">Fletching</div>
						<div class="text-xs text-gray-500">
							{weightDistribution.fletching.percentage.toFixed(1)}%
						</div>
					</div>
				</div>
			{/if}

			<!-- FOC Calculation -->
			{#if foc !== undefined}
				<div class="rounded-lg bg-white p-4">
					<h4 class="mb-2 font-medium text-gray-700">📐 Front of Center (FOC)</h4>
					<div class="flex items-center justify-between">
						<div>
							<span class="text-2xl font-bold text-orange-600">{foc.toFixed(1)}%</span>
							<p class="mt-1 text-sm text-gray-600">
								{#if foc < 7}
									Low FOC - Fast but less stable
								{:else if foc < 15}
									Good FOC - Balanced performance
								{:else}
									High FOC - Stable but slower
								{/if}
							</p>
						</div>
						<div class="text-right text-sm text-gray-600">
							<div>Optimal range: 7-15%</div>
							<div>Hunting: 10-15%</div>
							<div>Target: 7-12%</div>
						</div>
					</div>
				</div>
			{/if}
		</div>
	{/if}

	<!-- Educational Content -->
	<div class="rounded-lg bg-yellow-50 p-6">
		<h3 class="mb-3 text-lg font-medium text-gray-700">📚 Understanding Arrow Weight</h3>
		<div class="grid grid-cols-1 gap-4 text-sm text-gray-600 md:grid-cols-2">
			<div>
				<h4 class="mb-2 font-medium">Weight Distribution Impact:</h4>
				<ul class="space-y-1">
					<li>• <strong>Front Heavy:</strong> More stable, penetrates better</li>
					<li>• <strong>Balanced:</strong> Good all-around performance</li>
					<li>• <strong>Rear Heavy:</strong> Faster but less stable</li>
				</ul>

				<h4 class="mt-4 mb-2 font-medium">FOC Guidelines:</h4>
				<ul class="space-y-1">
					<li>• <strong>7-12%:</strong> Target shooting</li>
					<li>• <strong>10-15%:</strong> Hunting</li>
					<li>• <strong>15%+:</strong> Maximum penetration</li>
				</ul>
			</div>
			<div>
				<h4 class="mb-2 font-medium">Component Considerations:</h4>
				<ul class="space-y-1">
					<li>• <strong>Points:</strong> Biggest impact on FOC and spine</li>
					<li>• <strong>Nocks:</strong> Minimal weight, big safety factor</li>
					<li>• <strong>Fletching:</strong> Affects stability and clearance</li>
					<li>• <strong>Shaft:</strong> Base weight, determines spine needs</li>
				</ul>

				<p class="mt-4">
					<strong>Pro Tip:</strong> Consistent component weights are crucial for accuracy!
				</p>
			</div>
		</div>
	</div>
</div>
