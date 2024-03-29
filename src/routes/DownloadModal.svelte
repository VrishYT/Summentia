<script lang="ts">
	import { Button, Checkbox, Hr, Input, Label, Modal, Radio, Spinner } from 'flowbite-svelte';
	import {
		DEFAULT_CUSTOMISATION,
		type Customisation as CustomisationObj
	} from '$lib/types/Customisation';
	import {
		DIGITAL_OCEAN_ENDPOINT,
		DIGITAL_OCEAN_SUMMARIES_ENDPOINT
	} from '$lib/object_storage/static';
	import type { Project } from '@prisma/client';
	import path from 'node:path';

	export let open: boolean;
	export let project: Project;

	let customisation: CustomisationObj = project.customisation
		? (JSON.parse(JSON.stringify(project.customisation)) as CustomisationObj)
		: DEFAULT_CUSTOMISATION;

	let outputType: string;
	let loading = false;

	function sanitiseTitle(title: string): string {
		return `Download '${title}'`;
	}

	async function download() {
		if (!outputType) return;

		loading = true;

		const filetitle: string = project.title;

		const form = new FormData();
		form.append('id', project.id.toString());
		form.append('type', outputType);
		form.append('uuid', project.uuid);
		form.append('title', filetitle);
		form.append('customisation', JSON.stringify(customisation));

		const response = await fetch(`/download`, {
			method: 'POST',
			body: form
		});

		if (response.ok) {
			const json: {
				success: boolean;
				sanitisedFilename: string;
			}  = await response.json();

			const sanitisedFilename = json.sanitisedFilename;
			const url = `${DIGITAL_OCEAN_ENDPOINT}/${project.uuid}/summaries/${sanitisedFilename}.${outputType}`;
			//	const url = path.join(DIGITAL_OCEAN_SUMMARIES_ENDPOINT, `${filename}.${outputType}`);
			let link = document.createElement('a');

			link.href = url;
			link.click();
		}

		loading = false;
		open = false;
	}
</script>

<Modal title={sanitiseTitle(project.title)} bind:open outsideclose class="flex flex-col">
	{#if loading}
	<div class="flex-col absolute top-0 left-0 w-full h-full bg-opacity-50 bg-gray-900 flex items-center justify-center">
		<Spinner size="{12}" />
		<span class="ml-2 text-white">Prepare Downloading...</span>
	</div>
    {/if}
	<div class="flex flex-col w-full space-y-3">
		<div>
			<Label for="summary-types" class="mb-2">Types of Summary:</Label>
			<Radio name="type" value={''} bind:group={customisation.summary_format}>Text Format</Radio>
			<Radio name="type" value={'with each section organised into bullet points'} bind:group={customisation.summary_format}
				>Bullet Points</Radio
			>
		</div>
		<div>
			<Label for="extra-features" class="mb-2">Extra Features:</Label>
			<Checkbox bind:checked={customisation.highlight_keywords}>Underline Key Words</Checkbox>
			<Checkbox bind:checked={customisation.questions}>Generate Questions and Answers</Checkbox>
			<Checkbox bind:checked={customisation.reading_list}>Generate Reading List</Checkbox>
			<Checkbox bind:checked={customisation.key_definitions_list}>Generate Key Definitions List</Checkbox>
		</div>
	</div>
	<Hr />
	<div class="flex flex-col w-full">
		<h1 class="mb-4 font-semibold text-black dark:text-white">Download Format</h1>
		<ul
			class="items-center w-full rounded-lg border border-gray-200 sm:flex dark:bg-gray-800 dark:border-gray-600 divide-x rtl:divide-x-reverse divide-gray-200 dark:divide-gray-600"
		>
			<li class="w-full">
				<Radio bind:group={outputType} value={'pdf'} class="p-3">.pdf</Radio>
			</li>
			<li class="w-full">
				<Radio bind:group={outputType} value={'txt'} class="p-3">.txt</Radio>
			</li>
			<li class="w-full">
				<Radio bind:group={outputType} value={'tex'} class="p-3">.tex</Radio>
			</li>
			<li class="w-full">
				<Radio bind:group={outputType} value={'docx'} class="p-3">.docx</Radio>
			</li>
		</ul>
	</div>
	<svelte:fragment slot="footer">
		<div class="flex w-full justify-end">
			<Button on:click={() => download()}>Download</Button>
		</div>
	</svelte:fragment>
</Modal>
