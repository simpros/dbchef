<script lang="ts">
	import { DatePicker } from '$lib/components/ui/date-picker';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import type { FieldTypes } from '$lib/pg-utils/converter/db-to-form';
	import { toast } from 'svelte-sonner';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms/client';
	import type { DetailSchema } from './detail-schema';
	import type { RelationsData } from './get-relations-data';

	export let data: SuperValidated<Infer<DetailSchema>>;
	export let fieldTypes: FieldTypes;
	export let disabled: boolean = false;
	export let relations: RelationsData;

	const form = superForm(data, {
		resetForm: false,
		dataType: 'json',
		onUpdate(d) {
			if (d.form.valid) {
				toast.success('Successfully updated');
			} else {
				toast.error('Failed to update');
			}
		}
	});
	const { form: formData, enhance } = form;
</script>

<form use:enhance method="POST" class="grid h-full grid-rows-[1fr_auto]">
	<div class="grid auto-rows-min gap-4 grid-auto-fit-xl">
		{#each Object.keys($formData) as key}
			<Form.FormField {form} name={key}>
				<Form.FormControl let:attrs>
					<Form.Label for={key}>{key}</Form.Label>
					{#if relations[key] !== undefined}
						{@const optionsPromise = relations[key]}
						{#await optionsPromise}
							<span>Loading Options</span>
						{:then options}
							<Select.Root
								{disabled}
								onSelectedChange={(e) => ($formData[key] = e?.value)}
								selected={{
									value: $formData[key],
									label: options.find((o) => $formData[key] === o.value)?.label ?? 'Not found'
								}}
							>
								<Select.Trigger {...attrs}>
									<Select.Value />
								</Select.Trigger>
								<Select.Content>
									{#each options as option}
										<Select.Item value={option.value}>{option.label}</Select.Item>
									{/each}
								</Select.Content>
							</Select.Root>
						{:catch error}
							<span>Error Loading Options: {error.message}</span>
						{/await}
					{:else if fieldTypes[key].data_type === 'text'}
						<Input {disabled} {...attrs} bind:value={$formData[key]} />
					{:else if fieldTypes[key].data_type === 'date'}
						<DatePicker {disabled} {...attrs} bind:value={$formData[key]} />
						<input hidden value={$formData[key]} name={attrs.name} />
					{:else if fieldTypes[key].data_type === 'json'}
						<Textarea {disabled} {...attrs} bind:value={$formData[key]} />
					{:else}
						<Input {disabled} {...attrs} bind:value={$formData[key]} />
					{/if}
				</Form.FormControl>
			</Form.FormField>
		{/each}
	</div>
	<Form.Button class="w-fit">Save</Form.Button>
</form>
