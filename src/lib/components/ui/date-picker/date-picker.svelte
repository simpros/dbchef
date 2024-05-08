<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { cn } from '$lib/utils.js';
	import {
		DateFormatter,
		fromDate,
		getLocalTimeZone,
		type DateValue
	} from '@internationalized/date';
	import CalendarIcon from 'lucide-svelte/icons/calendar';
	import type { ComponentProps } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';

	type $$Props = ComponentProps<Calendar> & HTMLInputAttributes;

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	export let value: Date | undefined = undefined;
	let mappedValue: DateValue | undefined;
	export let disabled: $$Props['disabled'] = false;

	$: {
		mappedValue = value ? fromDate(value, getLocalTimeZone()) : undefined;
	}
</script>

<Popover.Root>
	<Popover.Trigger let:builder {...$$restProps} asChild>
		<Button
			{disabled}
			variant="outline"
			class={cn('w-full justify-start text-left font-normal', !value && 'text-muted-foreground')}
			builders={[builder]}
		>
			<CalendarIcon class="mr-2 h-4 w-4" />
			{value ? df.format(value) : 'Pick a date'}
		</Button>
	</Popover.Trigger>
	<Popover.Content class="w-auto p-0">
		<Calendar
			value={mappedValue}
			initialFocus
			onValueChange={(v) => {
				if (v) {
					value = v.toDate(getLocalTimeZone());
				} else {
					value = undefined;
				}
			}}
		/>
	</Popover.Content>
</Popover.Root>
