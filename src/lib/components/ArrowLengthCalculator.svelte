<script lang="ts">
	import type { ArrowConfiguration } from '../types';
	import { overhangOptions } from '../data';

	export let config: Partial<ArrowConfiguration>;
	export let arrowLength: number;
</script>

<div class="space-y-6">
	<div class="text-center">
		<h2 class="mb-2 text-2xl font-bold text-gray-800">📏 Arrow Length Calculator</h2>
		<p class="text-gray-600">
			Calculate the optimal arrow length for your draw length and safety preferences
		</p>
	</div>

	<!-- Draw Length Input -->
	<div class="rounded-lg bg-blue-50 p-6">
		<label for="drawLength" class="mb-3 block text-lg font-medium text-gray-700">
			Your Draw Length
		</label>
		<div class="flex items-center space-x-4">
			<input
				id="drawLength"
				type="number"
				step="0.25"
				min="20"
				max="35"
				bind:value={config.drawLength}
				class="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
				placeholder="28.0"
			/>
			<span class="text-lg font-medium text-gray-600">inches</span>
		</div>
		<p class="mt-2 text-sm text-gray-500">
			💡 Measure from the nock groove to the back of the bow at full draw, or have it measured at a
			shop
		</p>
	</div>

	<!-- Overhang Selection -->
	<div class="rounded-lg bg-green-50 p-6">
		<h3 class="mb-4 text-lg font-medium text-gray-700">Safety Overhang Options</h3>
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
			{#each overhangOptions as option (option.value)}
				<label class="relative">
					<input type="radio" bind:group={config.overhang} value={option.value} class="sr-only" />
					<div
						class="cursor-pointer rounded-lg border-2 p-4 transition-all
						{config.overhang === option.value
							? 'border-green-500 bg-green-100'
							: 'border-gray-200 hover:border-green-300 hover:bg-green-50'}"
					>
						<div class="mb-2 flex items-center justify-between">
							<span class="text-lg font-semibold">{option.label}</span>
							{#if config.overhang === option.value}
								<span class="text-green-600">✓</span>
							{/if}
						</div>
						<p class="mb-2 text-sm text-gray-600">{option.description}</p>
						<p
							class="text-xs font-medium
							{option.value <= 0.5
								? 'text-orange-600'
								: option.value <= 1.0
									? 'text-green-600'
									: 'text-blue-600'}"
						>
							{option.safety}
						</p>
					</div>
				</label>
			{/each}
		</div>
	</div>

	<!-- Results -->
	{#if config.drawLength && config.overhang}
		<div class="rounded-lg bg-gray-50 p-6">
			<h3 class="mb-4 text-lg font-medium text-gray-700">📋 Recommended Arrow Length</h3>
			<div class="text-center">
				<div class="mb-2 text-4xl font-bold text-blue-600">
					{arrowLength.toFixed(2)}"
				</div>
				<p class="mb-4 text-gray-600">
					Draw Length ({config.drawLength}") + Overhang ({config.overhang}") = Total Length
				</p>

				<!-- Safety Notes -->
				<div class="rounded-lg bg-white p-4">
					<h4 class="mb-2 font-medium text-gray-700">🛡️ Safety Notes</h4>
					<ul class="space-y-1 text-sm text-gray-600">
						{#if config.overhang < 1}
							<li class="text-orange-600">⚠️ Short overhang requires consistent anchor point</li>
						{/if}
						<li>✓ Always verify your draw length with a professional</li>
						<li>✓ Consider your shooting style and experience level</li>
						<li>✓ Hunting situations may benefit from extra safety margin</li>
					</ul>
				</div>
			</div>
		</div>
	{/if}

	<!-- Educational Content -->
	<div class="rounded-lg bg-yellow-50 p-6">
		<h3 class="mb-3 text-lg font-medium text-gray-700">📚 Why Arrow Length Matters</h3>
		<div class="grid grid-cols-1 gap-4 text-sm text-gray-600 md:grid-cols-2">
			<div>
				<h4 class="mb-2 font-medium">Safety Considerations:</h4>
				<ul class="space-y-1">
					<li>• Prevents overdraw accidents</li>
					<li>• Accounts for form variations</li>
					<li>• Provides margin for equipment changes</li>
				</ul>
			</div>
			<div>
				<h4 class="mb-2 font-medium">Performance Impact:</h4>
				<ul class="space-y-1">
					<li>• Longer arrows = slower but more forgiving</li>
					<li>• Shorter arrows = faster but less room for error</li>
					<li>• Affects spine selection and tuning</li>
				</ul>
			</div>
		</div>
	</div>
</div>
