<script lang="ts">
	import { goto } from '$app/navigation';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';
	import { toast } from 'svelte-sonner';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms/client';
	import { addWorkspaceSchema, type AddWorkspaceSchema } from './add-view-schema';

	export let data: SuperValidated<Infer<AddWorkspaceSchema>>;
	export let resourceOptions: { id: string; name: string }[] = [];

	const form = superForm(data, {
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

	const { form: formData, enhance } = form;

	$: selectedResource = $formData.resourceId
		? {
				label:
					resourceOptions.find((r) => r.id === $formData.resourceId)?.name ?? 'Resource not found',
				value: $formData.resourceId
			}
		: undefined;
</script>

<form method="post" use:enhance class="space-y-3">
	<div class="grid-auto-fit grid gap-3">
		<Form.Field {form} name="name">
			<Form.Control let:attrs>
				<Form.Label>Name</Form.Label>
				<Input {...attrs} bind:value={$formData.name} />
			</Form.Control>
		</Form.Field>
		<Form.Field {form} name="resourceId">
			<Form.Control let:attrs>
				<Form.Label>Resource</Form.Label>
				<Select.Root
					selected={selectedResource}
					onSelectedChange={(v) => {
						v && ($formData.resourceId = v.value);
					}}
				>
					<Select.Trigger {...attrs} bind:value={$formData.resourceId}>
						<Select.Value placeholder="Select a resource" />
					</Select.Trigger>
					<Select.Content>
						{#each resourceOptions as option}
							<Select.Item value={option.id} label={option.name} />
						{/each}
					</Select.Content>
				</Select.Root>
				<input type="hidden" bind:value={$formData.resourceId} name={attrs.name} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
	</div>
	<Form.Button>Create Workspace</Form.Button>
</form>
