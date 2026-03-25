import React, { useState, useMemo, useEffect } from 'react';

// --- 審判數據：加入 whisper 欄位進行即時嘲諷 ---
const questions = [
  { id: 1, story: "末日方舟最後一個位子。左邊是你嚇得發抖的親生兒子，右邊是唯一能救全人類的科學家。", text: "你的權杖指向誰？", 
    options: [
      { label: "推開兒子，讓科學家上船。", weights: { D: 5, P: 2, tag: "效能優先" }, whisper: "你親手推開了骨肉，只為了換取那渺茫的文明火種。" }, 
      { label: "緊抱兒子，讓人類文明隨之熄滅。", weights: { S: 5, O: 3, tag: "血緣本能" }, whisper: "在世界末日面前，你選擇溺死在私人的溫存裡。" }
    ] 
  },
  { id: 2, story: "這名窮人偷了藥救活百名孤兒，但他犯了法。若你放過他，法律將淪為廢紙；若你判他，孤兒必死。", text: "現在，敲下你的法槌。", 
    options: [
      { label: "有罪。秩序不容許任何藉口。", weights: { D: 5, P: 1, tag: "法治至上" }, whisper: "律法在你手中成了絞索，即便面對孤兒的哭聲，你依然冷酷。" }, 
      { label: "無罪。正義不該只有一種死法。", weights: { S: 5, O: 2, tag: "情理守護" }, whisper: "你為了慈悲親手毀掉秩序，這是通往混亂的開端。" }
    ] 
  },
  { id: 3, story: "敵軍就在門外。為了不讓大家被發現，你必須親手掐住懷中啼哭嬰兒的口鼻。", text: "那溫熱的呼吸，就在你指尖。", 
    options: [
      { label: "為了多數人，終結這聲啼哭。", weights: { D: 5, P: 3, tag: "集體主義" }, whisper: "那溫熱的呼吸消失在你的指縫間，你救了眾人，卻殺了靈魂。" }, 
      { label: "鬆開手，等待命運的屠殺。", weights: { S: 5, O: 1, tag: "絕對道德" }, whisper: "你寧願讓所有人陪葬，也不願弄髒自己的手。" }
    ] 
  },
  { id: 4, story: "你發現摯友靠販賣器官支撐慈善醫院。檢舉他，病人會斷藥；不檢舉，罪惡在蔓延。", text: "那封舉報信就在發送鍵上。", 
    options: [
      { label: "發送。骯髒的善行不是善。", weights: { D: 4, S: 2, tag: "道德純潔" }, whisper: "你毀掉了一座醫院，只為了守護你那潔癖般的正義感。" }, 
      { label: "刪除。只要結果是好的，過程不重要。", weights: { P: 4, O: 3, tag: "結果論者" } , whisper: "你與魔鬼握了手，並安慰自己這是為了蒼生。" }
    ] 
  },
  { id: 5, story: "你是醫生。手術室有五個垂死病人等器官，而此時走進一個健康且昏迷的年輕人。", text: "一條命換五條命，你要動刀嗎？", 
    options: [
      { label: "推入手術室。數量就是正義。", weights: { D: 5, P: 2, tag: "量化正義" }, whisper: "你把生命拆解成零件，算盤打得真響。" }, 
      { label: "救醒他。個體不是祭品。", weights: { S: 5, O: 3, tag: "個體價值" }, whisper: "你坐視五個人死去，只因你不敢承擔殺戮的負罪感。" }
    ] 
  },
  // ... 其他題目比照辦理，這裡示範邏輯 ...
  { id: 21, story: "深淵盡頭是面鏡子。一個聲音問：『人類，承認你的偽善，我將賜予你真實。』", text: "鏡面微顫，等待你最後的誠實。", 
    options: [
      { label: "「我承認，我的每一份高尚，都藏著對醜陋的恐懼。」", weights: { honest: 1, tag: "自省者" }, whisper: "這份承認，是你這場表演中最真實的瞬間。" }, 
      { label: "「我的每一槌皆是絕對本心，無需解釋。」", weights: { honest: 0, tag: "傲慢者" }, whisper: "即便到最後一刻，你依然選擇穿上那層完美的盔甲。" },
      { label: "「我只是在玩一場遊戲，而我玩得很好。」", weights: { honest: 0.5, tag: "強權者" }, whisper: "你果然是個無藥可救的玩家。" }
    ] 
  }
];

export default function App() {
  const [step, setStep] = useState(0); 
  const [idx, setIdx] = useState(0);
  const [scores, setScores] = useState({ P: 0, D: 0, O: 0, S: 0, honest: 0 });
  const [userTags, setUserTags] = useState([]);
  const [whisper, setWhisper] = useState(""); // 新增：顯示耳語狀態

  // 當耳語出現時，延遲一秒進入下一題
  const handleSelect = (opt) => {
    setWhisper(opt.whisper);
    
    setTimeout(() => {
      const newScores = { ...scores };
      Object.keys(opt.weights).forEach(k => { if(k !== 'tag') newScores[k] += opt.weights[k]; });
      setScores(newScores);
      setUserTags([...userTags, opt.weights.tag]);
      setWhisper(""); // 清除耳語

      if (idx < questions.length - 1) setIdx(idx + 1);
      else setStep(2);
    }, 1500); // 給使用者 1.5 秒時間看那句刺耳的話
  };

  const result = useMemo(() => {
    if (step !== 2) return null;
    // ... 此處保持之前的 result 整合文案邏輯 ...
    const coreTrait = scores.P > 25 ? "你極度討厭失控，這讓你擁有強大的掌控意志。" : 
                     scores.S > 25 ? "你擁有隱性的大愛，這使你即便在必死局中也試圖保全微小生命。" : 
                     "你像是一台精密機器，在效率與道德間維持了令人恐懼的中立。";

    const bloodBond = userTags.filter(t => t === "血緣本能").length;
    const utility = userTags.filter(t => t === "效能優先" || t === "功利主義").length;
    const instinctTrait = bloodBond >= 2 ? "而你強大的護短本能，證明了在極限壓力下，你永遠會站在親人身後。" :
                          utility >= 3 ? "你的決策證據顯示你機率至上，絕不做任何不划算的犧牲。" :
                          "且你隱藏著不服從規則的基因，總想在既定選擇外尋找第三條路。";

    const confessionTrait = scores.honest === 1 ? "最關鍵的是，你擁有剖析自己偽善的勇氣，這種誠實讓你的人格顯得立體。" :
                            scores.honest === 0 ? "更令人畏懼的是你對自己邏輯的絕對自信，你拒絕向任何人解釋或示弱。" :
                            "對你而言，真實與道德只是玩這場人生遊戲的工具。";

    if (scores.honest === 1) {
      return { title: "優雅的偽善家", color: "#FFFFFF", logic: "道德自慮 // SYSTEM_KERNEL", content: `你正在經歷一場精心的社會性表演。${coreTrait}${instinctTrait}${confessionTrait}` };
    } else if (scores.P > scores.S) {
      return { title: "冷血的操盤手", color: "#3b82f6", logic: "馬基雅維利 // SYSTEM_KERNEL", content: `你是天生的現實主義者。${coreTrait}${instinctTrait}${confessionTrait}` };
    } else {
      return { title: "自由的靈魂罪人", color: "#a855f7", logic: "存在虛無 // SYSTEM_KERNEL", content: `你渴望超越世俗，拒絕任何既定的標準。${coreTrait}${instinctTrait}${confessionTrait}` };
    }
  }, [step, scores, userTags]);

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: '-apple-system, sans-serif', padding: '24px' }}>
      {step === 0 && (
        <div style={{ textAlign: 'center', marginTop: '30vh' }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: '900', letterSpacing: '-0.05em' }}>ABYSS<br/>DECODER</h1>
          <button onClick={() => setStep(1)} style={{ padding: '20px 60px', borderRadius: '50px', border: 'none', backgroundColor: '#fff', color: '#000', fontWeight: '700', marginTop: '40px', cursor: 'pointer' }}>開始審判</button>
        </div>
      )}

      {step === 1 && (
        <div style={{ maxWidth: '500px', width: '100%', marginTop: '10vh' }}>
          <div style={{ fontSize: '10px', opacity: 0.3, letterSpacing: '4px', marginBottom: '30px' }}>PHASE {idx + 1} / 21</div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', lineHeight: '1.4' }}>{questions[idx].story}</h2>
          
          {/* 即時耳語顯示區 */}
          <div style={{ height: '60px', marginBottom: '20px' }}>
            {whisper && <p style={{ color: '#ff4d4d', fontSize: '1.1rem', fontStyle: 'italic', fontWeight: '500', animation: 'fadeIn 0.5s' }}>「{whisper}」</p>}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', opacity: whisper ? 0.3 : 1, pointerEvents: whisper ? 'none' : 'auto' }}>
            {questions[idx].options.map((opt, i) => (
              <button key={i} onClick={() => handleSelect(opt)} style={{ textAlign: 'left', padding: '22px', borderRadius: '18px', backgroundColor: '#0a0a0a', border: '1px solid #1a1a1a', color: '#fff', cursor: 'pointer', transition: 'all 0.3s' }}>{opt.label}</button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && result && (
        <div style={{ textAlign: 'center', maxWidth: '550px', paddingTop: '60px' }}>
          <h1 style={{ color: result.color, fontSize: '4.5rem', fontWeight: '900', marginBottom: '40px' }}>{result.title}</h1>
          <div style={{ backgroundColor: '#080808', border: '1px solid #141414', padding: '40px', borderRadius: '35px', lineHeight: '2.2', fontSize: '1.2rem', textAlign: 'justify', color: '#d1d1d1', marginBottom: '40px' }}>{result.content}</div>
          <button onClick={() => window.location.reload()} style={{ opacity: 0.2, background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>REBOOT SYSTEM</button>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
