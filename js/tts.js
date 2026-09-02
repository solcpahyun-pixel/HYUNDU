/* =====================================================
   TTS ENGINE
   K-ICTC Speaking Reader
   V8.4
   ===================================================== */

/*
   브라우저 SpeechSynthesis를 사용하는 공통 TTS 엔진.

   Reader / Flashcard / Podcast에서 사용하는
   재생 / 일시정지 / 재개 / 정지 기능을
   한 곳에서 관리하는 것을 목표로 한다.
*/


// =====================================================
// TTS STATE
// =====================================================

let currentTTSUtterance = null;
let ttsState = "idle";

// 현재 TTS 요청을 구분하기 위한 ID
let ttsRequestId = 0;


// =====================================================
// ENGLISH VOICE
// =====================================================

function getEnglishVoice(){

    const voices = speechSynthesis.getVoices();

    return voices.find(
        v => v.lang.toLowerCase() === "en-us"
    )
    || voices.find(
        v => v.lang.toLowerCase().startsWith("en")
    )
    || null;
}


// =====================================================
// SPEAK
// =====================================================

function speakText(
    text,
    rate = 0.85,
    options = {}
){

    // 새로운 TTS 요청
    const requestId = ++ttsRequestId;

if(options.cancelPrevious !== false){
    speechSynthesis.cancel();
}
    currentTTSUtterance =
        new SpeechSynthesisUtterance(text);

    currentTTSUtterance.lang = "en-US";
    currentTTSUtterance.rate = rate;

    const voice = getEnglishVoice();

    if(voice){
        currentTTSUtterance.voice = voice;
    }


    // -------------------------------------------------
    // CALLBACK
    // -------------------------------------------------

    currentTTSUtterance.onstart = e => {

        // 이전 TTS의 이벤트라면 무시
        if(requestId !== ttsRequestId){
            return;
        }

        ttsState = "playing";

        if(options.onStart){
            options.onStart(e);
        }

    };


    currentTTSUtterance.onboundary = e => {

        // 이전 TTS의 이벤트라면 무시
        if(requestId !== ttsRequestId){
            return;
        }

        if(options.onBoundary){
            options.onBoundary(e);
        }

    };


    currentTTSUtterance.onend = e => {

        // 이전 TTS의 이벤트라면 무시
        if(requestId !== ttsRequestId){
            return;
        }

        ttsState = "idle";
        currentTTSUtterance = null;

        if(options.onEnd){
            options.onEnd(e);
        }

    };


    currentTTSUtterance.onerror = e => {

        // 이전 TTS의 이벤트라면 무시
        if(requestId !== ttsRequestId){
            return;
        }

        ttsState = "idle";
        currentTTSUtterance = null;

        if(options.onError){
            options.onError(e);
        }

    };


    speechSynthesis.speak(currentTTSUtterance);

    return currentTTSUtterance;
}


// =====================================================
// PAUSE
// =====================================================

function pauseSpeech(){

    if(
        speechSynthesis.speaking &&
        !speechSynthesis.paused
    ){

        speechSynthesis.pause();

        ttsState = "paused";

    }

}


// =====================================================
// RESUME
// =====================================================

function resumeSpeech(){

    if(speechSynthesis.paused){

        speechSynthesis.resume();

        ttsState = "playing";

    }

}


// =====================================================
// STOP
// =====================================================

function stopSpeech(){

    // 현재 요청을 무효화
    ttsRequestId++;

    speechSynthesis.cancel();

    currentTTSUtterance = null;
    ttsState = "idle";

}


// =====================================================
// STATUS
// =====================================================

function isSpeaking(){

    return speechSynthesis.speaking;

}


function isPaused(){

    return speechSynthesis.paused;

}


function getTTSState(){

    return ttsState;

}


// =====================================================
// VOICE INITIALIZATION
// =====================================================

if("speechSynthesis" in window){

    speechSynthesis.onvoiceschanged = () => {

        getEnglishVoice();

    };

}