<script lang="ts">
	import type { Resource } from '$db/schema';
	import { Button } from '$lib/components/ui/button/index';
	import * as Card from '$lib/components/ui/card/index';

	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input/index';
	import { Label } from '$lib/components/ui/label/index';

	import { zodClient } from 'sveltekit-superforms/adapters';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms/client';
	import {
		establishConnectionSchema,
		type EstablishConnectionSchema
	} from './establish-connection-schema';

	export let resource: Resource;
	export let data: SuperValidated<Infer<EstablishConnectionSchema>>;
	const form = superForm(data, {
		validators: zodClient(establishConnectionSchema)
	});

	const { form: formData, enhance } = form;

	let input: HTMLInputElement;

	$: if (input) {
		input.focus();
	}
</script>

<div class="fixed inset-0 z-50 grid place-items-center bg-black/30 backdrop-blur-md">
	<Card.Root>
		<Card.Header>
			<Card.Title>Connect to {resource.name}</Card.Title>
			<Card.Description>
				Before you can work with the resource you have to establish a connection
			</Card.Description>
		</Card.Header>
		<Card.Content>
			<form action="/resource/{resource.id}?/connect" method="post" use:enhance>
				<Form.FormField {form} name="password">
					<Form.FormControl let:attrs>
						<Label>Password</Label>
						<Input bind:ref={input} type="password" {...attrs} bind:value={$formData.password} />
					</Form.FormControl>
					<Form.FieldErrors />
				</Form.FormField>
			</form>
		</Card.Content>
		<Card.Footer class="flex justify-between">
			<Button href="/" variant="outline">Cancel</Button>
			<Button>Connect</Button>
		</Card.Footer>
	</Card.Root>
</div>
