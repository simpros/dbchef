<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import type { SuccessViewData } from '../../call-view-query';

	export let viewId: string;
	export let viewData: SuccessViewData;
</script>

<div class="grid gap-3 grid-auto-fill-lg">
	{#each viewData.rows as row}
		<Card.Root>
			<Card.Header>
				{#each Object.entries(row).slice(0, 2) as [key, value], i}
					{#if i === 1}
						<Card.Title class="flex justify-between">{value}</Card.Title>
					{:else}
						<Card.Description class="text-xs">{value}</Card.Description>
					{/if}
				{/each}
			</Card.Header>
			<Card.Footer>
				<Button href="{viewId}/{Object.values(row)[0]}">Edit</Button>
			</Card.Footer>
		</Card.Root>
	{/each}
</div>
