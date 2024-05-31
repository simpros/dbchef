<script lang="ts">
	import { goto } from '$app/navigation';
	import BackAnchor from '$lib/components/ui/anchor/back-anchor.svelte';
	import WorkspaceViewForm from '$lib/components/workspace-view/workspace-view-form.svelte';
	import { toast } from 'svelte-sonner';
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';

	export let data: PageData;

	const form = superForm(data.form, {
		async onUpdated({ form }) {
			if (form.message?.success) {
				toast.success('View saved');
				await goto('../edit');
			}
		}
	});
</script>

<div>
	<BackAnchor href="../edit" />
	<WorkspaceViewForm {form} availableCardFields={data.availableCardField} />
</div>
