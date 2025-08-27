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
	<div class="container mx-auto px-3 py-4 sm:px-4 sm:py-8">
		<header class="mb-6 text-center sm:mb-8">
			<h1 class="mb-2 text-2xl font-bold text-gray-800 sm:text-3xl md:text-4xl">
				🏹 Archery Friend
			</h1>
			<p class="text-sm text-gray-600 sm:text-base md:text-lg">
				Professional Arrow Calculator & Setup Tool
			</p>
		</header>

		<ArrowCalculator />
	</div>
</div>
