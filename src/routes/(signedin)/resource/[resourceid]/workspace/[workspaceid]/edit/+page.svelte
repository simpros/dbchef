<script lang="ts">
	import { page } from '$app/stores';
	import * as Accordion from '$lib/components/ui/accordion';
	import BackAnchor from '$lib/components/ui/anchor/back-anchor.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import WorkspaceForm from '$lib/components/workspace-interactions/workspace-elements-form.svelte';
	import { toast } from 'svelte-sonner';
	import { superForm } from 'sveltekit-superforms';
	import type { PageData } from './$types';

	export let data: PageData;

	const form = superForm(data.workspaceform, {
		resetForm: false,
		onUpdated({ form }) {
			if (form.message?.success) {
				toast.success(form.message.message);
			}
		}
	});

	const { form: formData, enhance } = form;
</script>

<div class="grid h-full grid-rows-[auto_auto_1fr] gap-5">
	<BackAnchor />
	<form method="post" action="?/update-workspace" use:enhance>
		<div class="flex items-center justify-between">
			<h2 class="text-2xl font-bold">Edit Workspace</h2>
			<Form.Button>Save</Form.Button>
		</div>
		<Form.Field {form} name="name">
			<Form.Control let:attrs>
				<Form.Label>Name</Form.Label>
				<Input {...attrs} bind:value={$formData.name} />
			</Form.Control>
		</Form.Field>
	</form>
	<Accordion.Root>
		<Accordion.Item value="workspace-items">
			<Accordion.Trigger>Items</Accordion.Trigger>
			<Accordion.Content>
				<WorkspaceForm data={data.elementsform} resourceid={$page.params.resourceid} />
			</Accordion.Content>
		</Accordion.Item>
		<Accordion.Item value="workspace-views">
			<Accordion.Trigger>Views</Accordion.Trigger>
			<Accordion.Content>
				{#if data.views.length}
					<div class="grid gap-3 grid-auto-fill-lg">
						{#each data.views as view}
							<Card.Root>
								<Card.Header>
									<Card.Title>{view.name}</Card.Title>
									<Card.Description>{view.description}</Card.Description>
								</Card.Header>
								<Card.Footer class="justify-end">
									<Button href={`./views/${view.id}`}>Edit</Button>
								</Card.Footer>
							</Card.Root>
						{/each}
					</div>
				{:else}
					<Button href="./views/add">Add your first View</Button>
				{/if}
			</Accordion.Content>
		</Accordion.Item>
	</Accordion.Root>
</div>
