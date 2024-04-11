<script lang="ts">
	import type { LayoutData } from './$types';
	import EstablishConnectionModal from './establish-connection-modal.svelte';

	export let data: LayoutData;
</script>

{#if !data.pool}
	<EstablishConnectionModal resource={data.resource} data={data.establishConnectionForm} />
{/if}
<slot />
