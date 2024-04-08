<script>
	import { Toaster } from '$lib/components/ui/sonner';
	import { ModeWatcher, mode } from 'mode-watcher';
	import '../app.pcss';
</script>

<ModeWatcher />
<Toaster richColors theme={$mode} />
<slot />
