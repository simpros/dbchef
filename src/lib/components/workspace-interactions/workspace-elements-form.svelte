<script lang="ts">
	import { goto } from '$app/navigation';
	import type { ActionMessage } from '$lib/action-message';
	import * as Form from '$lib/components/ui/form';
	import { toast } from 'svelte-sonner';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import {
		arrayProxy,
		superForm,
		type Infer,
		type SuperValidated
	} from 'sveltekit-superforms/client';
	import { Button } from '../ui/button';
	import { Separator } from '../ui/separator';
	import WorkspacePreview from '../workspace-preview/workspace-preview.svelte';
	import WorkspaceInteractionBlock from './workspace-interaction-block.svelte';
	import { workspaceElementsSchema, type WorkspaceElementsSchema } from './workspace-schema';

	export let resourceid: string;
	export let data: SuperValidated<Infer<WorkspaceElementsSchema>>;

	const form = superForm<Infer<WorkspaceElementsSchema>, ActionMessage>(data, {
		dataType: 'json',
		validators: zodClient(workspaceElementsSchema),
		resetForm: false,
		async onUpdated(event) {
			if (event.form.message?.success) {
				toast.success(event.form.message.message);
				if (event.form.message.redirect) await goto(event.form.message.redirect);
			} else {
				toast.error(event.form.errors._errors?.[0] ?? 'An error occured');
			}
		}
	});
	const { values: viewElements } = arrayProxy(form, 'elements');

	const { form: formData, enhance } = form;
</script>

<div class="grid h-full grid-cols-[1fr_auto_1fr]">
	<div>
		<div class="grid grid-cols-[1fr_auto] items-center">
			<h4 class="text-lg font-bold">Interactions</h4>
			<Button
				variant="outline"
				size="sm"
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
		<div class="space-y-2">
			<form method="post" use:enhance class="grid grid-cols-1 content-center space-y-5">
				{#each $viewElements as _, i}
					<WorkspaceInteractionBlock {form} {i} />
				{/each}
				<Form.Button class="w-fit">Save</Form.Button>
			</form>
		</div>
	</div>
	<Separator orientation="vertical" class="mx-3" />
	<div>
		<h4 class="mb-3 text-lg font-bold">Preview</h4>
		<WorkspacePreview {form} {resourceid} />
	</div>
</div>
