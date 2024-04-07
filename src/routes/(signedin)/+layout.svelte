<script lang="ts">
	import Header from '$lib/components/header.svelte';
	import type { LayoutData } from './$types';

	export let data: LayoutData;
</script>

<Header />
<slot />
