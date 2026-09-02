/* =====================================================
WORD DATABASE
===================================================== */

const kictcWords = [

{
key:"platoon",
ipa:"/pləˈtuːn/",
part:"noun",
meaning:"소대",
example:"The platoon will move toward the objective.",
exampleKo:"소대는 목표를 향해 이동할 것입니다."
},

{
key:"attack",
ipa:"/əˈtæk/",
part:"noun / verb",
meaning:"공격; 공격하다",
example:"The attack will begin after the fire support is complete.",
exampleKo:"화력지원이 완료된 후 공격이 시작될 것입니다."
},

{
key:"position",
ipa:"/pəˈzɪʃən/",
part:"noun",
meaning:"위치; 진지",
example:"The platoon will move to the attack position.",
exampleKo:"소대는 공격대기지점으로 이동할 것입니다."
},

{
key:"objective",
ipa:"/əbˈdʒektɪv/",
part:"noun",
meaning:"목표",
example:"Our primary objective is Hill 245.",
exampleKo:"우리의 주요 목표는 245고지입니다."
},

{
key:"secure",
ipa:"/sɪˈkjʊr/",
part:"verb",
meaning:"확보하다",
example:"The platoon will secure the objective.",
exampleKo:"소대는 목표를 확보할 것입니다."
},

{
key:"seize",
ipa:"/siːz/",
part:"verb",
meaning:"점령하다; 탈취하다",
example:"Our mission is to seize the key terrain.",
exampleKo:"우리의 임무는 주요 지형을 점령하는 것입니다."
},

{
key:"terrain",
ipa:"/təˈreɪn/",
part:"noun",
meaning:"지형",
example:"The terrain is difficult to move through.",
exampleKo:"해당 지형은 통과하기 어렵습니다."
},

{
key:"suppress",
ipa:"/səˈpres/",
part:"verb",
meaning:"제압하다",
example:"The supporting element will suppress the enemy.",
exampleKo:"조공부대가 적을 제압할 것입니다."
},

{
key:"clear",
ipa:"/klɪr/",
part:"verb",
meaning:"소탕하다; 제거하다",
example:"We're going to clear the area before moving on.",
exampleKo:"우리는 다음 단계로 넘어가기 전에 해당 지역을 소탕할 것입니다."
},

{
key:"breach",
ipa:"/briːtʃ/",
part:"verb / noun",
meaning:"돌파하다; 돌파",
example:"The engineers will conduct the breach.",
exampleKo:"공병이 돌파를 실시할 것입니다."
},

{
key:"reserve",
ipa:"/rɪˈzɜːrv/",
part:"noun",
meaning:"예비대",
example:"The reserve will remain ready to reinforce the main effort.",
exampleKo:"예비대는 주공을 증원할 준비를 유지할 것입니다."
},

{
key:"recon",
ipa:"/ˈrekɑːn/",
part:"noun",
meaning:"정찰",
example:"We're going to conduct recon before moving forward.",
exampleKo:"우리는 전진하기 전에 정찰을 실시할 것입니다."
},

{
key:"front",
ipa:"/frʌnt/",
part:"noun",
meaning:"정면; 전방",
example:"We expect enemy contact to our front.",
exampleKo:"우리는 정면에서 적과 접촉할 것으로 예상합니다."
},

{
key:"depth",
ipa:"/depθ/",
part:"noun",
meaning:"종심",
example:"Enemy reserves are positioned in depth.",
exampleKo:"적 예비대는 종심에 배치되어 있습니다."
},

{
key:"maneuver",
ipa:"/məˈnuːvər/",
part:"verb / noun",
meaning:"기동하다; 기동",
example:"The main effort will maneuver to the enemy's flank.",
exampleKo:"주공은 적의 측방으로 기동할 것입니다."
},

{
key:"bypass",
ipa:"/ˈbaɪpæs/",
part:"verb",
meaning:"우회하다",
example:"We may bypass the enemy position if possible.",
exampleKo:"가능하다면 적 진지를 우회할 수 있습니다."
},

{
key:"fix",
ipa:"/fɪks/",
part:"verb",
meaning:"고착시키다",
example:"The supporting element will fix the enemy.",
exampleKo:"조공부대가 적을 고착시킬 것입니다."
},

{
key:"assault",
ipa:"/əˈsɔːlt/",
part:"noun / verb",
meaning:"돌격; 돌격하다",
example:"The assault will begin after the preparatory fires are complete.",
exampleKo:"준비사격이 완료된 후 돌격이 시작될 것입니다."
},

{
key:"flank",
ipa:"/flæŋk/",
part:"noun",
meaning:"측방; 측면",
example:"The main effort will attack the enemy's flank.",
exampleKo:"주공은 적의 측방을 공격할 것입니다."
},

{
key:"fire",
ipa:"/faɪr/",
part:"noun",
meaning:"화력; 사격",
example:"Fire support will be available during the assault.",
exampleKo:"돌격 중에 화력지원이 제공될 것입니다."
}

];


/* =====================================================
MY WORDS
===================================================== */

function getMyWords(){

    try{
        return JSON.parse(
            localStorage.getItem("kictcMyWords")
        ) || [];
    }catch{
        return [];
    }

}

function saveMyWords(words){

    localStorage.setItem(
        "kictcMyWords",
        JSON.stringify(words)
    );

}
