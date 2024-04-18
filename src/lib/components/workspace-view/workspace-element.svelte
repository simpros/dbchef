<script lang="ts">
	import * as Select from '$lib/components/ui/select';
	import type { Selected } from 'bits-ui';
	import type { SuccessElementData } from './get-workspace-element';

	export let data: SuccessElementData;
	export let selectedValue: string | null;
	export let onSelectedChange: (selected: Selected<string | null> | undefined) => void;
</script>

<span class="font-bold">{data.name}</span>
<Select.Root
	selected={{
		value: selectedValue,
		label: data.options.find((p) => p.value === selectedValue)?.label
	}}
	{onSelectedChange}
>
	<Select.Trigger>
		<Select.Value placeholder="Select a value" />
	</Select.Trigger>
	<Select.Content>
		{#each data.options as option}
			<Select.Item value={option.value} label={option.label} />
		{/each}
	</Select.Content>
	<Select.Input name={data.name} />
</Select.Root>
