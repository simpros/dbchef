<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { type Infer, type SuperForm } from 'sveltekit-superforms/client';
	import { Separator } from '../ui/separator';
	import type { WorkspaceViewSchema } from './workspace-view-schema';

	export let availableCardFields: { name: string }[] = [];
	export let form: SuperForm<Infer<WorkspaceViewSchema>>;

	const { form: formData, enhance } = form;
</script>

<form method="post" use:enhance class="space-y-6">
	<div class="grid grid-cols-2 gap-3">
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
					class="font-mono"
					{...attrs}
					placeholder="Select * from movies where genre_id = &lbrace;genre&rbrace;"
					bind:value={$formData.providerQuery}
				/>
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field class="col-span-full" {form} name="detailQuery">
			<Form.Control let:attrs>
				<Form.Label>Detail Query</Form.Label>
				<Textarea
					class="font-mono"
					{...attrs}
					placeholder="Select * from movies where id = &lbrace;item&rbrace;"
					bind:value={$formData.detailQuery}
				/>
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field class="col-span-full" {form} name="updateQuery">
			<Form.Control let:attrs>
				<Form.Label>Update Query</Form.Label>
				<Textarea
					class="font-mono"
					{...attrs}
					placeholder="UPDATE movies SET &lbrace;values&rbrace; WHERE id = &lbrace;item&rbrace;"
					bind:value={$formData.updateQuery}
				/>
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
	</div>
	<Separator class="my-3" />
	<div class="opacity-70">
		<h3 class="text-lg font-bold">Card</h3>
		<div class="grid grid-cols-1 gap-3">
			<h4 class="font-bold">Available Fields</h4>
			{#each availableCardFields as item}
				<div class="rounded-md border p-3">{item.name}</div>
			{/each}
		</div>
	</div>
	<Form.Button class="w-fit">Save View</Form.Button>
</form>
