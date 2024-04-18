<script lang="ts">
	import { goto } from '$app/navigation';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { toast } from 'svelte-sonner';
	import { superForm } from 'sveltekit-superforms';
	import type { PageData } from './$types';

	export let data: PageData;

	const form = superForm(data.form, {
		async onUpdated({ form }) {
			if (form.message?.success) {
				toast.success(form.message.message);
				if (form.message.redirect) {
					await goto(form.message.redirect);
				}
			}
		}
	});

	const { form: formData, enhance } = form;
</script>

<div class="grid h-full grid-rows-[auto_1fr] gap-5">
	<h2 class="text-2xl font-bold">Add Workspace</h2>
	<form use:enhance method="post" class="grid gap-3">
		<Form.Field {form} name="name">
			<Form.Control let:attrs>
				<Form.Label>Name</Form.Label>
				<Input {...attrs} bind:value={$formData.name} />
			</Form.Control>
		</Form.Field>
		<Form.Button class="w-min">Create</Form.Button>
	</form>
</div>
