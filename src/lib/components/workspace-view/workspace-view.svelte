<script lang="ts">
	import type { WorkspaceViewData } from './get-view-data';
	import CardGridView from './view-types/card-grid/card-grid-view.svelte';

	export let viewData: WorkspaceViewData;
</script>

<section>
	<h2 class="text-lg font-bold">{viewData.name}</h2>
	{#await viewData.data}
		<p>Loading...</p>
	{:then data}
		{#if data.success}
			{#if data.type === 'card-grid'}
				<CardGridView
					allowsDetails={viewData.detailQuery !== null}
					viewId={viewData.id}
					viewData={data}
				/>
			{/if}
		{:else}
			<p>{data.error}</p>
		{/if}
	{:catch error}
		<p>{error.message}</p>
	{/await}
</section>
