<script>
	import '../app.css';
	import Footer from './Footer.svelte';
	import Navbar from './Navbar.svelte';
	import { Button } from 'flowbite-svelte';
	import { PlusSolid } from 'flowbite-svelte-icons';
</script>

<div
	class="flex flex-col bg-gradient-to-br
        from-white via-slate-200 to-slate-600
        dark:from-black dark:via-slate-800 dark:to-slate-700
        bg-animate min-h-screen h-max justify-between"
>
	<Navbar />
	<div class="flex w-full justify-center">
		<slot />
		<div class="fixed bottom-5 right-5 z-10">
			<Button class="shadow-lg shadow-black hidden dark:flex" pill color="dark" href="/new"
				><PlusSolid class="mr-3" /> New Project</Button
			>
			<Button class="shadow-lg shadow-black flex dark:hidden" pill color="alternative" href="/new"
				><PlusSolid class="mr-3" /> New Project</Button
			>
		</div>
	</div>
	<Footer />
</div>

<style>
	.bg-animate {
		background-size: 400%;

		-webkit-animation: AnimationName 10s ease infinite;
		-moz-animation: AnimationName 10s ease infinite;
		animation: AnimationName 10s ease infinite;
	}
</style>
