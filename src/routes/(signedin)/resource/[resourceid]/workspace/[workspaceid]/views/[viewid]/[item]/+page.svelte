<script lang="ts">
	import { BackAnchor } from '$lib/components/ui/anchor';
	import type { PageData } from './$types';
	import DetailForm from './detail-form.svelte';

	export let data: PageData;
</script>

<div class="grid h-full grid-rows-[auto_1fr]">
	<BackAnchor />
	{#if data.form}
		<div class="p-2">
			<DetailForm
				disabled={data.readonly}
				data={data.form}
				fieldTypes={data.types}
				relations={data.relations}
			/>
		</div>
	{/if}
</div>
