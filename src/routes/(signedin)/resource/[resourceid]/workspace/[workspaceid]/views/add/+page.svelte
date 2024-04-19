<script lang="ts">
	import BackAnchor from '$lib/components/ui/anchor/back-anchor.svelte';
	import WorkspaceViewForm from '$lib/components/workspace-view/workspace-view-form.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div>
	<BackAnchor href="../edit" />
	<WorkspaceViewForm data={data.form} />
</div>
