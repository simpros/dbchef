<script lang="ts">
	import { page } from '$app/stores';
	import type { WorkspaceView } from '$db/schema';
	import { cn } from '$lib/utils';

	export let views: WorkspaceView[];
</script>

<div class="grid grid-auto-fill-sm">
	{#each views as view}
		{@const active = $page.url.pathname.endsWith(view.id)}
		<a href="{view.id}?{$page.url.searchParams}" class={cn(active && 'font-semibold underline')}>
			{view.name}
		</a>
	{/each}
</div>
