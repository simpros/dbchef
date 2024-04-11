<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="flex h-full flex-col">
	<div class="grid grid-cols-[1fr_auto]">
		<div>
			<span class="text-sm text-muted-foreground">Resource</span>
			<h2 class="text-2xl font-bold">{data.resource?.name}</h2>
		</div>
		<form method="post" action="?/disconnect">
			<Button variant="outline" type="submit" class="space-x-2">
				<div class="aspect-square w-2 animate-pulse rounded-full bg-red-500" />
				<span> Disconnect </span>
			</Button>
		</form>
	</div>
	<Separator class="my-2" />
	<div class="flex items-center justify-between">
		<h3 class="text-lg font-bold">Workspaces</h3>
		<Button href="{data.resource?.id}/add">Add</Button>
	</div>
	{#each data.views as view}
		<div>
			{view.name}
		</div>
	{:else}
		<div class="my-20 font-bold">This resource has no Workspace yet</div>
	{/each}
</div>
