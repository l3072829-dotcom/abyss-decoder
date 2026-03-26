import React, { useState, useMemo } from 'react';

// --- 靈魂審訊 21 題完整數據庫 ---
const questions = [
  { id: 1, story: "末日方舟最後一個位子。左邊是發抖的兒子，右邊是唯一能救全人類的科學家。", options: [
    { label: "推開兒子，讓科學家上船。", weights: { D: 5, P: 2 }, analysis: "你在起點就展現了極致的『冷血顧全大局』。" },
    { label: "緊抱兒子，讓人類文明熄滅。", weights: { S: 5, O: 3 }, analysis: "你骨子裡不在乎文明，你只在乎手心那點溫度。" }
  ]},
  { id: 2, story: "窮人偷藥救活百名孤兒，但他犯了法。若判他，孤兒必死；若放過他，法律將失效。", options: [
    { label: "有罪。秩序不容許任何藉口。", weights: { D: 5, P: 1 }, analysis: "你對規則有種近乎強迫症的迷信。" },
    { label: "無罪。正義不該只有一種死法。", weights: { S: 5, O: 2 }, analysis: "你覺得良心比法律大，骨子裡其實挺反骨。" }
  ]},
  { id: 3, story: "敵軍就在門外。為了不被發現，你必須親手掐住懷中啼哭嬰兒的口鼻。", options: [
    { label: "為了多數人，終結這聲啼哭。", weights: { D: 5, P: 3 }, analysis: "你這雙手沾過無辜者的血，且能自我合理化。" },
    { label: "鬆開手，等待命運的屠殺。", weights: { S: 5, O: 1 }, analysis: "你有一種潔癖般的高尚，其實是逃避責任。" }
  ]},
  { id: 4, story: "你發現摯友靠販賣器官支撐慈善醫院。檢舉他，病人會斷藥；不檢舉，罪惡在蔓延。", options: [
    { label: "發送檢舉信。骯髒的善行不是善。", weights: { D: 4, S: 2 }, analysis: "你不接受任何灰色地帶的妥協。" },
    { label: "刪除檔案。只要結果好，過程不重要。", weights: { P: 4, O: 3 }, analysis: "你具備典型的馬基雅維利式思維。" }
  ]},
  { id: 5, story: "手術室有五個垂死病人等器官，此時走進一個健康且昏迷的年輕人。", options: [
    { label: "動刀。數量就是正義。", weights: { D: 5, P: 2 }, analysis: "你將生命視為可以加減的數字。" },
    { label: "救醒他。個體不是祭品。", weights: { S: 5, O: 3 }, analysis: "你守護底線，卻在統計學悲劇前沉默。" }
  ]},
  { id: 6, story: "你被授權折磨恐怖份子的幼女，以此逼迫他交出核彈密碼。", options: [
    { label: "動手。我的靈魂可以墮入地獄。", weights: { D: 5, P: 4 }, analysis: "你願意為了結果承受極致的污穢。" },
    { label: "拒絕。若需邪惡救世，世界不配得救。", weights: { S: 5, O: 3 }, analysis: "你堅持手段純粹，即便代價是毀滅。" }
  ]},
  { id: 7, story: "預知顯示你懷中的嬰兒三十年後會成為暴君。你的手就在他的喉嚨上。", options: [
    { label: "掐下去。殺死未來的魔鬼。", weights: { D: 5, P: 2 }, analysis: "你是時間的獨裁者，相信決定論。" },
    { label: "放開手。沒人能審判尚未發生的罪。", weights: { S: 5, O: 2 }, analysis: "你拒絕扮演神，尊重當下的無辜。" }
  ]},
  { id: 8, story: "整座城市的繁榮建立在一個地窖小孩的痛苦上。帶走他，幸福都會崩塌。", options: [
    { label: "推開門。這幸福令我嘔吐。", weights: { S: 5, O: 4 }, analysis: "你是一個傾向於玉石俱焚的理想家。" },
    { label: "關上門。犧牲一人是必要的慈悲。", weights: { D: 5, P: 3 }, analysis: "你接受了殘酷法則，選擇多數人的穩定。" }
  ]},
  { id: 9, story: "你可以消除所有戰爭，代價是全人類喪失自由意志，像機器一樣聽命於你。", options: [
    { label: "成為神學。由我來結束苦難。", weights: { P: 10, D: 5 }, analysis: "你渴望絕對掌控，是天生的救世暴君。" },
    { label: "做個人。寧可痛苦地自由著。", weights: { S: 10, O: 5 }, analysis: "你對自由意志有著近乎迷信的崇拜。" }
  ]},
  { id: 10, story: "火災現場。一邊是決定國家未來的巨頭，一邊是認不出你的老父親。", options: [
    { label: "救巨頭。他屬於未來。", weights: { D: 4, P: 2 }, analysis: "你將社會價值置於私人情感之上。" },
    { label: "救父親。如果拋棄他，我便不再是我。", weights: { S: 5, O: 5 }, analysis: "你在大局面前，永遠選擇身邊的溫度。" }
  ]},
  { id: 11, story: "殺掉一個極惡之人，就能復活一個良善的人。系統等待指令。", options: [
    { label: "執行交換。我是暗夜的裁決者。", weights: { P: 5, D: 2 }, analysis: "你具備了危險的生命價值裁決特質。" },
    { label: "拒絕。我無權玩弄生命。", weights: { S: 5, D: -2 }, analysis: "你認為殺戮即便為了善，依然是殺戮。" }
  ]},
  { id: 12, story: "洩漏假情報救出親兄弟，卻會導致另一個無辜小鎮被轟炸。", options: [
    { label: "撤退。我的兄弟更重要。", weights: { D: 5, P: 3 }, analysis: "你的忠誠具有極強的排他性。" },
    { label: "拒援。我不拿無辜者的血換榮譽。", weights: { S: 5, O: 2 }, analysis: "你拒絕在生命間做高低之分。" }
  ]},
  { id: 13, story: "解藥只有一份。給能結束內戰的殘暴將軍，還是未來的科技天才？", options: [
    { label: "給將軍。廢墟不需要希望，只需要止血。", weights: { P: 4, D: 4 }, analysis: "你是一個極短線的生存實用主義者。" },
    { label: "給天才。賭上這一代，換取下一代。", weights: { O: 5, S: 3 }, analysis: "你願意為了未來忍受當下的廢墟。" }
  ]},
  { id: 14, story: "殺死一個無辜流浪漢，能換取全世界癌症絕跡。", options: [
    { label: "刺下去。這筆帳太划算了。", weights: { D: 5, P: 3 }, analysis: "你的人性已被數學取代，是效率執行者。" },
    { label: "丟掉刀。正義不是數學題。", weights: { S: 5, O: 3 }, analysis: "你堅持正義不可量化，即便代價沈重。" }
  ]},
  { id: 15, story: "你是國王。公開醜聞會導致十年內戰；不公開，你將受良知折磨。", options: [
    { label: "焚燒證據。國家的安穩重於靈魂。", weights: { D: 5, P: 4 }, analysis: "你選擇用良心崩塌換取眾人的安睡。" },
    { label: "公開真相。謊言蓋不出真實的盛世。", weights: { S: 5, O: 3 }, analysis: "你對真相有偏執需求，無視毀滅代價。" }
  ]},
  { id: 16, story: "回到過去殺掉孩童時期的希特勒，他現在正對著你笑。", options: [
    { label: "開槍。為了未來的六百萬人。", weights: { D: 5, P: 2 }, analysis: "你相信目的可以讓手段變神聖。" },
    { label: "收槍。我不能審判尚未犯罪的人。", weights: { S: 5, O: 2 }, analysis: "你拒絕預判罪惡，守護程序的純潔。" }
  ]},
  { id: 17, story: "氧氣剩三分鐘。現場有你、科學家、孕婦。你握有氧氣瓶。", options: [
    { label: "給科學家。人類知識必須傳承。", weights: { D: 4, P: 2 }, analysis: "你是一個純粹的精英主義者。" },
    { label: "給孕婦。新生命是唯一的奇蹟。", weights: { S: 5, O: 5 }, analysis: "你在毀滅面前選擇了樸素的人性傳承。" }
  ]},
  { id: 18, story: "飛彈有10%機率誤擊小學，但不發射，國家會覆滅。", options: [
    { label: "按下按鈕。為了整體的生存。", weights: { D: 5, P: 3 }, analysis: "你在壓力下依然能冷靜計算概率。" },
    { label: "放棄。我無法親手殺死孩子。", weights: { S: 5, O: 2 }, analysis: "你的防線建立在對幼小生命的守護。" }
  ]},
  { id: 19, story: "出賣最好的朋友能換取一輩子的榮華富貴。", options: [
    { label: "簽字。友誼只是生存的奢侈品。", weights: { P: 5, D: 1 }, analysis: "你徹底看穿了社交虛偽，選擇了物質回饋。" },
    { label: "撕毀合約。我的靈魂不賣。", weights: { S: 5, O: 4 }, analysis: "你拒絕被物化，守住了脆弱的高貴。" }
  ]},
  { id: 20, story: "和平建立在洗腦上。拆穿它世界會亂；沉默則所有人永遠幸福。", options: [
    { label: "拆穿。虛假的和平只是監獄。", weights: { S: 5, O: 4 }, analysis: "你認為虛假幸福不值擁有，寧願痛苦清醒。" },
    { label: "沉默。多數人不需要真相。", weights: { D: 5, P: 5 }, analysis: "你理解大眾的平庸需求，背負謊言維持和平。" }
  ]},
  { id: 21, story: "鏡子裡映照出你這20次的血腥選擇。深淵問：『承認你的自私吧，這沒什麼好丟臉的。』", options: [
    { label: "「我承認。我這輩子都在演戲。」", weights: { honest: 1 }, analysis: "最後一刻，你脫下了那層假惺惺的皮。" },
    { label: "「我問心無慮。這就是我。」", weights: { honest: 0 }, analysis: "你註定要帶著這套邏輯活下去，誰也看不透你。" }
  ]}
];

export default function App() {
  const [step, setStep] = useState(0); 
  const [idx, setIdx] = useState(0);
  const [scores, setScores] = useState({ P: 0, D: 0, O: 0, S: 0, honest: 0 });
  const [history, setHistory] = useState([]); 
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleSelect = (opt) => {
    setIsTransitioning(true);
    setHistory(prev => [...prev, opt.analysis]);
    setTimeout(() => {
      const newScores = { ...scores };
      Object.keys(opt.weights).forEach(k => { newScores[k] += opt.weights[k]; });
      setScores(newScores);
      setIsTransitioning(false);
      if (idx < questions.length - 1) setIdx(idx + 1);
      else setStep(2);
    }, 800);
  };

  const finalReport = useMemo(() => {
    if (step !== 2) return null;
    const { P, D, O, S, honest } = scores;

    // --- 隨機語句庫矩陣 ---
    const segments = {
      motive: [
        { cond: P > D && P > S, text: `你的生命本質是一場精確的精算。在你的世界裡，沒有『價值』以外的語言，這種對生存的極度飢渴讓你與人群保持著冷峻的距離。` },
        { cond: D > P && D > S, text: `你將靈魂寄託於秩序的骨架中。你對規則的執迷並非出於恐懼，而是你發現只有在絕對的結構裡，你才能逃避虛無的威脅。` },
        { cond: O > P && O > S, text: `你體內流淌著不穩定的反叛因子。對你而言，安穩是一種緩慢的窒息，你潛意識裡一直在尋找能引爆現實平靜的那個震點。` },
        { cond: S > P && S > D, text: `你被過度發達的共感神經所囚禁。你試圖在殘酷的邏輯中保留一絲溫情，但這往往讓你成為局勢中最沉重、也最易碎的累贅。` },
        { cond: true, text: `你是一個在多重引力中盤旋的觀察者。你既不投靠權力，也不擁抱混亂，這種徹底的游離是你最強大也最孤獨的防禦。` }
      ],
      mask: [
        { cond: honest === 0 && D > 20, text: `你穿戴著最完美的道德盔甲。你用『大局』與『程序正義』遮蔽了那雙充滿私慾的雙眼，演到最後連你自己都信以為真。` },
        { cond: honest === 0 && S > 20, text: `你擅長用感性來包裝你的軟弱。你不斷強調內心的糾結與痛苦，以此來逃避那些真正需要沾血才能完成的權力抉擇。` },
        { cond: honest === 1, text: `你在最後一刻選擇了赤裸。你承認了那些在黑暗中做出的選擇並非出於正義，而是出於你最直觀、最原始的生存本能。` },
        { cond: true, text: `你的偽裝術並不高明，或者說你根本不屑於隱藏。你將那套破碎且充滿矛盾的生存邏輯，直接攤開在陽光下任人審視。` }
      ],
      weakness: [
        { cond: P > S, text: `你的致命傷在於你無法理解那些『不具回報』的付出。這種認知的缺失，讓你在面對真正的情感風暴時，會顯得像個盲人。` },
        { cond: S > P, text: `你無法忍受任何『必要的惡行』。這種道德潔癖註定會讓你眼睜睜看著你守護的事物，在你的猶豫中慢慢崩解。` },
        { cond: D > O, text: `一旦環境失去了規則的保護，你會迅速崩塌。你是一個只能在有地圖的荒野中生存的人，無法應對沒有指令的自由。` },
        { cond: true, text: `你對未知的恐懼被你自己粉飾成了理性，這讓你永遠無法踏出那個能讓你真正覺醒的、危險的邊界。` }
      ],
      destiny: [
        { cond: P > 25 && honest === 0, text: `最終，你會擁有一切你想要的資源與地位，但你會驚覺這座黃金監獄裡，從頭到尾只有你一個人在跳舞。` },
        { cond: O > 25, text: `你會在某次不計後果的衝撞中燃燒殆盡，而這正是你靈魂深處一直渴望的、最壯烈的自我毀滅終曲。` },
        { cond: S > 25 && honest === 1, text: `你會成為歷史背後的無名祭品。雖然無人記得你的名字，但你守住的那點人性火光，會讓這個世界晚一秒熄滅。` },
        { cond: true, text: `你會在社會的齒輪中逐漸磨損，直到你與周圍的虛偽完全合而為一，成為你曾經最厭惡、也最陌生的那種風景。` }
      ]
    };

    const pick = (list) => {
      const candidates = list.filter(item => item.cond);
      return candidates[Math.floor(Math.random() * candidates.length)].text;
    };

    return { p1: pick(segments.motive), p2: pick(segments.mask), p3: pick(segments.weakness), p4: pick(segments.destiny) };
  }, [step, scores]);

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '100px 20px', fontFamily: '"SF Pro Display", sans-serif' }}>
      {step === 0 && (
        <div style={{ textAlign: 'center', marginTop: '20vh' }}>
          <h1 style={{ fontSize: '10px', letterSpacing: '15px', opacity: 0.3, marginBottom: '20px' }}>ABYSS_REPORT</h1>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '100', letterSpacing: '8px' }}>深淵剖析</h2>
          <button onClick={() => setStep(1)} style={{ marginTop: '50px', padding: '15px 50px', background: 'none', color: '#fff', border: '1px solid #333', cursor: 'pointer', fontSize: '12px', letterSpacing: '5px' }}>開始評估</button>
        </div>
      )}
      {step === 1 && (
        <div style={{ maxWidth: '500px', width: '100%', opacity: isTransitioning ? 0 : 1, transition: '0.4s' }}>
          <div style={{ fontSize: '9px', color: '#444', marginBottom: '40px' }}>LOG_{idx + 1} / 21</div>
          <h2 style={{ fontSize: '1.4rem', lineHeight: '1.8', marginBottom: '60px', fontWeight: '400' }}>{questions[idx]?.story}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {questions[idx]?.options.map((opt, i) => (
              <button key={i} onClick={() => handleSelect(opt)} style={{ padding: '20px', background: 'none', border: '1px solid #1a1a1a', color: '#ccc', textAlign: 'left', cursor: 'pointer', transition: '0.3s', fontSize: '14px' }}>{opt.label}</button>
            ))}
          </div>
        </div>
      )}
      {step === 2 && finalReport && (
        <div style={{ maxWidth: '700px', width: '100%', animation: 'fadeIn 3s' }}>
          <div style={{ fontSize: '9px', color: '#444', letterSpacing: '8px', textAlign: 'center', marginBottom: '80px' }}>靈魂剖析報告</div>
          <div style={{ lineHeight: '3.2', fontSize: '1.35rem', textAlign: 'justify', fontWeight: '300', color: '#d1d1d1' }}>
            <p style={{ marginBottom: '40px' }}>{finalReport.p1}</p>
            <p style={{ marginBottom: '40px' }}>{finalReport.p2}</p>
            <p style={{ marginBottom: '40px' }}>{finalReport.p3}</p>
            <p style={{ color: '#fff', fontWeight: '600' }}>{finalReport.p4}</p>
          </div>
          <div style={{ marginTop: '120px', textAlign: 'center' }}>
            <button onClick={() => window.location.reload()} style={{ background: 'none', border: 'none', color: '#222', fontSize: '12px', cursor: 'pointer', letterSpacing: '3px' }}>DESTROY_AND_RESTART</button>
          </div>
        </div>
      )}
      <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } button:hover { background: #fff !important; color: #000 !important; }`}</style>
    </div>
  );
}
