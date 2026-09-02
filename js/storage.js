/* =====================================================
SENTENCE STORAGE
===================================================== */

function getSavedSentences(){

    try{

        return JSON.parse(
            localStorage.getItem("kictcSentences")
        )||[];

    }catch{

        return [];

    }

}

function saveSentences(data){

    localStorage.setItem(
        "kictcSentences",
        JSON.stringify(data)
    );

}

function renderStorage(){

    const list=$("sentenceList");

    const saved=getSavedSentences();

    if(!saved.length){

        list.innerHTML=`
        <div class="empty">
            📚 아직 저장된 문장이 없습니다.
        </div>`;

        return;

    }

    list.innerHTML="";

    saved.forEach(
        (item,index)=>{

            const card=
                document.createElement("div");

            card.className="sentence-card";

            card.innerHTML=`
            <div class="sentence-text">
                ${escapeHTML(item.text)}
            </div>

            <div class="sentence-date">
                ${escapeHTML(item.created||"")}
            </div>

            <div class="sentence-buttons">

                <button class="green">
                    ▶︎ 불러오기
                </button>

                <button class="dark">
                    🗑️ 삭제
                </button>

            </div>`;

            card.children[2]
                .children[0]
                .onclick=()=>{

                    $("text").value=item.text;

                    buildReader();

                    $("charCount").textContent=
                        `${item.text.length.toLocaleString()} characters`;

                    showPage("current");

                };

            card.children[2]
                .children[1]
                .onclick=()=>{

                    const data=
                        getSavedSentences();

                    data.splice(index,1);

                    saveSentences(data);

                    renderStorage();

                };

            list.appendChild(card);

        }
    );

}

$("saveSentence").onclick=()=>{

    const text=$("text").value.trim();

    if(!text)return;

    const saved=getSavedSentences();

    saved.unshift({
        id:Date.now(),
        text:text,
        created:new Date().toLocaleString()
    });

    saveSentences(saved);

    $("status").textContent=
        "✓ 저장되었습니다.";

};
