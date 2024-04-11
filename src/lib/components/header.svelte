<script>
	import { enhance } from '$app/forms';
	import { LogOut } from 'lucide-svelte';
	import * as Avatar from './ui/avatar';
	import * as DropdownMenu from './ui/dropdown-menu';
</script>

<header
	class="sticky top-0 z-10 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
>
	<div class="container flex h-14 max-w-screen-2xl items-center">
		<a href="/" class="font-bold">dbchef</a>
		<div class="flex flex-1 justify-end">
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					<Avatar.Root>
						<Avatar.Image src="https://avatars.githubusercontent.com/u/1024025?v=4" />
						<Avatar.Fallback>John Doe</Avatar.Fallback>
					</Avatar.Root>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content class="w-56">
					<DropdownMenu.Label>My Account</DropdownMenu.Label>
					<DropdownMenu.Separator />
					<form action="/logout" method="post" use:enhance>
						<DropdownMenu.Item>
							<button type="submit" class="flex w-full items-center">
								<LogOut class="mr-2 h-4 w-4" />
								<span>Log out</span>
								<DropdownMenu.Shortcut>⇧⌘Q</DropdownMenu.Shortcut>
							</button>
						</DropdownMenu.Item>
					</form>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
	</div>
</header>
