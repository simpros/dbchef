<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { ArrowRightCircle } from 'lucide-svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div>
	<h2 class="text-2xl font-bold">DASHBOARD</h2>
	<Separator class="my-2" />
	<div class="flex items-center justify-between">
		<h3 class="text-xl font-bold">Resources</h3>
		<Button href="/add-resource">Add</Button>
	</div>
	<div class="grid gap-3 grid-auto-fill-md">
		{#each data.resources as resource}
			<a
				href="/resource/{resource.id}/"
				class="flex justify-between rounded-lg border bg-card p-4 text-card-foreground shadow-sm"
			>
				{resource.name}
				<ArrowRightCircle />
			</a>
		{/each}
	</div>
</div>
