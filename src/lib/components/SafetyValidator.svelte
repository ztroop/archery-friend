<script lang="ts">
	import type { ArrowConfiguration, SafetyCheck } from '../types';

	export let currentConfig: Partial<ArrowConfiguration>;
	export let validateSetup: () => SafetyCheck | null;
	export let totalWeight: number;
	export let gpp: number;
	export let arrowLength: number;
	export let foc: number;

	$: safetyCheck = validateSetup();

	function getStatusIcon(status: 'safe' | 'warning' | 'danger') {
		switch (status) {
			case 'safe':
				return '✅';
			case 'warning':
				return '⚠️';
			case 'danger':
				return '❌';
		}
	}

	function getStatusColor(status: 'safe' | 'warning' | 'danger') {
		switch (status) {
			case 'safe':
				return 'text-green-600 bg-green-50 border-green-200';
			case 'warning':
				return 'text-yellow-600 bg-yellow-50 border-yellow-200';
			case 'danger':
				return 'text-red-600 bg-red-50 border-red-200';
		}
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
			totalWeight &&
			gpp &&
			arrowLength
		);
	}
</script>

<div class="space-y-6">
	<div class="text-center">
		<h2 class="mb-2 text-2xl font-bold text-gray-800">🛡️ Safety Validator</h2>
		<p class="text-gray-600">Comprehensive safety check for your complete arrow setup</p>
	</div>

	{#if !isConfigComplete()}
		<div class="rounded-lg bg-gray-50 p-8 text-center">
			<div class="mb-4 text-6xl">⚙️</div>
			<h3 class="mb-2 text-xl font-medium text-gray-700">Setup Incomplete</h3>
			<p class="mb-4 text-gray-600">
				Please complete all the previous tabs to perform a comprehensive safety validation.
			</p>

			<div class="mx-auto max-w-md rounded-lg bg-white p-4 text-left">
				<h4 class="mb-2 font-medium text-gray-700">Required Information:</h4>
				<ul class="space-y-1 text-sm text-gray-600">
					<li class={currentConfig.drawLength ? 'text-green-600' : ''}>
						{currentConfig.drawLength ? '✓' : '○'} Draw Length
					</li>
					<li class={currentConfig.drawWeight ? 'text-green-600' : ''}>
						{currentConfig.drawWeight ? '✓' : '○'} Draw Weight
					</li>
					<li class={currentConfig.pointWeight ? 'text-green-600' : ''}>
						{currentConfig.pointWeight ? '✓' : '○'} Point Weight
					</li>
					<li class={currentConfig.shaftWeight ? 'text-green-600' : ''}>
						{currentConfig.shaftWeight ? '✓' : '○'} Shaft Weight
					</li>
					<li class={currentConfig.spineValue ? 'text-green-600' : ''}>
						{currentConfig.spineValue ? '✓' : '○'} Arrow Spine
					</li>
					<li class={totalWeight ? 'text-green-600' : ''}>
						{totalWeight ? '✓' : '○'} Total Arrow Weight
					</li>
				</ul>
			</div>
		</div>
	{:else if safetyCheck}
		<!-- Overall Safety Status -->
		<div class="mb-8 text-center">
			<div class="mb-4 text-8xl">
				{#if safetyCheck.overall === 'safe'}
					🟢
				{:else if safetyCheck.overall === 'warning'}
					🟡
				{:else}
					🔴
				{/if}
			</div>
			<h3
				class="mb-2 text-2xl font-bold
				{safetyCheck.overall === 'safe'
					? 'text-green-600'
					: safetyCheck.overall === 'warning'
						? 'text-yellow-600'
						: 'text-red-600'}"
			>
				{safetyCheck.overall === 'safe'
					? 'SAFE SETUP'
					: safetyCheck.overall === 'warning'
						? 'CAUTION ADVISED'
						: 'UNSAFE SETUP'}
			</h3>
			<p class="text-gray-600">
				{safetyCheck.overall === 'safe'
					? 'Your arrow setup passes all safety checks'
					: safetyCheck.overall === 'warning'
						? 'Setup has minor concerns that should be addressed'
						: 'Setup has serious safety issues that must be corrected'}
			</p>
		</div>

		<!-- Detailed Safety Checks -->
		<div class="space-y-4">
			<!-- GPP Check -->
			<div class="rounded-lg border-2 p-6 {getStatusColor(safetyCheck.gpp.status)}">
				<div class="mb-3 flex items-center justify-between">
					<h4 class="flex items-center space-x-2 text-lg font-medium">
						<span>{getStatusIcon(safetyCheck.gpp.status)}</span>
						<span>GPP (Grains Per Pound)</span>
					</h4>
					<span class="text-xl font-bold">{safetyCheck.gpp.value.toFixed(2)}</span>
				</div>
				<p class="text-sm">{safetyCheck.gpp.message}</p>

				{#if safetyCheck.gpp.status !== 'safe'}
					<div
						class="mt-3 rounded border-l-4 bg-white p-3
						{safetyCheck.gpp.status === 'warning' ? 'border-yellow-400' : 'border-red-400'}"
					>
						<h5 class="mb-1 font-medium text-gray-700">Recommended Actions:</h5>
						<ul class="space-y-1 text-sm text-gray-600">
							{#if safetyCheck.gpp.value < 5}
								<li>• IMMEDIATELY increase arrow weight before shooting</li>
								<li>• Add 50-100gr heavier point weight</li>
								<li>• Consider longer or heavier shaft</li>
								<li>• Consult with an archery professional</li>
							{:else if safetyCheck.gpp.value < 6}
								<li>• Increase arrow weight for better safety margin</li>
								<li>• Consider 25-50gr heavier points</li>
								<li>• Monitor bow for signs of stress</li>
							{:else}
								<li>• Consider lighter points for better speed</li>
								<li>• Current setup is very conservative</li>
							{/if}
						</ul>
					</div>
				{/if}
			</div>

			<!-- Arrow Length Check -->
			<div class="rounded-lg border-2 p-6 {getStatusColor(safetyCheck.arrowLength.status)}">
				<div class="mb-3 flex items-center justify-between">
					<h4 class="flex items-center space-x-2 text-lg font-medium">
						<span>{getStatusIcon(safetyCheck.arrowLength.status)}</span>
						<span>Arrow Length Safety</span>
					</h4>
					<span class="text-xl font-bold">
						{arrowLength?.toFixed(2)}"
					</span>
				</div>
				<p class="text-sm">{safetyCheck.arrowLength.message}</p>

				{#if safetyCheck.arrowLength.status !== 'safe'}
					<div
						class="mt-3 rounded border-l-4 bg-white p-3
						{safetyCheck.arrowLength.status === 'warning' ? 'border-yellow-400' : 'border-red-400'}"
					>
						<h5 class="mb-1 font-medium text-gray-700">Safety Guidelines:</h5>
						<ul class="space-y-1 text-sm text-gray-600">
							{#if (arrowLength || 0) - (currentConfig.drawLength || 0) < 0.5}
								<li>• DO NOT SHOOT - Arrow is too short</li>
								<li>• Risk of overdraw and serious injury</li>
								<li>• Get properly sized arrows immediately</li>
							{:else if (arrowLength || 0) - (currentConfig.drawLength || 0) < 1}
								<li>• Maintain consistent anchor point</li>
								<li>• Avoid drawing past your measured draw length</li>
								<li>• Consider adding 0.5" for safety margin</li>
							{:else}
								<li>• Very long arrows reduce performance</li>
								<li>• Consider shortening for better speed</li>
								<li>• Ensure proper spine selection</li>
							{/if}
						</ul>
					</div>
				{/if}
			</div>

			<!-- Spine Check -->
			<div class="rounded-lg border-2 p-6 {getStatusColor(safetyCheck.spine.status)}">
				<div class="mb-3 flex items-center justify-between">
					<h4 class="flex items-center space-x-2 text-lg font-medium">
						<span>{getStatusIcon(safetyCheck.spine.status)}</span>
						<span>Arrow Spine Match</span>
					</h4>
					<span class="text-xl font-bold">{currentConfig.spineValue}</span>
				</div>
				<p class="text-sm">{safetyCheck.spine.message}</p>

				{#if safetyCheck.spine.status !== 'safe'}
					<div
						class="mt-3 rounded border-l-4 bg-white p-3
						{safetyCheck.spine.status === 'warning' ? 'border-yellow-400' : 'border-red-400'}"
					>
						<h5 class="mb-1 font-medium text-gray-700">Tuning Recommendations:</h5>
						<ul class="space-y-1 text-sm text-gray-600">
							<li>• Paper tune your arrows to verify spine match</li>
							<li>• Adjust point weight to fine-tune dynamic spine</li>
							<li>• Consider professional bow tuning</li>
							<li>• Monitor arrow flight for erratic behavior</li>
						</ul>
					</div>
				{/if}
			</div>
		</div>

		<!-- Setup Summary -->
		<div class="rounded-lg bg-gray-50 p-6">
			<h3 class="mb-4 text-lg font-medium text-gray-700">📋 Setup Summary</h3>
			<div class="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
				<div class="rounded bg-white p-3 text-center">
					<div class="font-medium text-gray-700">Draw Length</div>
					<div class="text-lg text-blue-600">{currentConfig.drawLength}"</div>
				</div>
				<div class="rounded bg-white p-3 text-center">
					<div class="font-medium text-gray-700">Draw Weight</div>
					<div class="text-lg text-green-600">{currentConfig.drawWeight}#</div>
				</div>
				<div class="rounded bg-white p-3 text-center">
					<div class="font-medium text-gray-700">Arrow Length</div>
					<div class="text-lg text-purple-600">{arrowLength?.toFixed(2)}"</div>
				</div>
				<div class="rounded bg-white p-3 text-center">
					<div class="font-medium text-gray-700">Total Weight</div>
					<div class="text-lg text-red-600">{totalWeight?.toFixed(0)}gr</div>
				</div>
				<div class="rounded bg-white p-3 text-center">
					<div class="font-medium text-gray-700">Point Weight</div>
					<div class="text-lg text-orange-600">{currentConfig.pointWeight}gr</div>
				</div>
				<div class="rounded bg-white p-3 text-center">
					<div class="font-medium text-gray-700">Spine</div>
					<div class="text-lg text-indigo-600">{currentConfig.spineValue}</div>
				</div>
				<div class="rounded bg-white p-3 text-center">
					<div class="font-medium text-gray-700">GPP</div>
					<div class="text-lg text-teal-600">{gpp?.toFixed(2)}</div>
				</div>
				<div class="rounded bg-white p-3 text-center">
					<div class="font-medium text-gray-700">FOC</div>
					<div class="text-lg text-pink-600">{foc?.toFixed(1)}%</div>
				</div>
			</div>
		</div>

		<!-- Final Recommendations -->
		<div class="rounded-lg bg-blue-50 p-6">
			<h3 class="mb-3 text-lg font-medium text-gray-700">🎯 Final Recommendations</h3>
			<div class="space-y-2 text-sm text-gray-600">
				{#if safetyCheck.overall === 'safe'}
					<p>✅ <strong>Your setup looks great!</strong> Consider these final steps:</p>
					<ul class="ml-4 space-y-1">
						<li>• Paper tune your arrows to verify perfect flight</li>
						<li>• Start with shorter distances and work up</li>
						<li>• Keep detailed records of this successful setup</li>
						<li>• Consider saving this configuration for future reference</li>
					</ul>
				{:else if safetyCheck.overall === 'warning'}
					<p>
						⚠️ <strong>Address the warnings above before shooting.</strong> Most can be resolved with
						minor adjustments.
					</p>
				{:else}
					<p>
						❌ <strong>Do not shoot with this setup.</strong> Serious safety issues must be corrected
						first.
					</p>
				{/if}
			</div>
		</div>
	{/if}
</div>
