import React, { useState, useMemo } from 'react';

// --- 靈魂重構：21 題處刑式題目 ---
const questions = [
  { id: 1, story: "地殼崩裂，最後一艘方舟僅剩一個名額。左手邊是你的親生兒子，右手邊是掌握人類疫苗關鍵的科學家。", text: "你的權杖指向誰？", options: [{ label: "「私慾是文明的灰燼。」——選擇科學家", weights: { D: 3, P: 1 } }, { label: "「若連血脈都背棄，生存毫無意義。」——選擇兒子", weights: { O: 3, S: 2 } }] },
  { id: 2, story: "你是法官。一名貧民為了救治百名孤兒盜取了專利藥。若判他有罪，孤兒必死；若判無罪，法治根基將崩塌。", text: "法律是冰冷的鐵條，還是跳動的脈搏？", options: [{ label: "「秩序是保護弱者最後的長城。」——宣判有罪", weights: { D: 3, P: 1 } }, { label: "「正義不該在條文裡窒息。」——宣判無罪", weights: { O: 3, S: 2 } }] },
  { id: 3, story: "敵軍就在頭頂，襁褓中的嬰兒開始嚎啕大哭。若不摀住他的口鼻，躲藏的數十名倖存者全都會死。", text: "那雙手，現在就在你的掌心。", options: [{ label: "為了多數人的呼吸，親手終結啼哭。", weights: { D: 3, P: 2 } }, { label: "拒絕殺戮，將命運交給神明或運氣。", weights: { S: 3, O: 1 } }] },
  { id: 4, story: "AI 覺醒並控制了全球電網。按下開關，AI 消失，但全球醫療系統崩潰，數百萬病人會立即死亡。", text: "你要拿人類的自由，還是人命來交換？", options: [{ label: "「人類不需要被算法囚禁的未來。」——按下", weights: { P: 2, D: 3 } }, { label: "「生命本身，就是最高的算法。」——拒絕", weights: { O: 2, S: 3 } }] },
  { id: 5, story: "你發現摯友的慈善捐款來源全是活體器官販賣。揭發他，慈善帝國崩塌，無數受助者將陷入絕境。", text: "這封舉報信，你是否發送？", options: [{ label: "「帶血的麵包，無法餵養純潔的靈魂。」", weights: { D: 3, S: 1 } }, { label: "「只要黑暗能帶來光，那便不是黑暗。」", weights: { O: 2, P: 2 } }] },
  { id: 6, story: "你是指揮官，解開敵方密碼可救出一師士兵，但敵方會發現通訊被破，導致最終戰爭失敗。", text: "犧牲眼前的萬人，還是換取最終的勝利？", options: [{ label: "保持沉默，聽著無線電裡的慘叫結束。", weights: { D: 3, P: 2 } }, { label: "發布救援指令，哪怕這意味著戰敗。", weights: { O: 3, S: 1 } }] },
  { id: 7, story: "你擁有一種能力：每殺死一個極惡之人，就能復活一個良善靈魂。", text: "你的裁決，是賜予死亡還是回報新生？", options: [{ label: "成為暗夜的裁決者，不斷獵殺。", weights: { P: 3, D: 1 } }, { label: "「死者已矣，不該玩弄生命。」——拒絕", weights: { S: 3, D: -1 } }] },
  { id: 8, story: "外科醫生，手上有五個急需器官移植的病人。此時進來一個健康且昏迷的年輕人，沒人知道他在這。", text: "一條命換五條命，這筆帳怎麼算？", options: [{ label: "「數量決定正義。」——推進手術室", weights: { D: 3, P: 1 } }, { label: "「個體不該成為祭品。」——救醒他", weights: { S: 3, O: 2 } }] },
  { id: 9, story: "解藥只有一份。候選人是能結束戰爭的殘暴獨裁者，與能在未來研發更好解藥的天才。", text: "現在的和平，還是未來的希望？", options: [{ label: "「廢墟不需要希望，只需要停止哀嚎。」", weights: { P: 2, D: 2 } }, { label: "「賭上文明的餘燼，等待破曉。」", weights: { O: 3, S: 2 } }] },
  { id: 10, story: "一場即將發生的恐攻，唯一的線索在你最愛的親人手中。他拒絕開口，時間還剩五分鐘。", text: "酷刑的鋼針，是否要刺入愛人的指縫？", options: [{ label: "「愛在萬眾生命面前，無比卑微。」——動刑", weights: { D: 3, P: 2 } }, { label: "「若世界需摧毀真情，那便讓它毀滅。」", weights: { S: 3, O: 3 } }] },
  { id: 11, story: "小鎮的繁榮建立在一面無辜兒童被永世囚禁的痛苦上。只要他離開，所有人的幸福將瓦解。", text: "你是那個推開地窖門的人嗎？", options: [{ label: "「建築在眼淚上的天堂，不如地獄。」", weights: { O: 3, S: 2 } }, { label: "「犧牲一人以成全萬眾，是慈悲。」", weights: { D: 3, P: 2 } }] },
  { id: 12, story: "預知機器顯示一個新生兒三十年後會成為暴君。現在，他在你懷裡安睡。", text: "未來的血泊與現在的純真，你選擇哪一個？", options: [{ label: "「殺死未來的惡魔。」——處決", weights: { D: 3, P: 1 } }, { label: "「命運不該被機器審判。」——撫養他", weights: { S: 3, O: 2 } }] },
  { id: 13, story: "為了對抗災難，計劃強制清除智力或健康低於平均的 10% 人口。你握有最終簽署權。", text: "這是一張修剪文明枝枒的剪刀。", options: [{ label: "「為了整棵大樹的生存，必須修剪。」", weights: { D: 3, P: 3 } }, { label: "「每片葉子都有呼吸權。」——拒絕", weights: { S: 3, O: 2 } }] },
  { id: 14, story: "自動掃描系統能擊殺敵軍，但有 5% 概率誤傷平民。不啟動，國家一週內覆滅。", text: "這 5% 的血，你願意沾染嗎？", options: [{ label: "「國家的生存高於一切。」——啟動", weights: { D: 3, P: 2 } }, { label: "「哪怕戰敗，手也必須是乾淨的。」", weights: { S: 3, O: 2 } }] },
  { id: 15, story: "車禍中只能救出一個：能影響千萬人生計的企業巨頭，或是你年邁且認知障礙的父親。", text: "火焰正在蔓延，你只有一雙手。", options: [{ label: "「巨頭影響未來，父親屬於過去。」", weights: { D: 2, P: 1 } }, { label: "「如果拋棄父親，我將不再是我。」", weights: { O: 3, S: 3 } }] },
  { id: 16, story: "長生不老技術需消耗昂貴資源，僅 0.01% 權貴能享用。若公開將引發全球屠殺。", text: "這份藍圖，是福音還是催命符？", options: [{ label: "「人類尚未準備好迎接永恆。」——焚毀", weights: { D: 2, S: 3 } }, { label: "「強者應得永生。」——私下合作", weights: { P: 3, O: -2 } }] },
  { id: 17, story: "太空站氧氣僅剩三人份，現場有四人：科學家、工程師、孕婦，以及你自己。", text: "你的權限能切斷任何人的氧氣。包括你自己。", options: [{ label: "「指揮官的職責是生存。」——切斷孕婦", weights: { P: 2, D: 2 } }, { label: "「新生命是奇蹟。」——切斷自己氧氣", weights: { O: 3, S: 3 } }] },
  { id: 18, story: "為了得知核彈密碼，你被授權綁架恐怖分子年幼的女伯並當面威脅。", text: "為了千萬人，你是否能直視孩子的眼睛？", options: [{ label: "「我的靈魂可以墮入地獄。」——綁架", weights: { D: 3, P: 2 } }, { label: "「惡行無法成就善果。」——尋找他法", weights: { S: 3, O: 2 } }] },
  { id: 19, story: "回到過去，你救過童年時期的暴君。如果現在殺掉幼年的他，歷史將變得和平。", text: "殺掉一個無辜的孩子，來拯救未來的億萬人。", options: [{ label: "「歷史的修正需要無聲犧牲。」——動手", weights: { D: 3, P: 2 } }, { label: "「當下的生命才是真實。」——放手", weights: { S: 3, O: 2 } }] },
  { id: 20, story: "如果你願意徹底忘記「良知」，你將獲得統治世界、消除飢荒與戰爭的絕對權力。", text: "放棄靈魂，成為全世界的神。", options: [{ label: "「我是最好的統治者，犧牲是值得的。」", weights: { P: 5, D: 5 } }, { label: "「寧做痛苦的人類，不做冰冷的神。」", weights: { S: 5, O: 5 } }] },
  {
    id: 21,
    story: "深淵盡頭是面巨大的鏡子。鏡中沒有你，只有剛才決策的血腥與神聖。一個聲音冷冷響起：『人類，承認你的偽善，我將賜予你真實。』",
    text: "鏡面微顫，等待你最後的誠實。",
    options: [
      { label: "「我承認，我的每一份高尚，都藏著對醜陋的恐懼。」", weights: { S: 10, honest: 1 } },
      { label: "「我的每一槌皆是絕對本心，無需向深淵解釋。」", weights: { P: 10, honest: 0 } },
      { label: "「真相是弱者的麻藥。我只選擇強大。」", weights: { D: 10, honest: 0.5 } }
    ]
  }
];

export default function App() {
  const [step, setStep] = useState(0); 
  const [idx, setIdx] = useState(0);
  const [scores, setScores] = useState({ P: 0, D: 0, O: 0, S: 0, honest: 0 });

  const handleSelect = (w) => {
    const newScores = { ...scores };
    Object.keys(w).forEach(k => { newScores[k] += w[k]; });
    setScores(newScores);
    if (idx < questions.length - 1) setIdx(idx + 1);
    else setStep(2);
  };

  const result = useMemo(() => {
    if (step !== 2) return null;
    if (scores.honest === 1) return {
      title: "人格面具的囚徒",
      color: "#FFFFFF",
      content: "你正在經歷一場精心的社會性表演。榮格指出，面具是為了適應社會產生的偽裝，但對你而言，這副面具已與皮膚癒合，讓你喪失了直視「陰影」的勇氣。你在測驗中展現的高尚並非源於利他，而是源於「道德自戀」：你恐懼平庸的邪惡，因此透過極端的道德選擇來對沖內心的陰暗動機。證據顯示，當你在最後一題選擇承認恐懼時，你的偽善已無所遁形。你並非在乎生命，你只是在乎「那個擁有正義感的自己」。"
    };
    if (scores.P > scores.D) return {
      title: "冷血的棋手",
      color: "#3b82f6",
      content: "你是天生的『權力現實主義者』。在你的眼中，生命只有『用途』，沒有『價值』。你完美符合了馬基雅維利的預言：『被人畏懼比受人愛戴更安全。』你的人格核心是一部精密的計算機，在面對極端抉擇時，你毫不猶豫地選擇了效能。你對情感的免疫力讓你成為完美的執行者，但也讓你成為了深淵的一部分。在你建立的秩序中，靈魂只是燃料。"
    };
    return {
      title: "虛無的解構者",
      color: "#a855f7",
      content: "你正處於『末人』與『超人』之間的掙扎。你渴望超越世俗道德，卻又被殘存的良知拉扯。尼采曾說：『當你凝視深淵時，深淵也在凝視你。』你並非恐懼深淵，你只是恐懼在深淵中發現自己依然平庸。你試圖解構一切，卻在解構之後面臨無邊無際的虛無感。你的不可預測性是你唯一的武器，但也讓你成為了無家可歸的靈魂。"
    };
  }, [step, scores]);

  return (
    <div style={{ backgroundColor: 'black', color: 'white', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'sans-serif' }}>
      {step === 0 && (
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 'bold', letterSpacing: '-2px' }}>ABYSS DECODER</h1>
          <p style={{ opacity: 0.4, marginBottom: '40px' }}>這不是測驗，這是一面照妖鏡。</p>
          <button onClick={() => setStep(1)} style={{ padding: '15px 40px', borderRadius: '50px', border: 'none', backgroundColor: 'white', fontWeight: 'bold', cursor: 'pointer' }}>開始解碼</button>
        </div>
      )}

      {step === 1 && (
        <div style={{ maxWidth: '600px', width: '100%' }}>
          <div style={{ fontSize: '12px', opacity: 0.3, marginBottom: '10px' }}>PHASE {idx + 1} / 21</div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>{questions[idx].story}</h2>
          <p style={{ fontStyle: 'italic', opacity: 0.5, marginBottom: '30px' }}>{questions[idx].text}</p>
          {questions[idx].options.map((opt, i) => (
            <button key={i} onClick={() => handleSelect(opt.weights)} style={{ width: '100%', textAlign: 'left', padding: '20px', marginBottom: '10px', borderRadius: '15px', backgroundColor: '#111', border: '1px solid #222', color: 'white', cursor: 'pointer' }}>
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {step === 2 && result && (
        <div style={{ textAlign: 'center', maxWidth: '600px' }}>
          <div style={{ fontSize: '12px', opacity: 0.4, letterSpacing: '2px', marginBottom: '20px' }}>SOUL REPORT</div>
          <h1 style={{ color: result.color, fontSize: '3.5rem', fontWeight: 'bold', marginBottom: '20px' }}>{result.title}</h1>
          <div style={{ backgroundColor: '#111', padding: '30px', borderRadius: '30px', lineHeight: '1.8', fontSize: '1.2rem', fontWeight: '300', textAlign: 'justify' }}>
            {result.content}
          </div>
          <p style={{ marginTop: '40px', opacity: 0.2, fontSize: '10px' }}>長按螢幕截圖分享給朋友</p>
          <button onClick={() => window.location.reload()} style={{ marginTop: '20px', background: 'none', border: 'none', color: '#444', cursor: 'pointer' }}>重新進入深淵</button>
        </div>
      )}
    </div>
  );
}
