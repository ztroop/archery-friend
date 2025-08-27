<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { ArrowConfiguration } from '../types';

	const dispatch = createEventDispatcher<{
		save: void;
		load: ArrowConfiguration;
		delete: string;
	}>();

	export let configurations: ArrowConfiguration[];
	export let currentConfig: Partial<ArrowConfiguration>;

	let showSaveDialog = false;
	let saveName = '';
	let showDeleteConfirm = '';

	function handleSave() {
		if (!saveName.trim()) {
			saveName = `Setup ${configurations.length + 1}`;
		}
		currentConfig.name = saveName.trim();
		dispatch('save');
		showSaveDialog = false;
		saveName = '';
	}

	function handleLoad(config: ArrowConfiguration) {
		dispatch('load', config);
	}

	function handleDelete(id: string) {
		dispatch('delete', id);
		showDeleteConfirm = '';
	}

	function formatDate(timestamp: number): string {
		return new Date(parseInt(timestamp.toString().slice(0, 13))).toLocaleDateString();
	}

	function getSetupCompleteness(config: Partial<ArrowConfiguration>): number {
		const requiredFields = [
			'drawLength',
			'drawWeight',
			'pointWeight',
			'shaftWeight',
			'nockWeight',
			'fletchingWeight',
			'spineValue',
			'totalWeight'
		];
		const completedFields = requiredFields.filter(
			(field) =>
				config[field as keyof ArrowConfiguration] !== undefined &&
				config[field as keyof ArrowConfiguration] !== null
		);
		return Math.round((completedFields.length / requiredFields.length) * 100);
	}

	function canSave(): boolean {
		return getSetupCompleteness(currentConfig) >= 50; // At least 50% complete
	}

	function exportConfiguration(config: ArrowConfiguration) {
		const dataStr = JSON.stringify(config, null, 2);
		const dataBlob = new Blob([dataStr], { type: 'application/json' });
		const url = URL.createObjectURL(dataBlob);
		const link = document.createElement('a');
		link.href = url;
		link.download = `${config.name.replace(/[^a-z0-9]/gi, '_')}.json`;
		link.click();
		URL.revokeObjectURL(url);
	}

	function importConfiguration(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = (e) => {
			try {
				const config = JSON.parse(e.target?.result as string);
				// Validate the configuration has required fields
				if (config.name && config.drawLength && config.drawWeight) {
					config.id = Date.now().toString(36) + Math.random().toString(36).substr(2);
					configurations = [...configurations, config];
					// You would typically save this to localStorage here
				} else {
					alert('Invalid configuration file');
				}
			} catch {
				alert('Error reading configuration file');
			}
		};
		reader.readAsText(file);
		input.value = ''; // Reset input
	}
</script>

<div class="space-y-6">
	<div class="text-center">
		<h2 class="mb-2 text-2xl font-bold text-gray-800">💾 Configuration Manager</h2>
		<p class="text-gray-600">Save, load, and manage your arrow setups</p>
	</div>

	<!-- Current Setup Card -->
	<div class="rounded-lg border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
		<h3 class="mb-4 text-lg font-medium text-gray-800">🔧 Current Setup</h3>

		<div class="mb-4 grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
			<div class="rounded bg-white p-3 text-center">
				<div class="mb-1 text-xs text-gray-500">Draw Length</div>
				<div class="font-medium">{currentConfig.drawLength || '—'}"</div>
			</div>
			<div class="rounded bg-white p-3 text-center">
				<div class="mb-1 text-xs text-gray-500">Draw Weight</div>
				<div class="font-medium">{currentConfig.drawWeight || '—'}#</div>
			</div>
			<div class="rounded bg-white p-3 text-center">
				<div class="mb-1 text-xs text-gray-500">Total Weight</div>
				<div class="font-medium">{currentConfig.totalWeight?.toFixed(0) || '—'}gr</div>
			</div>
			<div class="rounded bg-white p-3 text-center">
				<div class="mb-1 text-xs text-gray-500">GPP</div>
				<div class="font-medium">{currentConfig.gpp?.toFixed(2) || '—'}</div>
			</div>
		</div>

		<!-- Completeness Indicator -->
		<div class="mb-4">
			<div class="mb-1 flex items-center justify-between text-sm">
				<span class="text-gray-600">Setup Completeness</span>
				<span class="font-medium">{getSetupCompleteness(currentConfig)}%</span>
			</div>
			<div class="h-2 w-full rounded-full bg-gray-200">
				<div
					class="h-2 rounded-full transition-all duration-300
						{getSetupCompleteness(currentConfig) >= 80
						? 'bg-green-500'
						: getSetupCompleteness(currentConfig) >= 50
							? 'bg-yellow-500'
							: 'bg-red-500'}"
					style="width: {getSetupCompleteness(currentConfig)}%"
				></div>
			</div>
		</div>

		<!-- Save Button -->
		<div class="flex space-x-3">
			<button
				class="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
				disabled={!canSave()}
				on:click={() => (showSaveDialog = true)}
			>
				💾 Save Current Setup
			</button>

			{#if !canSave()}
				<div class="flex-1 py-2 text-center text-sm text-gray-500">
					Complete more fields to save
				</div>
			{/if}
		</div>
	</div>

	<!-- Import/Export -->
	<div class="rounded-lg bg-gray-50 p-6">
		<h3 class="mb-4 text-lg font-medium text-gray-700">📁 Import/Export</h3>
		<div class="flex space-x-3">
			<label
				class="flex-1 cursor-pointer rounded-lg bg-green-600 px-4 py-2 text-center font-medium text-white transition-colors hover:bg-green-700"
			>
				📥 Import Configuration
				<input type="file" accept=".json" class="hidden" on:change={importConfiguration} />
			</label>
			<button
				class="flex-1 rounded-lg bg-purple-600 px-4 py-2 font-medium text-white transition-colors hover:bg-purple-700 disabled:bg-gray-400"
				disabled={configurations.length === 0}
				on:click={() => {
					if (configurations.length > 0) {
						const allConfigs = { configurations, exportDate: new Date().toISOString() };
						const dataStr = JSON.stringify(allConfigs, null, 2);
						const dataBlob = new Blob([dataStr], { type: 'application/json' });
						const url = URL.createObjectURL(dataBlob);
						const link = document.createElement('a');
						link.href = url;
						link.download = 'archery_configurations.json';
						link.click();
						URL.revokeObjectURL(url);
					}
				}}
			>
				📤 Export All
			</button>
		</div>
	</div>

	<!-- Saved Configurations -->
	<div class="rounded-lg border bg-white">
		<div class="border-b p-6">
			<h3 class="text-lg font-medium text-gray-800">📚 Saved Configurations</h3>
			{#if configurations.length === 0}
				<p class="mt-2 text-sm text-gray-500">
					No saved configurations yet. Complete and save your first setup above.
				</p>
			{/if}
		</div>

		{#if configurations.length > 0}
			<div class="divide-y">
				{#each configurations as config (config.id)}
					<div class="p-6 transition-colors hover:bg-gray-50">
						<div class="mb-3 flex items-center justify-between">
							<div>
								<h4 class="text-lg font-medium text-gray-800">{config.name}</h4>
								<p class="text-sm text-gray-500">Saved {formatDate(parseInt(config.id))}</p>
							</div>
							<div class="flex space-x-2">
								<button
									class="rounded bg-blue-100 px-3 py-1 text-sm text-blue-700 transition-colors hover:bg-blue-200"
									on:click={() => handleLoad(config)}
								>
									Load
								</button>
								<button
									class="rounded bg-green-100 px-3 py-1 text-sm text-green-700 transition-colors hover:bg-green-200"
									on:click={() => exportConfiguration(config)}
								>
									Export
								</button>
								<button
									class="rounded bg-red-100 px-3 py-1 text-sm text-red-700 transition-colors hover:bg-red-200"
									on:click={() => (showDeleteConfirm = config.id)}
								>
									Delete
								</button>
							</div>
						</div>

						<!-- Configuration Preview -->
						<div class="grid grid-cols-2 gap-3 text-xs md:grid-cols-6">
							<div class="rounded bg-gray-50 p-2 text-center">
								<div class="text-gray-500">Draw</div>
								<div class="font-medium">{config.drawLength}"@{config.drawWeight}#</div>
							</div>
							<div class="rounded bg-gray-50 p-2 text-center">
								<div class="text-gray-500">Arrow</div>
								<div class="font-medium">{config.arrowLength?.toFixed(1)}"</div>
							</div>
							<div class="rounded bg-gray-50 p-2 text-center">
								<div class="text-gray-500">Spine</div>
								<div class="font-medium">{config.spineValue}</div>
							</div>
							<div class="rounded bg-gray-50 p-2 text-center">
								<div class="text-gray-500">Weight</div>
								<div class="font-medium">{config.totalWeight?.toFixed(0)}gr</div>
							</div>
							<div class="rounded bg-gray-50 p-2 text-center">
								<div class="text-gray-500">GPP</div>
								<div class="font-medium">{config.gpp?.toFixed(1)}</div>
							</div>
							<div class="rounded bg-gray-50 p-2 text-center">
								<div class="text-gray-500">FOC</div>
								<div class="font-medium">{config.foc?.toFixed(1)}%</div>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>

<!-- Save Dialog -->
{#if showSaveDialog}
	<div class="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
		<div class="mx-4 w-full max-w-md rounded-lg bg-white p-6">
			<h3 class="mb-4 text-lg font-medium text-gray-800">💾 Save Configuration</h3>
			<div class="mb-4">
				<label for="saveName" class="mb-2 block text-sm font-medium text-gray-700">
					Configuration Name
				</label>
				<input
					id="saveName"
					type="text"
					bind:value={saveName}
					placeholder="My Hunting Setup"
					class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
				/>
			</div>
			<div class="flex space-x-3">
				<button
					class="flex-1 rounded-lg bg-gray-300 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-400"
					on:click={() => {
						showSaveDialog = false;
						saveName = '';
					}}
				>
					Cancel
				</button>
				<button
					class="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
					on:click={handleSave}
				>
					Save
				</button>
			</div>
		</div>
	</div>
{/if}

<!-- Delete Confirmation -->
{#if showDeleteConfirm}
	<div class="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
		<div class="mx-4 w-full max-w-md rounded-lg bg-white p-6">
			<h3 class="mb-4 text-lg font-medium text-gray-800">🗑️ Delete Configuration</h3>
			<p class="mb-4 text-gray-600">
				Are you sure you want to delete this configuration? This action cannot be undone.
			</p>
			<div class="flex space-x-3">
				<button
					class="flex-1 rounded-lg bg-gray-300 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-400"
					on:click={() => (showDeleteConfirm = '')}
				>
					Cancel
				</button>
				<button
					class="flex-1 rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition-colors hover:bg-red-700"
					on:click={() => handleDelete(showDeleteConfirm)}
				>
					Delete
				</button>
			</div>
		</div>
	</div>
{/if}
