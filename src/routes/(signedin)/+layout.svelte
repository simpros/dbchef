<script lang="ts">
	import Header from '$lib/components/header.svelte';
</script>

<section class="grid h-full grid-rows-[auto_1fr] gap-6">
	<Header />
	<main class="container mx-auto pb-5">
		<slot />
	</main>
</section>
