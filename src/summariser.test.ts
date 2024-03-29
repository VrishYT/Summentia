import { test, expect } from 'vitest';
import { summarise } from '../src/lib/summariser';

const lecture1: string = `I'm Preesha Gehlot, currently in my third year studying Computing at Imperial College London. Nestled near Chelsea in the heart of London, I'm deeply engaged in a captivating software engineering project focused on the auto summarization of lectures. 
This endeavor allows me to blend my passion for technology with the dynamic world of education. Within my academic journey, I've found particular joy in exploring the intricacies of data processing, concurrency, and compilers. These modules have not only broadened my understanding but also fueled my curiosity for 
the ever-evolving landscape of computing. Beyond the realm of code and algorithms, I embrace an active lifestyle. Whether it's the rhythmic beat of my running shoes hitting the pavement or the strategic intensity of a tennis match, I find solace and exhilaration in staying active. Reading serves as a constant companion, 
and my favorite movie, "Good Will Hunting," mirrors my appreciation for compelling narratives. On the tennis court, my admiration extends to Nick Kyrgios, whose mischievous on-court persona adds a touch of spontaneity to the game. Looking ahead, post-graduation holds the promise of adventure as I dream of traversing the 
diverse landscapes and cultures of Asia. This upcoming journey embodies my insatiable curiosity and eagerness to explore the world beyond the confines of academia.`;

const lecture1_keywords = new Set<string>([
	'preesha',
	'gehlot',
	'computing',
	'imperial',
	'london',
	'data',
	'processing',
	'concurrency',
	'compilers',
	'running',
	'tennis',
	'nick',
	'kyrgios',
	'travelling',
	'asia',
	'reading',
	'graduation',
	'good',
	'will',
	'hunting'
]);

const lecture2: string = `In the last section, we examined some early aspects of memory. In this section, what we’re going to do is discuss some factors that influence memory. So let’s do that by beginning with the concept on slide two, and that concept is overlearning. Basically in overlearning, the idea is that you continue to study something after you can recall it perfectly. So you study some particular topic whatever that topic is. When you can recall it perfectly, you continue to study it.
This is a classic way to help when one is taking comprehensive finals later in the semester. So when you study for exam one and after you really know it all, you continue to study it. That will make your comprehensive final easier.
The next factor that will influence memory relates to what we call organization. In general, if you can organize material, you can recall it better. There are lots of different types of organizational strategies and I’ve listed those on slide four. So let’s begin by talking about the first organizational strategy called clustering and is located on page five.
In clustering, basically you recall items better if you can recognize that there are two or more types of things in a particular list. So let’s give a couple of lists and show you some examples of that. These examples are shown in slide six.
Let’s say that I give you the first list; north, cardinal, south, robin, east, wren, west, sparrow. Now if you can recognize that north, south, east and west are points on a compass and cardinal, robin, wren and sparrow are birds, then you have a higher probability of recalling that material than if you just tried to recall the list in order.
The same occurs with the second list that is located on the right hand side of page six. So let’s list these words as well; pig, cat, horse, dog, sheep, birds, cow, and fish. Now if you can recognize that these are two groups of animals; one being farm animals and the other being domestic companions, ala, pets, then you can recall that list of material better than if you just tried to recall the list in order. So again, this is another type of example of organizational strategy.
Now there are other organizational strategies that one can use as well. The next one of these, as we see on slide seven, are what are called verbal pneumonic techniques. In verbal pneumonic techniques, you make your own organization and there are many, many different types of techniques. So let’s talk about the first of these on slide eight and that is called acrostics. In acrostics these are phrases in which the first letter of each word functions as a cue to help you recall some piece of information. There are a variety of different acrostics that one uses. The most famous of these relates to this saying: On Old Olympus Towering Tops A Fin And German Vented Some Hops. These relate to the twelve different cranial nerves that we have within the brain and if you are a traditional medical student or taking anatomy and physiology, this is the acrostic that you usually use to remember them.
Now there are other verbal pneumonic techniques as well.`;

const lecture2_keywords = new Set<string>([
	'memory',
	'factors',
	'influence',
	'overlearning',
	'study',
	'recall',
	'perfectly',
	'topic',
	'continue',
	'easier',
	'organization',
	'material',
	'strategies',
	'clustering',
	'recognize',
	'probability',
	'groups',
	'pneumonic',
	'acrostics'
]);

test('accurate summary of short transcript', async () => {
	const summary = await summarise(lecture1);
	const keyWords = lecture1_keywords;

	const splitted = (summary == null ? '' : summary)
		.split(/[ .,]/)
		.filter((item) => item.length > 0);

	let count = 0;
	function update_count(item: string) {
		if (keyWords.has(item.toLowerCase())) {
			count += 1;
		}
	}

	splitted.forEach(update_count);

	expect(count).toBeGreaterThan(10);
}, 70000);

test('accurate brief summary of short transcript', async () => {
	const summary = await summarise(lecture1, 0);
	const keyWords = lecture1_keywords;

	const splitted = (summary == null ? '' : summary)
		.split(/[ .,]/)
		.filter((item) => item.length > 0);

	let count = 0;
	function update_count(item: string) {
		if (keyWords.has(item.toLowerCase())) {
			count += 1;
		}
	}

	splitted.forEach(update_count);

	expect(count).toBeGreaterThan(5);
}, 70000);

test('accurate extensive summary of short transcript', async () => {
	const summary = await summarise(lecture1, 2);
	const keyWords = lecture1_keywords;

	const splitted = (summary == null ? '' : summary)
		.split(/[ .,]/)
		.filter((item) => item.length > 0);

	let count = 0;
	function update_count(item: string) {
		if (keyWords.has(item.toLowerCase())) {
			count += 1;
		}
	}

	splitted.forEach(update_count);

	expect(count).toBeGreaterThan(15);
}, 70000);

test('accurate summary of realistic transcript', async () => {
	const summary = await summarise(lecture2);
	const keyWords = lecture2_keywords;

	const splitted = (summary == null ? '' : summary)
		.split(/[ .,]/)
		.filter((item) => item.length > 0);

	let count = 0;
	function update_count(item: string) {
		if (keyWords.has(item.toLowerCase())) {
			count += 1;
		}
	}

	splitted.forEach(update_count);

	expect(count).toBeGreaterThan(10);
}, 70000);

test('accurate brief summary of realistic transcript', async () => {
	const summary = await summarise(lecture2, 0);
	const keyWords = lecture2_keywords;

	const splitted = (summary == null ? '' : summary)
		.split(/[ .,]/)
		.filter((item) => item.length > 0);

	let count = 0;
	function update_count(item: string) {
		if (keyWords.has(item.toLowerCase())) {
			count += 1;
		}
	}

	splitted.forEach(update_count);

	expect(count).toBeGreaterThan(5);
}, 70000);

test('accurate extensive summary of realistic transcript', async () => {
	const summary = await summarise(lecture2, 2);
	const keyWords = lecture2_keywords;

	const splitted = (summary == null ? '' : summary)
		.split(/[ .,]/)
		.filter((item) => item.length > 0);

	let count = 0;
	function update_count(item: string) {
		if (keyWords.has(item.toLowerCase())) {
			count += 1;
		}
	}

	splitted.forEach(update_count);

	expect(count).toBeGreaterThan(15);
}, 70000);
