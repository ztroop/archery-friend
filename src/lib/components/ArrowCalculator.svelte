<script lang="ts">
	import { onMount } from 'svelte';
	import type { ArrowConfiguration } from '../types';
	import {
		calculateArrowLength,
		calculateSpineRecommendation,
		calculateTotalWeight,
		calculateGPP,
		calculateFOC,
		calculateOptimalPointWeight,
		performSafetyCheck
	} from '../calculations';
	import { shaftDatabase, componentDatabase, overhangOptions } from '../data';
	import {
		loadConfigurations,
		saveConfigurations,
		generateId,
		createDefaultConfiguration
	} from '../storage';

	import ArrowLengthCalculator from './ArrowLengthCalculator.svelte';
	import SpineSelector from './SpineSelector.svelte';
	import WeightCalculator from './WeightCalculator.svelte';
	import GPPCalculator from './GPPCalculator.svelte';
	import PointWeightRecommendations from './PointWeightRecommendations.svelte';
	import SafetyValidator from './SafetyValidator.svelte';
	import ConfigurationManager from './ConfigurationManager.svelte';

	// State
	let configurations: ArrowConfiguration[] = [];
	let currentConfig: Partial<ArrowConfiguration> = createDefaultConfiguration();
	let activeTab: string = 'arrow-length';

	// Computed values that are calculated on-demand without cycles
	$: arrowLength =
		currentConfig.drawLength && currentConfig.overhang
			? calculateArrowLength(currentConfig.drawLength, currentConfig.overhang)
			: 0;

	$: totalWeight =
		currentConfig.shaftWeight &&
		arrowLength &&
		currentConfig.pointWeight &&
		currentConfig.nockWeight &&
		currentConfig.fletchingWeight
			? calculateTotalWeight(
					currentConfig.shaftWeight,
					arrowLength,
					currentConfig.pointWeight,
					currentConfig.nockWeight,
					currentConfig.fletchingWeight
				)
			: 0;

	$: gpp =
		totalWeight && currentConfig.drawWeight
			? calculateGPP(totalWeight, currentConfig.drawWeight)
			: 0;

	$: foc =
		arrowLength && currentConfig.pointWeight && totalWeight
			? calculateFOC(arrowLength, currentConfig.pointWeight, totalWeight)
			: 0;

	// Navigation tabs
	const tabs = [
		{ id: 'arrow-length', label: 'Arrow Length', icon: '📏' },
		{ id: 'spine', label: 'Spine Selection', icon: '🎯' },
		{ id: 'weight', label: 'Weight Calculator', icon: '⚖️' },
		{ id: 'gpp', label: 'GPP Calculator', icon: '🔋' },
		{ id: 'point-weight', label: 'Point Weight', icon: '🔺' },
		{ id: 'safety', label: 'Safety Check', icon: '🛡️' },
		{ id: 'configs', label: 'My Setups', icon: '💾' }
	];

	onMount(() => {
		configurations = loadConfigurations();
	});

	function saveCurrentConfig() {
		if (!currentConfig.name) {
			currentConfig.name = `Setup ${configurations.length + 1}`;
		}

		const fullConfig: ArrowConfiguration = {
			id: generateId(),
			name: currentConfig.name,
			drawLength: currentConfig.drawLength || 28,
			drawWeight: currentConfig.drawWeight || 50,
			arrowLength: arrowLength,
			overhang: currentConfig.overhang || 1,
			shaftWeight: currentConfig.shaftWeight || 8.5,
			pointWeight: currentConfig.pointWeight || 125,
			nockWeight: currentConfig.nockWeight || 8,
			fletchingWeight: currentConfig.fletchingWeight || 21,
			arrowMaterial: currentConfig.arrowMaterial || 'carbon',
			spineValue: currentConfig.spineValue || 400,
			totalWeight: totalWeight,
			gpp: gpp,
			foc: foc
		};

		configurations = [...configurations, fullConfig];
		saveConfigurations(configurations);
	}

	function loadConfig(config: ArrowConfiguration) {
		currentConfig = { ...config };
		activeTab = 'arrow-length';
	}

	function deleteConfig(id: string) {
		configurations = configurations.filter((c) => c.id !== id);
		saveConfigurations(configurations);
	}

	function validateSetup() {
		if (!isConfigComplete()) return null;

		const fullConfig: ArrowConfiguration = {
			id: 'temp',
			name: 'Validation',
			drawLength: currentConfig.drawLength!,
			drawWeight: currentConfig.drawWeight!,
			arrowLength: arrowLength,
			overhang: currentConfig.overhang!,
			shaftWeight: currentConfig.shaftWeight!,
			pointWeight: currentConfig.pointWeight!,
			nockWeight: currentConfig.nockWeight!,
			fletchingWeight: currentConfig.fletchingWeight!,
			arrowMaterial: currentConfig.arrowMaterial!,
			spineValue: currentConfig.spineValue!,
			totalWeight: totalWeight,
			gpp: gpp,
			foc: foc
		};

		return performSafetyCheck(fullConfig);
	}

	function isConfigComplete(): boolean {
		return !!(
			currentConfig.drawLength &&
			currentConfig.drawWeight &&
			currentConfig.pointWeight &&
			currentConfig.shaftWeight &&
			currentConfig.nockWeight &&
			currentConfig.fletchingWeight &&
			currentConfig.spineValue &&
			arrowLength &&
			totalWeight
		);
	}
</script>

<div class="mx-auto max-w-6xl">
	<!-- Tab Navigation -->
	<div class="mb-6 rounded-lg bg-white p-1 shadow-sm">
		<nav class="flex space-x-1 overflow-x-auto">
			{#each tabs as tab}
				<button
					class="flex items-center space-x-2 rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors
						{activeTab === tab.id
						? 'bg-blue-100 text-blue-700'
						: 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'}"
					on:click={() => (activeTab = tab.id)}
				>
					<span>{tab.icon}</span>
					<span>{tab.label}</span>
				</button>
			{/each}
		</nav>
	</div>

	<!-- Quick Validation Button -->
	{#if isConfigComplete()}
		<div class="mb-6">
			<button
				class="flex w-full items-center justify-center space-x-2 rounded-lg bg-green-600 px-6 py-3 font-medium text-white transition-colors hover:bg-green-700"
				on:click={() => (activeTab = 'safety')}
			>
				<span>🛡️</span>
				<span>Validate This Setup</span>
			</button>
		</div>
	{/if}

	<!-- Tab Content -->
	<div class="rounded-lg bg-white p-6 shadow-sm">
		{#if activeTab === 'arrow-length'}
			<ArrowLengthCalculator bind:config={currentConfig} {arrowLength} />
		{:else if activeTab === 'spine'}
			<SpineSelector bind:config={currentConfig} />
		{:else if activeTab === 'weight'}
			<WeightCalculator bind:config={currentConfig} {arrowLength} {totalWeight} {foc} />
		{:else if activeTab === 'gpp'}
			<GPPCalculator bind:config={currentConfig} {totalWeight} {gpp} />
		{:else if activeTab === 'point-weight'}
			<PointWeightRecommendations bind:config={currentConfig} />
		{:else if activeTab === 'safety'}
			<SafetyValidator {currentConfig} {validateSetup} />
		{:else if activeTab === 'configs'}
			<ConfigurationManager
				{configurations}
				{currentConfig}
				on:save={saveCurrentConfig}
				on:load={(e) => loadConfig(e.detail)}
				on:delete={(e) => deleteConfig(e.detail)}
			/>
		{/if}
	</div>
</div>
