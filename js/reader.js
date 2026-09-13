/* =====================================================
   CURRENT READER
   K-ICTC Speaking Reader
   V8.4
   ===================================================== */

let words = [];
let currentUtterance = null;

let pausedCharIndex = 0;
let lastCharIndex = 0;
let sentenceReaderDeckId = null;
let sentenceReaderIndex = 0;


// =====================================================
// SENTENCE DECK READER
// =====================================================

function updateSentenceDeckReader(){

    const deck = getSentenceDeck(sentenceReaderDeckId);

    if(!deck || !deck.sentences.length){

        sentenceReaderDeckId = null;
        $("sentenceReaderNavigation").style.display = "none";

        return;

    }

    if(sentenceReaderIndex < 0){
        sentenceReaderIndex = deck.sentences.length - 1;
    }

    if(sentenceReaderIndex >= deck.sentences.length){
        sentenceReaderIndex = 0;
    }

    const item = deck.sentences[sentenceReaderIndex];

    stopSpeech();

    pausedCharIndex = 0;
    lastCharIndex = 0;

    $("text").value = item.text;
    $("charCount").textContent =
        `${item.text.length.toLocaleString()} characters`;
    $("status").textContent =
        `${deck.name} · 문장 ${sentenceReaderIndex + 1}`;
    $("sentenceReaderPosition").textContent =
        `${sentenceReaderIndex + 1} / ${deck.sentences.length}`;
    $("sentenceReaderNavigation").style.display = "block";

    buildReader();

}

function startSentenceDeckReader(deckId,index){

    const deck = getSentenceDeck(deckId);

    if(!deck || !deck.sentences.length)return;

    sentenceReaderDeckId = deckId;
    sentenceReaderIndex = index;

    updateSentenceDeckReader();
    showPage("current");

}

function leaveSentenceDeckReader(){

    sentenceReaderDeckId = null;
    $("sentenceReaderNavigation").style.display = "none";

}

$("sentenceReaderPrev").onclick = () => {

    sentenceReaderIndex--;
    updateSentenceDeckReader();

};

$("sentenceReaderNext").onclick = () => {

    sentenceReaderIndex++;
    updateSentenceDeckReader();

};


// =====================================================
// BUILD READER
// =====================================================

function buildReader(){

    const text = $("text").value;

    const regex = /\S+/g;

    let match;
    let last = 0;
    let output = "";

    words = [];

    while((match = regex.exec(text))){

        output += escapeHTML(
            text.slice(last, match.index)
        );

        const index = words.length;

        words.push(match[0]);

        output += `
            <span
                class="word"
                id="word-${index}"
                onclick="speakWord(${index})">
                ${escapeHTML(match[0])}
            </span>
        `;

        last =
            match.index +
            match[0].length;
    }

    output += escapeHTML(
        text.slice(last)
    );

    $("reader").innerHTML = output;
}


// =====================================================
// RESET HIGHLIGHTS
// =====================================================

function resetHighlights(){

    document
        .querySelectorAll(".word")
        .forEach(el => {

            el.classList.remove("current");
            el.classList.remove("done");

        });

}


// =====================================================
// HIGHLIGHT WORD
// =====================================================

function highlightWordAt(charIndex){

    const text = $("text").value;

    const before =
        text.slice(0, charIndex);

    const matches =
        before.match(/\S+/g);

    let index =
        matches ? matches.length : 0;

    if(index >= words.length){

        index = words.length - 1;

    }

    if(index < 0) return;


    for(let i = 0; i < index; i++){

        const el =
            $(`word-${i}`);

        if(el){

            el.classList.add("done");
            el.classList.remove("current");

        }

    }


    const current =
        $(`word-${index}`);

    if(current){

        current.classList.remove("done");
        current.classList.add("current");

        current.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    }

}


// =====================================================
// PLAY
// =====================================================

$("play").onclick = () => {

    const fullText =
        $("text").value.trim();

    if(!fullText){

        $("status").textContent =
            "문장을 입력해주세요.";

        return;

    }


    // -------------------------------------------------
    // RESUME FROM SAVED POSITION
    // -------------------------------------------------

    if(pausedCharIndex > 0){

        const resumeText =
            fullText.slice(pausedCharIndex);

        const startIndex =
            pausedCharIndex;

        const rate =
            Number($("speed").value);


        currentUtterance =
            speakText(
                resumeText,
                rate,
                {

                    onStart: () => {

                        $("status").textContent =
                            "🔊 읽는 중…";

                    },


                    onBoundary: event => {

                        if(
                            !event.name ||
                            event.name === "word"
                        ){

                            if(
                                typeof event.charIndex ===
                                "number"
                            ){

                                const actualCharIndex =
                                    startIndex +
                                    event.charIndex;

                                lastCharIndex =
                                    actualCharIndex;

                                highlightWordAt(
                                    actualCharIndex
                                );

                            }

                        }

                    },


                    onEnd: () => {

                        words.forEach(
                            (_, index) => {

                                const el =
                                    $(`word-${index}`);

                                if(el){

                                    el.classList.remove(
                                        "current"
                                    );

                                    el.classList.add(
                                        "done"
                                    );

                                }

                            }
                        );

                        pausedCharIndex = 0;
                        lastCharIndex = 0;

                        $("status").textContent =
                            "✓ 완료";

                    },


                    onError: event => {

                        $("status").textContent =
                            "⚠️ TTS 오류: " +
                            (event.error || "unknown");

                    }

                }
            );

        return;

    }


    // -------------------------------------------------
    // ALREADY PLAYING
    // -------------------------------------------------

    if(speechSynthesis.speaking){

        return;

    }


    resetHighlights();

    pausedCharIndex = 0;
    lastCharIndex = 0;


    const rate =
        Number($("speed").value);


    currentUtterance =
        speakText(
            fullText,
            rate,
            {

                onStart: () => {

                    $("status").textContent =
                        "🔊 읽는 중…";

                },


                onBoundary: event => {

                    if(
                        !event.name ||
                        event.name === "word"
                    ){

                        if(
                            typeof event.charIndex ===
                            "number"
                        ){

                            lastCharIndex =
                                event.charIndex;

                            highlightWordAt(
                                event.charIndex
                            );

                        }

                    }

                },


                onEnd: () => {

                    words.forEach(
                        (_, index) => {

                            const el =
                                $(`word-${index}`);

                            if(el){

                                el.classList.remove(
                                    "current"
                                );

                                el.classList.add(
                                    "done"
                                );

                            }

                        }
                    );

                    pausedCharIndex = 0;
                    lastCharIndex = 0;

                    $("status").textContent =
                        "✓ 완료";

                },


                onError: event => {

                    $("status").textContent =
                        "⚠️ TTS 오류: " +
                        (event.error || "unknown");

                }

            }
        );

};


// =====================================================
// PAUSE
// =====================================================

$("pause").onclick = () => {

    if(
        speechSynthesis.speaking &&
        !speechSynthesis.paused
    ){

        /*
            TTS boundary 이벤트에서 마지막으로
            확인된 실제 문자 위치를 저장한다.
        */

        pausedCharIndex =
            lastCharIndex;


        /*
            native resume()을 사용하지 않고
            현재 음성을 정지한다.
        */

        stopSpeech();

        currentUtterance = null;


        $("status").textContent =
            "Ⅱ 일시정지";

    }

};


// =====================================================
// STOP
// =====================================================

$("stop").onclick = () => {

    stopSpeech();

    currentUtterance = null;

    pausedCharIndex = 0;
    lastCharIndex = 0;

    resetHighlights();

    $("status").textContent =
        "정지";

};


// =====================================================
// SPEED
// =====================================================

$("speed").oninput = () => {

    $("sv").textContent =
        Number($("speed").value)
        .toFixed(2) +
        "×";

};


// =====================================================
// TEXT INPUT
// =====================================================

$("text").oninput = () => {

    stopSpeech();

    leaveSentenceDeckReader();

    pausedCharIndex = 0;
    lastCharIndex = 0;

    buildReader();

    $("charCount").textContent =
        `${$("text").value.length.toLocaleString()} characters`;

    $("status").textContent =
        "준비됨";

};


// =====================================================
// CLEAR
// =====================================================

$("clearText").onclick = () => {

    stopSpeech();

    leaveSentenceDeckReader();

    pausedCharIndex = 0;
    lastCharIndex = 0;

    $("text").value = "";

    buildReader();

    $("charCount").textContent =
        "0 characters";

    $("status").textContent =
        "문장이 삭제되었습니다.";

};


// =====================================================
// PASTE
// =====================================================

$("pasteText").onclick = async () => {

    try{

        if(
            !navigator.clipboard ||
            !navigator.clipboard.readText
        ){

            throw new Error(
                "Clipboard API unavailable"
            );

        }


        const text =
            await navigator.clipboard.readText();


        if(!text){

            $("status").textContent =
                "클립보드에 텍스트가 없습니다.";

            return;

        }


        stopSpeech();

        leaveSentenceDeckReader();

        pausedCharIndex = 0;
        lastCharIndex = 0;

        $("text").value =
            text
                .replace(/<[^>]*>/g, " ")
                .trim();

        buildReader();

        $("charCount").textContent =
            `${$("text").value.length.toLocaleString()} characters`;

        $("status").textContent =
            "📋 클립보드 내용을 붙여넣었습니다.";

    }

    catch(error){

        console.error(
            "Clipboard error:",
            error
        );

        $("status").textContent =
            "⚠️ 클립보드 접근이 차단되었습니다.";

    }

};
