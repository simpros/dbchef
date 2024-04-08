<script lang="ts">
	import type { PageData } from './$types';
	import AddCommisForm from './add-view-form.svelte';

	export let data: PageData;
</script>

<div class="space-y-3">
	<h2 class="text-2xl font-bold">Add Workspace</h2>
	<AddCommisForm data={data.form} resourceOptions={data.resourceOptions} />
</div>
