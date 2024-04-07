<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Separator } from '$lib/components/ui/separator';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { addResourceSchema, type AddResourceSchema } from './schema';

	export let data: SuperValidated<Infer<AddResourceSchema>>;

	const form = superForm(data, {
		validators: zodClient(addResourceSchema)
	});

	const { form: formData, enhance } = form;
</script>

<form method="POST" use:enhance>
	<div class="grid grid-cols-[1fr_auto] gap-3">
		<Form.Field {form} name="host">
			<Form.Control let:attrs>
				<Form.Label>Host</Form.Label>
				<Input {...attrs} bind:value={$formData.host} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="port">
			<Form.Control let:attrs>
				<Form.Label>URL</Form.Label>
				<Input {...attrs} bind:value={$formData.port} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
	</div>
	<Form.Field {form} name="database">
		<Form.Control let:attrs>
			<Form.Label>Database</Form.Label>
			<Input {...attrs} bind:value={$formData.database} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Separator class="my-5" />
	<Form.Field {form} name="user">
		<Form.Control let:attrs>
			<Form.Label>User</Form.Label>
			<Input {...attrs} bind:value={$formData.user} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="password">
		<Form.Control let:attrs>
			<Form.Label>Password</Form.Label>
			<Input type="password" {...attrs} bind:value={$formData.password} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Button>Save Resource</Form.Button>
</form>
