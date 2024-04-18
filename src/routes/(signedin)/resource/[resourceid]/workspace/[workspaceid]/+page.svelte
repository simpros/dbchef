<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import WorkspaceElements from '$lib/components/workspace-view/workspace-element.svelte';
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
		<div class="grid gap-4 grid-auto-fill-sm">
			{#each Object.entries(data.elements) as element}
				<div>
					{#await element[1]}
						<div>Loading...</div>
					{:then elementResult}
						{#if !elementResult.success}
							<div class="flex flex-col gap-1">
								<span class="font-bold">{elementResult.name}</span>
								<span class="text-destructive">{elementResult.error}</span>
							</div>
						{:else if elementResult.type === 'select'}
							{@const parameter = $page.url.searchParams.get(elementResult.name)}
							<WorkspaceElements
								selectedValue={parameter}
								onSelectedChange={(e) => {
									const url = new URL($page.url);
									url.searchParams.set(elementResult.name, e?.value ?? '');
									goto(url);
								}}
								data={elementResult}
							/>
						{:else}
							<pre>{JSON.stringify(element[1], null, 2)}</pre>
						{/if}
					{:catch error}
						<span class="text-destructive">{error.message}</span>
					{/await}
				</div>
			{/each}
		</div>
	{/if}
</div>
