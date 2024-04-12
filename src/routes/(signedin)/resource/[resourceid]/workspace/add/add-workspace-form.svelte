<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';
	import { toast } from 'svelte-sonner';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import {
		arrayProxy,
		superForm,
		type Infer,
		type SuperValidated
	} from 'sveltekit-superforms/client';
	import {
		addWorkspaceSchema,
		availableElementTypes,
		type AddViewSchema
	} from './add-workspace-schema';

	export let data: SuperValidated<Infer<AddViewSchema>>;

	const form = superForm(data, {
		dataType: 'json',
		validators: zodClient(addWorkspaceSchema),
		async onUpdated(event) {
			if (event.form.valid) {
				toast.success('Workspace created');
				await goto('/');
			} else {
				toast.error(event.form.errors.name?.[0] ?? 'An error occured');
			}
		}
	});

	const { values: viewElements } = arrayProxy(form, 'elements');

	const { form: formData, enhance } = form;
</script>

<form method="post" use:enhance class="space-y-5">
	<Form.Field {form} name="name">
		<Form.Control let:attrs>
			<Form.Label>Name</Form.Label>
			<Input {...attrs} bind:value={$formData.name} />
		</Form.Control>
	</Form.Field>
	<div class="flex items-center justify-between">
		<h3 class="text-lg font-bold">Elements</h3>
		<Button
			on:click={(e) => {
				e.preventDefault();
				$formData.elements = [...$formData.elements, { type: 'select', providerQuery: '' }];
			}}
		>
			Add Element
		</Button>
	</div>
	{#each $viewElements as _, i}
		{@const selectedType = $formData.elements[i].type
			? { value: $formData.elements[i].type, label: $formData.elements[i].type }
			: undefined}
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
	{/each}
	<Form.Button>Create View</Form.Button>
</form>
