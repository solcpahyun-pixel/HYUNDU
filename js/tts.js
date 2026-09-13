console.log("🔥 tts.js 로드됨");
let currentAudio = null;
let ttsState = "idle";

async function speakText(text, rate = 0.85, options = {}) {
console.log("🔥 GOOGLE TTS speakText 실행");
    stopSpeech();

    try {

        if (options.onStart) {
            options.onStart();
        }

        ttsState = "loading";

const response = await fetch("https://hyundu-tts-487744215139.asia-northeast3.run.app/tts", {            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text: text
            })
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }

        const blob = await response.blob();
        const audioURL = URL.createObjectURL(blob);

        currentAudio = new Audio(audioURL);

        /*
         * Google TTS는 이미 음성 파일을 만들어 주므로
         * 현재 rate 값은 우선 사용하지 않는다.
         */

        currentAudio.onplay = () => {
            ttsState = "playing";
        };

        currentAudio.onended = () => {
            ttsState = "idle";

            if (options.onEnd) {
                options.onEnd();
            }

            URL.revokeObjectURL(audioURL);
            currentAudio = null;
        };

        currentAudio.onerror = (event) => {
            ttsState = "idle";

            if (options.onError) {
                options.onError(event);
            }

            URL.revokeObjectURL(audioURL);
            currentAudio = null;
        };

        await currentAudio.play();

        return currentAudio;

    } catch (error) {

        ttsState = "idle";

        console.error("Google TTS Error:", error);

        if (options.onError) {
            options.onError(error);
        }

        return null;
    }
}


function pauseSpeech() {

    if (currentAudio && !currentAudio.paused) {
        currentAudio.pause();
        ttsState = "paused";
    }
}


function resumeSpeech() {

    if (currentAudio && currentAudio.paused) {
        currentAudio.play();
        ttsState = "playing";
    }
}


function stopSpeech() {

    if (currentAudio) {

        currentAudio.pause();
        currentAudio.currentTime = 0;

        currentAudio = null;
    }

    ttsState = "idle";
}


function isSpeaking() {

    return currentAudio &&
           !currentAudio.paused &&
           !currentAudio.ended;
}


function isPaused() {

    return currentAudio &&
           currentAudio.paused &&
           currentAudio.currentTime > 0;
}


function getTTSState() {

    return ttsState;
}