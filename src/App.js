import React, { useState, useMemo } from 'react';

// --- 題目數據保持不變，但我們現在會從中提取 analysis 作為證據 ---
// (題目內容請延用之前的完整 21 題數據)

export default function App() {
  const [step, setStep] = useState(0); 
  const [idx, setIdx] = useState(0);
  const [scores, setScores] = useState({ P: 0, D: 0, O: 0, S: 0, honest: 0 });
  const [history, setHistory] = useState([]); 
  const [whisper, setWhisper] = useState(""); 

  const handleSelect = (opt) => {
    setWhisper(opt.whisper);
    setHistory(prev => [...prev, { analysis: opt.analysis, tag: opt.weights.tag }]);

    setTimeout(() => {
      const newScores = { ...scores };
      Object.keys(opt.weights).forEach(k => { if(k !== 'tag') newScores[k] += opt.weights[k]; });
      setScores(newScores);
      setWhisper("");
      if (idx < questions.length - 1) setIdx(idx + 1);
      else setStep(2);
    }, 1500);
  };

  const result = useMemo(() => {
    if (step !== 2) return null;

    // 1. 提取最具代表性的抉擇 (例如從前 5 題找一個，中間找一個)
    const earlyEvidence = history[0]?.analysis || ""; 
    const midEvidence = history[Math.floor(history.length / 2)]?.analysis || "";
    const lastEvidence = history[history.length - 1]?.analysis || "";

    // 2. 判斷核心性格
    const isPower = scores.P > scores.S;
    const isHonest = scores.honest === 1;

    let title = "";
    let color = "";
    let baseContent = "";

    if (isHonest) {
      title = "優雅的偽善家";
      color = "#FFFFFF";
      baseContent = `你正在經歷一場精心的社會性表演。你極度討厭失控，這展現出你強大的掌控意志。在之前的審判中，${earlyEvidence} 而隨後的抉擇顯示，${midEvidence} 最終，${lastEvidence} 這份誠實是你靈魂中唯一的破綻。`;
    } else if (isPower) {
      title = "冷血的操盤手";
      color = "#3b82f6";
      baseContent = `你是天生的現實主義者。在你的宇宙裡，生命只有用途而沒有價值。數據顯示，${earlyEvidence} 且你傾向於 ${midEvidence}。即便最後 ${lastEvidence}，你依然拒絕向任何人解釋或示弱。`;
    } else {
      title = "自由的靈魂罪人";
      color = "#a855f7";
      baseContent = `你渴望超越世俗，拒絕任何框架。你擁有一種隱性的大愛，這使你即便在必死局中也試圖保全微小生命。誠如你選的：${earlyEvidence}，這證明了你的掙扎。雖然 ${midEvidence}，但你依然在理性與瘋狂的裂縫中挑戰極限。`;
    }

    return { title, color, content: baseContent };
  }, [step, scores, history]);

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', padding: '40px 20px', fontFamily: '-apple-system, sans-serif' }}>
      
      {/* 測驗頁面 (保持不變) */}
      {step === 1 && (
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          <div style={{ opacity: 0.3, fontSize: '10px', marginBottom: '30px' }}>LOG_{idx + 1}/21</div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '30px' }}>{questions[idx].story}</h2>
          <div style={{ height: '50px', color: '#ff4d4d' }}>{whisper && `「${whisper}」`}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {questions[idx].options.map((opt, i) => (
              <button key={i} onClick={() => handleSelect(opt)} style={{ padding: '20px', borderRadius: '15px', background: '#111', color: '#fff', border: '1px solid #222', textAlign: 'left', cursor: 'pointer' }}>{opt.label}</button>
            ))}
          </div>
        </div>
      )}

      {/* 整合後的結果頁面 */}
      {step === 2 && result && (
        <div style={{ maxWidth: '650px', margin: '0 auto', textAlign: 'center', animation: 'fadeIn 2s' }}>
          <div style={{ fontSize: '12px', color: result.color, letterSpacing: '5px', marginBottom: '20px' }}>DECODED_IDENTITY</div>
          
          <h1 style={{ color: result.color, fontSize: '4.5rem', fontWeight: '900', marginBottom: '40px' }}>{result.title}</h1>
          
          {/* 這裡是重點：分析與結果完全融合的區塊 */}
          <div style={{ 
            background: 'rgba(255,255,255,0.02)', 
            padding: '50px 35px', 
            borderRadius: '40px', 
            fontSize: '1.25rem', 
            lineHeight: '2.5', 
            border: `1px solid ${result.color}33`, // 帶有主題色的微弱邊框
            textAlign: 'justify', 
            color: '#e1e1e1',
            boxShadow: `0 20px 50px ${result.color}11`
          }}>
            {result.content}
          </div>

          <div style={{ marginTop: '60px', opacity: 0.4, fontSize: '11px', letterSpacing: '2px' }}>
            TRAIT_EVIDENCE_SYNTHESIZED_SUCCESSFULLY
          </div>

          <button onClick={() => window.location.reload()} style={{ marginTop: '100px', background: 'none', border: 'none', color: '#333', cursor: 'pointer', letterSpacing: '3px' }}>REBOOT SYSTEM</button>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
