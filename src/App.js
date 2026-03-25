import React, { useState, useMemo } from 'react';

// --- 題目數據：確保這部分完整存在，否則會報錯 ---
const questions = [
  { id: 1, story: "末日方舟最後一個位子。左邊是發抖的兒子，右邊是唯一能救全人類的科學家。", options: [
    { label: "推開兒子，讓科學家上船。", weights: { D: 5, P: 2, tag: "效能優先" }, whisper: "你親手推開了骨肉，換取渺茫的文明火種。", analysis: "你具備極端的理性，願意為了大局切斷感性軟肋" },
    { label: "緊抱兒子，讓人類文明熄滅。", weights: { S: 5, O: 3, tag: "血緣本能" }, whisper: "在世界末日面前，你選擇溺死在私人的溫存裡。", analysis: "你拒絕讓抽象的文明凌駕於具體的愛，是純粹的本能守護者" }
  ]},
  // ... 此處建議補齊 2~20 題，結構須與上方一致 ...
  { id: 21, story: "深淵盡頭是面鏡子。聲音問：『承認你的偽善，我將賜予真實。』", options: [
    { label: "「我承認，我的每一份高尚都藏著恐懼。」", weights: { honest: 1, tag: "自省者" }, whisper: "這份誠實，是你這場表演中唯一的真話。", analysis: "在最後關頭你選擇了剖析自我，這份脆弱讓你的人格顯得立體" },
    { label: "「我的每一槌皆是本心，無需解釋。」", weights: { honest: 0, tag: "傲慢者" }, whisper: "直到最後，你依然穿著那身完美的盔甲。", analysis: "你拒絕向任何事物屈服，你對自己的邏輯有著病態的自信" }
  ]}
];

export default function App() {
  const [step, setStep] = useState(0); 
  const [idx, setIdx] = useState(0);
  const [scores, setScores] = useState({ P: 0, D: 0, O: 0, S: 0, honest: 0 });
  const [history, setHistory] = useState([]); 
  const [whisper, setWhisper] = useState(""); 

  const handleSelect = (opt) => {
    setWhisper(opt.whisper);
    // 儲存關鍵證據
    setHistory(prev => [...prev, { analysis: opt.analysis }]);

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

    // 智能提取證據：抓取第一道題與最後一道題的分析作為融合素材
    const firstEvidence = history[0]?.analysis || "尋求超越標準的可能";
    const lastEvidence = history[history.length - 1]?.analysis || "在深淵中保持沉默";

    const isHonest = scores.honest === 1;
    const isPower = scores.P > scores.S;

    let config = { title: "", color: "", desc: "" };

    if (isHonest) {
      config = {
        title: "優雅的偽善家",
        color: "#FFFFFF",
        desc: `你正在經歷一場精心的社會性表演。你渴求超越世俗，拒絕任何既定標準。誠如審判所見，${firstEvidence}。你並不恐懼深淵，你只是恐懼在深淵中發現自己依然平庸。最終，${lastEvidence}，這讓你既痛苦又自由。`
      };
    } else if (isPower) {
      config = {
        title: "冷血的操盤手",
        color: "#3b82f6",
        desc: `你是天生的現實主義者。在你眼中，生命只有用途而沒有價值。當抉擇降臨時，${firstEvidence}。你的核心是一部精密的計算機，雖然${lastEvidence}，但你拒絕向任何人解釋或示弱。`
      };
    } else {
      config = {
        title: "自由的靈魂罪人",
        color: "#a855f7",
        desc: `你正處於理性與瘋狂的裂縫中。你並非在拯救世界，而是在挑戰這個世界的極限。因為${firstEvidence}，你的人性還在拉扯。儘管${lastEvidence}，你依然選擇擁抱那份不被理解的純粹。`
      };
    }
    return config;
  }, [step, scores, history]);

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 20px', fontFamily: 'sans-serif' }}>
      
      {step === 0 && (
        <div style={{ textAlign: 'center', marginTop: '30vh' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: '900', letterSpacing: '10px' }}>ABYSS</h1>
          <button onClick={() => setStep(1)} style={{ marginTop: '40px', padding: '15px 40px', borderRadius: '30px', border: 'none', background: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>開啟審判</button>
        </div>
      )}

      {step === 1 && (
        <div style={{ maxWidth: '500px', width: '100%' }}>
          <div style={{ opacity: 0.3, fontSize: '12px', marginBottom: '20px' }}>LOG_{idx + 1}/21</div>
          <h2 style={{ fontSize: '1.4rem', lineHeight: '1.6', marginBottom: '30px' }}>{questions[idx].story}</h2>
          <div style={{ height: '50px', color: '#ff4d4d', fontStyle: 'italic' }}>{whisper && `「${whisper}」`}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {questions[idx].options.map((opt, i) => (
              <button key={i} onClick={() => handleSelect(opt)} style={{ padding: '20px', borderRadius: '15px', background: '#111', color: '#fff', border: '1px solid #222', textAlign: 'left', cursor: 'pointer' }}>{opt.label}</button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && result && (
        <div style={{ maxWidth: '600px', width: '100%', textAlign: 'center', animation: 'fadeIn 1.5s' }}>
          <h1 style={{ color: result.color, fontSize: '4rem', fontWeight: '900', marginBottom: '40px' }}>{result.title}</h1>
          <div style={{ background: '#0a0a0a', padding: '40px', borderRadius: '30px', border: `1px solid ${result.color}33`, lineHeight: '2.2', fontSize: '1.15rem', textAlign: 'justify', color: '#ccc' }}>
            {result.desc}
          </div>
          <button onClick={() => window.location.reload()} style={{ marginTop: '60px', background: 'none', border: 'none', color: '#333', cursor: 'pointer', letterSpacing: '2px' }}>REBOOT SYSTEM</button>
        </div>
      )}

      <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
    </div>
  );
}
