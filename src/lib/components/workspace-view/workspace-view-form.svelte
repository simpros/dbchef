<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import type { ChefRelations } from '$lib/pg-utils/chef-relations';
	import { arrayProxy, type Infer, type SuperForm } from 'sveltekit-superforms/client';
	import type { WorkspaceViewSchema } from './workspace-view-schema';

	export let form: SuperForm<Infer<WorkspaceViewSchema>>;
	export let relations: ChefRelations = null;
	const { form: formData, enhance } = form;
	const { values } = arrayProxy(form, 'relations');
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

		<div class="col-span-full">
			{#if relations}
				<h3 class="font-bold">Relations</h3>
				<div class="grid gap-2">
					{#each relations as relation, i}
						<input type="hidden" name="relations[{i}].columnName" value={relation.column_name} />
						<Form.Field {form} name={`relations[${i}].providerQuery`}>
							<Form.Control let:attrs>
								<Form.Label><span class="italic">{relation.column_name}</span> query</Form.Label>
								<Form.Description>
									{relation.target_column} / {relation.target_table}
								</Form.Description>
								<Textarea
									{...attrs}
									bind:value={$values[i].providerQuery}
									placeholder="SELECT {relation.target_column} as value, name as label FROM {relation.target_table}"
								/>
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
					{/each}
				</div>
			{/if}
		</div>

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

	<Form.Button class="w-fit">Save View</Form.Button>
</form>
