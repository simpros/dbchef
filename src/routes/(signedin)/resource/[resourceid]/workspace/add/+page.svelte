<script lang="ts">
	import AddWorkspaceForm from '$lib/components/workspace-interactions/add-workspace-form.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="grid h-full grid-rows-[auto_1fr] gap-5">
	<h2 class="text-2xl font-bold">Add Workspace</h2>
	<AddWorkspaceForm data={data.form} />
</div>
