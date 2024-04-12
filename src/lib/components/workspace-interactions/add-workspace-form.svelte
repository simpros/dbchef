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
	import WorkspaceInteractionBlock from './workspace-interaction-block.svelte';
	import WorkspacePreview from './workspace-preview.svelte';
	import { workspaceSchema, type WorkspaceSchema } from './workspace-schema';

	export let resourceid: string;
	export let data: SuperValidated<Infer<WorkspaceSchema>>;

	const form = superForm(data, {
		dataType: 'json',
		validators: zodClient(workspaceSchema),
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
				$formData.elements = [
					...$formData.elements,
					{ name: '', type: 'select', providerQuery: '' }
				];
			}}
		>
			Add Element
		</Button>
	</div>
	<div class="grid h-full grid-cols-[1fr_auto_1fr]">
		<div>
			<h4 class="mb-3 text-lg font-bold">Interactions</h4>
			<div class="space-y-2">
				{#each $viewElements as _, i}
					<WorkspaceInteractionBlock {form} {i} />
				{/each}
			</div>
		</div>
		<Separator orientation="vertical" class="mx-3" />
		<div>
			<h4 class="mb-3 text-lg font-bold">Preview</h4>
			<WorkspacePreview {form} {resourceid} />
		</div>
	</div>
	<Form.Button class="w-fit">Create Workspace</Form.Button>
</form>
