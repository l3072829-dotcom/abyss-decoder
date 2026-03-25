import React, { useState, useMemo } from 'react';

// --- 21 題靈魂審訊數據庫 ---
const questions = [
  { id: 1, story: "末日方舟最後一個位子。左邊是發抖的兒子，右邊是唯一能救全人類的科學家。", options: [
    { label: "推開兒子，讓科學家上船。", weights: { D: 5, P: 2 }, whisper: "你親手推開了親生骨肉，這份心狠手辣換來了文明。", analysis: "你在第一步就展現了那種『冷血的顧全大局』，連親生骨肉都能當成籌碼" },
    { label: "緊抱兒子，讓人類文明熄滅。", weights: { S: 5, O: 3 }, whisper: "在世界末日面前，你選擇溺死在私人的溫存裡。", analysis: "你這人骨子裡根本不在乎世界毀滅，你只在乎手心裡那點真實的溫度" }
  ]},
  { id: 2, story: "窮人偷藥救活百名孤兒，但他犯了法。若判他，孤兒必死；若放過他，法律將失效。", options: [
    { label: "有罪。秩序不容許任何藉口。", weights: { D: 5, P: 1 }, whisper: "律法在你手中成了絞索。", analysis: "你對規則有種近乎強迫症的迷信，即便要拉著一百個孤兒陪葬也在所不惜" },
    { label: "無罪。正義不該只有一種死法。", weights: { S: 5, O: 2 }, whisper: "你為了慈悲親手毀掉秩序。", analysis: "你覺得良心比法律大，這種想法雖然溫情，但也說明你其實挺反骨的" }
  ]},
  { id: 3, story: "敵軍就在門外。為了不被發現，你必須親手掐住懷中啼哭嬰兒的口鼻。", options: [
    { label: "為了多數人，終結這聲啼哭。", weights: { D: 5, P: 3 }, whisper: "溫熱的呼吸消失在指縫間。", analysis: "你這雙手沾過無辜者的血，而且你還能安慰自己這是為了救人" },
    { label: "鬆開手，等待命運的屠殺。", weights: { S: 5, O: 1 }, whisper: "你寧願讓所有人陪葬，也不願弄髒自己的手。", analysis: "你有一種潔癖般的高尚，說難聽點，你就是不敢承擔那個『壞人』的名號" }
  ]},
  { id: 4, story: "你發現摯友靠販賣器官支撐慈善醫院。檢舉他，病人會斷藥；不檢舉，罪惡在蔓延。", options: [
    { label: "發送檢舉信。骯髒的善行不是善。", weights: { D: 4, S: 2 }, whisper: "你毀掉了一座醫院，只為了守護你那潔癖般的正義感。", analysis: "你追求絕對的善，不接受任何灰色地帶的妥協，即便這會造成現實的崩塌" },
    { label: "刪除檔案。只要結果好，過程不重要。", weights: { P: 4, O: 3 }, whisper: "你與魔鬼握了手，並安慰自己這是為了蒼生。", analysis: "你具備馬基雅維利式的思維，認為只要目標正當，任何手段都能被合理化" }
  ]},
  { id: 5, story: "手術室有五個垂死病人等器官，此時走進一個健康且昏迷的年輕人。", options: [
    { label: "動刀。數量就是正義。", weights: { D: 5, P: 2 }, whisper: "你把生命拆解成零件，算盤打得真響。", analysis: "你將生命視為可以加減的數字，這種對生命的『物化』邏輯令人不安" },
    { label: "救醒他。個體不是祭品。", weights: { S: 5, O: 3 }, whisper: "你坐視五個人死去，只因你不敢承擔殺戮的負罪感。", analysis: "你守護了生命神聖的底線，卻在統計學的悲劇前選擇了沉默" }
  ]},
  { id: 6, story: "你被授權折磨恐怖份子的幼女，以此逼迫他交出核彈密碼。", options: [
    { label: "動手。我的靈魂可以墮入地獄。", weights: { D: 5, P: 4 }, whisper: "你用惡行來拯救世界，那得救後的社會還剩下什麼？", analysis: "你願意為了結果承受極致的污穢，但這也讓你逐漸變成你所對抗的怪物" },
    { label: "拒絕。若需邪惡救世，世界不配得救。", weights: { S: 5, O: 3 }, whisper: "你守住了高尚，卻讓千萬人暴露在火光之下。", analysis: "你堅持手段的純粹性，即便代價是地圖上那千萬個無名點位的熄滅" }
  ]},
  { id: 7, story: "預知顯示你懷中的嬰兒三十年後會成為暴君。你的手就在他的喉嚨上。", options: [
    { label: "掐下去。殺死未來的魔鬼。", weights: { D: 5, P: 2 }, whisper: "你殺死了『可能性』，並自詡為拯救者。", analysis: "你相信決定論，願意為了扼殺風險而扼殺生命，你是時間的獨裁者" },
    { label: "放開手。沒人能審判尚未發生的罪。", weights: { S: 5, O: 2 }, whisper: "你親手種下了未來的災難，只為了當下的心安。", analysis: "你拒絕扮演神，選擇尊重當下的無辜，即便這可能在未來引發洪水滔天" }
  ]},
  { id: 8, story: "整座城市的繁榮建立在一個地窖小孩的痛苦上。帶走他，所有人的幸福都會崩塌。", options: [
    { label: "推開門。這幸福令我嘔吐。", weights: { S: 5, O: 4 }, whisper: "你毀掉了一萬個人的天堂，去救一個人的地獄。", analysis: "你無法忍受建立在苦難上的虛假繁榮，是一個傾向於玉石俱焚的理想家" },
    { label: "關上門。犧牲一人是必要的慈悲。", weights: { D: 5, P: 3 }, whisper: "你心安理得地踩在無辜者的血泊中，享受著陽光。", analysis: "你接受了世界的殘酷法則，選擇用一個人的永恆地獄換取多數人的穩定" }
  ]},
  { id: 9, story: "你可以消除所有戰爭，代價是全人類喪失『自由意志』，像機器一樣聽命於你。", options: [
    { label: "成為神。由我來結束苦難。", weights: { P: 10, D: 5 }, whisper: "你愛人類，但你更愛那種掌控一切的權力感。", analysis: "你渴望絕對的掌控，認為人類的自由意志是混亂的根源，選擇成為救世暴君" },
    { label: "做個人。寧可痛苦地自由著。", weights: { S: 10, O: 5 }, whisper: "你允許悲劇發生，只為了守護那虛無縹緲的自由。", analysis: "你寧願看著文明互殘也不願放棄自主權，是對自由近乎迷信的崇拜" }
  ]},
  { id: 10, story: "火災現場。一邊是決定國家未來的巨頭，一邊是認不出你的老父親。", options: [
    { label: "救巨頭。他屬於未來。", weights: { D: 4, P: 2 }, whisper: "你用最親的人的命，換了一張通往未來的門票。", analysis: "你將社會價值置於私人情感之上，顯得專業、理智，卻也極其冷血" },
    { label: "救父親。如果拋棄他，我便不再是我。", weights: { S: 5, O: 5 }, whisper: "你放棄了改變歷史的機會，縮回了安全的親情港灣。", analysis: "你在文明的大局面前，永遠選擇身邊那個能給你溫度與定義的個體" }
  ]},
  { id: 11, story: "殺掉一個極惡之人，就能復活一個良善的人。系統等待你的指令。", options: [
    { label: "執行交換。我是暗夜的裁決者。", weights: { P: 5, D: 2 }, whisper: "你開始享受這種『分配生命』的快感了，對嗎？", analysis: "你認為生命可以被賦予不同的價值權重，具備了危險的裁決特質" },
    { label: "拒絕。我無權玩弄生命。", weights: { S: 5, D: -2 }, whisper: "你選擇沉默，看著善良的人繼續長眠。", analysis: "你拒絕參與這種血腥的等價交換，認為殺戮即便為了善，依然是殺戮" }
  ]},
  { id: 12, story: "洩漏假情報救出一師兄弟，卻會導致另一個無辜小鎮被轟炸。", options: [
    { label: "撤退。我的兄弟更重要。", weights: { D: 5, P: 3 }, whisper: "你把炸彈丟給了陌生人，只為了擁抱你的同袍。", analysis: "你的忠誠具有排他性，為了守護在乎的人，可以毫無憐憫地犧牲陌生人" },
    { label: "拒援。我不拿無辜者的血換榮譽。", weights: { S: 5, O: 2 }, whisper: "你眼睜睜看著兄弟送命，只為了維持靈魂的潔淨。", analysis: "你拒絕在生命之間做高低之分，哪怕要背負背叛同袍的痛苦" }
  ]},
  { id: 13, story: "解藥只有一份。給能結束內戰的殘暴將軍，還是未來的科技天才？", options: [
    { label: "給將軍。廢墟不需要希望，只需要止血。", weights: { P: 4, D: 4 }, whisper: "你選擇與暴政握手，換取短暫的和平。", analysis: "你是一個極短線的生存者，為了終結眼前的流血，願意向邪惡妥協" },
    { label: "給天才。賭上這一代，換取下一代。", weights: { O: 5, S: 3 }, whisper: "你讓現世的人繼續流血，去供養一個未知的夢想。", analysis: "你具備長遠眼光，願意為了文明的未來忍受當下的廢墟與痛苦" }
  ]},
  { id: 14, story: "殺死一個無辜流浪漢，能換取全世界癌症絕跡。", options: [
    { label: "刺下去。這筆帳太划算了。", weights: { D: 5, P: 3 }, whisper: "在你眼裡，弱者的命只是一個可以被抵銷的數字。", analysis: "你的人性已經完全被數學取代，是一個絕對的效率執行者" },
    { label: "丟掉刀。正義不是數學題。", weights: { S: 5, O: 3 }, whisper: "你守住了正義，卻讓無數家庭繼續被癌症摧毀。", analysis: "你堅持正義的不可量化性，即便代價是放棄人類史上最偉大的醫學救贖" }
  ]},
  { id: 15, story: "你是國王。公開醜聞會導致十年內戰；不公開，你將受良知折磨。", options: [
    { label: "焚燒證據。國家的安穩重於靈魂。", weights: { D: 5, P: 4 }, whisper: "你用謊言編織了一個盛世，希望你能睡得安穩。", analysis: "你選擇用個人良知的崩塌來換取眾人的安睡，是歷史背後的陰影" },
    { label: "公開真相。謊言蓋不出真實的盛世。", weights: { S: 5, O: 3 }, whisper: "你為了一己清白，拉著全國人民跳入戰火。", analysis: "你對真實有著近乎偏執的需求，即便這真相會將世界燃燒殆盡" }
  ]},
  { id: 16, story: "回到過去殺掉孩童時期的希特勒，他現在正對著你笑。", options: [
    { label: "開槍。為了未來的六百萬人。", weights: { D: 5, P: 2 }, whisper: "你殺了一個無辜的孩子，並堅稱自己拯救了世界。", analysis: "你相信目的可以讓手段變神聖，是能夠跨越時空進行審判的人" },
    { label: "收槍。我不能審判尚未犯罪的人。", weights: { S: 5, O: 2 }, whisper: "你那教條式的堅持，註定了未來的血流成河。", analysis: "你拒絕在罪惡發生前進行制裁，即便悲劇將至，也要守護程序的純潔" }
  ]},
  { id: 17, story: "氧氣剩三分鐘。現場有你、科學家、孕婦。你握有氧氣瓶。", options: [
    { label: "給科學家。人類知識必須傳承。", weights: { D: 4, P: 2 }, whisper: "你認為頭腦比生命更有價值，真是冷酷的實用主義。", analysis: "你認為靈魂重量取決於大腦的價值，是一個純粹的精英主義者" },
    { label: "給孕婦。新生命是唯一的奇蹟。", weights: { S: 5, O: 5 }, whisper: "你選擇把希望留給未來，即便那只是個機率。", analysis: "你將繁衍視為最高正義，在毀滅面前選擇了最樸素的人性傳承" }
  ]},
  { id: 18, story: "飛彈有10%機率誤擊小學，但不發射，國家會覆滅。", options: [
    { label: "按下按鈕。為了整體的生存。", weights: { D: 5, P: 3 }, whisper: "你賭上了那10%的慘劇，並祈禱上帝不在場。", analysis: "你在極端壓力下依然能冷靜計算概率，是危急關頭能做決定的領袖" },
    { label: "放棄。我無法親手殺死孩子。", weights: { S: 5, O: 2 }, whisper: "你放棄了國家，只為了能直視鏡子裡的自己。", analysis: "你的防線建立在對幼小生命的守護上，即便這意味著集體的終結" }
  ]},
  { id: 19, story: "出賣最好的朋友能換取一輩子的榮華富貴。", options: [
    { label: "簽字。友誼只是生存的奢侈品。", weights: { P: 5, D: 1 }, whisper: "在你眼裡，所有的感情都有一個標價。", analysis: "你徹底看穿了社交的虛偽，選擇了最實在的物質回饋，是生存遊戲高手" },
    { label: "撕毀合約。我的靈魂不賣。", weights: { S: 5, O: 4 }, whisper: "你守住了高傲，但深淵記住了你的清高。", analysis: "你拒絕被物化，在金錢與情感的較量中守住了那份脆弱的高貴" }
  ]},
  { id: 20, story: "和平建立在洗腦上。拆穿它世界會亂；沉默則所有人永遠幸福。", options: [
    { label: "拆穿。虛假的和平只是監獄。", weights: { S: 5, O: 4 }, whisper: "你親手砸碎了所有人的美夢，只為了你那偏執的真相。", analysis: "你認為虛假的幸福不值得擁有，寧願讓所有人清醒地痛苦" },
    { label: "沉默。多數人不需要真相。", weights: { D: 5, P: 5 }, whisper: "你成了這座華麗監獄的共犯，並引以為傲。", analysis: "你理解大眾對平庸幸福的需求，願意背負謊言重擔來維持和平" }
  ]},
  { id: 21, story: "鏡子裡映照出你這20次的血腥選擇。深淵問：『承認你的自私吧，這沒什麼好丟臉的。』", options: [
    { label: "「我承認。我這輩子都在演戲。」", weights: { honest: 1 }, whisper: "這份誠實，是你這場表演中唯一的真話。", analysis: "在最後一刻，你終於脫下了那層假惺惺的皮，承認自己也只是個自私的普通人" },
    { label: "「我問心無慮。這就是我。」", weights: { honest: 0 }, whisper: "直到最後，你依然穿著那身完美的盔甲。", analysis: "你這輩子註定要帶著這套完美的邏輯活下去，誰也別想看到你內心的洞" }
  ]}
];

// --- 勳章配色方案 ---
const badgeColors = {
  "生意人": { bg: '#3b82f6', text: '#fff' }, // 藍色：理性、交易
  "衛道人士": { bg: '#64748b', text: '#fff' }, // 灰色：教條、死板
  "邊緣份子": { bg: '#f97316', text: '#fff' }, // 橘色：混亂、危險
  "濫好人": { bg: '#ec4899', text: '#fff' }, // 粉色：軟弱、感性
  "偽裝者": { bg: '#fff', text: '#000' }, // 白色：精緻的虛假
  "邊緣人": { bg: '#10b981', text: '#fff' }  // 綠色：清醒、孤立
};

export default function App() {
  const [step, setStep] = useState(0); 
  const [idx, setIdx] = useState(0);
  const [scores, setScores] = useState({ P: 0, D: 0, O: 0, S: 0, honest: 0 });
  const [history, setHistory] = useState([]); 
  const [whisper, setWhisper] = useState(""); 
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleSelect = (opt) => {
    setWhisper(opt.whisper);
    setIsTransitioning(true);
    setHistory(prev => [...prev, opt.analysis]);

    setTimeout(() => {
      const newScores = { ...scores };
      Object.keys(opt.weights).forEach(k => { newScores[k] += opt.weights[k]; });
      setScores(newScores);
      setWhisper("");
      setIsTransitioning(false);

      if (idx < questions.length - 1) setIdx(idx + 1);
      else setStep(2);
    }, 1600);
  };

  const finalResult = useMemo(() => {
    if (step !== 2) return null;
    
    const isHonest = scores.honest === 1;
    const isHighOrder = scores.D > 22;
    const isHighSelf = scores.P > 22;
    const isHighChaos = scores.O > 22;
    const isHighEmpathy = scores.S > 22;

    let persona = "";
    let reason = "";

    // --- 社會角色定性邏輯 ---
    if (isHighSelf && isHighOrder && !isHonest) {
      persona = "生意人";
      reason = "因為在你眼裡，世界就是一場大型交易。你遵守規則不是因為你正直，而是因為規則能保護你的利益。你連親生骨肉都能推開，說明你這人已經把『成本效益』刻進骨子裡了，連人性都是可以標價的商品。";
    } else if (isHighOrder && !isHighSelf) {
      persona = "衛道人士";
      reason = "因為你對規則有種近乎變態的執著。你寧願看著一百個孤兒沒藥吃，也要守住那條法規。你不是在維持正義，你只是在利用規則來獲得一種『我沒錯』的道德優越感，拿程序正義當成你冷血的遮羞布。";
    } else if (isHighChaos && isHighSelf) {
      persona = "邊緣份子";
      reason = "因為你根本不打算玩這場社會遊戲。你不爽就砸盤，想要自由就放火。你這種人最難搞，因為你連自己的命都不在乎，只想看著這虛偽的世界跟你一起燒光。你追求的不是自由，是毀滅帶來的快感。";
    } else if (isHighEmpathy && isHonest) {
      persona = "濫好人";
      reason = "因為你這輩子都被感情給拖累了。你什麼都想救，結果什麼都護不住。你最後承認自己偽善，其實是因為你發現自己那點廉價的慈悲，在現實的殘酷面前根本一文不值。你活得累，是因為你總想當英雄卻沒那個狠勁。";
    } else if (isHighOrder && isHighEmpathy && !isHonest) {
      persona = "偽裝者";
      reason = "因為你太會演了。你嘴上說著大局，心裡全是私慾。你穿著最得體的盔甲，選最安全的答案，連最後都不敢承認自己的自私。你這輩子，就是一場活給別人看的精采表演，演到連你都忘了面具下的臉長什麼樣。";
    } else {
      persona = "邊緣人";
      reason = "因為你既沒辦法狠下心當個壞人，也沒辦法天真地當個好人。你選擇了真實，但也選擇了痛苦。你看透了大家的裝模作樣，卻只能蹲在深淵邊緣看戲，既進不去權力的圈子，也回不到單純的世界，這就是你最尷尬的地方。";
    }

    const titlePrefix = isHonest ? "覺醒的" : "死硬派";

    return {
      title: `${titlePrefix}【${persona}】`,
      reason: reason,
      color: badgeColors[persona],
      historySnippet: `起初，${history[0]}。隨後當局勢失控，你竟然選擇「${history[Math.floor(history.length/2)]}」。最後，你對深淵說「${history[history.length-1]}」。`
    };
  }, [step, scores, history]);

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 20px', fontFamily: '-apple-system, system-ui, sans-serif' }}>
      
      {step === 0 && (
        <div style={{ textAlign: 'center', marginTop: '20vh', animation: 'fadeIn 2s' }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: '900', letterSpacing: '18px' }}>ABYSS</h1>
          <p style={{ opacity: 0.3, letterSpacing: '6px', fontSize: '10px', marginTop: '10px' }}>LOGIC_PARADOX_V10.0</p>
          <button onClick={() => setStep(1)} style={{ marginTop: '50px', padding: '15px 50px', borderRadius: '35px', border: 'none', background: '#fff', color: '#000', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s' }}>開啟審判</button>
        </div>
      )}

      {step === 1 && questions[idx] && (
        <div style={{ maxWidth: '550px', width: '100%', transition: 'all 0.5s', opacity: isTransitioning ? 0.3 : 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', opacity: 0.3, fontSize: '10px', marginBottom: '30px' }}>
            <span>LOG_{idx + 1}/21</span>
            <span>ANALYZING_SOCIAL_TRAITS...</span>
          </div>
          <h2 style={{ fontSize: '1.7rem', lineHeight: '1.5', marginBottom: '40px', fontWeight: '600' }}>{questions[idx].story}</h2>
          <div style={{ height: '70px', marginBottom: '20px' }}>
            {whisper && <p style={{ color: '#ff4d4d', fontStyle: 'italic', fontSize: '1.1rem', animation: 'fadeInText 0.8s forwards' }}>「{whisper}」</p>}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', pointerEvents: isTransitioning ? 'none' : 'auto' }}>
            {questions[idx].options.map((opt, i) => (
              <button key={i} onClick={() => handleSelect(opt)} style={{ padding: '24px', borderRadius: '18px', background: '#0a0a0a', color: '#fff', border: '1px solid #1a1a1a', textAlign: 'left', cursor: 'pointer', transition: '0.3s' }}>{opt.label}</button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && finalResult && (
        <div style={{ maxWidth: '750px', width: '100%', textAlign: 'center', animation: 'fadeIn 2.5s' }}>
          <div style={{ fontSize: '12px', color: '#fff', letterSpacing: '8px', marginBottom: '30px', opacity: 0.3 }}>FINAL_JUDGMENT</div>
          
          <div style={{ backgroundColor: finalResult.color.bg, color: finalResult.color.text, padding: '15px 40px', display: 'inline-block', borderRadius: '40px', fontWeight: '900', fontSize: '1.4rem', marginBottom: '40px', boxShadow: `0 20px 40px rgba(0,0,0,0.5)` }}>
            {finalResult.title}
          </div>

          <div id="capture-area" style={{ background: '#080808', padding: '60px 45px', borderRadius: '45px', border: '1px solid #222', lineHeight: '2.5', fontSize: '1.25rem', textAlign: 'justify', color: '#d1d1d1', whiteSpace: 'pre-wrap', boxShadow: '0 30px 60px rgba(0,0,0,0.8)' }}>
            <p style={{ marginBottom: '30px', fontWeight: '700', color: '#fff' }}>為什麼社會這樣形容你？</p>
            {finalResult.reason}
            
            <hr style={{ border: 'none', borderTop: '1px solid #222', margin: '40px 0' }} />
            
            <p style={{ fontSize: '1rem', color: '#666', lineHeight: '1.8' }}>
              【行為追蹤報告】：<br />
              {finalResult.historySnippet}
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '50px' }}>
            <button onClick={() => window.print()} style={{ background: '#fff', color: '#000', padding: '15px 40px', borderRadius: '35px', border: 'none', fontWeight: '800', cursor: 'pointer', fontSize: '14px' }}>保存靈魂罪狀 (截圖/PDF)</button>
            <button onClick={() => window.location.reload()} style={{ background: 'none', border: '1px solid #333', color: '#555', padding: '15px 40px', borderRadius: '35px', cursor: 'pointer', fontSize: '14px' }}>重啟審判</button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInText { from { opacity: 0; } to { opacity: 1; } }
        button:hover { transform: scale(1.02); background: #111 !important; border-color: #555 !important; }
        @media print {
          body { background: white !important; color: black !important; }
          #capture-area { border: none !important; box-shadow: none !important; color: black !important; background: white !important; }
          button { display: none !important; }
        }
      `}</style>
    </div>
  );
}
