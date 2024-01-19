import * as fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';

function extract_audio(filePath: string) {
    ffmpeg()
        .input(filePath + ".mp4")
        .outputOptions('-ab', '192k')
        .on('progress', (progress) => {
            if (progress.percent) {
                console.log(`Processing: ${Math.floor(progress.percent)}% done`);
            }
        })
        .on('end', () => {
            console.log('FFmpeg has finished.');
        })
        .on('error', (error) => {
            console.error(error);
        })
        .format('mp3')
        .save(filePath + ".mp3")
}

async function run_query(filePath: string) {
    const data = fs.readFileSync(filePath + ".mp3");
    console.log(data);
    const response = await fetch(
        "https://api-inference.huggingface.co/models/openai/whisper-large-v3",
        {
            headers: { Authorization: "Bearer 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" },
            method: "POST",
            body: data,
        }
    );
    const result = await response.json();
    // console.log(result);
    return result
}

export async function transcribe(filePath: string) {
    try {
        extract_audio(filePath);
        const transcript = await run_query(filePath);
        return transcript;
    } catch (error) {
        console.log(error);
    }
}


