/* =====================================================
FLASH CARDS
===================================================== */

let selectedDeck=null;
let flashCards=[];
let flashIndex=0;
let flashPage=1;

function showDeckSelection(){

    $("deckSelection").style.display="block";
    $("flashStudy").style.display="none";

    $("myDeckCount").textContent=
        `${getMyWords().length} words`;

}

$("kictcDeck").onclick=()=>{

    selectedDeck="kictc";

    startFlashStudy();

};

$("myDeck").onclick=()=>{

    selectedDeck="my";

    startFlashStudy();

};

function startFlashStudy(){

    if(selectedDeck==="kictc"){

        flashCards=kictcWords;

        $("selectedDeckName").textContent=
            "📕 K-ICTC 핵심 단어";

        $("selectedDeckSub").textContent=
            "K-ICTC 군사영어 핵심 단어";

    }else{

        flashCards=getMyWords();

        $("selectedDeckName").textContent=
            "📗 나의 단어장";

        $("selectedDeckSub").textContent=
            `${flashCards.length}개의 단어`;

    }

    if(!flashCards.length){

        alert("이 단어집에는 아직 단어가 없습니다.");

        return;

    }

    flashIndex=0;
    flashPage=1;

    $("deckSelection").style.display="none";
    $("flashStudy").style.display="block";

    renderFlashCard();

    autoPlayFlash();

}

function renderFlashCard(){

    const card=flashCards[flashIndex];

    $("flashProgress").textContent=
        `${flashIndex+1} / ${flashCards.length} · ${flashPage}P`;

    if(flashPage===1){

        $("flashPageLabel").textContent=
            "PAGE 1 · WORD";

        $("flashContent").innerHTML=`

        <div class="flash-word">
            ${escapeHTML(card.key)}
        </div>

        <div class="flash-ipa">
            ${escapeHTML(card.ipa||"")}
        </div>`;

    }

    else if(flashPage===2){

        $("flashPageLabel").textContent=
            "PAGE 2 · MEANING";

        $("flashContent").innerHTML=`

        <div class="flash-word" style="font-size:26px">
            ${escapeHTML(card.key)}
        </div>

        <div class="flash-meaning">
            ${escapeHTML(card.meaning)}
        </div>`;

    }

    else{

        $("flashPageLabel").textContent=
            "PAGE 3 · EXAMPLE";

        $("flashContent").innerHTML=`

        <div class="flash-example">
            ${escapeHTML(card.example)}
        </div>

        <div class="flash-example-ko">
            ${escapeHTML(card.exampleKo||"")}
        </div>`;

    }

}

function playFlashAudio(){

    const card=flashCards[flashIndex];

    if(!card)return;

    if(flashPage===1)
        speakText(card.key,Number($("flashSpeed").value));

    if(flashPage===3)
        speakText(card.example,Number($("flashSpeed").value));

}

function autoPlayFlash(){

    if(
        flashPage===1 ||
        flashPage===3
    ){

        playFlashAudio();

    }

}

function nextFlash(){

    stopSpeech();

    flashIndex++;

    if(flashIndex>=flashCards.length)
        flashIndex=0;

    flashPage=1;

    renderFlashCard();

    autoPlayFlash();

}

function prevFlash(){

    stopSpeech();

    flashIndex--;

    if(flashIndex<0)
        flashIndex=flashCards.length-1;

    flashPage=1;

    renderFlashCard();

    autoPlayFlash();

}

$("flashNext").onclick=nextFlash;
$("flashPrev").onclick=prevFlash;

$("flashAudio").onclick=playFlashAudio;

$("flashBackToDeck").onclick=()=>{

    stopSpeech();

    showDeckSelection();

};

$("restartFlash").onclick=()=>{

    stopSpeech();

    flashIndex=0;
    flashPage=1;

    renderFlashCard();

    autoPlayFlash();

};

$("flashSpeed").oninput=()=>{

    $("flashSpeedValue").textContent=
        Number($("flashSpeed").value)
        .toFixed(2)+"×";

};

let touchStartX=0;

$("flashCard").addEventListener(
    "touchstart",
    e=>{
        touchStartX=
            e.changedTouches[0].clientX;
    },
    {passive:true}
);

$("flashCard").addEventListener(
    "touchend",
    e=>{

        const delta=
            e.changedTouches[0].clientX-
            touchStartX;

        if(delta<-60){

            prevFlash();

            return;

        }

        if(delta>60){

            nextFlash();

            return;

        }

        if(flashPage===1){

            flashPage=2;

            renderFlashCard();

        }

        else if(flashPage===2){

            flashPage=3;

            renderFlashCard();

            autoPlayFlash();

        }

        else{

            nextFlash();

        }

    },
    {passive:true}
);
