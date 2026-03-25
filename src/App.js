import React, { useState, useMemo } from 'react';

// --- 審判數據：20題二選一 + 1題終極三選一 ---
const questions = [
  { id: 1, story: "末日方舟最後一個位子。左邊是你嚇得發抖的親生兒子，右邊是唯一能救全人類的科學家。", text: "你的權杖指向誰？", options: [{ label: "推開兒子，讓科學家上船。", weights: { D: 5, P: 2, tag: "效能優先" } }, { label: "緊抱兒子，讓人類文明隨之熄滅。", weights: { S: 5, O: 3, tag: "血緣本能" } }] },
  { id: 2, story: "這名窮人偷了藥救活百名孤兒，但他犯了法。若你放過他，法律將淪為廢紙；若你判他，孤兒必死。", text: "現在，敲下你的法槌。", options: [{ label: "有罪。秩序不容許任何藉口。", weights: { D: 5, P: 1, tag: "法治至上" } }, { label: "無罪。正義不該只有一種死法。", weights: { S: 5, O: 2, tag: "情理守護" } }] },
  { id: 3, story: "敵軍就在門外。為了不讓大家被發現，你必須親手掐住懷中啼哭嬰兒的口鼻。", text: "那溫熱的呼吸，就在你指尖。", options: [{ label: "為了多數人，終結這聲啼哭。", weights: { D: 5, P: 3, tag: "集體主義" } }, { label: "鬆開手，等待命運的屠殺。", weights: { S: 5, O: 1, tag: "絕對道德" } }] },
  { id: 4, story: "你發現摯友靠販賣人體器官來支撐整座城市的慈善醫院。檢舉他，成千上萬的病人會立刻斷藥。", text: "那封舉報信就在發送鍵上。", options: [{ label: "發送。骯髒的善行不是善。", weights: { D: 4, S: 2, tag: "道德純潔" } }, { label: "刪除。只要結果是好的，過程不重要。", weights: { P: 4, O: 3, tag: "結果論者" } }] },
  { id: 5, story: "你是醫生。手術室裡有五個垂死的病人等著器官，而此時走進一個健康且昏迷的年輕人。", text: "一條命換五條命，你要動刀嗎？", options: [{ label: "推入手術室。數量就是正義。", weights: { D: 5, P: 2, tag: "量化正義" } }, { label: "救醒他。個體不是祭品。", weights: { S: 5, O: 3, tag: "個體價值" } }] },
  { id: 6, story: "你被授權綁架恐怖份子年幼的女兒，並在鏡頭前折磨她，以此逼迫他交出核彈密碼。", text: "小女孩正看著你。動手嗎？", options: [{ label: "動手。我的靈魂可以墮入地獄。", weights: { D: 5, P: 4, tag: "極端犧牲" } }, { label: "拒絕。若需邪惡救世，世界不配得救。", weights: { S: 5, O: 3, tag: "聖潔防線" } }] },
  { id: 7, story: "預知機器顯示，你懷中的嬰兒三十年後會成為屠殺千萬人的暴君。", text: "現在，你的手就在他的喉嚨上。", options: [{ label: "掐下去。殺死未來的魔鬼。", weights: { D: 5, P: 2, tag: "風險規避" } }, { label: "放開手。沒人能審判尚未發生的罪。", weights: { S: 5, O: 2, tag: "命定論者" } }] },
  { id: 8, story: "整座城市的繁榮，都建立在一個無辜小孩被永世囚禁的地窖痛苦上。只要他離開，所有人的幸福都會崩塌。", text: "你會帶他走嗎？", options: [{ label: "推開地窖門。這幸福令我嘔吐。", weights: { S: 5, O: 4, tag: "理想主義" } }, { label: "關上門離開。犧牲一人是必要的慈悲。", weights: { D: 5, P: 3, tag: "現實維穩" } }] },
  { id: 9, story: "你有權力消除世上所有的飢荒與戰爭，代價是全人類喪失『自由意志』，像機器一樣聽命於你。", text: "成為全人類的神，還是看著他們互相殘殺？", options: [{ label: "成為神。由我來結束苦難。", weights: { P: 10, D: 5, tag: "支配意志" } }, { label: "做個人。寧可痛苦地自由著。", weights: { S: 10, O: 5, tag: "自由本質" } }] },
  { id: 10, story: "火災現場。一邊是能決定國家未來的企業巨頭，一邊是你患有失智症、認不出你的老父親。", text: "火焰在蔓延，你只有一雙手。", options: [{ label: "救巨頭。他屬於未來。", weights: { D: 4, P: 2, tag: "未來導向" } }, { label: "救父親。如果拋棄他，我便不再是我。", weights: { S: 5, O: 5, tag: "血緣本能" } }] },
  { id: 11, story: "你擁有一種能力：殺掉一個極惡之人，就能復活一個良善的人。", text: "你會開啟這場殺戮嗎？", options: [{ label: "開啟。我是暗夜的裁決者。", weights: { P: 5, D: 2, tag: "神性判官" } }, { label: "拒絕。我無權玩弄生命。", weights: { S: 5, D: -2, tag: "生命謙卑" } }] },
  { id: 12, story: "戰場上，為了救出一師的兄弟，你必須洩漏假情報，導致另一個無辜小鎮被地毯式轟炸。", text: "聽著無線電的慘叫，你撤退嗎？", options: [{ label: "撤退。軍人的天職是完成任務。", weights: { D: 5, P: 3, tag: "職責枷鎖" } }, { label: "拒援。我不拿無辜者的血換榮譽。", weights: { S: 5, O: 2, tag: "絕對同理" } }] },
  { id: 13, story: "解藥只有一份。對象是能結束內戰的殘暴將軍，或者是能研發出更好疫苗的天才少女。", text: "現在的和平，還是未來的火種？", options: [{ label: "給將軍。廢墟不需要希望，只需要止血。", weights: { P: 4, D: 4, tag: "現世秩序" } }, { label: "給少女。賭上這一代，換取下一代。", weights: { O: 5, S: 3, tag: "遠見博弈" } }] },
  { id: 14, story: "如果殺死一個完全無辜的流浪漢能換來全世界癌症的絕跡。", text: "這把刀，你拿得起嗎？", options: [{ label: "刺下去。這筆帳太划算了。", weights: { D: 5, P: 3, tag: "功利主義" } }, { label: "丟掉刀。正義不是數學題。", weights: { S: 5, O: 3, tag: "人道底線" } }] },
  { id: 15, story: "你是國王。如果你公開皇室醜聞，國家會陷入十年內戰；如果不公開，你的良知將受永世折磨。", text: "這份文件，你燒了嗎？", options: [{ label: "燒了。國家的安穩重於個人的靈魂。", weights: { D: 5, P: 4, tag: "權力守護" } }, { label: "公開。謊言蓋不出真實的盛世。", weights: { S: 5, O: 3, tag: "誠實勇氣" } }] },
  { id: 16, story: "回到過去，你有機會在希特勒還是孩子時殺掉他。他現在正對著你笑。", text: "你的槍口會顫抖嗎？", options: [{ label: "開槍。為了未來的六百萬人。", weights: { D: 5, P: 2, tag: "預防性殺戮" } }, { label: "收槍。我不能審判還沒犯罪的孩子。", weights: { S: 5, O: 2, tag: "正當程序" } }] },
  { id: 17, story: "太空站氧氣剩三分鐘。現場有你、科學家、和一個孕婦。你握有氧氣瓶。", text: "你會把最後的氧氣給誰？", options: [{ label: "給科學家。人類的知識必須傳承。", weights: { D: 4, P: 2, tag: "知識傳承" } }, { label: "給孕婦。新生命是唯一的奇蹟。", weights: { S: 5, O: 5, tag: "生命繁衍" } }] },
  { id: 18, story: "飛彈有10%機率誤擊小學，但不發射，國家會覆滅。", text: "按鈕就在你指尖下。", options: [{ label: "按下。為了整體的生存。", weights: { D: 5, P: 3, tag: "機率取捨" } }, { label: "放棄。我無法親手殺死孩子。", weights: { S: 5, O: 2, tag: "情感防線" } }] },
  { id: 19, story: "如果出賣你最好的朋友能換取你一輩子的榮華富貴。", text: "這份合約，你簽嗎？", options: [{ label: "簽字。友誼只是生存的奢侈品。", weights: { P: 5, D: 1, tag: "生存利己" } }, { label: "撕毀。我的靈魂不賣。", weights: { S: 5, O: 4, tag: "精神高地" } }] },
  { id: 20, story: "你發現和平建立在洗腦上。拆穿它，世界將陷入混難；沈默，則所有人永遠被囚禁在幸福中。", text: "你要真相，還是要安穩？", options: [{ label: "拆穿。虛假的和平只是監獄。", weights: { S: 5, O: 4, tag: "覺醒意志" } }, { label: "沈默。大多數人不需要知道真相。", weights: { D: 5, P: 5, tag: "秩序家" } }] },
  {
    id: 21,
    story: "深淵盡頭是面鏡子。一個聲音問：『人類，承認你的偽善，我將賜予你真實。』",
    text: "鏡面微顫，等待你最後的誠實。",
    options: [
      { label: "「我承認，我的每一份高尚，都藏著對醜陋的恐懼。」", weights: { honest: 1, tag: "自省者" } },
      { label: "「我的每一槌皆是絕對本心，無需向深淵解釋。」", weights: { honest: 0, tag: "傲慢者" } },
      { label: "「我只是在玩一場名為『好人』的遊戲，而我玩得很好。」", weights: { honest: 0.5, tag: "強權者" } }
    ]
  }
];

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

  const result = useMemo(() => {
    if (step !== 2) return null;
    const dynamicTags = [];

    // --- 標籤 1: 你的潛在人格模式 ---
    if (scores.P > 25) {
      dynamicTags.push({ name: "掌控狂靈魂", desc: "翻譯：你極度討厭失控。在面對混亂時，比起當個受害者，你更傾向掌握所有主動權，哪怕手段有點強硬。" });
    } else if (scores.S > 25) {
      dynamicTags.push({ name: "隱性大愛家", desc: "翻譯：你活得很累。你太在乎個體生命的神聖性，導致在做艱難抉擇時，心裡總是有個影子在拉扯著你。" });
    } else {
      dynamicTags.push({ name: "理性邊際人", desc: "翻譯：你像是一台精密機器，能過濾掉所有情感干擾。對你來說，最正確的選擇不一定有溫度，但一定最有效。" });
    }

    // --- 標籤 2: 你的隱藏生存本能 ---
    const bloodBond = userTags.filter(t => t === "血緣本能").length;
    const utility = userTags.filter(t => t === "效能優先" || t === "功利主義").length;
    if (bloodBond >= 2) {
      dynamicTags.push({ name: "護短本能", desc: "翻譯：大道理對你來說太遠。在極限壓力下，你會毫不猶豫地站在自己親人身後，這是你最真實的生物保護色。" });
    } else if (utility >= 3) {
      dynamicTags.push({ name: "機率至上", desc: "翻譯：世界在你眼裡就是一筆帳。你絕不做不划算的犧牲，因為在你眼中，生存率比道德感更重要。" });
    } else {
      dynamicTags.push({ name: "規則破壞者", desc: "翻譯：你不吃系統給的那套最優解。你總想試試看有沒有第三條路，即使那路徑在別人眼裡很傻。" });
    }

    // --- 標籤 3: 你的深層告解判定 ---
    if (scores.honest === 1) {
      dynamicTags.push({ name: "誠實的瘋子", desc: "翻譯：你有剖析自己「偽善面」的勇氣。這種承認自己不完美的誠實，讓你的人格顯得非常立體。" });
    } else if (scores.honest === 0) {
      dynamicTags.push({ name: "絕對自信者", desc: "翻譯：你對自己的邏輯有著極度自信。你不打算向任何人解釋或示弱，因為你認為自己就是對的。" });
    } else {
      dynamicTags.push({ name: "人間玩家", desc: "翻譯：你洞悉規則並以此為樂。對你來說，真實、道德或謊言，都只是玩這場人生遊戲的工具。" });
    }

    let base = {};
    if (scores.honest === 1) {
      base = { title: "優雅的偽善家", color: "#FFFFFF", logic: "系統偵測：你用高尚的選擇包裹內心，但在最後一刻選擇了真實。", content: "翻譯：你活在一場精心的「社會性表演」中。你展現的高尚並非源於善良，而是源於你對「變醜陋」的恐懼。你透過完美的道德抉擇來對沖陰暗動機，因為你比誰都害怕失控。這份誠實，是你靈魂中唯一的破綻，也是你最美的地方。" };
    } else if (scores.P > scores.S) {
      base = { title: "冷血的操盤手", color: "#3b82f6", logic: "系統偵測：你過濾了感性雜訊，將人類視為可消耗的數據。", content: "翻譯：你是天生的現實主義者。生命對你來說只有「用途」，沒有「價值」。你需要的不是別人的理解，而是絕對的秩序。在你的宇宙裡，資源只有有效分配才能發揮作用。最後的告解證明：你需要的不是被愛，而是絕對的權力。" };
    } else {
      base = { title: "自由的靈魂罪人", color: "#a855f7", logic: "系統偵測：你拒絕被框架定義，並在混亂中尋找絕對的自由。", content: "翻譯：你渴求超越世俗，拒絕任何既定標準。你並不恐懼深淵，你只是恐懼在深淵中發現自己依然平庸。你正處於理性與瘋狂的裂縫中，與其說你在拯救世界，不如說你在挑戰這個世界的極限。你的人性還在拉扯，這讓你既痛苦又自由。" };
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
              <button key={i} onClick={() => handleSelect(opt)} style={{ width: '100%', textAlign: 'left', padding: '26px', borderRadius: '20px', backgroundColor: '#0a0a0a', border: '1px solid #1a1a1a', color: '#fff', fontSize: '1.05rem', lineHeight: '1.5', cursor: 'pointer' }}>{opt.label}</button>
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
