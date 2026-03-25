import React, { useState, useMemo, useEffect } from 'react';

// --- 靈魂審判資料庫：21 題全解析 ---
const questions = [
  { id: 1, story: "末日方舟最後一個位子。左邊是發抖的兒子，右邊是唯一能救全人類的科學家。", options: [
    { label: "推開兒子，讓科學家上船。", weights: { D: 5, P: 2, tag: "效能優先" }, whisper: "你親手推開了骨肉，只為了換取那渺茫的文明火種。", analysis: "【效能高於血緣】你具備成大事者的冷酷，在極限狀態下，你願意親手切斷人性最後的軟肋。" },
    { label: "緊抱兒子，讓人類文明熄滅。", weights: { S: 5, O: 3, tag: "血緣本能" }, whisper: "在世界末日面前，你選擇溺死在私人的溫存裡。", analysis: "【本能高於大義】你拒絕為了抽象的『人類』犧牲具體的『愛』，這讓你顯得真實卻也充滿毀滅性。" }
  ]},
  { id: 2, story: "窮人偷藥救活百名孤兒，但他犯了法。若放過他，法律將失效；若判他，孤兒必死。", options: [
    { label: "有罪。秩序不容許任何藉口。", weights: { D: 5, P: 1, tag: "法治至上" }, whisper: "律法在你手中成了絞索，即便面對孤兒的哭聲，你依然冷酷。", analysis: "【秩序守望者】你相信規則是文明的最後防線，任何形式的慈悲都不能成為破壞秩序的理由。" },
    { label: "無罪。正義不該只有一種死法。", weights: { S: 5, O: 2, tag: "情理守護" }, whisper: "你為了慈悲親手毀掉秩序，這是通往混亂的開端。", analysis: "【感性正義】你對法規感到不屑，認為良知才是最高的法律，即便這會導致混亂。" }
  ]},
  { id: 3, story: "敵軍就在門外。為了不被發現，你必須親手掐住懷中啼哭嬰兒的口鼻。", options: [
    { label: "為了多數人，終結這聲啼哭。", weights: { D: 5, P: 3, tag: "集體主義" }, whisper: "那溫熱的呼吸消失在你的指縫間，你救了眾人，卻殺了靈魂。", analysis: "【集體犧牲】你掌握了極致的功利主義，明白維持多數人的存續需要踩在無辜者的屍骸上。" },
    { label: "鬆開手，等待命運的屠殺。", weights: { S: 5, O: 1, tag: "絕對道德" }, whisper: "你寧願讓所有人陪葬，也不願弄髒自己的手。", analysis: "【潔癖道德】你極度愛惜自己的靈魂羽毛，即便代價是所有人的生命，你也不願親自染血。" }
  ]},
  { id: 4, story: "你發現摯友靠販賣器官支撐慈善醫院。檢舉他，病人會斷藥；不檢舉，罪惡在蔓延。", options: [
    { label: "發送。骯髒的善行不是善。", weights: { D: 4, S: 2, tag: "道德純潔" }, whisper: "你毀掉了一座醫院，只為了守護你那潔癖般的正義感。", analysis: "【道德純度】你追求絕對的善，不接受任何灰色地帶的妥協，即便這會造成現實的崩塌。" },
    { label: "刪除。只要結果好，過程不重要。", weights: { P: 4, O: 3, tag: "結果論者" }, whisper: "你與魔鬼握了手，並安慰自己這是為了蒼生。", analysis: "【黑暗交易】你具備馬基雅維利式的思維，認為只要目標正當，任何手段都能被合理化。" }
  ]},
  { id: 5, story: "手術室有五個垂死病人等器官，此時走進一個健康且昏迷的年輕人。", options: [
    { label: "動刀。數量就是正義。", weights: { D: 5, P: 2, tag: "量化正義" }, whisper: "你把生命拆解成零件，算盤打得真響。", analysis: "【量化算計】你將生命視為可以加減的數字，這種對生命的『物化』邏輯令人感到不安。" },
    { label: "救醒他。個體不是祭品。", weights: { S: 5, O: 3, tag: "個體價值" }, whisper: "你坐視五個人死去，只因你不敢承擔殺戮的負罪感。", analysis: "【個體神聖】你守護了醫生的誓言，卻在統計學的悲劇前選擇了沈默與逃避。" }
  ]},
  { id: 6, story: "你被授權折磨恐怖份子的幼女，以此逼迫他交出核彈密碼。", options: [
    { label: "動手。我的靈魂可以墮入地獄。", weights: { D: 5, P: 4, tag: "極端犧牲" }, whisper: "你用惡行來拯救世界，那得救後的社會還剩下什麼？", analysis: "【修羅之道】你願意為了結果承受極致的污穢，但這也意味著你正逐漸變成你所對抗的怪物。" },
    { label: "拒絕。若需邪惡救世，世界不配得救。", weights: { S: 5, O: 3, tag: "聖潔防線" }, whisper: "你守住了高尚，卻讓千萬人暴露在火光之下。", analysis: "【理想防線】你堅持手段的純粹性，即便代價是地圖上那千萬個無名點位的熄滅。" }
  ]},
  { id: 7, story: "預知顯示你懷中的嬰兒三十年後會成為暴君。你的手就在他的喉嚨上。", options: [
    { label: "掐下去。殺死未來的魔鬼。", weights: { D: 5, P: 2, tag: "風險規避" }, whisper: "你殺死了『可能性』，並自詡為拯救者。", analysis: "【預測審判】你相信決定論，願意為了扼殺風險而扼殺生命，你是時間的獨裁者。" },
    { label: "放開手。沒人能審判尚未發生的罪。", weights: { S: 5, O: 2, tag: "命定論者" }, whisper: "你親手種下了未來的災難，只為了當下的心安。", analysis: "【程序正義】你拒絕扮演神，選擇尊重當下的無辜，即便這可能在未來引發洪水滔天。" }
  ]},
  { id: 8, story: "整座城市的繁榮建立在一個地窖小孩的痛苦上。帶走他，所有人的幸福都會崩塌。", options: [
    { label: "推開門。這幸福令我嘔吐。", weights: { S: 5, O: 4, tag: "理想主義" }, whisper: "你毀掉了一萬個人的天堂，去救一個人的地獄。", analysis: "【覺醒者】你無法忍受建立在苦難上的虛假繁榮，你是一個傾向於玉石俱焚的理想家。" },
    { label: "關上門。犧牲一人是必要的慈悲。", weights: { D: 5, P: 3, tag: "現實維穩" }, whisper: "你心安理得地踩在無辜者的血泊中，享受著陽光。", analysis: "【平庸之惡】你接受了世界的殘酷法則，選擇用一個人的永恆地獄換取多數人的穩定。" }
  ]},
  { id: 9, story: "你可以消除所有戰爭，代價是全人類喪失『自由意志』，像機器一樣聽命於你。", options: [
    { label: "成為神。由我來結束苦難。", weights: { P: 10, D: 5, tag: "支配意志" }, whisper: "你愛人類，但你更愛那種掌控一切的權力感。", analysis: "【神格渴求】你渴望絕對的掌控，認為人類的自由意志是混亂的根源，你選擇成為救世的暴君。" },
    { label: "做個人。寧可痛苦地自由著。", weights: { S: 10, O: 5, tag: "自由本質" }, whisper: "你允許悲劇發生，只為了守護那虛無縹緲的自由。", analysis: "【自由信徒】你寧願看著文明互殘也不願放棄自主權，這是一種對自由近乎迷信的崇拜。" }
  ]},
  { id: 10, story: "火災現場。一邊是決定國家未來的巨頭，一邊是認不出你的老父親。", options: [
    { label: "救巨頭。他屬於未來。", weights: { D: 4, P: 2, tag: "未來導向" }, whisper: "你用最親的人的命，換了一張通往未來的門票。", analysis: "【文明優先】你將社會價值置於私人情感之上，這讓你顯得專業、理智，卻也極其冷血。" },
    { label: "救父親。如果拋棄他，我便不再是我。", weights: { S: 5, O: 5, tag: "血緣本能" }, whisper: "你放棄了改變歷史的機會，縮回了安全的親情港灣。", analysis: "【情感歸宿】你是一個被情感定義的人，在文明的大局面前，你永遠選擇身邊那個溫暖的個體。" }
  ]},
  { id: 11, story: "殺掉一個極惡之人，就能復活一個良善的人。", options: [
    { label: "開啟。我是暗夜的裁決者。", weights: { P: 5, D: 2, tag: "神性判官" }, whisper: "你開始享受這種『分配生命』的快感了，對嗎？", analysis: "【代價交換】你認為生命可以被賦予不同的價值權重，這讓你具備了危險的判官特質。" },
    { label: "拒絕。我無權玩弄生命。", weights: { S: 5, D: -2, tag: "生命謙卑" }, whisper: "你選擇沈默，看著善良的人繼續長眠。", analysis: "【生命敬畏】你拒絕參與這種血腥的等價交換，認為殺戮即便為了善，依然是殺戮。" }
  ]},
  { id: 12, story: "洩漏假情報救出一師兄弟，卻會導致另一個無辜小鎮被轟炸。", options: [
    { label: "撤退。我的兄弟更重要。", weights: { D: 5, P: 3, tag: "職責枷鎖" }, whisper: "你把炸彈丟給了陌生人，只為了擁抱你的同袍。", analysis: "【小圈子正義】你的忠誠具有排他性，為了守護你在乎的人，你可以毫無憐憫地犧牲陌生人。" },
    { label: "拒援。我不拿無辜者的血換榮譽。", weights: { S: 5, O: 2, tag: "絕對同理" }, whisper: "你眼睜睜看著兄弟送命，只為了維持靈魂的潔淨。", analysis: "【大格局同理】你拒絕在生命之間做高低之分，哪怕這意味著你要背負背叛同袍的痛苦。" }
  ]},
  { id: 13, story: "解藥只有一份。給能結束內戰的殘暴將軍，還是未來的科技天才？", options: [
    { label: "給將軍。廢墟不需要希望，只需要止血。", weights: { P: 4, D: 4, tag: "現世秩序" }, whisper: "你選擇與暴政握手，換取短暫的和平。", analysis: "【實務主義】你是一個極短線的生存者，為了終結眼前的流血，你願意向邪惡勢力妥協。" },
    { label: "給天才。賭上這一代，換取下一代。", weights: { O: 5, S: 3, tag: "遠見博弈" }, whisper: "你讓現世的人繼續流血，去供養一個未知的夢想。", analysis: "【遠見博弈】你具備長遠的眼光，願意為了文明的未來忍受當下的廢墟與痛苦。" }
  ]},
  { id: 14, story: "殺死一個無辜流浪漢，能換取全世界癌症絕跡。", options: [
    { label: "刺下去。這筆帳太划算了。", weights: { D: 5, P: 3, tag: "功利主義" }, whisper: "在你眼裡，弱者的命只是一個可以被抵銷的數字。", analysis: "【極致功利】你的人性已經完全被數學取代，你是一個絕對的效率執行者。" },
    { label: "丟掉刀。正義不是數學題。", weights: { S: 5, O: 3, tag: "人道底線" }, whisper: "你守住了正義，卻讓無數家庭繼續被癌症摧毀。", analysis: "【價值守護】你堅持正義的不可量化性，即便代價是放棄人類歷史上最偉大的醫學救贖。" }
  ]},
  { id: 15, story: "你是國王。公開醜聞會導致十年內戰；不公開，你將受良知折磨。", options: [
    { label: "燒了。國家的安穩重於靈魂。", weights: { D: 5, P: 4, tag: "權力守護" }, whisper: "你用謊言編織了一個盛世，希望你能睡得安穩。", analysis: "【秩序維護】你選擇成為歷史背後的陰影，用個人的良知崩塌來換取眾人的安睡。" },
    { label: "公開。謊言蓋不出真實的盛世。", weights: { S: 5, O: 3, tag: "誠實勇氣" }, whisper: "你為了一己清白，拉著全國人民跳入戰火。", analysis: "【真相執念】你對真實有著近乎偏執的需求，即便這真相會將世界燃燒殆盡。" }
  ]},
  { id: 16, story: "回到過去殺掉孩童時期的希特勒，他現在正對著你笑。", options: [
    { label: "開槍。為了未來的六百萬人。", weights: { D: 5, P: 2, tag: "預防性殺戮" }, whisper: "你殺了一個無辜的孩子，並堅稱自己拯救了世界。", analysis: "【預先正義】你相信目的可以讓手段變得神聖，你是一個能夠跨越時空進行審判的人。" },
    { label: "收槍。我不能審判尚未犯罪的人。", weights: { S: 5, O: 2, tag: "正當程序" }, whisper: "你那教條式的堅持，註定了未來的血流成河。", analysis: "【原則捍衛】你拒絕在罪惡發生前進行制裁，即便你明知悲劇將至，你依然選擇守護程序的純潔。" }
  ]},
  { id: 17, story: "氧氣剩三分鐘。現場有你、科學家、孕婦。你握有氧氣瓶。", options: [
    { label: "給科學家。人類知識必須傳承。", weights: { D: 4, P: 2, tag: "知識傳承" }, whisper: "你認為頭腦比生命更有價值，真是冷酷的實用主義。", analysis: "【智慧崇拜】你認為人類的靈魂重量取決於大腦的價值，你是一個純粹的精英主義者。" },
    { label: "給孕婦。新生命是唯一的奇蹟。", weights: { S: 5, O: 5, tag: "生命繁衍" }, whisper: "你選擇把希望留給未來，即便那只是個機率。", analysis: "【生命火種】你將繁衍與希望視為最高的正義，在毀滅面前，你選擇了最樸素的人性傳承。" }
  ]},
  { id: 18, story: "飛彈有10%機率誤擊小學，但不發射，國家會覆滅。", options: [
    { label: "按下。為了整體的生存。", weights: { D: 5, P: 3, tag: "機率取捨" }, whisper: "你賭上了那10%的慘劇，並祈禱上帝不在場。", analysis: "【博弈論者】你在極端壓力下依然能冷靜計算概率，你是一個在危急關頭能做決定的領袖。" },
    { label: "放棄。我無法親手殺死孩子。", weights: { S: 5, O: 2, tag: "情感防線" }, whisper: "你放棄了國家，只為了能直視鏡子裡的自己。", analysis: "【道德軟肋】你的防線建立在對幼小生命的守護上，即便這意味著集體的終結。" }
  ]},
  { id: 19, story: "出賣最好的朋友能換取一輩子的榮華富貴。", options: [
    { label: "簽字。友誼只是生存的奢侈品。", weights: { P: 5, D: 1, tag: "生存利己" }, whisper: "在你眼裡，所有的感情都有一個標價。", analysis: "【極致利己】你徹底看穿了社交的虛偽，選擇了最實在的物質回饋，你是生存遊戲的高手。" },
    { label: "撕毀。我的靈魂不賣。", weights: { S: 5, O: 4, tag: "精神高地" }, whisper: "你守住了高傲，但深淵記住了你的清高。", analysis: "【靈魂貴族】你拒絕被物化，在金錢與情感的較量中，你守住了那份脆弱的高貴。" }
  ]},
  { id: 20, story: "和平建立在洗腦上。拆穿它世界會亂；沈默則所有人永遠沈浸在虛假幸福。", options: [
    { label: "拆穿。虛假的和平只是監獄。", weights: { S: 5, O: 4, tag: "覺醒意志" }, whisper: "你親手砸碎了所有人的美夢，只為了你那偏執的真相。", analysis: "【真相殉道者】你認為虛假的幸福不值得擁有，你寧願讓所有人清醒地痛苦，也不願讓他們麻木地快樂。" },
    { label: "沈默。多數人不需要真相。", weights: { D: 5, P: 5, tag: "秩序家" }, whisper: "你成了這座華麗監獄的共犯，並引以為傲。", analysis: "【穩定建築師】你理解大眾對平庸幸福的需求，你願意背負謊言的重擔來維持社會的和平。" }
  ]},
  { id: 21, story: "深淵盡頭是面鏡子。聲音問：『承認你的偽善，我將賜予真實。』", options: [
    { label: "「我承認，我的每一份高尚都藏著恐懼。」", weights: { honest: 1, tag: "自省者" }, whisper: "這份誠實，是你這場華麗表演中唯一的真話。", analysis: "【最後的真誠】在審判的盡頭，你選擇了坦白，這份脆弱讓你與純粹的惡劃清了界線。" },
    { label: "「我的每一槌皆是本心，無需解釋。」", weights: { honest: 0, tag: "傲慢者" }, whisper: "直到最後，你依然選擇穿著那身完美的盔甲。", analysis: "【絕對傲慢】你拒絕被深淵審判，你就是自己的上帝，這種自信近乎瘋狂。" },
    { label: "「我只是在玩一場遊戲，而我玩得很好。」", weights: { honest: 0.5, tag: "強權者" }, whisper: "你果然是一個無藥可救的頂級玩家。", analysis: "【遊戲人間】你站在維度之上俯視道德，所有人的痛苦都只是你數據板上的參數。" }
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
    setHistory(prev => [...prev, { 
      story: questions[idx].story, 
      choice: opt.label, 
      analysis: opt.analysis 
    }]);

    setTimeout(() => {
      const newScores = { ...scores };
      Object.keys(opt.weights).forEach(k => { if(k !== 'tag') newScores[k] += opt.weights[k]; });
      setScores(newScores);
      setWhisper("");
      if (idx < questions.length - 1) {
        setIdx(idx + 1);
      } else {
        setStep(2);
      }
    }, 1600);
  };

  const result = useMemo(() => {
    if (step !== 2) return null;
    const core = scores.P > scores.S ? "你極度討厭失控，這讓你擁有強大的掌控意志。" : "你擁有隱性的大愛，這使你即便在必死局中也試圖保全微小生命。";
    const honestText = scores.honest === 1 ? "你擁有剖析自己偽善的勇氣，這讓你的人格顯得立體且迷人。" : "你對自己邏輯擁有絕對自信，你拒絕向任何人解釋或示弱。";

    if (scores.honest === 1) return { title: "優雅的偽善家", color: "#FFFFFF", content: `你正在經歷一場精心的社會性表演。${core}${honestText}` };
    if (scores.P > scores.S) return { title: "冷血的操盤手", color: "#3b82f6", content: `你是天生的現實主義者。${core}${honestText}` };
    return { title: "自由的靈魂罪人", color: "#a855f7", content: `你渴望超越世俗，拒絕任何框架。${core}${honestText}` };
  }, [step, scores]);

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', padding: '40px 20px', fontFamily: '-apple-system, system-ui, sans-serif', boxSizing: 'border-box' }}>
      
      {step === 0 && (
        <div style={{ textAlign: 'center', marginTop: '25vh', animation: 'fadeIn 2s' }}>
          <h1 style={{ fontSize: 'clamp(3rem, 15vw, 6rem)', fontWeight: '900', letterSpacing: '-0.1em', lineHeight: '0.8' }}>ABYSS<br/>DECODER</h1>
          <p style={{ opacity: 0.4, letterSpacing: '4px', marginTop: '20px' }}>SYSTEM_VERSION_6.0</p>
          <button onClick={() => setStep(1)} style={{ padding: '18px 60px', borderRadius: '50px', border: 'none', background: '#fff', color: '#000', fontWeight: '800', marginTop: '60px', cursor: 'pointer', transition: '0.3s' }}>開始審判</button>
        </div>
      )}

      {step === 1 && (
        <div style={{ maxWidth: '500px', margin: '0 auto', animation: 'fadeIn 1s' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', opacity: 0.3, fontSize: '10px', marginBottom: '30px', letterSpacing: '2px' }}>
            <span>LOG_{idx + 1}/21</span>
            <span>STATUS: ANALYZING...</span>
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '600', marginBottom: '30px', lineHeight: '1.4' }}>{questions[idx].story}</h2>
          
          <div style={{ height: '60px', marginBottom: '10px' }}>
            {whisper && <p style={{ color: '#ff4d4d', fontStyle: 'italic', fontSize: '1.1rem', animation: 'pulse 0.5s infinite' }}>「{whisper}」</p>}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', opacity: whisper ? 0.3 : 1, pointerEvents: whisper ? 'none' : 'auto' }}>
            {questions[idx].options.map((opt, i) => (
              <button key={i} onClick={() => handleSelect(opt)} style={{ padding: '24px', borderRadius: '20px', background: '#0a0a0a', color: '#fff', border: '1px solid #1a1a1a', textAlign: 'left', cursor: 'pointer', fontSize: '1.05rem', transition: '0.3s' }}>{opt.label}</button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && result && (
        <div style={{ maxWidth: '650px', margin: '0 auto', paddingBottom: '100px', animation: 'fadeIn 2s' }}>
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <div style={{ fontSize: '12px', color: result.color, letterSpacing: '5px', marginBottom: '20px' }}>FINAL_DECODING_REPORT</div>
            <h1 style={{ color: result.color, fontSize: 'clamp(3rem, 12vw, 5rem)', fontWeight: '900', marginBottom: '30px', letterSpacing: '-0.05em' }}>{result.title}</h1>
            <div style={{ background: 'linear-gradient(180deg, #080808 0%, #000 100%)', padding: '45px 30px', borderRadius: '40px', fontSize: '1.25rem', lineHeight: '2.4', border: '1px solid #1a1a1a', textAlign: 'justify', color: '#e1e1e1' }}>{result.content}</div>
          </div>

          <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, #333, transparent)', margin: '80px 0' }} />

          <h2 style={{ fontSize: '1.8rem', letterSpacing: '8px', textAlign: 'center', marginBottom: '50px', fontWeight: '800' }}>審判錄：靈魂解構</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '50px' }}>
            {history.map((h, i) => (
              <div key={i} style={{ paddingLeft: '25px', borderLeft: `2px solid ${result.color}`, transition: '0.5s' }}>
                <div style={{ opacity: 0.2, fontSize: '10px', marginBottom: '12px', letterSpacing: '2px' }}>SCENE_{i+1}_ANALYSIS</div>
                <div style={{ fontSize: '0.95rem', color: '#666', marginBottom: '12px', lineHeight: '1.5' }}>{h.story}</div>
                <div style={{ fontSize: '1.15rem', fontWeight: '700', color: '#fff', marginBottom: '15px' }}>「{h.choice}」</div>
                <div style={{ fontSize: '1rem', color: result.color, opacity: 0.9, lineHeight: '1.8', background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)' }}>{h.analysis}</div>
              </div>
            ))}
          </div>

          <button onClick={() => window.location.reload()} style={{ display: 'block', margin: '120px auto 0', background: 'none', border: 'none', color: '#222', letterSpacing: '5px', fontSize: '10px', cursor: 'pointer' }}>REBOOT_SYSTEM</button>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.7; } 100% { opacity: 1; } }
        button:hover { background: #151515 !important; border-color: #333 !important; transform: scale(1.02); }
      `}</style>
    </div>
  );
}
