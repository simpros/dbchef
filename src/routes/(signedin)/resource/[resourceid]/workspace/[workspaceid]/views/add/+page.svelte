<script lang="ts">
	import BackAnchor from '$lib/components/ui/anchor/back-anchor.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div>
	<BackAnchor href="../edit" />
</div>
