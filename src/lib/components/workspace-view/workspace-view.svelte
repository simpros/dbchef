<script lang="ts">
	import type { WorkspaceViewData } from './get-view-data';

	export let viewData: WorkspaceViewData;
</script>

<section>
	<h2>{viewData.name}</h2>
	{#await viewData.data}
		<p>Loading...</p>
	{:then data}
		{#if data.success}
			<pre>{JSON.stringify(data.rows)}</pre>
		{:else}
			<p>{data.error}</p>
		{/if}
	{:catch error}
		<p>{error.message}</p>
	{/await}
</section>
