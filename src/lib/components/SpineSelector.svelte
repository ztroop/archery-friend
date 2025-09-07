<script lang="ts">
	import type { ArrowConfiguration, ArrowMaterial } from '../types';
	import {
		calculateSpineRecommendation,
		getManufacturerSpineRecommendations
	} from '../calculations';
	import { shaftDatabase } from '../data';

	export let config: Partial<ArrowConfiguration>;

	let spineRecommendation: ReturnType<typeof calculateSpineRecommendation> | null = null;
	let manufacturerRecommendations: ReturnType<typeof getManufacturerSpineRecommendations> = [];
	let filteredShafts: typeof shaftDatabase = [];
	let selectedManufacturer: string = 'all';
	let showBrowsableOptions: boolean = false;

	$: if (config.drawWeight && config.drawLength && config.pointWeight && config.arrowMaterial) {
		spineRecommendation = calculateSpineRecommendation(
			config.drawWeight,
			config.drawLength,
			config.pointWeight,
			config.arrowMaterial
		);

		// Get manufacturer-specific recommendations
		manufacturerRecommendations = getManufacturerSpineRecommendations(
			config.drawWeight,
			config.pointWeight,
			config.arrowLength || 28
		);

		// Filter shafts by material and manufacturer (expanded spine range for browsing)
		filteredShafts = shaftDatabase
			.filter((shaft) => shaft.material === config.arrowMaterial)
			.filter((shaft) => {
				if (!spineRecommendation) return true;
				// Expand the range significantly for browsing - show ±150 spine units instead of ±50
				const expandedMinSpine = Math.max(200, spineRecommendation.recommended - 150);
				const expandedMaxSpine = Math.min(900, spineRecommendation.recommended + 150);
				return shaft.spine >= expandedMinSpine && shaft.spine <= expandedMaxSpine;
			})
			.filter((shaft) => {
				if (selectedManufacturer === 'all') return true;
				return shaft.name.toLowerCase().includes(selectedManufacturer.toLowerCase());
			})
			.sort((a, b) => a.spine - b.spine);
	}

	function selectShaft(shaft: (typeof shaftDatabase)[0]) {
		config.spineValue = shaft.spine;
		config.shaftWeight = shaft.weight;
		config.arrowMaterial = shaft.material;
		config.shaftName = shaft.name;
	}

	function isManufacturerRecommended(shaft: (typeof shaftDatabase)[0]): boolean {
		return manufacturerRecommendations.some(
			(rec) =>
				Math.abs(rec.recommendedSpine - shaft.spine) <= 25 &&
				shaft.name.toLowerCase().includes(rec.manufacturer.toLowerCase())
		);
	}

	function getManufacturerMatch(shaft: (typeof shaftDatabase)[0]) {
		return manufacturerRecommendations.find(
			(rec) =>
				Math.abs(rec.recommendedSpine - shaft.spine) <= 25 &&
				shaft.name.toLowerCase().includes(rec.manufacturer.toLowerCase())
		);
	}

	function isInOptimalRange(shaft: (typeof shaftDatabase)[0]): boolean {
		if (!spineRecommendation) return false;
		return (
			shaft.spine >= spineRecommendation.minSpine && shaft.spine <= spineRecommendation.maxSpine
		);
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
			{#each materials as material (material.value)}
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
						{#each spineRecommendation.notes as note, i (i)}
							<li>• {note}</li>
						{/each}
					</ul>
				</div>
			{/if}
		</div>
	{/if}

	<!-- Manufacturer-Specific Recommendations -->
	{#if manufacturerRecommendations.length > 0}
		<div class="rounded-lg bg-green-50 p-6">
			<h3 class="mb-4 text-lg font-medium text-gray-700">🏭 Manufacturer Recommendations</h3>
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
				{#each manufacturerRecommendations as rec (rec.manufacturer + rec.series)}
					<div
						class="rounded-lg border bg-white p-4 {rec.confidence === 'high'
							? 'border-green-300'
							: rec.confidence === 'medium'
								? 'border-yellow-300'
								: 'border-gray-300'}"
					>
						<div class="mb-2 flex items-center justify-between">
							<h4 class="font-semibold text-gray-800">{rec.manufacturer}</h4>
							<span
								class="rounded px-2 py-1 text-xs font-medium {rec.confidence === 'high'
									? 'bg-green-100 text-green-800'
									: rec.confidence === 'medium'
										? 'bg-yellow-100 text-yellow-800'
										: 'bg-gray-100 text-gray-800'}"
							>
								{rec.confidence}
							</span>
						</div>
						<div class="mb-2 text-sm text-gray-600">{rec.series}</div>
						<div class="mb-2 text-xl font-bold text-blue-600">{rec.recommendedSpine}</div>
						{#if rec.notes.length > 0}
							<div class="text-xs text-gray-500">
								{#each rec.notes as note}
									<div>• {note}</div>
								{/each}
							</div>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Enhanced Shaft Selection -->
	{#if filteredShafts.length > 0}
		<div class="rounded-lg border bg-white p-6">
			<div class="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h3 class="text-lg font-medium text-gray-700">🏹 Available Arrow Shafts</h3>
					<p class="text-sm text-gray-500">Click any shaft to select it for your configuration</p>
				</div>
				<div class="flex flex-col gap-2 sm:flex-row sm:items-center">
					<div class="flex items-center gap-2">
						<label for="manufacturerFilter" class="text-sm font-medium text-gray-600"
							>Filter by:</label
						>
						<select
							id="manufacturerFilter"
							bind:value={selectedManufacturer}
							class="rounded border border-gray-300 px-3 py-1 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
						>
							<option value="all">All Manufacturers</option>
							<option value="black eagle">Black Eagle</option>
							<option value="easton">Easton</option>
							<option value="carbon express">Carbon Express</option>
							<option value="gold tip">Gold Tip</option>
						</select>
					</div>
					<button
						type="button"
						on:click={() => (showBrowsableOptions = !showBrowsableOptions)}
						class="rounded border px-3 py-1 text-sm transition-colors {showBrowsableOptions
							? 'border-blue-500 bg-blue-50 text-blue-700'
							: 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'}"
					>
						{showBrowsableOptions ? 'Hide' : 'Show'} All Options
						{#if !showBrowsableOptions}
							{@const browsableCount = filteredShafts.filter((shaft) => {
								const isRecommended = isManufacturerRecommended(shaft);
								const isInOptimal = isInOptimalRange(shaft);
								const isSelected =
									config.spineValue === shaft.spine && config.shaftWeight === shaft.weight;
								return !isSelected && !isRecommended && !isInOptimal;
							}).length}
							{#if browsableCount > 0}
								<span class="ml-1 rounded bg-gray-200 px-1.5 py-0.5 text-xs text-gray-700">
									+{browsableCount}
								</span>
							{/if}
						{/if}
					</button>
				</div>
			</div>

			<!-- Legend -->
			<div class="mb-4 flex flex-wrap gap-4 text-xs">
				<div class="flex items-center gap-1">
					<div class="h-3 w-3 rounded border-2 border-green-400 bg-green-100"></div>
					<span class="text-gray-600">Manufacturer Recommended</span>
				</div>
				<div class="flex items-center gap-1">
					<div class="h-3 w-3 rounded border-2 border-blue-500 bg-blue-100"></div>
					<span class="text-gray-600">Currently Selected</span>
				</div>
				<div class="flex items-center gap-1">
					<div class="h-3 w-3 rounded border-2 border-orange-300 bg-orange-50"></div>
					<span class="text-gray-600">In Optimal Range</span>
				</div>
				{#if showBrowsableOptions}
					<div class="flex items-center gap-1">
						<div class="h-3 w-3 rounded border-2 border-gray-200 bg-white"></div>
						<span class="text-gray-600">Browsable Option</span>
					</div>
				{/if}
			</div>

			<div class="grid grid-cols-1 gap-3 md:grid-cols-2">
				{#each filteredShafts.filter((shaft) => {
					const isRecommended = isManufacturerRecommended(shaft);
					const isInOptimal = isInOptimalRange(shaft);
					const isSelected = config.spineValue === shaft.spine && config.shaftWeight === shaft.weight;

					// Always show selected, recommended, or optimal range shafts
					if (isSelected || isRecommended || isInOptimal) return true;

					// Only show browsable options if toggle is enabled
					return showBrowsableOptions;
				}) as shaft (shaft.name)}
					{@const isRecommended = isManufacturerRecommended(shaft)}
					{@const manufacturerMatch = getManufacturerMatch(shaft)}
					{@const isInOptimal = isInOptimalRange(shaft)}
					{@const isSelected =
						config.spineValue === shaft.spine && config.shaftWeight === shaft.weight}
					<div
						class="cursor-pointer rounded-lg border p-4 transition-all hover:shadow-md
						{isSelected
							? 'border-blue-500 bg-blue-50 shadow-sm'
							: isRecommended
								? 'border-green-400 bg-green-50 hover:bg-green-100'
								: isInOptimal
									? 'border-orange-300 bg-orange-50 hover:bg-orange-100'
									: 'border-gray-200 hover:bg-gray-50'}"
						on:click={() => selectShaft(shaft)}
						on:keydown={(e) => e.key === 'Enter' && selectShaft(shaft)}
						role="button"
						tabindex="0"
					>
						<div class="flex items-start justify-between">
							<div class="flex-1">
								<div class="flex items-center justify-between gap-2">
									<h4 class="font-medium text-gray-800">{shaft.name}</h4>
									{#if isRecommended}
										<span class="rounded bg-green-200 px-2 py-1 text-xs font-medium text-green-800">
											RECOMMENDED
										</span>
									{:else if isInOptimal && !isRecommended}
										<span
											class="rounded bg-orange-200 px-2 py-1 text-xs font-medium text-orange-800"
										>
											OPTIMAL RANGE
										</span>
									{/if}
									{#if isSelected}
										<span class="text-lg text-blue-600">✓</span>
									{/if}
								</div>

								<div class="mt-2 grid grid-cols-3 gap-2 text-sm">
									<div>
										<span class="font-medium text-gray-700">Spine:</span>
										<div class="text-lg font-bold text-blue-600">{shaft.spine}</div>
									</div>
									<div>
										<span class="font-medium text-gray-700">Weight:</span>
										<div class="text-gray-900">{shaft.weight} gr/in</div>
									</div>
									<div>
										<span class="font-medium text-gray-700">Diameter:</span>
										<div class="text-gray-900">{shaft.diameter}mm</div>
									</div>
								</div>

								{#if manufacturerMatch}
									<div class="mt-2 rounded bg-white p-2 text-xs">
										<div class="font-medium text-green-700">
											{manufacturerMatch.manufacturer}
											{manufacturerMatch.series}
										</div>
										<div class="text-gray-600">
											Recommended: {manufacturerMatch.recommendedSpine} spine
											<span
												class="ml-1 rounded px-1 text-xs {manufacturerMatch.confidence === 'high'
													? 'bg-green-100 text-green-700'
													: manufacturerMatch.confidence === 'medium'
														? 'bg-yellow-100 text-yellow-700'
														: 'bg-gray-100 text-gray-700'}"
											>
												{manufacturerMatch.confidence}
											</span>
										</div>
									</div>
								{/if}
							</div>
						</div>
					</div>
				{/each}
			</div>

			{#if filteredShafts.length === 0}
				<div class="py-8 text-center text-gray-500">
					<p>No shafts match your current criteria.</p>
					<p class="text-sm">Try adjusting your material selection or manufacturer filter.</p>
				</div>
			{/if}
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
