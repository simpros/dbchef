<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { WorkspaceElementData } from './get-element-data';
	import WorkspaceElement from './workspace-element.svelte';

	export let elements: WorkspaceElementData;
</script>

<div class="grid gap-3 grid-auto-fill-lg">
	{#each Object.values(elements) as element}
		{#await element}
			<p>Loading...</p>
		{:then element}
			{#if element.success}
				{@const parameter = $page.url.searchParams.get(element.name)}
				<WorkspaceElement
					data={element}
					selectedValue={parameter}
					onSelectedChange={(e) => {
						const url = new URL($page.url);
						url.searchParams.set(element.name, e?.value ?? '');
						goto(url);
					}}
				/>
			{/if}
		{/await}
	{/each}
</div>
