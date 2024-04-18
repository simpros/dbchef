<script>
	import { ChevronLeft } from 'lucide-svelte';

	export let size = 16;
	export let href = '.';
</script>

<a class="flex items-center gap-1 text-sm text-muted-foreground underline" {href}>
	<ChevronLeft {size} /> Back</a
>
