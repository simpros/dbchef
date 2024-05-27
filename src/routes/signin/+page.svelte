<script lang="ts">
	import type { PageData } from './$types';
	import SigninForm from './signin-form.svelte';

	export let data: PageData;
</script>

<section class="container grid h-full grid-rows-1 items-center">
	<div class="mx-auto w-full max-w-2xl">
		<SigninForm data={data.form} />
	</div>
</section>
