/* =====================================================
SENTENCE STORAGE
===================================================== */
const defaultSentenceDecks = [
    {id:"nato",name:"NATO 환영",description:"NATO 방문객 응대 문장",icon:"📕",sentences:[]},
    {id:"gimburi",name:"김부리 브리핑",description:"김부리 훈련장 설명 문장",icon:"📗",sentences:[]},
    {id:"competition",name:"경기장 참관",description:"경기 진행 설명 문장",icon:"📘",sentences:[]}
];

let sentenceDecks=[];
let selectedSentenceDeckId=null;

function getSentenceDeck(deckId){
    return sentenceDecks.find(deck=>deck.id===deckId);
}

function createSentenceId(){
    return `sentence-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalizeSentences(sentences){
    if(!Array.isArray(sentences))return [];
    return sentences.filter(item=>item&&typeof item.text==="string").map(item=>({
        id:item.id||createSentenceId(),
        text:item.text,
        created:item.created||new Date().toLocaleString()
    }));
}

function normalizeSentenceDeck(deck,fallback){
    return {
        id:deck.id||fallback.id,
        name:deck.name||fallback.name,
        description:deck.description||fallback.description||"나만의 학습 문장집",
        icon:deck.icon||fallback.icon||"📙",
        sentences:normalizeSentences(deck.sentences)
    };
}

function saveSentenceDecks(){
    localStorage.setItem("kictcSentenceDecks",JSON.stringify(sentenceDecks));
}

function loadSentenceDecks(){
    let saved=[];

    try{
        saved=JSON.parse(localStorage.getItem("kictcSentenceDecks"))||[];
    }catch{
        saved=[];
    }

    sentenceDecks=defaultSentenceDecks.map(defaultDeck=>{
        const savedDeck=Array.isArray(saved)&&saved.find(deck=>deck.id===defaultDeck.id);
        return normalizeSentenceDeck(savedDeck||defaultDeck,defaultDeck);
    });

    if(Array.isArray(saved)){
        saved.filter(deck=>deck&&deck.id&&!defaultSentenceDecks.some(defaultDeck=>defaultDeck.id===deck.id))
            .forEach(deck=>sentenceDecks.push(normalizeSentenceDeck(deck,{
                id:deck.id,name:"새 문장집",description:"나만의 학습 문장집",icon:"📙"
            })));
    }

    /* 기존 단일 저장소 문장은 첫 문장집으로 한 번만 이전한다. */
    if(!localStorage.getItem("kictcSentenceDecks")){
        try{
            sentenceDecks[0].sentences=normalizeSentences(
                JSON.parse(localStorage.getItem("kictcSentences"))||[]
            );
        }catch{
            sentenceDecks[0].sentences=[];
        }
        saveSentenceDecks();
    }
}

function sentenceCountText(deck){
    return `${deck.sentences.length} sentences`;
}

function renderCurrentSentenceDeckSelect(){
    const select=$("currentSentenceDeckSelect");

    select.innerHTML="<option value=\"\">문장집을 선택하세요</option>";

    sentenceDecks.forEach(deck=>{
        const option=document.createElement("option");
        option.value=deck.id;
        option.textContent=`${deck.icon} ${deck.name}`;
        select.appendChild(option);
    });

    select.value=selectedSentenceDeckId||"";
}

function renderCustomSentenceDecks(){
    const container=$("customSentenceDecks");
    container.innerHTML="";

    sentenceDecks.slice(defaultSentenceDecks.length).forEach(deck=>{
        const card=document.createElement("button");
        card.className="deck-card";
        card.innerHTML=`
        <div class="deck-icon">${escapeHTML(deck.icon)}</div>
        <div class="deck-name">${escapeHTML(deck.name)}</div>
        <div class="deck-description">${escapeHTML(deck.description)}</div>
        <div class="deck-count">${sentenceCountText(deck)}</div>`;
        card.onclick=()=>openSentenceDeck(deck.id);
        container.appendChild(card);
    });
}

function renderSentenceDeckStudy(){
    const deck=getSentenceDeck(selectedSentenceDeckId);
    if(!deck)return;

    $("selectedSentenceDeckName").textContent=`${deck.icon} ${deck.name}`;
    $("selectedSentenceDeckDescription").textContent=deck.description;
    $("selectedSentenceDeckCount").textContent=sentenceCountText(deck);

    const list=$("sentenceList");
    if(!deck.sentences.length){
        list.innerHTML=`<div class="empty">📚 아직 저장된 문장이 없습니다.</div>`;
        return;
    }

    list.innerHTML="";
    deck.sentences.forEach((item,index)=>{
        const card=document.createElement("div");
        card.className="sentence-card";
        card.innerHTML=`
        <div class="sentence-number">문장 ${index+1}</div>
        <div class="sentence-text">${escapeHTML(item.text)}</div>
        <div class="sentence-date">${escapeHTML(item.created)}</div>
        <div class="sentence-buttons">
            <button class="dark">🔊 듣기</button>
            <button class="green">Reader</button>
            <button class="dark">🗑️ 삭제</button>
        </div>`;

        const buttons=card.querySelectorAll("button");
        buttons[0].onclick=()=>speakText(item.text,Number($("speed").value));
        buttons[1].onclick=()=>startSentenceDeckReader(deck.id,index);
        buttons[2].onclick=()=>{
            if(!confirm("이 문장을 삭제할까요?"))return;
            deck.sentences.splice(index,1);
            saveSentenceDecks();
            renderStorage();
            renderSentenceDeckStudy();
        };
        list.appendChild(card);
    });
}

function renderStorage(){
    defaultSentenceDecks.forEach(deck=>{
        const currentDeck=getSentenceDeck(deck.id);
        const count=$(`${deck.id}SentenceCount`);
        if(currentDeck&&count)count.textContent=sentenceCountText(currentDeck);
    });
    renderCurrentSentenceDeckSelect();
    renderCustomSentenceDecks();
    renderSentenceDeckStudy();
}

function openSentenceDeck(deckId){
    const deck=getSentenceDeck(deckId);
    if(!deck)return;
    selectedSentenceDeckId=deckId;
    renderCurrentSentenceDeckSelect();
    $("sentenceDeckSelection").style.display="none";
    $("sentenceDeckStudy").style.display="block";
    renderSentenceDeckStudy();
}

function addSentenceToSelectedDeck(text){
    const deck=getSentenceDeck(selectedSentenceDeckId);
    if(!deck)return false;
    deck.sentences.unshift({
        id:createSentenceId(),
        text:text,
        created:new Date().toLocaleString()
    });
    saveSentenceDecks();
    renderStorage();
    renderSentenceDeckStudy();
    return true;
}

$("natoSentenceDeck").onclick=()=>openSentenceDeck("nato");
$("gimburiSentenceDeck").onclick=()=>openSentenceDeck("gimburi");
$("competitionSentenceDeck").onclick=()=>openSentenceDeck("competition");

$("currentSentenceDeckSelect").onchange=()=>{
    const deckId=$("currentSentenceDeckSelect").value;
    const deck=getSentenceDeck(deckId);

    selectedSentenceDeckId=deck ? deckId : null;

    if(!deck || !deck.sentences.length){
        leaveSentenceDeckReader();

        if(deck){
            $("status").textContent="문장을 저장한 뒤 학습을 시작할 수 있습니다.";
        }

        return;
    }

    startSentenceDeckReader(deckId,0);
};

$("sentenceDeckBack").onclick=()=>{
    $("sentenceDeckStudy").style.display="none";
    $("sentenceDeckSelection").style.display="block";
    renderStorage();
};

$("newSentence").onclick=()=>{
    $("addText").value="";
    $("addMessage").textContent="";
    $("addModal").classList.add("show");
};

function closeSentenceAddModal(){
    $("addModal").classList.remove("show");
}

$("closeAddModal").onclick=closeSentenceAddModal;
$("cancelAdd").onclick=closeSentenceAddModal;
$("confirmAdd").onclick=()=>{
    const text=$("addText").value.trim();
    if(!text){
        $("addMessage").textContent="문장을 입력해주세요.";
        return;
    }
    addSentenceToSelectedDeck(text);
    closeSentenceAddModal();
};

$("openAddSentenceDeck").onclick=()=>{
    $("newSentenceDeckName").value="";
    $("sentenceDeckAddMessage").textContent="";
    $("sentenceDeckAddModal").classList.add("show");
};

function closeSentenceDeckAddModal(){
    $("sentenceDeckAddModal").classList.remove("show");
}

$("closeSentenceDeckAdd").onclick=closeSentenceDeckAddModal;
$("cancelSentenceDeckAdd").onclick=closeSentenceDeckAddModal;
$("confirmSentenceDeckAdd").onclick=()=>{
    const name=$("newSentenceDeckName").value.trim();
    if(!name){
        $("sentenceDeckAddMessage").textContent="문장집 이름을 입력해주세요.";
        return;
    }
    if(sentenceDecks.some(deck=>deck.name===name)){
        $("sentenceDeckAddMessage").textContent="같은 이름의 문장집이 이미 있습니다.";
        return;
    }

    const deck={
        id:`deck-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        name:name,
        description:"나만의 학습 문장집",
        icon:"📙",
        sentences:[]
    };
    sentenceDecks.push(deck);
    saveSentenceDecks();
    renderStorage();
    closeSentenceDeckAddModal();
    openSentenceDeck(deck.id);
};

$("saveSentence").onclick=()=>{
    const text=$("text").value.trim();
    if(!text)return;
    if(!addSentenceToSelectedDeck(text)){
        $("status").textContent="문장집을 먼저 선택해주세요.";
        return;
    }
    $("status").textContent="✓ 선택한 문장집에 저장되었습니다.";
};
