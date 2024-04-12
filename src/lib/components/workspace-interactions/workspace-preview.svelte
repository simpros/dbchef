<script lang="ts">
	import { onMount } from 'svelte';
	import type { Infer, SuperForm } from 'sveltekit-superforms';
	import type { WorkspaceSchema } from './workspace-schema';

	export let resourceid: string;
	export let form: SuperForm<Infer<WorkspaceSchema>>;

	const { form: formData } = form;
	let debounce: Timer;
	let previewResult: Promise<Response> | undefined;

	onMount(() => {
		const unsub = formData.subscribe((v) => {
			clearTimeout(debounce);
			debounce = setTimeout(() => {
				previewResult = fetch('/api/exec-preview', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ ...v, resource_id: resourceid })
				});
			}, 500);
		});

		return unsub;
	});
</script>

{#await previewResult}
	<p>Loading...</p>
{:then response}
	{#if response?.ok}
		{#await response.json()}
			Loading
		{:then data}
			<pre>{JSON.stringify(data, null, 2)}</pre>
		{/await}
	{:else if response?.status === 400}
		<p>Invalid query</p>
	{:else}
		<p>Failed to preview</p>
	{/if}
{:catch error}
	<p>{error.message}</p>
{/await}
