/* =====================================================
   TTS ENGINE
   K-ICTC Speaking Reader
   V8.4
   ===================================================== */

/*
   현재는 브라우저 SpeechSynthesis를 사용한다.

   Reader / Flashcard / Podcast는
   직접 speechSynthesis를 호출하지 않고
   이 파일의 함수를 사용한다.

   추후 Kokoro 등의 TTS 엔진으로 교체할 때
   이 파일만 수정하는 것을 목표로 한다.
*/


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

    speechSynthesis.cancel();

    const utterance =
        new SpeechSynthesisUtterance(text);

    utterance.lang = "en-US";
    utterance.rate = rate;

    const voice = getEnglishVoice();

    if(voice){
        utterance.voice = voice;
    }


    // -------------------------------------------------
    // CALLBACK
    // -------------------------------------------------

    if(options.onStart){
        utterance.onstart = options.onStart;
    }

    if(options.onBoundary){
        utterance.onboundary = options.onBoundary;
    }

    if(options.onEnd){
        utterance.onend = options.onEnd;
    }

    if(options.onError){
        utterance.onerror = options.onError;
    }


    speechSynthesis.speak(utterance);

    return utterance;
}


// =====================================================
// PAUSE
// =====================================================

function pauseSpeech(){

    if(speechSynthesis.speaking){

        speechSynthesis.pause();

    }

}


// =====================================================
// RESUME
// =====================================================

function resumeSpeech(){

    if(speechSynthesis.paused){

        speechSynthesis.resume();

    }

}


// =====================================================
// STOP
// =====================================================

function stopSpeech(){

    speechSynthesis.cancel();

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


// =====================================================
// VOICE INITIALIZATION
// =====================================================

if("speechSynthesis" in window){

    speechSynthesis.onvoiceschanged = () => {

        getEnglishVoice();

    };

}