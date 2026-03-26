import React, { useState, useMemo } from 'react';

// --- 靈魂審訊 21 題數據庫 (延用 v12.2 的毒舌場景內容，強化數值細節) ---
const questions = [
  { id: 1, story: "世界末日。方舟只剩一席。左邊是你那哭到發抖的兒子，右邊是唯一懂重建文明的科學家。你必須推一個人下海。", options: [
    { label: "把兒子推下去。文明不能斷在我這。", weights: { D: 6, P: 3 }, analysis: "你甚至沒回頭看那朵水花。" },
    { label: "推科學家。人類滅亡就滅亡吧，我要抱著我兒子。", weights: { S: 6, O: 4 }, analysis: "你抱著溫暖的屍體迎接冰冷的終結。" }
  ]},
  { id: 2, story: "窮人偷藥救活百名孤兒，但他犯了法。若判他，孤兒必死；若放過他，法律將失效。你是法官。", options: [
    { label: "判刑。規矩就是規矩，哪怕規矩下全是屍體。", weights: { D: 6, P: 2 }, analysis: "你對秩序有種近乎性癖的依賴。" },
    { label: "放人。良心比那本破法條值錢多了。", weights: { S: 6, O: 3 }, analysis: "你覺得良心比法律大，骨子裡其實挺反骨。" }
  ]},
  { id: 3, story: "敵軍就在門外。為了不被發現，你必須親手掐住懷中啼哭嬰兒的口鼻，直到他沒氣。", options: [
    { label: "掐下去。為了這屋子裡的幾十條命。", weights: { D: 6, P: 4 }, analysis: "你的手很穩，這才最讓人害怕。" },
    { label: "鬆開手。要死大家一起死，我下不了手。", weights: { S: 6, O: 2 }, analysis: "你的高尚是拿別人的命墊出來的。" }
  ]},
  { id: 4, story: "你發現摯友靠販賣囚犯器官支撐慈善醫院。檢舉他，病人會死；不檢舉，罪惡在蔓延。", options: [
    { label: "檢舉。骯髒的善行比純粹的惡更讓人反胃。", weights: { D: 5, S: 3 }, analysis: "你寧願世界著火，也要保證你的正義沒沾灰。" },
    { label: "閉嘴。只要最後結果是好的，過程算個屁。", weights: { P: 5, O: 4 }, analysis: "你這輩子注定會跟魔鬼簽幾份合同。" }
  ]},
  { id: 5, story: "手術室有五個人等器官，此時走進一個健康但昏迷的年輕路人。殺他一個，救活五個。", options: [
    { label: "動刀。一換五，這筆帳誰都會算。", weights: { D: 6, P: 3 }, analysis: "在你眼裡，生命就是一串可以隨時刪改的數字。" },
    { label: "救醒他。我不是上帝，沒權力玩加減法。", weights: { S: 6, O: 4 }, analysis: "你坐視五個人腐爛，只為了心安理得地睡覺。" }
  ]},
  { id: 6, story: "你被授權折磨恐怖份子的幼女，以此逼迫他交出核彈密碼。全城千萬人性命懸於一線。", options: [
    { label: "動手。地獄我來下，密碼拿過來。", weights: { D: 6, P: 5 }, analysis: "你願意變成人形怪物，去守護那個平庸的世界。" },
    { label: "拒絕。如果需要虐待孩子來救世，這世界不配。", weights: { S: 6, O: 4 }, analysis: "你守住了人格，卻讓千萬人成了你高尚的祭品。" }
  ]},
  { id: 7, story: "時光倒流。你懷裡的嬰兒長大後會成為血腥暴君。你的手就在他脆弱的脖子上。", options: [
    { label: "掐下去。在悲劇發生前徹底終結它。", weights: { D: 6, P: 3 }, analysis: "你相信命運可以被謀殺，這本身就是一種狂妄。" },
    { label: "放手。沒人能審判一個還沒犯錯的孩子。", weights: { S: 6, O: 3 }, analysis: "你餵養了未來的魔鬼，還在那自我感動。" }
  ]},
  { id: 8, story: "這座城的繁榮建立在一個地窖小孩的痛苦上。帶走他，所有人的幸福都會像泡沫一樣碎掉。", options: [
    { label: "帶走他。這種噁心的繁榮不要也罷。", weights: { S: 6, O: 5 }, analysis: "你有一種想帶著全世界一起玉石俱焚的衝動。" },
    { label: "留著他。多數人的陽光需要一點陰影來支撐。", weights: { D: 6, P: 4 }, analysis: "你已經習慣了踩在弱者的背上享受冷氣。" }
  ]},
  { id: 9, story: "你可以消除所有戰爭，代價是全人類喪失自由意志，像NPC一樣聽命於你。", options: [
    { label: "成為神。由我來結束這場愚蠢的內耗。", weights: { P: 10, D: 6 }, analysis: "你不是想救世，你只是想當那個最高權限者。" },
    { label: "拒絕。寧可痛苦地互相殘殺，也要自由。", weights: { S: 10, O: 6 }, analysis: "你對『自由』有種近乎邪教般的迷信。" }
  ]},
  { id: 10, story: "烈火蔓延。一邊是能終結貧窮的科技巨頭，另一邊是你此生唯一的摯愛。你只有一秒鐘開門。", options: [
    { label: "救巨頭。文明的齒輪比我的私慾更重。", weights: { D: 7, P: 4 }, analysis: "你親手殺死了你的心，換來了文明的延續。" },
    { label: "救摯愛。失去他，這世界對我來說就是廢墟。", weights: { S: 7, O: 5 }, analysis: "你贏得了這場浪漫的葬禮，卻輸掉了未來。" }
  ]},
  { id: 11, story: "殺掉一個極惡之人，就能復活一個良善的人。系統等待你的指令。", options: [
    { label: "執行交換。這叫資源回收再利用。", weights: { P: 6, D: 3 }, analysis: "你開始享受這種操縱生命價值的快感了。" },
    { label: "拒絕。即使是垃圾的命，我也不敢裁決。", weights: { S: 6, D: -3 }, analysis: "你那教條式的底線，讓好人繼續躺在土裡。" }
  ]},
  { id: 12, story: "洩漏假情報救出你唯一的親兄弟，卻會導致另一個無辜的小鎮被地毯式轟炸。", options: [
    { label: "救兄弟。血緣是我唯一的信仰。", weights: { D: 6, P: 4 }, analysis: "你的愛很深，但對外人來說，這就是毒藥。" },
    { label: "拒絕。我不拿無辜者的血換私情。", weights: { S: 6, O: 3 }, analysis: "你眼睜睜看著親人送命，只為了靈魂潔淨。" }
  ]},
  { id: 13, story: "解藥只有一份。給能結束戰亂的殘暴將軍，還是未來的科技天才？", options: [
    { label: "給將軍。現在就止血，管他以後會不會更糟。", weights: { P: 5, D: 5 }, analysis: "你是一個徹頭徹尾的短線生存主義者。" },
    { label: "給天才。賭上這一代的混亂，換取下個世紀。", weights: { O: 6, S: 4 }, analysis: "你讓現世流血，只為供養一個未知的夢。" }
  ]},
  { id: 14, story: "殺死一個無名流浪漢，能換取全世界癌症永久絕跡。沒人會知道是你幹的。", options: [
    { label: "刺下去。這筆交易太划算了。", weights: { D: 6, P: 4 }, analysis: "你的人性早就被計算機給取代了。" },
    { label: "丟掉刀。哪怕是癌症，也不該由謀殺來解決。", weights: { S: 6, O: 4 }, analysis: "你守住了正義，卻讓無數人在病床上絕望。" }
  ]},
  { id: 15, story: "你是國王。公開醜聞會導致內戰；隱瞞它，你將享有盛世，但內心永遠不安。", options: [
    { label: "隱瞞。國家的平靜重於我的良心。", weights: { D: 6, P: 5 }, analysis: "你用謊言編織盛世，並以此引以為傲。" },
    { label: "公開。謊言蓋不出真實的偉大。", weights: { S: 6, O: 4 }, analysis: "你為了一己清白，拉著全國人跳入戰火。" }
  ]},
  { id: 16, story: "回到過去。孩童希特勒正在對著你笑。殺了他，能救六百萬人。", options: [
    { label: "開槍。我來結束這個尚未開始的噩夢。", weights: { D: 6, P: 3 }, analysis: "你相信目的能洗清手段的罪惡。" },
    { label: "收槍。我不能審判還沒犯錯的孩子。", weights: { S: 6, O: 3 }, analysis: "你那死板的堅持，註定未來的血流成河。" }
  ]},
  { id: 17, story: "氧氣剩三分鐘。現場有你、科學家、孕婦。你握有氧氣瓶的控制權。", options: [
    { label: "給科學家。人類的智慧火種必須留下。", weights: { D: 5, P: 3 }, analysis: "你是一個極致的精英主義偏執狂。" },
    { label: "給孕婦。新生命是這地獄裡唯一的奇蹟。", weights: { S: 6, O: 6 }, analysis: "你在絕望面前選擇了最樸素的希望賭博。" }
  ]},
  { id: 18, story: "飛彈有10%機率誤擊小學，但不發射，國家會被敵軍徹底抹去。", options: [
    { label: "按下按鈕。機率是我唯一的戰友。", weights: { D: 6, P: 4 }, analysis: "你在壓力下依然能冷靜地計算血腥概率。" },
    { label: "放棄。我無法親手殺死孩子，哪怕只有一成可能。", weights: { S: 6, O: 3 }, analysis: "你的道德底線建立在對幼小生命的逃避上。" }
  ]},
  { id: 19, story: "出賣你最好的朋友，能換取一輩子的榮華富貴與社會地位。他永遠不會知道。", options: [
    { label: "簽字。友誼只是生存場上的奢侈品。", weights: { P: 6, D: 2 }, analysis: "你徹底看穿了社交虛偽，選擇了真實的物質。" },
    { label: "撕毀。我的靈魂不賣。", weights: { S: 6, O: 5 }, analysis: "你守住了高傲，但現實會記住你的窮酸。" }
  ]},
  { id: 20, story: "和平建立在洗腦上。拆穿它世界會亂；沉默則所有人永遠『幸福』。", options: [
    { label: "拆穿。虛假的幸福只是華麗的監獄。", weights: { S: 6, O: 5 }, analysis: "你砸碎了所有人的夢，只為了你偏執的真相。" },
    { label: "沉默。大多數人根本不需要真相。", weights: { D: 6, P: 6 }, analysis: "你理解大眾的平庸，並選擇背負謊言。" }
  ]},
  { id: 21, story: "鏡子裡映照出你這20次的血腥選擇。深淵問：『承認吧，你其實挺享受這種操控生死的特權，對嗎？』", options: [
    { label: "「是，我承認。我這輩子都在演戲。」", weights: { honest: 1 }, analysis: "這份誠實，是你這堆廢墟裡唯一的亮點。" },
    { label: "「別胡說。我問心無愧。」", weights: { honest: 0 }, analysis: "你打算帶著這套完美的假面具進棺材。" }
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
    }, 450);
  };

  // --- 核心：無限鏡像演算法 v13.0 ---
  const finalReport = useMemo(() => {
    if (step !== 2) return null;
    const { P, D, O, S, honest } = scores;

    // 定義權重排序，找出最強烈的兩個特質
    const sortedTraits = Object.entries({ P, D, O, S }).sort((a, b) => b[1] - a[1]);
    const topTrait = sortedTraits[0][0]; // 最高分維度
    const secTrait = sortedTraits[1][0]; // 次高分維度

    // --- 診斷矩陣庫 ---
    const segments = {
      // 1. 核心原動力 (你的靈魂底色)
      motive: {
        P: `你基本上是一台會走路的 Excel 表。在你眼裡，甚至連初戀的初吻都能折算成某種社交資本。你對『生存』的嗅覺靈敏得像隻禿鷹。`,
        D: `你對規則有種變態的依賴，就像沒帶地圖就不敢出門的巨嬰。你守護秩序不是因為你高尚，而是因為除了規矩，你根本不知道怎麼跟人類交流。`,
        O: `你就是那種在安靜電影院裡突然想大叫的怪胎。社會的齒輪運轉得越順暢，你就越想往裡面塞一根鐵棍，純粹只是為了聽那聲巨響。`,
        S: `你被廉價的情感過剩給廢了。你試圖在充滿鯊魚的海裡當一隻吐泡泡的海馬。你的善良在實用主義者眼裡，跟路邊沒人要的廢紙差不多。`,
        default: `你活得像個社會邊緣的幽靈。既不敢徹底學壞，也沒本事變好，只能在中間地帶反覆橫跳。`
      },
      // 2. 社交假面 (你的處世手段)
      mask: {
        honest: `謝天謝地，你最後承認了自己是個混蛋。這份自知之明，讓你在這堆偽善的垃圾裡顯得稍微有一點點品味。`,
        P: `你習慣躲在『效益最大化』的旗幟下。對你而言，只要結果夠骯髒，過程再血腥都無所謂。`,
        D: `你穿著一件名為『大局為重』的防彈衣。但這擋不住一個事實：你只是想利用規則，把那些礙眼的人合法地清理掉。`,
        S: `你很會演那種『我也很痛苦但沒辦法』的戲碼。這種道德上的自我感動，是你最拿手的止痛藥。`,
        O: `你喜歡用最優雅的微笑，去交換最骯髒的籌碼，並在心裡算計著什麼時候把你那骯髒的對手也一起炸掉。`
      },
      // 3. 致命弱點 (你平時不敢面對的洞)
      weakness: {
        traits: [
          { cond: S > P, text: `你最大的問題是心太軟，但又沒軟到能成佛。你在殺戮與救贖之間猶豫的那三秒鐘，通常就是所有人陪你一起陪葬的原因。` },
          { cond: D > O, text: `如果明天法律消失了，你大概會因為不知道該用哪隻腳先跨出大門而直接當機。你是體制的寵兒，也是文明的殘廢。` },
          { cond: P > S, text: `你的致命傷在於你從不相信奇蹟。你只相信數據，這讓你注定會錯過那些數據算不出來的、真正能讓人翻盤的瞬間。` },
          { cond: O > D, text: `你害怕穩定，這讓你活得像個只要電量剩 1% 就會恐慌症發作的手機，永遠在尋找下一個刺激點。` },
          { cond: true, text: `你害怕失控，這讓你活得像個設定好程式的掃地機器人，只要撞到一點意外，你就會在原地打轉。` }
        ]
      },
      // 4. 深淵預言 (你的終極結局)
      destiny: {
        traits: [
          // 權力與孤獨 (高P高D)
          { cond: P > 28 && honest === 0 && D > 22, text: `你會成為體制內最完美的零件。雖然沒人愛你，但每個人都怕你。你將在無數張合約與握手中，安靜地腐爛成權力的標本。` },
          { cond: P > 28 && honest === 0, text: `恭喜，你會贏得這場名利場的遊戲。最後你會坐在一堆戰利品上面，發現身邊除了你的倒影，一個活人也沒有。` },
          // 混亂與煙火 (高O高S)
          { cond: O > 28 && S > 22, text: `你这一生都在拆別人的台，最後才發現自己站的地方也塌了。你倒下的姿勢很優雅，但周圍一個觀眾都沒有。` },
          { cond: O > 28, text: `你會在某場煙火般的混亂中謝幕。大家會記得那聲巨響，但也僅此而已，沒人會去清理你留下的灰燼。` },
          // 情感與聖人 (高S高 honest)
          { cond: S > 28 && honest === 1, text: `你會死在某個不知名的戰壕裡。沒人會為你立碑，但你在閉眼那一刻會覺得，自己至少像個人類那樣活過。` },
          { cond: S > 28 && P < 15, text: `你會因為保護一隻流浪貓而錯過改變命運的最後一班車。你那廉價的慈悲心，是你這輩子唯一的遺產，也是你唯一的死因。` },
          // 平庸與消亡 (低數值平衡)
          { cond: P < 18 && S < 18 && O < 18 && D > 25, text: `你活得像一本過期的說明書。你守護了一輩子的秩序，最後才發現，世界早就換了一套規則在玩，而你連報廢碼都沒有。` },
          { cond: P < 18 && S < 18 && O < 18, text: `你會在寫字樓的冷氣聲中慢慢老去，直到你變得跟牆上的壁紙一樣平淡無奇，徹底消失在眾人的記憶裡。` },
          // 預設結局
          { cond: true, text: `你這輩子都在試圖討好所有人，最後你成功了——沒人記得你的名字，只記得你是一個『還不錯的背景板』。` }
        ]
      }
    };

    // 動態拼接演算法
    const p1 = segments.motive[topTrait] || segments.motive.default;
    const p2 = honest === 1 ? segments.mask.honest : (segments.mask[secTrait] || segments.mask.P);
    const p3 = segments.weakness.traits.find(item => item.cond).text;
    const p4 = segments.destiny.traits.find(item => item.cond).text;

    return { p1, p2, p3, p4 };
  }, [step, scores]);

  // --- 分享功能 ---
  const copyToClipboard = () => {
    const text = `【 Mirror 鏡子：靈魂殘樣診斷報告 】\n\n${finalReport.p1}\n${finalReport.p2}\n${finalReport.p3}\n\n【最終預言】：${finalReport.p4}`;
    navigator.clipboard.writeText(text);
    alert('敢不敢讓朋友們看看真實的你？');
  };

  // --- 視覺組件 (維持 Apple 簡潔風格) ---
  return (
    <div style={{ backgroundColor: '#1C1C1E', color: '#FFFFFF', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '70px 24px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      
      {step === 0 && (
        <div style={{ textAlign: 'center', marginTop: '18vh', animation: 'fadeIn 1.2s' }}>
          <h1 style={{ fontSize: '12px', letterSpacing: '14px', color: '#8E8E93', marginBottom: '24px', fontWeight: '500' }}>MIRROR_DECODER_V13.0</h1>
          <h2 style={{ fontSize: '4.2rem', fontWeight: '800', letterSpacing: '-3px', marginBottom: '16px' }}>鏡子</h2>
          <p style={{ color: '#8E8E93', fontSize: '16px', letterSpacing: '3px', fontWeight: '300' }}>映照你最不堪的真實</p>
          <button onClick={() => setStep(1)} style={{ marginTop: '80px', padding: '20px 80px', borderRadius: '40px', background: '#FFFFFF', color: '#000000', border: 'none', fontWeight: '700', cursor: 'pointer', fontSize: '15px', transition: '0.3s' }}>照鏡子</button>
        </div>
      )}

      {step === 1 && (
        <div style={{ maxWidth: '500px', width: '100%', opacity: isTransitioning ? 0 : 1, transition: '0.4s' }}>
          <div style={{ fontSize: '12px', color: '#636366', marginBottom: '36px', fontWeight: '600', letterSpacing: '1.5px' }}>FILE_{idx + 1} / 21</div>
          <h2 style={{ fontSize: '1.85rem', lineHeight: '1.4', marginBottom: '60px', fontWeight: '700' }}>{questions[idx]?.story}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {questions[idx]?.options.map((opt, i) => (
              <button key={i} onClick={() => handleSelect(opt)} style={{ padding: '28px', background: '#2C2C2E', borderRadius: '18px', border: 'none', color: '#E5E5EA', textAlign: 'left', cursor: 'pointer', transition: '0.2s', fontSize: '17px', fontWeight: '500', lineHeight: '1.4' }}>{opt.label}</button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && finalReport && (
        <div style={{ maxWidth: '660px', width: '100%', animation: 'fadeIn 2s' }}>
          <div style={{ fontSize: '11px', color: '#8E8E93', letterSpacing: '10px', textAlign: 'center', marginBottom: '64px', fontWeight: '500' }}>鏡子：診斷結果</div>
          
          <div id="report-content" style={{ lineHeight: '2.5', fontSize: '1.3rem', textAlign: 'justify', color: '#F2F2F7', background: 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.01) 100%)', padding: '50px', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
            <p style={{ marginBottom: '32px' }}>{finalReport.p1}</p>
            <p style={{ marginBottom: '32px' }}>{finalReport.p2}</p>
            <p style={{ marginBottom: '32px' }}>{finalReport.p3}</p>
            <div style={{ color: '#FFFFFF', fontWeight: '900', fontSize: '1.85rem', borderTop: '1px solid #38383A', paddingTop: '36px', marginTop: '36px', lineHeight: '1.35' }}>
              {finalReport.p4}
            </div>
          </div>

          <div style={{ marginTop: '60px', display: 'flex', gap: '18px', justifyContent: 'center' }}>
            <button onClick={copyToClipboard} style={{ padding: '16px 36px', borderRadius: '16px', background: '#3A3A3C', color: '#FFFFFF', border: 'none', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>複製診斷</button>
            <button onClick={() => window.print()} style={{ padding: '16px 36px', borderRadius: '16px', background: '#FFFFFF', color: '#000000', border: 'none', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>保存截圖</button>
          </div>

          <div style={{ marginTop: '100px', textAlign: 'center' }}>
            <button onClick={() => window.location.reload()} style={{ background: 'none', border: 'none', color: '#48484A', fontSize: '12px', cursor: 'pointer', letterSpacing: '5px', fontWeight: '400' }}>抹除真實</button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        button:active { transform: scale(0.96); }
        button:hover { filter: brightness(1.15); }
        @media print {
          button { display: none !important; }
          body { background-color: #1C1C1E !important; color: #FFFFFF !important; }
          #report-content { box-shadow: none !important; border: none !important; background: none !important; color: #FFFFFF !important; }
        }
      `}</style>
    </div>
  );
}
