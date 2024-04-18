<script lang="ts">
	import { onMount } from 'svelte';
	import { derived, writable } from 'svelte/store';
	import type { Infer, SuperForm } from 'sveltekit-superforms';
	import type { WorkspaceElementsSchema } from '../workspace-interactions/workspace-schema';
	import PreviewElements from './preview-elements.svelte';

	export let resourceid: string;
	export let form: SuperForm<Infer<WorkspaceElementsSchema>>;

	const { form: formData } = form;
	let debounce: Timer;
	let previewResult: Promise<Response> | undefined;
	let parameters = writable({} as Record<string, unknown>);

	const idk = derived([formData, parameters], ([$formData, $parameters]) => {
		return { ...$formData, parameters: $parameters };
	});

	onMount(() => {
		const unsub = idk.subscribe((v) => {
			clearTimeout(debounce);
			debounce = setTimeout(() => {
				previewResult = fetch('/api/exec-preview', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ ...v, resource_id: resourceid })
				});
			}, 250);
		});

		return unsub;
	});
</script>

{#await previewResult}
	<p>Loading...</p>
{:then response}
	{#if response?.ok}
		{#await response.json()}
			<p>Loading...</p>
		{:then data}
			<PreviewElements
				{data}
				parameters={$parameters}
				onSelectChange={(k, v) => {
					parameters.update((p) => ({ ...p, [k]: v }));
				}}
			/>
		{/await}
	{:else if response?.status === 400}
		<p>Invalid query</p>
	{:else}
		<p>Failed to preview</p>
	{/if}
{:catch error}
	<p>{error.message}</p>
{/await}
