<script lang="ts">
	import ArrowCalculator from '$lib/components/ArrowCalculator.svelte';
</script>

<svelte:head>
	<title>Archery Friend - Arrow Calculator</title>
	<meta
		name="description"
		content="Professional archery arrow calculator with spine selection, weight calculation, and safety recommendations."
	/>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
	<div class="container mx-auto px-4 py-8">
		<header class="mb-8 text-center">
			<h1 class="mb-2 text-4xl font-bold text-gray-800">🏹 Archery Friend</h1>
			<p class="text-lg text-gray-600">Professional Arrow Calculator & Setup Tool</p>
		</header>

		<ArrowCalculator />
	</div>
</div>
