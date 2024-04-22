<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { type Infer, type SuperForm } from 'sveltekit-superforms/client';
	import type { WorkspaceViewSchema } from './workspace-view-schema';

	export let form: SuperForm<Infer<WorkspaceViewSchema>>;

	const { form: formData, enhance } = form;
</script>

<form method="post" use:enhance class="grid grid-cols-2 gap-3">
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
	<Form.Field class="col-span-full" {form} name="providerQuery">
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
