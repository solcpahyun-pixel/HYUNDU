/* =====================================================
SENTENCE STORAGE
===================================================== */
const natoEscortSentences = [
    "Good morning, everyone. Did you sleep well?",
    "Are you all ready for today's schedule?",
    "Please wear your battle uniforms and wait in the lobby by 8:40.",
    "We'll head out now.",
    "If everyone is ready, we'll head out.",
    "We're heading to the Inje Indoor Gymnasium now.",
    "It should take about 30 minutes.",
    "We have a reception and opening ceremony scheduled for this morning.",
    "After the opening ceremony, there will be a Taekwondo demonstration and an equipment exhibition.",
    "After lunch, the delegation will split into two groups.",
    "We've arrived at the reception venue.",
    "Please come this way.",
    "Please wait here for a moment.",
    "The event will begin shortly.",
    "We'll now watch an introductory video about the K-ICTC.",
    "The opening ceremony is about to begin.",
    "Please remain seated during the ceremony.",
    "They are now introducing the participating countries and teams.",
    "The opening remarks and congratulatory speeches will follow.",
    "We'll now move to the equipment exhibition.",
    "What is this equipment used for?",
    "What is the primary purpose of this equipment?",
    "Is this equipment also used in actual operations?",
    "I'll check the exact specifications for you.",
    "We'll have lunch now.",
    "General, your table is Table One.",
    "The rest of you will be at Table Five.",
    "I hope you enjoy your meal.",
    "We'll meet again at 1 p.m. after lunch.",
    "From here, the delegation will split into two groups.",
    "Ms. Pasini and Lieutenant Colonel Robert will go to the training center.",
    "The rest of the group will go to the Gimburi Training Area.",
    "I'll be accompanying the Gimburi team.",
    "The vehicles are this way.",
    "We've arrived at the Gimburi Training Area.",
    "Our first stop is the operations room.",
    "First, we'll check the current situation displayed on the monitors.",
    "This is where we can see the current battlefield situation.",
    "This screen shows the current positions and situation of the units.",
    "We'll now move to the B Competition Area.",
    "First, we'll receive an introduction to the B Competition Area.",
    "Then, we'll learn about the unit's operational planning process.",
    "This is one of the main areas of interest for the NATO delegation.",
    "You will be able to see how the unit analyzes the situation and plans its operations.",
    "We'll now move to the observation point.",
    "You can observe the A Competition Area from here.",
    "We'll now observe the competition.",
    "The main purpose of today's observation is to see how the unit conducts combat operations.",
    "In particular, you can observe what equipment and weapons they use.",
    "You can also observe the tactics they employ.",
    "Another important point is how the unit operates as a team.",
    "You can also observe how the commander controls the unit.",
    "The unit is currently moving toward the objective.",
    "They are currently establishing a defensive position.",
    "They are using the terrain to their advantage.",
    "They are using cover and concealment.",
    "The platoon leader is controlling the squads.",
    "The squads are moving while providing mutual support.",
    "They are currently engaging the enemy.",
    "You can see how the unit responds to this situation.",
    "That's a good question.",
    "Let me confirm that for you.",
    "As far as I know, that's correct.",
    "I'll need to confirm the exact figure.",
    "I'll check with the person in charge.",
    "Please give me a moment.",
    "The observation is now complete.",
    "We'll return to the unit now.",
    "We'll all regroup now.",
    "We'll move to Support Facility C for dinner.",
    "After dinner, we'll head to the Speadium.",
    "We've arrived at the hotel.",
    "Thank you for your cooperation today."
];

const defaultSentenceDecks = [
    {id:"nato",name:"NATO 환영",description:"NATO 방문객 응대 문장",icon:"📕",sentences:[]},
    {id:"gimburi",name:"김부리 브리핑",description:"김부리 훈련장 설명 문장",icon:"📗",sentences:[]},
    {id:"competition",name:"경기장 참관",description:"경기 진행 설명 문장",icon:"📘",sentences:[]},
    {
        id:"nato-escort",
        name:"NATO 대표단 에스코트 · 내일 일정",
        description:"호텔부터 복귀까지 현우 에스코트 문장",
        icon:"🚌",
        sentences:natoEscortSentences.map((text,index)=>({
            id:`nato-escort-${index+1}`,
            text:text,
            created:"2026-09-14"
        }))
    }
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

    sentenceDecks.filter(deck=>
        !["nato","gimburi","competition"].includes(deck.id)
    ).forEach(deck=>{
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

function addBulkSentencesToSelectedDeck(texts){
    const deck=getSentenceDeck(selectedSentenceDeckId);

    if(!deck)return 0;

    const created=new Date().toLocaleString();

    texts.forEach(text=>{
        deck.sentences.push({
            id:createSentenceId(),
            text:text,
            created:created
        });
    });

    saveSentenceDecks();
    renderStorage();
    renderSentenceDeckStudy();

    return texts.length;
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

$("openBulkSentenceAdd").onclick=()=>{
    $("bulkSentenceText").value="";
    $("bulkSentenceAddMessage").textContent="";
    $("bulkSentenceAddModal").classList.add("show");
};

function closeBulkSentenceAddModal(){
    $("bulkSentenceAddModal").classList.remove("show");
}

$("closeBulkSentenceAdd").onclick=closeBulkSentenceAddModal;
$("cancelBulkSentenceAdd").onclick=closeBulkSentenceAddModal;
$("confirmBulkSentenceAdd").onclick=()=>{
    const texts=$("bulkSentenceText").value
        .split(/\r?\n/)
        .map(text=>text.trim())
        .filter(Boolean);

    if(!texts.length){
        $("bulkSentenceAddMessage").textContent="저장할 문장을 입력해주세요.";
        return;
    }

    const count=addBulkSentencesToSelectedDeck(texts);

    if(!count){
        $("bulkSentenceAddMessage").textContent="문장집을 먼저 선택해주세요.";
        return;
    }

    closeBulkSentenceAddModal();
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
