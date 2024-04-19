<script lang="ts">
	import type { Infer, SuperForm } from 'sveltekit-superforms/client';
	import type { WorkspaceViewSchema } from './workspace-view-schema';

	export let form: SuperForm<Infer<WorkspaceViewSchema>>;

	const { form: formData } = form;
</script>

<pre>{JSON.stringify($formData, null, 2)}</pre>
