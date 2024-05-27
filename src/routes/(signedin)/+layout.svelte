<script lang="ts">
	import Header from '$lib/components/header.svelte';
</script>

<section class="grid h-full grid-rows-[auto_1fr] gap-6">
	<Header />
	<main class="mx-auto w-full max-w-screen-2xl px-8 pb-5">
		<slot />
	</main>
</section>
