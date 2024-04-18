<script lang="ts">
	import * as Select from '$lib/components/ui/select';
	import type { PreviewData } from './call-preview';

	export let data: PreviewData;
	export let parameters: Record<string, unknown>;
	export let onSelectChange: (name: string, value: unknown) => void;
</script>

{#each data as element}
	{#if element.error}
		<div class="flex flex-col">
			<span class="font-bold">{element.name}</span>
			<span class="text-destructive">{element.error}</span>
		</div>
	{:else if element.type === 'select' && !element.error}
		<span class="font-bold">{element.name}</span>
		<Select.Root
			selected={{
				value: parameters[element.name],
				label: element.result.find((p) => p.value === parameters[element.name])?.label
			}}
			onSelectedChange={(v) => {
				onSelectChange(element.name, v?.value);
			}}
		>
			<Select.Trigger>
				<Select.Value placeholder="Select a value" />
			</Select.Trigger>
			<Select.Content>
				{#each element.result as option}
					<Select.Item value={option.value} label={option.label} />
				{/each}
			</Select.Content>
			<Select.Input name={element.name} />
		</Select.Root>
	{/if}
{/each}
