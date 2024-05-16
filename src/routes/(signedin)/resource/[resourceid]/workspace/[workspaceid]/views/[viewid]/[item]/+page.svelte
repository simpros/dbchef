<script lang="ts">
	import BackAnchor from '$lib/components/ui/anchor/back-anchor.svelte';
	import DetailForm from '$lib/components/workspace-view/details/detail-form.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="grid grid-rows-[auto_1fr]">
	<BackAnchor />
	{#if data.form}
		<div class="p-2">
			<DetailForm disabled={data.readonly} data={data.form} fieldTypes={data.types} />
		</div>
	{/if}
</div>
