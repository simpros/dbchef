<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Edit } from 'lucide-svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="flex h-full flex-col gap-3">
	<div class="flex items-center justify-between">
		<h3 class="text-lg font-bold">Workspaces</h3>
		<Button href="{data.resource.id}/workspace/add">Add</Button>
	</div>
	<div class="grid gap-3 grid-auto-fill-xl">
		{#each data.workspaces as workspace}
			<div class="grid grid-cols-[1fr_auto_auto] items-center rounded-md border p-3">
				<Button
					class="justify-start"
					variant="ghost"
					href="{data.resource.id}/workspace/{workspace.id}"
				>
					<span>{workspace.name}</span>
				</Button>
				<Button variant="ghost" size="sm" href="{data.resource.id}/workspace/{workspace.id}/edit">
					<Edit />
				</Button>
			</div>
		{:else}
			<div class="my-20 font-bold">This resource has no Workspace yet</div>
		{/each}
	</div>
</div>
