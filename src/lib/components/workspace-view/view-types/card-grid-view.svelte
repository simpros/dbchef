<script lang="ts">
	import type { SuccessViewData } from '../call-view-query';

	export let viewData: SuccessViewData;
</script>

<div class="grid gap-3 grid-auto-fill-lg">
	{#each viewData.rows as row}
		<div class="border">
			<pre>{JSON.stringify(row, null, 2)}</pre>
		</div>
	{/each}
</div>
