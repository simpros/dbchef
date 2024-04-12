<script lang="ts">
	import type { PageData } from './$types';
	import AddResourceForm from './add-resource-form.svelte';

	export let data: PageData;
</script>

<div>
	<h2 class="text-xl font-bold">Add a Resource</h2>
	<p class="mb-10 text-sm text-muted-foreground">You can add a new resource here.</p>
	<AddResourceForm data={data.form} />
</div>
