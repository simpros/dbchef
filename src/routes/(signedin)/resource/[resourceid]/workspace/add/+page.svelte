<script lang="ts">
	import type { PageData } from './$types';
	import AddWorkspaceForm from './add-workspace-form.svelte';

	export let data: PageData;
</script>

<div class="space-y-3">
	<h2 class="text-2xl font-bold">Add Workspace</h2>
	<AddWorkspaceForm data={data.form} />
</div>
