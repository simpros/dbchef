<script lang="ts">
	import type { LayoutData } from './$types';
	import EstablishConnectionModal from './establish-connection-modal.svelte';

	export let data: LayoutData;
</script>

{#if !data.pool}
	<EstablishConnectionModal resource={data.resource} data={data.establishConnectionForm} />
{/if}
<div class="h-full">
	<!-- <div class="grid grid-cols-[1fr_auto] items-end">
		<div>
			<span class="text-sm text-muted-foreground">Resource</span>
			<h2 class="text-2xl font-bold">{data.resource?.name}</h2>
		</div>
		<form method="post" action="?/disconnect">
			<Button variant="outline" type="submit" class="group space-x-2">
				<div
					class="aspect-square w-2 animate-pulse rounded-full bg-green-500 transition-colors group-hover:bg-red-500"
				/>

				<span class="absolute transition-all group-hover:scale-0 group-hover:opacity-0">
					Connected
				</span>
				<span
					class="scale-0 opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100"
				>
					Disconnect
				</span>
			</Button>
		</form>
	</div>
	<Separator class="my-3" /> -->
	<slot />
</div>
