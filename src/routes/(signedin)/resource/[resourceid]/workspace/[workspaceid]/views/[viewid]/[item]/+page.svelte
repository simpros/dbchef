<script lang="ts">
	import DetailForm from '$lib/components/workspace-view/details/detail-form.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div>
	<h3>DETAILS</h3>

	{#if data.form}
		<DetailForm data={data.form} />
	{/if}
</div>
