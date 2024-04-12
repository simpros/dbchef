<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import * as Select from '$lib/components/ui/select';
	import type { Infer, SuperForm } from 'sveltekit-superforms/client';
	import { Input } from '../ui/input';
	import { availableElementTypes, type AddWorkspaceSchema } from './add-workspace-schema';

	export let form: SuperForm<Infer<AddWorkspaceSchema>>;
	export let i: number;
	const { form: formData } = form;

	let selectedType = $formData.elements[i].type
		? { value: $formData.elements[i].type, label: $formData.elements[i].type }
		: undefined;
</script>

<div class="grid gap-3 grid-auto-fit-md">
	<Form.Field {form} name="elements[{i}].type">
		<Form.Control let:attrs>
			<Form.Label>Type</Form.Label>
			<Select.Root
				selected={selectedType}
				onSelectedChange={(v) => {
					v && ($formData.elements[i].type = v.value);
				}}
			>
				<Select.Trigger {...attrs}>
					<Select.Value placeholder="Select a type" />
				</Select.Trigger>
				<Select.Content>
					{#each availableElementTypes as option}
						<Select.Item value={option} label={option} />
					{/each}
				</Select.Content>
			</Select.Root>
		</Form.Control>
	</Form.Field>
	<Form.Field {form} name="elements[{i}].providerQuery">
		<Form.Control let:attrs>
			<Form.Label>Provider Query</Form.Label>
			<Input class="font-mono" {...attrs} bind:value={$formData.elements[i].providerQuery} />
		</Form.Control>
	</Form.Field>
</div>
