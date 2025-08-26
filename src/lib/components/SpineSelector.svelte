<script lang="ts">
	import type { ArrowConfiguration, ArrowMaterial } from '../types';
	import { calculateSpineRecommendation } from '../calculations';
	import { shaftDatabase } from '../data';

	export let config: Partial<ArrowConfiguration>;

	let spineRecommendation: ReturnType<typeof calculateSpineRecommendation> | null = null;
	let filteredShafts: typeof shaftDatabase = [];

	$: if (config.drawWeight && config.drawLength && config.pointWeight && config.arrowMaterial) {
		spineRecommendation = calculateSpineRecommendation(
			config.drawWeight,
			config.drawLength,
			config.pointWeight,
			config.arrowMaterial
		);

		// Filter shafts by material and spine range
		filteredShafts = shaftDatabase
			.filter((shaft) => shaft.material === config.arrowMaterial)
			.filter((shaft) => {
				if (!spineRecommendation) return true;
				return (
					shaft.spine >= spineRecommendation.minSpine && shaft.spine <= spineRecommendation.maxSpine
				);
			})
			.sort((a, b) => a.spine - b.spine);
	}

	function selectShaft(shaft: (typeof shaftDatabase)[0]) {
		config.spineValue = shaft.spine;
		config.shaftWeight = shaft.weight;
		config.arrowMaterial = shaft.material;
	}

	const materials: { value: ArrowMaterial; label: string; description: string }[] = [
		{
			value: 'carbon',
			label: 'Carbon',
			description: 'Lightweight, durable, consistent. Best all-around choice.'
		},
		{
			value: 'aluminum',
			label: 'Aluminum',
			description: 'Precise, straightens easily, good for target shooting.'
		},
		{
			value: 'wood',
			label: 'Wood',
			description: 'Traditional, natural feel, requires more maintenance.'
		}
	];
</script>

<div class="space-y-6">
	<div class="text-center">
		<h2 class="mb-2 text-2xl font-bold text-gray-800">🎯 Arrow Spine Selection</h2>
		<p class="text-gray-600">Find the perfect spine for your bow setup with dynamic calculations</p>
	</div>

	<!-- Input Parameters -->
	<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
		<div class="rounded-lg bg-blue-50 p-4">
			<label for="drawWeight" class="mb-2 block font-medium text-gray-700">
				Draw Weight (lbs)
			</label>
			<input
				id="drawWeight"
				type="number"
				min="15"
				max="100"
				step="1"
				bind:value={config.drawWeight}
				class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
				placeholder="50"
			/>
		</div>

		<div class="rounded-lg bg-green-50 p-4">
			<label for="drawLength" class="mb-2 block font-medium text-gray-700">
				Draw Length (inches)
			</label>
			<input
				id="drawLength"
				type="number"
				min="20"
				max="35"
				step="0.25"
				bind:value={config.drawLength}
				class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-500"
				placeholder="28.0"
			/>
		</div>

		<div class="rounded-lg bg-purple-50 p-4">
			<label for="pointWeight" class="mb-2 block font-medium text-gray-700">
				Point Weight (grains)
			</label>
			<input
				id="pointWeight"
				type="number"
				min="50"
				max="300"
				step="5"
				bind:value={config.pointWeight}
				class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
				placeholder="125"
			/>
		</div>
	</div>

	<!-- Material Selection -->
	<div class="rounded-lg bg-gray-50 p-6">
		<h3 class="mb-4 text-lg font-medium text-gray-700">Arrow Material</h3>
		<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
			{#each materials as material}
				<label class="relative">
					<input
						type="radio"
						bind:group={config.arrowMaterial}
						value={material.value}
						class="sr-only"
					/>
					<div
						class="cursor-pointer rounded-lg border-2 p-4 transition-all
						{config.arrowMaterial === material.value
							? 'border-blue-500 bg-blue-100'
							: 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'}"
					>
						<div class="mb-2 flex items-center justify-between">
							<span class="font-semibold">{material.label}</span>
							{#if config.arrowMaterial === material.value}
								<span class="text-blue-600">✓</span>
							{/if}
						</div>
						<p class="text-sm text-gray-600">{material.description}</p>
					</div>
				</label>
			{/each}
		</div>
	</div>

	<!-- Spine Recommendation -->
	{#if spineRecommendation}
		<div class="rounded-lg bg-yellow-50 p-6">
			<h3 class="mb-4 text-lg font-medium text-gray-700">📊 Spine Recommendations</h3>
			<div class="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
				<div class="text-center">
					<div class="text-2xl font-bold text-green-600">{spineRecommendation.recommended}</div>
					<div class="text-sm text-gray-600">Recommended</div>
				</div>
				<div class="text-center">
					<div class="text-lg font-semibold text-gray-700">
						{spineRecommendation.minSpine} - {spineRecommendation.maxSpine}
					</div>
					<div class="text-sm text-gray-600">Acceptable Range</div>
				</div>
				<div class="text-center">
					<div class="text-lg font-semibold text-blue-600 capitalize">
						{spineRecommendation.material}
					</div>
					<div class="text-sm text-gray-600">Material</div>
				</div>
			</div>

			{#if spineRecommendation.notes.length > 0}
				<div class="rounded-lg bg-white p-4">
					<h4 class="mb-2 font-medium text-gray-700">📝 Setup Notes</h4>
					<ul class="space-y-1 text-sm text-gray-600">
						{#each spineRecommendation.notes as note}
							<li>• {note}</li>
						{/each}
					</ul>
				</div>
			{/if}
		</div>
	{/if}

	<!-- Shaft Selection -->
	{#if filteredShafts.length > 0}
		<div class="rounded-lg border bg-white p-6">
			<h3 class="mb-4 text-lg font-medium text-gray-700">🏹 Recommended Shafts</h3>
			<div class="space-y-3">
				{#each filteredShafts as shaft}
					<div
						class="cursor-pointer rounded-lg border p-4 transition-all hover:bg-gray-50
						{config.spineValue === shaft.spine && config.shaftWeight === shaft.weight
							? 'border-blue-500 bg-blue-50'
							: 'border-gray-200'}"
						on:click={() => selectShaft(shaft)}
						on:keydown={(e) => e.key === 'Enter' && selectShaft(shaft)}
						role="button"
						tabindex="0"
					>
						<div class="flex items-center justify-between">
							<div>
								<h4 class="font-medium text-gray-800">{shaft.name}</h4>
								<div class="mt-1 text-sm text-gray-600">
									<span class="mr-4 inline-block">Spine: {shaft.spine}</span>
									<span class="mr-4 inline-block">Weight: {shaft.weight} gr/in</span>
									<span class="inline-block">Diameter: {shaft.diameter}mm</span>
								</div>
							</div>
							{#if config.spineValue === shaft.spine && config.shaftWeight === shaft.weight}
								<span class="text-xl text-blue-600">✓</span>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Custom Spine Entry -->
	<div class="rounded-lg bg-orange-50 p-6">
		<h3 class="mb-4 text-lg font-medium text-gray-700">🔧 Custom Spine Entry</h3>
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
			<div>
				<label for="customSpine" class="mb-2 block font-medium text-gray-700"> Spine Value </label>
				<input
					id="customSpine"
					type="number"
					min="200"
					max="900"
					step="10"
					bind:value={config.spineValue}
					class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-500"
					placeholder="400"
				/>
			</div>
			<div>
				<label for="customWeight" class="mb-2 block font-medium text-gray-700">
					Shaft Weight (gr/in)
				</label>
				<input
					id="customWeight"
					type="number"
					min="5"
					max="20"
					step="0.1"
					bind:value={config.shaftWeight}
					class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-500"
					placeholder="8.5"
				/>
			</div>
		</div>
		<p class="mt-2 text-sm text-gray-500">
			💡 Use this if you have a specific shaft not in our database
		</p>
	</div>

	<!-- Educational Content -->
	<div class="rounded-lg bg-indigo-50 p-6">
		<h3 class="mb-3 text-lg font-medium text-gray-700">📚 Understanding Arrow Spine</h3>
		<div class="grid grid-cols-1 gap-4 text-sm text-gray-600 md:grid-cols-2">
			<div>
				<h4 class="mb-2 font-medium">What is Spine?</h4>
				<p class="mb-3">
					Arrow spine measures the stiffness of the arrow shaft. It's critical for accuracy because
					arrows bend when shot.
				</p>

				<h4 class="mb-2 font-medium">Dynamic vs Static Spine:</h4>
				<ul class="space-y-1">
					<li>• <strong>Static:</strong> Measured deflection under standard weight</li>
					<li>• <strong>Dynamic:</strong> How arrow flexes during actual shooting</li>
					<li>• Point weight affects dynamic spine significantly</li>
				</ul>
			</div>
			<div>
				<h4 class="mb-2 font-medium">Factors Affecting Spine:</h4>
				<ul class="space-y-1">
					<li>• <strong>Draw Weight:</strong> Higher = need stiffer spine</li>
					<li>• <strong>Draw Length:</strong> Longer = need stiffer spine</li>
					<li>• <strong>Point Weight:</strong> Heavier = acts like weaker spine</li>
					<li>• <strong>Arrow Length:</strong> Longer = acts like weaker spine</li>
				</ul>

				<p class="mt-3"><strong>Remember:</strong> Lower spine numbers = stiffer arrows</p>
			</div>
		</div>
	</div>
</div>
