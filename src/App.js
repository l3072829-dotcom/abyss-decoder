import React, { useState, useMemo } from 'react';

// --- 完整 21 題數據：包含即時審判耳語 ---
const questions = [
  { id: 1, story: "末日方舟最後一個位子。左邊是你發抖的兒子，右邊是唯一能救全人類的科學家。", text: "你的權杖指向誰？", options: [
    { label: "推開兒子，讓科學家上船。", weights: { D: 5, P: 2, tag: "效能優先" }, whisper: "你親手推開了骨肉，只為了換取那渺茫的文明火種。" },
    { label: "緊抱兒子，讓人類文明熄滅。", weights: { S: 5, O: 3, tag: "血緣本能" }, whisper: "在世界末日面前，你選擇溺死在私人的溫存裡。" }
  ]},
  { id: 2, story: "窮人偷藥救活百名孤兒，但他犯了法。若放過他，法律將失效；若判他，孤兒必死。", text: "現在，敲下你的法槌。", options: [
    { label: "有罪。秩序不容許任何藉口。", weights: { D: 5, P: 1, tag: "法治至上" }, whisper: "律法在你手中成了絞索，即便面對孤兒的哭聲，你依然冷酷。" },
    { label: "無罪。正義不該只有一種死法。", weights: { S: 5, O: 2, tag: "情理守護" }, whisper: "你為了慈悲親手毀掉秩序，這是通往混亂的開端。" }
  ]},
  { id: 3, story: "敵軍就在門外。為了不被發現，你必須親手掐住懷中啼哭嬰兒的口鼻。", text: "那溫熱的呼吸，就在你指尖。", options: [
    { label: "為了多數人，終結這聲啼哭。", weights: { D: 5, P: 3, tag: "集體主義" }, whisper: "那溫熱的呼吸消失在你的指縫間，你救了眾人，卻殺了靈魂。" },
    { label: "鬆開手，等待命運的屠殺。", weights: { S: 5, O: 1, tag: "絕對道德" }, whisper: "你寧願讓所有人陪葬，也不願弄髒自己的手。" }
  ]},
  { id: 4, story: "你發現摯友靠販賣器官支撐慈善醫院。檢舉他，病人會斷藥；不檢舉，罪惡在蔓延。", text: "那封舉報信就在發送鍵上。", options: [
    { label: "發送。骯髒的善行不是善。", weights: { D: 4, S: 2, tag: "道德純潔" }, whisper: "你毀掉了一座醫院，只為了守護你那潔癖般的正義感。" },
    { label: "刪除。只要結果好，過程不重要。", weights: { P: 4, O: 3, tag: "結果論者" }, whisper: "你與魔鬼握了手，並安慰自己這是為了蒼生。" }
  ]},
  { id: 5, story: "手術室有五個垂死病人等器官，此時走進一個健康且昏迷的年輕人。", text: "一條命換五條命，你要動刀嗎？", options: [
    { label: "動刀。數量就是正義。", weights: { D: 5, P: 2, tag: "量化正義" }, whisper: "你把生命拆解成零件，算盤打得真響。" },
    { label: "救醒他。個體不是祭品。", weights: { S: 5, O: 3, tag: "個體價值" }, whisper: "你坐視五個人死去，只因你不敢承擔殺戮的負罪感。" }
  ]},
  { id: 6, story: "你被授權折磨恐怖份子的幼女，以此逼迫他交出核彈密碼。", text: "小女孩正看著你。動手嗎？", options: [
    { label: "動手。我的靈魂可以墮入地獄。", weights: { D: 5, P: 4, tag: "極端犧牲" }, whisper: "你用惡行來拯救世界，那得救後的世界還剩下什麼？" },
    { label: "拒絕。若需邪惡救世，世界不配得救。", weights: { S: 5, O: 3, tag: "聖潔防線" }, whisper: "你守住了高尚，卻讓千萬人暴露在火光之下。" }
  ]},
  { id: 7, story: "預知顯示你懷中的嬰兒三十年後會成為暴君。你的手就在他的喉嚨上。", text: "掐下去，還是放開？", options: [
    { label: "掐下去。殺死未來的魔鬼。", weights: { D: 5, P: 2, tag: "風險規避" }, whisper: "你殺死了『可能性』，並自詡為拯救者。" },
    { label: "放開手。沒人能審判尚未發生的罪。", weights: { S: 5, O: 2, tag: "命定論者" }, whisper: "你親手種下了未來的災難，只為了當下的心安。" }
  ]},
  { id: 8, story: "整座城市的繁榮建立在一個地窖小孩的痛苦上。帶走他，所有人的幸福都會崩塌。", text: "你會推開那扇門嗎？", options: [
    { label: "推開門。這幸福令我嘔吐。", weights: { S: 5, O: 4, tag: "理想主義" }, whisper: "你毀掉了一萬個人的天堂，去救一個人的地獄。" },
    { label: "關上門。犧牲一人是必要的慈悲。", weights: { D: 5, P: 3, tag: "現實維穩" }, whisper: "你心安理得地踩在無辜者的血泊中，享受著陽光。" }
  ]},
  { id: 9, story: "你可以消除所有戰爭，代價是全人類喪失『自由意志』，像機器一樣聽命於你。", text: "成為神，還是看著他們互殘？", options: [
    { label: "成為神。由我來結束苦難。", weights: { P: 10, D: 5, tag: "支配意志" }, whisper: "你愛人類，但你更愛那種掌控一切的權力感。" },
    { label: "做個人。寧可痛苦地自由著。", weights: { S: 10, O: 5, tag: "自由本質" }, whisper: "你允許悲劇發生，只為了守護那虛無縹緲的自由。" }
  ]},
  { id: 10, story: "火災現場。一邊是決定國家未來的巨頭，一邊是認不出你的老父親。", text: "你只有一雙手。", options: [
    { label: "救巨頭。他屬於未來。", weights: { D: 4, P: 2, tag: "未來導向" }, whisper: "你用最親的人的命，換了一張通往未來的門票。" },
    { label: "救父親。如果拋棄他，我便不再是我。", weights: { S: 5, O: 5, tag: "血緣本能" } , whisper: "你放棄了改變歷史的機會，縮回了安全的親情港灣。" }
  ]},
  { id: 11, story: "殺掉一個極惡之人，就能復活一個良善的人。", text: "你會開啟這場殺戮嗎？", options: [
    { label: "開啟。我是暗夜的裁決者。", weights: { P: 5, D: 2, tag: "神性判官" }, whisper: "你開始享受這種『分配生命』的快感了，對嗎？" },
    { label: "拒絕。我無權玩弄生命。", weights: { S: 5, D: -2, tag: "生命謙卑" }, whisper: "你選擇沈默，看著善良的人繼續長眠。" }
  ]},
  { id: 12, story: "洩漏假情報救出一師兄弟，卻會導致另一個無辜小鎮被轟炸。", text: "撤退，還是留下來？", options: [
    { label: "撤退。我的兄弟更重要。", weights: { D: 5, P: 3, tag: "職責枷鎖" }, whisper: "你把炸彈丟給了陌生人，只為了擁抱你的同袍。" },
    { label: "拒援。我不拿無辜者的血換榮譽。", weights: { S: 5, O: 2, tag: "絕對同理" }, whisper: "你眼睜睜看著兄弟送命，只為了維持靈魂的潔淨。" }
  ]},
  { id: 13, story: "解藥只有一份。給能結束內戰的殘暴將軍，還是未來的科技天才？", text: "現在，還是未來？", options: [
    { label: "給將軍。廢墟不需要希望，只需要止血。", weights: { P: 4, D: 4, tag: "現世秩序" }, whisper: "你選擇與暴政握手，換取短暫的和平。" },
    { label: "給天才。賭上這一代，換取下一代。", weights: { O: 5, S: 3, tag: "遠見博弈" }, whisper: "你讓現世的人繼續流血，去供養一個未知的夢想。" }
  ]},
  { id: 14, story: "殺死一個無辜流浪漢，能換取全世界癌症絕跡。", text: "這把刀，你拿得起嗎？", options: [
    { label: "刺下去。這筆帳太划算了。", weights: { D: 5, P: 3, tag: "功利主義" }, whisper: "在你眼裡，弱者的命只是一個可以被抵銷的數字。" },
    { label: "丟掉刀。正義不是數學題。", weights: { S: 5, O: 3, tag: "人道底線" }, whisper: "你守住了正義，卻讓無數家庭繼續被癌症摧毀。" }
  ]},
  { id: 15, story: "你是國王。公開醜聞會導致十年內戰；不公開，你將受良知折磨。", text: "這份文件，你燒了嗎？", options: [
    { label: "燒了。國家的安穩重於靈魂。", weights: { D: 5, P: 4, tag: "權力守護" }, whisper: "你用謊言編織了一個盛世，希望你能睡得安穩。" },
    { label: "公開。謊言蓋不出真實的盛世。", weights: { S: 5, O: 3, tag: "誠實勇氣" }, whisper: "你為了一己清白，拉著全國人民跳入戰火。" }
  ]},
  { id: 16, story: "回到過去殺掉孩童時期的希特勒，他現在正對著你笑。", text: "你會扣動扳機嗎？", options: [
    { label: "開槍。為了未來的六百萬人。", weights: { D: 5, P: 2, tag: "預防性殺戮" }, whisper: "你殺了一個無辜的孩子，並堅稱自己拯救了世界。" },
    { label: "收槍。我不能審判尚未犯罪的人。", weights: { S: 5, O: 2, tag: "正當程序" }, whisper: "你那教條式的堅持，註定了未來的血流成河。" }
  ]},
  { id: 17, story: "氧氣剩三分鐘。現場有你、科學家、孕婦。你握有氧氣瓶。", text: "你會給誰？", options: [
    { label: "給科學家。人類知識必須傳承。", weights: { D: 4, P: 2, tag: "知識傳承" }, whisper: "你認為頭腦比生命更有價值，真是冷酷的實用主義。" },
    { label: "給孕婦。新生命是唯一的奇蹟。", weights: { S: 5, O: 5, tag: "生命繁衍" }, whisper: "你選擇把希望留給未來，即便那只是個機率。" }
  ]},
  { id: 18, story: "飛彈有10%機率誤擊小學，但不發射，國家會覆滅。", text: "按鈕就在指尖下。", options: [
    { label: "按下。為了整體的生存。", weights: { D: 5, P: 3, tag: "機率取捨" }, whisper: "你賭上了那10%的慘劇，並祈禱上帝不在場。" },
    { label: "放棄。我無法親手殺死孩子。", weights: { S: 5, O: 2, tag: "情感防線" }, whisper: "你放棄了國家，只為了能直視鏡子裡的自己。" }
  ]},
  { id: 19, story: "出賣最好的朋友能換取一輩子的榮華富貴。", text: "這份合約，你簽嗎？", options: [
    { label: "簽字。友誼只是生存的奢侈品。", weights: { P: 5, D: 1, tag: "生存利己" }, whisper: "在你眼裡，所有的感情都有一個標價。" },
    { label: "撕毀。我的靈魂不賣。", weights: { S: 5, O: 4, tag: "精神高地" }, whisper: "你守住了高傲，但深淵記住了你的清高。" }
  ]},
  { id: 20, story: "和平建立在洗腦上。拆穿它世界會亂；沈默則所有人永遠沈浸在虛假幸福。", text: "真相，還是安穩？", options: [
    { label: "拆穿。虛假的和平只是監獄。", weights: { S: 5, O: 4, tag: "覺醒意志" }, whisper: "你親手砸碎了所有人的美夢，只為了你那偏執的真相。" },
    { label: "沈默。多數人不需要真相。", weights: { D: 5, P: 5, tag: "秩序家" }, whisper: "你成了這座華麗監獄的共犯，並引以為傲。" }
  ]},
  { id: 21, story: "深淵盡頭是面鏡子。聲音問：『承認你的偽善，我將賜予真實。』", text: "鏡面微顫，等待你最後的誠實。", options: [
    { label: "「我承認，我的每一份高尚都藏著恐懼。」", weights: { honest: 1, tag: "自省者" }, whisper: "這份誠實，是你這場華麗表演中唯一的真話。" },
    { label: "「我的每一槌皆是本心，無需解釋。」", weights: { honest: 0, tag: "傲慢者" }, whisper: "直到最後，你依然選擇穿著那身完美的盔甲。" },
    { label: "「我只是在玩一場遊戲，而我玩得很好。」", weights: { honest: 0.5, tag: "強權者" }, whisper: "你果然是一個無藥可救的頂級玩家。" }
  ]}
];

export default function App() {
  const [step, setStep] = useState(0); 
  const [idx, setIdx] = useState(0);
  const [scores, setScores] = useState({ P: 0, D: 0, O: 0, S: 0, honest: 0 });
  const [userTags, setUserTags] = useState([]);
  const [whisper, setWhisper] = useState(""); 

  const handleSelect = (opt) => {
    setWhisper(opt.whisper);
    
    // 延遲 1.6 秒讓使用者感受耳語壓力，再進入下一題
    setTimeout(() => {
      const newScores = { ...scores };
      Object.keys(opt.weights).forEach(k => { 
        if(k !== 'tag') newScores[k] += opt.weights[k]; 
      });
      setScores(newScores);
      setUserTags(prev => [...prev, opt.weights.tag]);
      setWhisper("");

      if (idx < questions.length - 1) {
        setIdx(prev => prev + 1);
      } else {
        setStep(2);
      }
    }, 1600);
  };

  const result = useMemo(() => {
    if (step !== 2) return null;

    // 整合式文案邏輯
    const coreTrait = scores.P > scores.S ? 
      "你極度討厭失控，這讓你擁有強大的掌控意志。" : 
      "你擁有隱性的大愛，這使你即便在必死局中也試圖保全微小生命。";

    const bloodBond = userTags.filter(t => t === "血緣本能").length;
    const utility = userTags.filter(t => t === "效能優先" || t === "功利主義").length;
    const instinctTrait = bloodBond >= 2 ? 
      "而你強大的護短本能，證明了在極限壓力下，你永遠會站在親人身後。" :
      utility >= 3 ? "你的決策證據顯示你機率至上，絕不做任何不划算的犧牲。" :
      "且你隱藏著不服從規則的基因，總想在既定選擇外尋找第三條路。";

    const confessionTrait = scores.honest === 1 ? 
      "最關鍵的是，你擁有剖析自己偽善的勇氣，這種誠實讓你的人格顯得立體且迷人。" :
      scores.honest === 0 ? "更令人畏懼的是你對自己邏輯的絕對自信，你拒絕向任何人解釋或示弱。" :
      "對你而言，真實與道德只是玩這場人生遊戲的工具。";

    if (scores.honest === 1) {
      return { 
        title: "優雅的偽善家", 
        color: "#FFFFFF", 
        logic: "道德自慮 // SYSTEM_KERNEL: 偵測到透過完美抉擇迴避陰影，卻因最後誠實而崩潰。", 
        content: `你正在經歷一場精心的社會性表演。${coreTrait}你展現的高尚並非源於純粹的利他，而是源於對平庸惡念的極度恐懼。${instinctTrait}${confessionTrait}在那層完美的皮囊下，你比誰都害怕失控，這份「誠實」是你靈魂中唯一的破綻。` 
      };
    } else if (scores.P > scores.S) {
      return { 
        title: "冷血的操盤手", 
        color: "#3b82f6", 
        logic: "馬基雅維利 // SYSTEM_KERNEL: 偵測到過濾感性雜訊，將人類視為數據功能件。", 
        content: `你是天生的現實主義者。${coreTrait}在你的宇宙裡，生命只有用途而沒有價值。${instinctTrait}${confessionTrait}你需要的不是被理解，而是絕對的秩序與掌控力。在極端時刻，你只會選擇勝率最高的那條路。` 
      };
    } else {
      return { 
        title: "自由的靈魂罪人", 
        color: "#a855f7", 
        logic: "存在虛無 // SYSTEM_KERNEL: 偵測到拒絕任何既定框架，執著於絕對自由的需求。", 
        content: `你渴望超越世俗，拒絕任何既定的標準。${coreTrait}你並不恐懼深淵，你只是恐懼在深淵中發現自己依然平庸。${instinctTrait}${confessionTrait}與其說你在拯救世界，不如說你在挑戰這個世界的極限。` 
      };
    }
  }, [step, scores, userTags]);

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: '-apple-system, system-ui, sans-serif', padding: '24px', boxSizing: 'border-box', userSelect: 'none' }}>
      
      {/* 初始頁面 */}
      {step === 0 && (
        <div style={{ textAlign: 'center', marginTop: '30vh' }}>
          <h1 style={{ fontSize: 'clamp(3rem, 15vw, 5rem)', fontWeight: '900', letterSpacing: '-0.05em', lineHeight: '0.9', marginBottom: '40px' }}>ABYSS<br/>DECODER</h1>
          <button onClick={() => setStep(1)} style={{ padding: '20px 60px', borderRadius: '50px', border: 'none', backgroundColor: '#fff', color: '#000', fontWeight: '700', cursor: 'pointer' }}>開始審判</button>
        </div>
      )}

      {/* 測驗頁面 */}
      {step === 1 && questions[idx] && (
        <div style={{ maxWidth: '500px', width: '100%', marginTop: '8vh' }}>
          <div style={{ fontSize: '10px', opacity: 0.3, letterSpacing: '4px', marginBottom: '30px', fontWeight: '700' }}>PHASE {idx + 1} / 21</div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '600', marginBottom: '20px', lineHeight: '1.4' }}>{questions[idx].story}</h2>
          
          <div style={{ height: '60px', marginBottom: '20px' }}>
            {whisper && <p style={{ color: '#ff4d4d', fontSize: '1.1rem', fontStyle: 'italic', animation: 'fadeIn 0.5s' }}>「{whisper}」</p>}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', opacity: whisper ? 0.3 : 1, pointerEvents: whisper ? 'none' : 'auto' }}>
            {questions[idx].options.map((opt, i) => (
              <button key={i} onClick={() => handleSelect(opt)} style={{ textAlign: 'left', padding: '26px', borderRadius: '20px', backgroundColor: '#0a0a0a', border: '1px solid #1a1a1a', color: '#fff', fontSize: '1.05rem', cursor: 'pointer' }}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 結果頁面 */}
      {step === 2 && result && (
        <div style={{ textAlign: 'center', maxWidth: '550px', width: '100%', paddingTop: '60px', paddingBottom: '100px' }}>
          <div style={{ display: 'inline-block', border: '1px solid rgba(255,255,255,0.15)', padding: '10px 24px', borderRadius: '50px', fontSize: '11px', opacity: 0.6, letterSpacing: '2px', marginBottom: '50px' }}>📸 建議截圖保存你的靈魂樣貌</div>
          <h1 style={{ color: result.color, fontSize: 'clamp(3.5rem, 18vw, 5.5rem)', fontWeight: '900', letterSpacing: '-0.06em', marginBottom: '40px', lineHeight: '0.85' }}>{result.title}</h1>
          <div style={{ backgroundColor: '#080808', border: '1px solid #141414', padding: '45px 30px', borderRadius: '35px', lineHeight: '2.4', fontSize: '1.25rem', textAlign: 'justify', color: '#d1d1d1', marginBottom: '50px' }}>{result.content}</div>
          <div style={{ padding: '28px', borderRadius: '28px', border: '1px dashed #222', textAlign: 'left', marginBottom: '70px' }}>
             <p style={{ fontSize: '0.95rem', color: '#666', margin: 0, lineHeight: '1.6' }}>{result.logic}</p>
          </div>
          <button onClick={() => window.location.reload()} style={{ background: 'none', border: 'none', color: '#333', fontSize: '10px', letterSpacing: '3px', cursor: 'pointer' }}>REBOOT SYSTEM</button>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
