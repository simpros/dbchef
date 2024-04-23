<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import WorkspaceElements from '$lib/components/workspace-element/workspace-elements.svelte';
	import WorkspaceView from '$lib/components/workspace-view/workspace-view.svelte';
	import { Edit } from 'lucide-svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div>
	<div class="flex justify-between">
		<h2 class="text-2xl font-bold">{data.workspace.name}</h2>
		<Button size="sm" variant="ghost" href="{data.workspace.id}/edit"><Edit /></Button>
	</div>
	{#if !data.elements}
		<div>Could not load elements</div>
	{:else}
		<WorkspaceElements elements={data.elements} />
		{#if data.view}
			<Separator class="my-3" />
			<WorkspaceView viewData={data.view} />
		{:else}
			<div>
				<p>No view data</p>
			</div>
		{/if}
	{/if}
</div>
