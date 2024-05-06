<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import type { FieldTypes } from '$lib/pg-utils/get-field-types';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms/client';
	import type { DetailSchema } from './detail-schema';

	export let data: SuperValidated<Infer<DetailSchema>>;
	export let fieldTypes: FieldTypes;
	const form = superForm(data, {
		dataType: 'json'
	});
	const { form: formData, enhance } = form;
</script>

<div>
	<form use:enhance method="POST">
		<div class="grid gap-4 grid-auto-fit-md">
			{#each Object.keys($formData) as key}
				<Form.FormField {form} name={key}>
					<Form.FormControl let:attrs>
						<Form.Label for={key}>{key}</Form.Label>
						{#if fieldTypes[key].data_type === 'text'}
							<Input {...attrs} bind:value={$formData[key]} />
						{:else if fieldTypes[key].data_type === 'date'}
							<pre>{$formData[key]}</pre>
							<!-- <DatePicker {...attrs} bind:value={$formData[key]} /> -->
						{:else}
							<Input {...attrs} bind:value={$formData[key]} />
						{/if}
					</Form.FormControl>
				</Form.FormField>
			{/each}
		</div>
	</form>
</div>
