<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import type { SuccessViewData } from '../../call-view-query';

	export let viewId: string;
	export let allowsDetails: boolean;
	export let viewData: SuccessViewData;
</script>

<div class="grid gap-3 grid-auto-fill-lg">
	{#each viewData.rows as row}
		<Card.Root>
			<Card.Header>
				{#each Object.entries(row).slice(0, 2) as [key, value], i (key)}
					{#if i === 1}
						<Card.Title class="flex justify-between">{value}</Card.Title>
					{:else}
						<Card.Description class="text-xs">{value}</Card.Description>
					{/if}
				{/each}
			</Card.Header>
			{#if allowsDetails && row['id'] !== undefined}
				<Card.Footer>
					<Button variant="outline" href="{viewId}/{row['id']}">Details</Button>
				</Card.Footer>
			{/if}
		</Card.Root>
	{/each}
</div>
