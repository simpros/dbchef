<script lang="ts">
	import WorkspaceViewForm from '$lib/components/workspace-view/workspace-view-form.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<WorkspaceViewForm data={data.form} />
