<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { cn } from '$lib/utils.js';
	import {
		DateFormatter,
		getLocalTimeZone,
		parseDate,
		type DateValue
	} from '@internationalized/date';
	import CalendarIcon from 'lucide-svelte/icons/calendar';
	import type { ComponentProps } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';

	type $$Props = ComponentProps<Calendar> & HTMLInputAttributes;

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	let nativeValue: $$Props['value'] = undefined;
	let value: DateValue | undefined;
	$: value = nativeValue ? parseDate(nativeValue) : undefined;

	export { nativeValue as value };

	$: console.log(nativeValue);
</script>

<Popover.Root>
	<Popover.Trigger asChild let:builder {...$$restProps}>
		<Button
			variant="outline"
			class={cn('w-[280px] justify-start text-left font-normal', !value && 'text-muted-foreground')}
			builders={[builder]}
		>
			<CalendarIcon class="mr-2 h-4 w-4" />
			{value ? df.format(value.toDate(getLocalTimeZone())) : 'Pick a date'}
		</Button>
	</Popover.Trigger>
	<Popover.Content class="w-auto p-0">
		<Calendar bind:value initialFocus />
	</Popover.Content>
</Popover.Root>
