import { DIGITAL_OCEAN_ENDPOINT } from './../../object_storage/static';
import { PATH_TO_DATA } from '$env/static/private';
import { formatDate } from '$lib/utils';
import { randomUUID } from 'node:crypto';
import { VideoURLHandler } from './URLHandler';
import path from 'node:path';
import { writeFile } from 'node:fs/promises';
import { mkdirSync } from 'node:fs';
import { upload } from '$lib/object_storage/upload';
import ytdl from 'ytdl-core';

export class Lecture {
	readonly userId: string | undefined;
	uuid: string;
	video: Video;
	slides: string | undefined;
	info: { title: string; date: string } | undefined;
	customisation: { summaryLevel: number; questions: boolean };

	public constructor(video: Video, userId: string | undefined) {
		this.uuid = video.uuid;
		this.video = video;
		this.userId = userId;
		this.customisation = { summaryLevel: 2, questions: false };
	}

	public async withSlidesFromFile(slides: File): Promise<Lecture> {
		const filepath: string = path.join(PATH_TO_DATA, this.uuid, 'slides.pdf');
		console.log('slides file path' + filepath);
		console.log('uuid: ' + this.uuid);
		await writeFile(filepath, Buffer.from(await slides.arrayBuffer()));
		this.slides = filepath;
		return this;
	}

	public async withSlidesFromURL(url: string): Promise<Lecture> {
		// TODO: download from url and write to filesys
		this.slides = url;
		return this;
	}

	public async getTitleDate(): Promise<{ title: string; date: string }> {
		return this.info ? this.info : await this.video.getTitleDate();
	}

	// public abstract toFilePath(): Promise<string>;
	// public abstract saveToUrl(): URL;

	// public async cleanup(): Promise<void> {
	// 	if (this.video) await rm(this.video);
	// 	if ()
	// }

	public static async fromLectureForm(form: FormData): Promise<Lecture> {
		let video: Video;
		if (form.get('lectureFromFile') === 'true') {
			video = await VideoFromFile.from(form.get(`lectureFile`) as File);
		} else {
			const data = form.get('lectureURL');
			const valid_url = await VideoFromUrl.check_url(data.toString());
			if (!data || !valid_url) {
				throw new Error('Invalid URL');
			}

			video = await VideoFromUrl.from(new URL(data.toString()));
		}

		return new Lecture(video, form.get('userId')?.toString());
	}

	public static fromJSON(json: string): Lecture {
		const data: {
			uuid: string;
			video: string;
			slides: string;
			userId: string;
			info: { title: string; date: string };
			customisation: { summaryLevel: number; questions: boolean };
		} = JSON.parse(json);
		const lecture = new Lecture(new Video(data.uuid), data.userId);
		lecture.slides = data.slides;
		lecture.info = data.info;
		lecture.customisation = data.customisation;
		return lecture;
	}

	public async toJSON(): Promise<string> {
		return JSON.stringify({
			uuid: this.uuid,
			video: `${DIGITAL_OCEAN_ENDPOINT}/${this.uuid}/video.mp4`,
			slides: this.slides,
			userId: this.userId,
			info: this.info ? this.info : await this.video.getTitleDate(),
			customisation: this.customisation
		});
	}
}

class Video {
	readonly uuid: string;

	public constructor(uuid: string) {
		this.uuid = uuid;
		console.log(`Init with uuid=${uuid}`);
	}

	public async getTitleDate(): Promise<{ title: string; date: string }> {
		return { title: 'Lecture', date: formatDate(new Date()) };
	}

	// public saveToUrl();
}

class VideoFromFile extends Video {
	private readonly file: File;

	private constructor(uuid: string, file: File) {
		super(uuid);
		this.file = file;
	}

	static async from(file: File): Promise<VideoFromFile> {
		const uuid: string = randomUUID();
		const folder: string = path.join(PATH_TO_DATA, uuid);
		console.log(folder);
		mkdirSync(folder);
		console.log(`mkdir ${folder}`);
		const filepath: string = path.join(folder, 'video.mp4');
		await writeFile(filepath, Buffer.from(await file.arrayBuffer()));
		console.log(`Written file to ${path}`);

		const destination = `${uuid}/video.mp4`;
		upload(filepath, destination);
		return new VideoFromFile(uuid, file);
	}

	// public async toFilePath(): Promise<string> {
	// 	await writeFile(this.video, Buffer.from(await this.file.arrayBuffer()));
	// 	return this.video;
	// }

	public async getTitleDate(): Promise<{ title: string; date: string }> {
		const date = new Date();

		return {
			title: path
				.parse(this.file.name)
				.name.replaceAll(/[^a-zA-Z\d]/g, ' ')
				.split(' ')
				.map((word) => word[0].toUpperCase() + (word.length > 1 ? word.substring(1) : ''))
				.join(' '),
			date: formatDate(date)
		};
	}

	// public saveToUrl(): URL {
	//     throw new Error("Method not implemented.");
	// }
}

// TODO: check if can be combined with URLHandler
class VideoFromUrl extends Video {
	private readonly handler: VideoURLHandler;

	static async check_url(url: string) {
		let value = true;
		try {
			await ytdl.getInfo(url.toString());
		} catch {
			value = false;
		}
		return value;
	}

	static async from(url: URL): Promise<VideoFromUrl> {
		const uuid: string = randomUUID();
		const folder: string = path.join(PATH_TO_DATA, uuid);
		console.log(folder);
		mkdirSync(folder);
		console.log(`mkdir ${folder}`);
		const video = new VideoFromUrl(VideoURLHandler.create(url), uuid);
		await video.download();
		return video;
	}

	private async download(): Promise<void> {
		await this.handler.download(this.uuid);
	}

	private constructor(urlHandler: VideoURLHandler, uuid: string) {
		super(uuid);
		this.handler = urlHandler;
	}

	public getTitleDate(): Promise<{ title: string; date: string }> {
		return this.handler.getTitleDate();
	}
}
