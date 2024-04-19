<script lang="ts">
	import { goto } from '$app/navigation';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { toast } from 'svelte-sonner';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import WorkspaceViewPreview from './workspace-view-preview.svelte';
	import type { WorkspaceViewSchema } from './workspace-view-schema';

	export let data: SuperValidated<Infer<WorkspaceViewSchema>>;
	const form = superForm(data, {
		async onUpdated({ form }) {
			if (form.message?.success) {
				toast.success('View saved');
				await goto('..');
			}
		}
	});
	const { form: formData, enhance } = form;
</script>

<form method="post" use:enhance class="grid grid-cols-1 gap-3">
	<Form.Field {form} name="name">
		<Form.Control let:attrs>
			<Form.Label>Name</Form.Label>
			<Input {...attrs} bind:value={$formData.name} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="description">
		<Form.Control let:attrs>
			<Form.Label>Description</Form.Label>
			<Input
				{...attrs}
				placeholder="This view shows all movies that are in the specified genre."
				bind:value={$formData.description}
			/>
		</Form.Control>
	</Form.Field>
	<Form.Field {form} name="providerQuery">
		<Form.Control let:attrs>
			<Form.Label>Query</Form.Label>
			<Textarea
				{...attrs}
				placeholder="Select * from movies where id = &lbrace;genre&rbrace;"
				bind:value={$formData.providerQuery}
			/>
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Button class="w-fit">Save View</Form.Button>
</form>
<WorkspaceViewPreview {form} />
