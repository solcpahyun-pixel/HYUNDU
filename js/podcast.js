/* =====================================================
PODCAST ENGINE — V8.3
===================================================== */

let podcastSentences=[];
let podcastIndex=0;
let podcastPlaying=false;
let podcastUtterance=null;
let podcastTimer=null;


/*
    긴 글을 문장 단위로 나눈다.
*/

function splitPodcastText(text){

    /*
        마침표, 물음표, 느낌표,
        줄바꿈 등을 기준으로 분리한다.
    */

    return text
        .replace(/\r\n/g,"\n")
        .split(/\n+/)
        .flatMap(
            paragraph =>
                paragraph.match(
                    /[^.!?]+[.!?]+|[^.!?]+$/g
                )||[]
        )
        .map(
            x=>x.trim()
        )
        .filter(
            x=>x.length>0
        );

}


/*
    글자 수
*/

$("podcastText").oninput=()=>{

    $("podcastCharCount").textContent=
        `${$("podcastText").value.length.toLocaleString()} characters`;

};


/*
    Podcast 붙여넣기
*/

$("podcastPaste").onclick=async()=>{

    try{

        const text=
            await navigator.clipboard.readText();

        $("podcastText").value=text;

        $("podcastCharCount").textContent=
            `${text.length.toLocaleString()} characters`;

    }catch{

        $("podcastStatus").textContent=
            "⚠️ 클립보드 접근이 차단되었습니다.";

    }

};


/*
    Podcast 전체 삭제
*/

$("podcastClear").onclick=()=>{

    speechSynthesis.cancel();

    podcastPlaying=false;

    podcastSentences=[];

    podcastIndex=0;

    $("podcastText").value="";

    $("podcastCharCount").textContent=
        "0 characters";

    $("podcastCurrentSentence").textContent=
        "팟캐스트를 시작하면 현재 읽고 있는 문장이 표시됩니다.";

    $("podcastStatus").textContent=
        "준비됨";

};


/*
    Podcast 속도
*/

$("podcastSpeed").oninput=()=>{

    $("podcastSpeedValue").textContent=
        Number($("podcastSpeed").value)
        .toFixed(2)+"×";

};


/*
    현재 문장 표시
*/

function showPodcastSentence(){

    if(!podcastSentences.length)
        return;

    const sentence=
        podcastSentences[podcastIndex];

    $("podcastCurrentSentence").innerHTML=`

        <div class="podcast-current">

            ${escapeHTML(sentence)}

        </div>

    `;

    $("podcastStatus").textContent=
        `🔊 ${podcastIndex+1} / ${podcastSentences.length} 문장`;

}


/*
    다음 문장 재생
*/

function playPodcastSentence(){

    if(!podcastPlaying)
        return;

    if(
        podcastIndex>=
        podcastSentences.length
    ){

        podcastPlaying=false;

        $("podcastStatus").textContent=
            "✓ Podcast 완료";

        $("podcastCurrentSentence").innerHTML=`

            <div class="podcast-finished">

                ✓ 모든 문장을 재생했습니다.

            </div>

        `;

        return;

    }

    showPodcastSentence();

    const sentence=
        podcastSentences[podcastIndex];

    podcastUtterance=
        new SpeechSynthesisUtterance(sentence);

    podcastUtterance.lang="en-US";

    podcastUtterance.rate=
        Number($("podcastSpeed").value);

    const voice=getEnglishVoice();

    if(voice)
        podcastUtterance.voice=voice;


    podcastUtterance.onend=()=>{

        if(!podcastPlaying)
            return;

        podcastIndex++;

        podcastTimer=setTimeout(
            ()=>{
                if(podcastPlaying)
                    playPodcastSentence();
            },
            180
        );

    };


    podcastUtterance.onerror=e=>{

        if(!podcastPlaying)
            return;

        /*
            iOS에서 cancel 직후 발생하는
            오류는 무시한다.
        */

        if(e.error==="canceled")
            return;

        $("podcastStatus").textContent=
            "⚠️ TTS 오류";

    };


    speechSynthesis.speak(
        podcastUtterance
    );

}


/*
    Podcast 시작
*/

$("podcastPlay").onclick=()=>{

    const text=
        $("podcastText")
        .value
        .trim();


    if(!text){

        $("podcastStatus").textContent=
            "먼저 글을 입력해주세요.";

        return;

    }


    /*
        일시정지 상태라면
        처음부터 시작하지 않고
        이어서 재생한다.
    */

    if(
        speechSynthesis.paused &&
        podcastPlaying
    ){

        speechSynthesis.resume();

        $("podcastStatus").textContent=
            `🔊 ${podcastIndex+1} / ${podcastSentences.length} 문장`;

        return;

    }


    speechSynthesis.cancel();

    clearTimeout(podcastTimer);


    podcastSentences=
        splitPodcastText(text);


    if(!podcastSentences.length){

        $("podcastStatus").textContent=
            "읽을 문장이 없습니다.";

        return;

    }


    podcastIndex=0;

    podcastPlaying=true;

    playPodcastSentence();

};


/*
    Podcast 일시정지 / 재개
*/

$("podcastPause").onclick=()=>{

    if(
        speechSynthesis.speaking &&
        !speechSynthesis.paused
    ){

        speechSynthesis.pause();

        $("podcastStatus").textContent=
            `Ⅱ 일시정지 · ${podcastIndex+1} / ${podcastSentences.length}`;

    }

    else if(
        speechSynthesis.paused
    ){

        speechSynthesis.resume();

        $("podcastStatus").textContent=
            `🔊 ${podcastIndex+1} / ${podcastSentences.length} 문장`;

    }

};


/*
    Podcast 정지
*/

$("podcastStop").onclick=()=>{

    podcastPlaying=false;

    speechSynthesis.cancel();

    clearTimeout(podcastTimer);

    podcastUtterance=null;

    podcastIndex=0;

    $("podcastStatus").textContent=
        "정지";

    $("podcastCurrentSentence").textContent=
        "Podcast가 정지되었습니다.";

};