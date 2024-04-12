<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { toast } from 'svelte-sonner';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import {
		arrayProxy,
		superForm,
		type Infer,
		type SuperValidated
	} from 'sveltekit-superforms/client';
	import { Separator } from '../ui/separator';
	import { addWorkspaceSchema, type AddWorkspaceSchema } from './add-workspace-schema';
	import WorkspaceSelect from './wordspace-select.svelte';

	export let data: SuperValidated<Infer<AddWorkspaceSchema>>;

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

<form method="post" use:enhance class="flex flex-col space-y-5">
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
	<div class="grid h-full grid-cols-[1fr_auto_1fr]">
		<div>
			<h4 class="mb-3 text-lg font-bold">Interactions</h4>
			<div>
				{#each $viewElements as _, i}
					<WorkspaceSelect {form} {i} />
				{/each}
			</div>
		</div>
		<Separator orientation="vertical" class="mx-3" />
		<div>
			<h4 class="mb-3 text-lg font-bold">Preview</h4>
			TODO
		</div>
	</div>
	<Form.Button class="w-fit">Create Workspace</Form.Button>
</form>
