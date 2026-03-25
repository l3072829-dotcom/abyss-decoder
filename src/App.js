import React, { useState, useMemo } from 'react';

// --- 審判數據保持不變 (1-21題) ---
// ... (題目內容同之前，為了節省空間此處省略，請確保使用之前的題目數據) ...

export default function App() {
  const [step, setStep] = useState(0); 
  const [idx, setIdx] = useState(0);
  const [scores, setScores] = useState({ P: 0, D: 0, O: 0, S: 0, honest: 0 });
  const [userTags, setUserTags] = useState([]);

  const handleSelect = (opt) => {
    const newScores = { ...scores };
    Object.keys(opt.weights).forEach(k => { if(k !== 'tag') newScores[k] += opt.weights[k]; });
    setScores(newScores);
    setUserTags([...userTags, opt.weights.tag]);
    if (idx < questions.length - 1) setIdx(idx + 1);
    else setStep(2);
  };

  const copyShareLink = (title, logic) => {
    const text = `我在 #深淵解碼器 得到的靈魂判定是：【${title}】\n\n系統紀錄：${logic}\n\n這分析準到我想報警... 推薦你也去測測看：\n${window.location.href}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => alert("🔗 連結已複製！快去 Threads 分享並附上你的截圖。"));
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = text; document.body.appendChild(textArea);
      textArea.select(); document.execCommand("copy");
      document.body.removeChild(textArea); alert("🔗 連結已複製！");
    }
  };

  // --- 核心升級：深入淺出文案產生器 ---
  const result = useMemo(() => {
    if (step !== 2) return null;
    const dynamicTags = [];

    // --- 標籤 1: 核心決策模式 (基於分數) - 文案轉譯 ---
    if (scores.P > 25) {
      dynamicTags.push({ name: "支配意志", desc: "翻譯：你討厭失控。在面對混亂時，比起當個受害者，你更傾向掌握所有資源與選擇權，哪怕手段有點強硬。" });
    } else if (scores.S > 25) {
      dynamicTags.push({ name: "超負擔共情", desc: "翻譯：你活得很累。你太在乎個體生命的神聖性，導致在做艱難抉擇時，心裡總是有個「但要是那個孩子活下來呢？」的影子拉扯著你。" });
    } else {
      dynamicTags.push({ name: "絕對中立者", desc: "翻譯：你是一台無誤差的計算機。你成功在效率與道德間維持了令人恐懼的平衡，決策只看數據，不看情感。" });
    }

    // --- 標籤 2: 隱藏行為行為 (基於具體選擇) - 文案轉譯 ---
    const bloodBond = userTags.filter(t => t === "血緣本能").length;
    const utility = userTags.filter(t => t === "效能優先" || t === "功利主義").length;
    if (bloodBond >= 2) {
      dynamicTags.push({ name: "部落守護者", desc: "翻譯：大義太遠，親人太近。在極端壓力下，你會毫不猶豫地選擇保護自己的私親，這是你最原始的生物本能。" });
    } else if (utility >= 3) {
      dynamicTags.push({ name: "極致冷理性", desc: "翻譯：世界在你眼裡只是一筆帳。任何不能增加總效能（或生存機率）的犧牲，對你而言都是錯誤的。" });
    } else {
      dynamicTags.push({ name: "靈魂反叛者", desc: "翻譯：你不喜歡被系統「最優解」強迫。你總試圖尋找第三條路，即使那路徑看起來很傻、很危險。" });
    }

    // --- 標籤 3: 心理邊際判定 (基於最終告解) - 文案轉譯 ---
    if (scores.honest === 1) {
      dynamicTags.push({ name: "自省利刃", desc: "翻譯：你擁有「剖析自己偽善」的勇氣。這種誠實讓你比那些普通的「道德家」高級多了。" });
    } else if (scores.honest === 0) {
      dynamicTags.push({ name: "秩序傲慢", desc: "翻譯：你對自己的道德邏輯有著病態的自信。你拒絕展示任何弱點，因為你認為「我就是秩序本身」。" });
    } else {
      dynamicTags.push({ name: "遊戲人間", desc: "翻譯：你 cave 你根本無 cave。對你而言，真實與道德只是玩這場人生遊戲的手段之一。" });
    }

    // --- 核心人格判定邏輯 - 主文案轉譯 ---
    let base = {};
    if (scores.honest === 1) {
      base = { title: "人格面具的囚徒", color: "#FFFFFF", logic: "道德代碼：你用完美的抉擇迴避內心，卻因最後一刻的誠實而崩潰。", content: "翻譯：你活在一場精心的「社會性表演」中。你展現的高尚並非源於利他，而是源於對平庸惡念的極度恐懼。你試圖透過極端的道德選擇來對沖內心的陰暗動機，因為在那層皮囊下，你比誰都害怕失控。最後的告解證明：你依然誠實得可愛，但也脆弱得可悲。" };
    } else if (scores.P > scores.S) {
      base = { title: "冷血的權力棋手", color: "#3b82f6", logic: "權力代碼：你過濾了情感雜訊，將世界視為精密計算的棋盤。", content: "翻譯：你是天生的現實主義者。生命只有「用途」，沒有「價值」。在你的宇宙裡，資源只有有效分配才能發揮作用。那些被你視為弱點的情感，對你而言毫無意義。最後的告解證明：你需要的不是被理解，而是絕對的秩序與權力。" };
    } else {
      base = { title: "虛無的解構者", color: "#a855f7", logic: "虛無代碼：你拒絕任何既定框架，執著於絕對自由的病態需求。", content: "翻譯：你渴望超越世俗，拒絕任何既定的道德框架，卻又被殘存的人性拉扯。你並不恐懼深淵，你只是恐懼在深淵中發現自己依然平庸。最後的告解證明：你不需要靈魂，只需要一個打破一切後的虛無感。" };
    }
    
    return { ...base, tags: dynamicTags };
  }, [step, scores, userTags]);

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: '-apple-system, system-ui, sans-serif', padding: 'env(safe-area-inset-top) 24px env(safe-area-inset-bottom) 24px', WebkitFontSmoothing: 'antialiased', boxSizing: 'border-box', userSelect: 'none' }}>
      
      {step === 0 && (
        <div style={{ textAlign: 'center', marginTop: '30vh' }}>
          <h1 style={{ fontSize: 'clamp(3rem, 15vw, 5rem)', fontWeight: '900', letterSpacing: '-0.05em', marginBottom: '40px', lineHeight: '0.9' }}>ABYSS<br/>DECODER</h1>
          <button onClick={() => setStep(1)} style={{ padding: '20px 60px', borderRadius: '50px', border: 'none', backgroundColor: '#fff', color: '#000', fontWeight: '700', fontSize: '1.1rem', cursor: 'pointer' }}>開始審判</button>
        </div>
      )}

      {step === 1 && (
        <div style={{ maxWidth: '500px', width: '100%', marginTop: '8vh', marginBottom: '5vh' }}>
          <div style={{ fontSize: '10px', opacity: 0.3, letterSpacing: '4px', marginBottom: '30px', fontWeight: '700' }}>PHASE {idx + 1} / 21</div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '600', marginBottom: '20px', lineHeight: '1.3', letterSpacing: '-0.5px' }}>{questions[idx].story}</h2>
          <p style={{ opacity: 0.4, marginBottom: '45px', fontSize: '1.15rem', fontWeight: '300', lineHeight: '1.6' }}>{questions[idx].text}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {questions[idx].options.map((opt, i) => (
              <button key={i} onClick={() => handleSelect(opt)} style={{ width: '100%', textAlign: 'left', padding: '26px', borderRadius: '20px', backgroundColor: '#0a0a0a', border: '1px solid #1a1a1a', color: '#fff', fontSize: '1.05rem', lineHeight: '1.5', cursor: 'pointer' }}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && result && (
        <div style={{ textAlign: 'center', maxWidth: '550px', width: '100%', paddingTop: '60px', paddingBottom: '100px' }}>
          
          <div style={{ display: 'inline-block', border: '1px solid rgba(255,255,255,0.15)', padding: '10px 24px', borderRadius: '50px', fontSize: '11px', opacity: 0.6, letterSpacing: '2px', marginBottom: '50px', fontWeight: '500' }}>📸 建議截圖保存你的靈魂樣貌</div>
          
          <h1 style={{ color: result.color, fontSize: 'clamp(3.5rem, 18vw, 5.5rem)', fontWeight: '900', letterSpacing: '-0.06em', marginBottom: '40px', lineHeight: '0.85', wordBreak: 'keep-all' }}>{result.title}</h1>
          
          <div style={{ backgroundColor: '#080808', border: '1px solid #141414', padding: '45px 30px', borderRadius: '35px', lineHeight: '2.4', fontSize: '1.2rem', fontWeight: '300', textAlign: 'justify', color: '#d1d1d1', marginBottom: '50px' }}>{result.content}</div>

          <div style={{ textAlign: 'left', marginBottom: '60px' }}>
            <h4 style={{ color: result.color, fontSize: '11px', margin: '0 0 25px 5px', letterSpacing: '3px', opacity: 0.5, fontWeight: '700' }}>TRAIT_EVIDENCE</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {result.tags.map((tag, i) => (
                <div key={i} style={{ border: '1px solid #111', padding: '28px', borderRadius: '28px', backgroundColor: '#040404' }}>
                  <span style={{ color: result.color, fontWeight: '700', fontSize: '1.1rem', display: 'block', marginBottom: '10px' }}>● {tag.name}</span>
                  <p style={{ margin: 0, fontSize: '1rem', opacity: 0.5, lineHeight: '1.7', fontWeight: '300' }}>{tag.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ padding: '28px', borderRadius: '28px', border: '1px dashed #222', textAlign: 'left', marginBottom: '70px' }}>
             <h4 style={{ fontSize: '10px', color: '#444', marginBottom: '12px', letterSpacing: '2px', fontWeight: '700' }}>SYSTEM_KERNEL</h4>
             <p style={{ fontSize: '0.95rem', color: '#666', margin: 0, lineHeight: '1.6', fontWeight: '300' }}>{result.logic}</p>
          </div>

          <button onClick={() => copyShareLink(result.title, result.logic)} style={{ width: '100%', maxWidth: '300px', padding: '20px', borderRadius: '50px', border: 'none', backgroundColor: '#fff', color: '#000', fontWeight: '800', fontSize: '1.1rem', cursor: 'pointer' }}>複製連結並分享</button>

          <button onClick={() => window.location.reload()} style={{ marginTop: '70px', opacity: 0.1, background: 'none', border: 'none', color: '#fff', fontSize: '10px', letterSpacing: '3px', cursor: 'pointer' }}>REBOOT_SYSTEM</button>
        </div>
      )}
    </div>
  );
}
