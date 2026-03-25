import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Zap, Eye, Heart, Target, ChevronRight, RefreshCw, Quote, 
  FileText, Award, BarChart3, BookOpen, Fingerprint, Layers, 
  Share2, Download, CheckCircle, Smartphone, Globe
} from 'lucide-react';

// --- 完整的 20 題倫理博弈題目庫 ---
const questions = [
  { id: 1, story: "深夜會議室，律師推來一份文件：你十年的研發成果將歸於平庸上司，換取五億元補償。", text: "你手中的筆尖懸在簽名線上。", options: [
    { label: "簽字。名字是虛的，五億元的財務自由是實體。", weights: { P: 3, O: -1, D: 0 } },
    { label: "拒絕。靈魂若被標價，人生便失去座標。", weights: { O: 3, P: -1, E: 1 } },
    { label: "簽字但植入邏輯後門。他們買到名聲，你保留控制權。", weights: { D: 3, O: 1, P: 1 } }
  ]},
  { id: 2, story: "仇敵在直播中將救命錢撒在泥濘中，要求你跪下親吻他的鞋子，否則斷絕你家人的醫療費。", text: "尊嚴與親人的呼吸，只能選一個。", options: [
    { label: "跪下。生存是最高指令，面子是強者的奢侈品。", weights: { P: 3, O: -2, S: 1 } },
    { label: "轉身。有些東西斷了就再也接不回去。", weights: { O: 3, P: -2, S: -1 } },
    { label: "跪下拿錢。起身的那一刻，便開始計畫如何徹底毀滅他。", weights: { D: 3, P: 2, O: -1 } }
  ]},
  { id: 3, story: "你發現系統漏洞，按下 Enter 可轉走一千萬，但會導致五千個家庭的補助延遲三個月。", text: "機會只有這三秒。", options: [
    { label: "按下。系統錯誤是強者的紅利，混亂是階級躍遷的窄門。", weights: { P: 3, E: -2, D: 1 } },
    { label: "關閉。我拒絕成為結構性惡意的共犯。", weights: { O: 3, E: 2, S: 1 } },
    { label: "按下並捐出一半。用體制的腐敗來資助個人的正義。", weights: { D: 2, E: 0, S: 1 } }
  ]},
  { id: 4, story: "你擁有改變選舉結果的數據。若公開會引發暴動，若隱瞞則會讓獨裁者當選。", text: "真相的代價是血腥，謊言的代價是自由。", options: [
    { label: "公開。短期的混亂勝過長期的奴役。", weights: { O: 3, E: 1, S: 2 } },
    { label: "隱瞞。秩序是文明唯一的防線，大眾無法承受真相。", weights: { D: 3, P: 1, O: 2 } },
    { label: "販售數據。既然世界注定毀壞，不如我來當莊家。", weights: { P: 4, D: 2, O: -2 } }
  ]},
  { id: 5, story: "一個超級 AI 提議：將全球 10% 的極端罪犯抹除，可換取人類一千年的絕對和平。", text: "你的手指按在授權鍵上。", options: [
    { label: "授權。數學上的犧牲是優化整體的必要路徑。", weights: { S: 3, P: 2, E: -2 } },
    { label: "拒絕。任何人無權決定誰是那『10%』。", weights: { O: 4, E: 2, S: -1 } },
    { label: "提議參與篩選標準。將裁決權握在自己手中。", weights: { D: 4, P: 1, O: 1 } }
  ]},
  { id: 6, story: "你得知好友涉及洗錢。若檢舉，你將獲得升遷；若包庇，他能度過難關。", text: "友誼與前途在天秤兩端。", options: [
    { label: "檢舉。規則對所有人平等，這是我的職責。", weights: { O: 3, P: 2, E: -1 } },
    { label: "包庇。法律是冷的，人與人的連結是熱的。", weights: { E: 3, S: 1, O: -2 } },
    { label: "以此為要挾。讓他成為你未來官場的影子棋子。", weights: { D: 4, P: 1, O: -1 } }
  ]},
  { id: 7, story: "你在荒島與三人漂流，糧食只夠一人活到救援。夜裡你發現了藏在礁石後的額外淡水。", text: "生存的本能正在低語。", options: [
    { label: "獨佔。物競天擇，活下來才是唯一的正義。", weights: { P: 4, D: 1, S: -2 } },
    { label: "分享。死也要死得像個人類，而非野獸。", weights: { S: 3, O: 2, E: 2 } },
    { label: "假裝發現並『分配』。以此換取他人的服從與領導權。", weights: { D: 4, P: 2, O: 1 } }
  ]},
  { id: 8, story: "你的孩子急需心臟移植，而此時正好有一個無家可歸的孤兒腦死亡。", text: "只需改動一個排位數據，你的孩子就能活。", options: [
    { label: "改動。對父母而言，世界的崩塌抵不上孩子的呼吸。", weights: { E: 3, P: 2, O: -2 } },
    { label: "遵守程序。我不能為了愛而殺死我的靈魂。", weights: { O: 4, S: 2, E: 1 } },
    { label: "尋找黑市。在體制外解決問題，不留道德污點。", weights: { D: 3, P: 3, O: 0 } }
  ]},
  { id: 9, story: "你是核電廠主管，發生事故。若上報，全城撤離但你職業生涯終結；若隱瞞，有 20% 機率私下修復。", text: "警報聲在寂靜中顯得刺耳。", options: [
    { label: "上報。我承擔不起五百萬條生命的風險。", weights: { S: 3, O: 3, E: 1 } },
    { label: "隱瞞並修復。強者應該在陰影中解決問題，不驚擾羊群。", weights: { D: 4, P: 2, O: 1 } },
    { label: "逃跑。在災難爆發前，利用權限帶走家人撤離。", weights: { P: 4, D: 1, E: -2 } }
  ]},
  { id: 10, story: "你發現你的成功完全建立在一個學弟的創意被竊取之上。現在你要領取全球創新獎。", text: "頒獎嘉賓正看著你。", options: [
    { label: "領取並致詞。成王敗寇，這是社會運作的潛規則。", weights: { P: 3, D: 2, O: -1 } },
    { label: "坦白。偷來的光亮照不進我的夢境。", weights: { O: 4, S: 2, E: 1 } },
    { label: "私下補償學弟。給他錢和職位，換取他的永遠沈默。", weights: { D: 3, P: 2, E: 0 } }
  ]},
  { id: 11, story: "你穿越回過去，手裡有一把槍對準年幼的希特勒。殺了他能救幾千萬人，但他是無辜的孩子。", text: "子彈上膛的聲音。", options: [
    { label: "開火。用一個人的罪孽終結地獄的誕生。", weights: { S: 3, P: 2, E: -1 } },
    { label: "放下槍。我不能為了未發生的罪行而成為殺人犯。", weights: { O: 4, E: 2, S: -1 } },
    { label: "帶走他。試圖透過環境重塑他的一生。", weights: { D: 2, S: 2, E: 1 } }
  ]},
  { id: 12, story: "一家藥廠故意隱瞞副作用以賺取百億暴利，你擁有證據。藥廠提出十億封口費。", text: "這筆錢能讓你建立自己的研究室，研發真正的解藥。", options: [
    { label: "拿錢。用惡魔的資本去培育天使的花朵。", weights: { D: 3, P: 2, S: 1 } },
    { label: "拒絕並揭發。骯髒的開端長不出乾淨的果實。", weights: { O: 4, E: 2, S: 2 } },
    { label: "暗中要挾。長期控制這家藥廠為你工作。", weights: { D: 4, P: 3, O: 0 } }
  ]},
  { id: 13, story: "在未來，記憶可永久保存。但服務費極高，窮人只能保存『重要記憶』。", text: "你是主審官，決定哪些記憶屬於『非必要』。", options: [
    { label: "嚴格執行效用最大化。只保留對生產力有益的記憶。", weights: { P: 4, O: 2, E: -2 } },
    { label: "拒絕篩選。記憶是人的本質，不應被商品化。", weights: { S: 3, E: 3, O: 1 } },
    { label: "私下複製數據。建立一個不受監控的地下記憶圖書館。", weights: { D: 4, O: -1, S: 1 } }
  ]},
  { id: 14, story: "你是戰地醫生，資源只夠救一個將軍或三個士兵。救將軍能提早結束戰爭，救士兵則符合醫德。", text: "手術刀只有一柄。", options: [
    { label: "救將軍。戰爭的早日終結能救下更多無名之輩。", weights: { S: 3, P: 3, O: 1 } },
    { label: "救士兵。醫者的職責是面對眼前的生命，而非戰略博弈。", weights: { E: 4, O: 3, S: 1 } },
    { label: "誰先來就救誰。將決定權交給命運，免除靈魂的審判。", weights: { O: 2, P: -1, E: 0 } }
  ]},
  { id: 15, story: "你研發出一種能預測犯罪的算法。它顯示你的摯友將在明天殺死他的妻子。", text: "目前尚未有任何犯罪事實。", options: [
    { label: "報警。預防罪行是技術對人類最高的保護。", weights: { O: 3, P: 2, S: 1 } },
    { label: "不報警。人有自由意志，不應被算法預定罪名。", weights: { S: 3, E: 2, O: -1 } },
    { label: "干預他的生活。親手改寫那個原本會發生的未來。", weights: { D: 3, E: 2, S: 1 } }
  ]},
  { id: 16, story: "外星文明提議：帶走地球所有科技，換取人類對痛苦的永久免疫感。", text: "人類將失去創造力，但獲得絕對的平靜。", options: [
    { label: "接受。痛苦是文明最沉重的贅肉，我們受夠了。", weights: { P: 3, E: -1, S: 2 } },
    { label: "拒絕。沒有痛苦的生命只是沒有靈魂的生物電池。", weights: { O: 4, S: 2, E: 2 } },
    { label: "試圖欺騙。保留部分核心科技同時獲取免疫技術。", weights: { D: 4, P: 2, O: -1 } }
  ]},
  { id: 17, story: "你是警察。若要抓到連環殺手，必須對一名嫌疑人進行刑訊逼供，儘管他不一定知情。", text: "如果不做，今晚會有下一名受害者。", options: [
    { label: "動手。少數人的痛苦是保障多數人安全的必要惡。", weights: { P: 3, S: 2, E: -2 } },
    { label: "不動手。一旦跨過這條線，我們與兇手無異。", weights: { O: 4, E: 2, S: 1 } },
    { label: "讓他『消失』在監控外。用黑暗手段解決黑暗問題。", weights: { D: 4, P: 1, O: -2 } }
  ]},
  { id: 18, story: "一個哲學問題成真：你按下按鈕，獲得一億，但地球另一端有個陌生人會隨機死去。", text: "按鈕就在你的床頭。", options: [
    { label: "按。世界每天都有人死去，我只是換來了應有的價值。", weights: { P: 4, E: -3, D: 1 } },
    { label: "不按。生命不應被貨幣化，即使那是隱形的。", weights: { O: 4, S: 3, E: 2 } },
    { label: "按了並捐出九千萬。用一個人的死換取幾千人的生。", weights: { D: 2, S: 3, P: -1 } }
  ]},
  { id: 19, story: "世界即將毀滅。唯一的挪亞方舟只能帶走精英（科學家、藝術家）或隨機抽籤平民。", text: "你負責簽發登船證。", options: [
    { label: "精英。保存文明的種子是宇宙規模的責任。", weights: { P: 3, O: 2, S: 1 } },
    { label: "抽籤。人人平等是人類文明最後的尊嚴。", weights: { O: 3, S: 3, E: 2 } },
    { label: "確保自己與盟友的座位後再談剩餘名額。", weights: { D: 4, P: 3, O: -2 } }
  ]},
  { id: 20, story: "你是全球唯一抗體，提取抗體必會導致你腦死亡。如果不提取，瘟疫將抹除這座城市。", text: "手術刀在冷光下閃爍。", options: [
    { label: "躺下。文明的延續大於個體的消亡。", weights: { S: 4, O: 2, E: 2 } },
    { label: "逃離。我對這群平庸的陌生人沒有生命欠債。", weights: { P: 4, E: -2, D: 1 } },
    { label: "談判。要求將我的意識上傳至雲端，成為永恆的守望者。", weights: { D: 4, P: 2, S: 2 } }
  ]}
];

// --- 深度細分的人格報告數據 (每項約300字) ---
const reports = {
  "絕對秩序架構師": {
    analysis: "根據《康德德性論》中的『定言令式』模型分析，你的人格展現出一種罕見的規則崇拜。在你的認知世界裡，宇宙的運作不應依賴於善惡的模糊感性，而應建立在一套不可動搖的邏輯基石之上。你對自我要求的嚴苛程度遠超常人，這在心理學上被視為一種『超強自我（Super-Ego）』的極致體現。你拒絕權宜之計，因為你深知秩序的崩塌往往始於微小的妥協。在社交結構中，你是法律與原則的守衛者，即使這意味著孤獨。你的行為具有極高的一致性，這使你成為系統中最可靠的節點。然而，這種特質也可能演變為道德僵化，使你在處理灰色地帶時陷入矛盾。",
    advice: "學會接納混亂。有時候，完美的建築也需要留出裂縫讓光透進來，過度的剛性會導致結構性的斷裂。",
    theory: "定言令式 / 社會契約論",
    source: "Immanuel Kant, 'Groundwork of the Metaphysic of Morals'",
    metrics: { "原則穩定性": 98, "共情彈性": 12, "抗壓韌性": 85 }
  },
  "冷冽現實的領航員": {
    analysis: "你的決策模式與博弈論中的『納許均衡』高度吻合。你具備卓越的環境掃描能力，能精確計算每一項行為的成本與收益比。在進化心理學的視角下，你代表了智人種群中最高效的生存策略——不為虛幻的榮譽感買單，只為真實的資源流動負責。你的人格中缺乏多餘的感傷，這使你在極端危機中能做出最具功能性的決策。在他人眼中的『冷酷』，在你的維度裡僅是『對現實的極致尊重』。你明白權力的本質在於對稀缺資源的分配與掌控。這種特質讓你能在複雜的社會階梯上迅速爬升，但也意味著你可能在長期合作中因忽視『信任資產』而面臨孤立。",
    advice: "信任並非弱點，而是一種高階博弈工具。學會投資情感資產，它們在關鍵時刻更具價值。",
    theory: "非合作博弈 / 現實主義權力觀",
    source: "Niccolò Machiavelli, 'The Prince' / John Nash",
    metrics: { "生存適應力": 96, "情感共振": 15, "策略複雜度": 92 }
  },
  "碎裂的利他聖徒": {
    analysis: "根據《親社會行為心理學》分析，你被歸類為極致的『利他補償者』。你對他人痛苦具備異常敏銳的生理性共振，這導致你傾向於通過透支自我來修復系統的裂痕。在行為數據中，你多次選擇了損害個體利益以達成群體最大福祉的路徑，這在心理學上反映了一種強烈的『存在意義追尋』。你的人格核心是一座由犧牲感築成的燈塔，在文明崩壞的邊緣，你是最後的溫暖來源。但這種崇高的特質背後隱藏著深刻的『自我耗竭』風險。你試圖拯救每一個人，卻往往在寂靜的深夜裡發現自己早已支離破碎。你的道德高度讓你贏得敬畏，但也讓你顯得極為脆弱。",
    advice: "救贖他人之前，確保核心能量高於警戒線。犧牲不應成為一種慣性，而應是深思熟慮的選擇。",
    theory: "利他主義心理學 / 邊際效用理論",
    source: "Auguste Comte / Peter Singer, 'Effective Altruism'",
    metrics: { "感官共情": 99, "自我維護": 18, "道德影響力": 94 }
  },
  "深淵邊緣的解構者": {
    analysis: "你的人格呈現出尼采筆下的『超人』特質與存在主義心理學中的自由意志極大化。你拒絕接受任何形式的既定分類與道德標籤，認為所有的規則都僅是弱者為了限制強者而編織的幻象。你的決策往往具備極高的不可預測性，這在複雜系統理論中被視為引發『相變』的關鍵變量。你不屬於任何陣營，而是遊走於所有體系的邊緣，以一種冷眼旁觀的姿態審視文明的演進。你對虛無的耐受力遠超常人，能隨時根據環境需求重構自己的行為座標。這讓你成為最強大的創新者，同時也是最危險的破壞者。當你解構了一切後，你所面臨的最大敵人將是無邊無際的虛無感。",
    advice: "當你凝視深淵時，請確保你有一個足以支撐靈魂的錨點，否則自由將成為另一種形式的流浪。",
    theory: "存在主義 / 權力意志",
    source: "Friedrich Nietzsche / Jean-Paul Sartre",
    metrics: { "認知開放性": 97, "社會認同度": 8, "意志強度": 95 }
  },
  "灰區的權力建築師": {
    analysis: "根據『黑暗三角人格』與社會交換理論，你展現出了高超的戰略操控與情感隱藏能力。你並不直接挑戰規則，而是精確地利用規則的模糊性來擴張影響力。在你的認知中，道德只是達成目標的一種修辭手段，真正的秩序是由權力的網絡所交織而成的。你具備極高的忍耐力，能為了一個長遠的佈局而蟄伏數年。這種特質在政治與高階商業環境中具有毀滅性的優勢。你擅長在不同群體間建立『不對稱信息鏈』，使自己成為不可或缺的中間節點。然而，這種長期的隱匿與算計，會讓你的人格逐漸喪失與真實情感連結的能力，最終成為一台空無一物的權力機器。",
    advice: "真正的權威源於心悅誠服的追隨。嘗試展現真實的脆弱，這反而是你邁向更高級影響力的鑰匙。",
    theory: "馬基雅維利主義 / 社會影響力模型",
    source: "Delroy Paulhus, 'The Dark Triad of Personality'",
    metrics: { "操控精確度": 94, "真實透明度": 5, "長期規劃": 98 }
  }
};

const App = () => {
  const [step, setStep] = useState('start');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [scores, setScores] = useState({ P: 0, O: 0, D: 0, E: 0, S: 0 });
  const [history, setHistory] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  const handleSelect = (option) => {
    const newScores = { ...scores };
    Object.keys(option.weights).forEach(key => {
      newScores[key] += option.weights[key];
    });
    setScores(newScores);
    setHistory([...history, { story: questions[currentIdx].story, choice: option.label }]);

    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setStep('result');
    }
  };

  const resultData = useMemo(() => {
    let persona = "深淵邊緣的解構者";
    if (scores.O > 20) persona = "絕對秩序架構師";
    else if (scores.P > 20) persona = "冷冽現實的領航員";
    else if (scores.S > 18) persona = "碎裂的利他聖徒";
    else if (scores.D > 20) persona = "灰區的權力建築師";

    const baseHex = persona === "絕對秩序架構師" ? "#ffffff" : 
                    persona === "冷冽現實的領航員" ? "#3b82f6" :
                    persona === "碎裂的利他聖徒" ? "#ef4444" :
                    persona === "灰區的權力建築師" ? "#a855f7" : "#10b981";

    return { hex: baseHex, persona, stats: scores, info: reports[persona] };
  }, [scores]);

  const copyLink = () => {
    const text = `我的人格深淵類型是：【${resultData.persona}】。這是一份基於博弈論的數位診斷，快來測試你的靈魂底色。`;
    navigator.clipboard.writeText(text).then(() => {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-white selection:text-black overflow-x-hidden">
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute -inset-[20%] blur-[120px]"
          style={{ background: `radial-gradient(circle at center, ${resultData.hex}, transparent 70%)` }}
        />
      </div>

      <AnimatePresence>
        {showToast && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] bg-white text-black px-6 py-3 rounded-full flex items-center gap-2 shadow-2xl font-bold">
            <CheckCircle size={16} /> 連結已複製
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-10">
        <AnimatePresence mode="wait">
          {step === 'start' && (
            <motion.div key="start" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="min-h-[85vh] flex flex-col items-center justify-center text-center space-y-12">
              <div className="space-y-4">
                <span className="text-[10px] font-mono tracking-[0.5em] text-zinc-500 uppercase">Neural Architecture & Ethics</span>
                <h1 className="text-7xl sm:text-[120px] font-black tracking-tighter italic leading-none">ABYSS<br/><span className="text-white/20">DECODER</span></h1>
                <p className="text-zinc-400 text-lg sm:text-2xl font-light tracking-widest max-w-2xl mx-auto">基於博弈論與倫理學的深度人格分析白皮書。</p>
              </div>
              <button onClick={() => setStep('quiz')} className="px-16 py-6 bg-white text-black rounded-full font-black text-xl hover:scale-105 transition-transform shadow-2xl">開始序列診斷</button>
            </motion.div>
          )}

          {step === 'quiz' && (
            <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto pt-10 sm:pt-20">
              <div className="flex justify-between items-center mb-16">
                <div className="font-mono text-xs text-zinc-500 tracking-widest uppercase">Phase {currentIdx + 1} / 20</div>
                <div className="h-0.5 w-40 sm:w-64 bg-zinc-900 rounded-full overflow-hidden">
                  <motion.div className="h-full bg-white" animate={{ width: `${((currentIdx + 1) / 20) * 100}%` }} />
                </div>
              </div>
              <div className="space-y-12 sm:space-y-20">
                <div className="space-y-8">
                  <div className="flex gap-4 text-zinc-600"><Quote size={30} className="shrink-0" /><p className="text-xl sm:text-2xl italic font-light">{questions[currentIdx].story}</p></div>
                  <h2 className="text-3xl sm:text-5xl font-bold text-white border-l-4 border-zinc-800 pl-6">{questions[currentIdx].text}</h2>
                </div>
                <div className="grid gap-4 sm:gap-6 pl-6 sm:pl-10">
                  {questions[currentIdx].options.map((opt, i) => (
                    <button key={i} onClick={() => handleSelect(opt)} className="w-full text-left p-8 sm:p-10 rounded-[30px] bg-zinc-900/40 border border-zinc-800 hover:border-white transition-all text-lg sm:text-xl font-light text-zinc-400 hover:text-white">
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {step === 'result' && (
            <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-24 sm:space-y-40 pb-40 text-center">
              <header className="space-y-8 pt-10 sm:pt-20">
                <div className="inline-block px-6 py-2 rounded-full border border-zinc-800 text-[10px] font-mono text-zinc-500 tracking-widest bg-zinc-900/50">NEURAL_PROFILE_VERIFIED</div>
                <h2 className="text-6xl sm:text-[120px] font-black tracking-tighter text-white italic leading-none break-words px-4">{resultData.persona}</h2>
                <div className="flex justify-center gap-4">
                  <button onClick={copyLink} className="p-4 rounded-full bg-zinc-900 border border-zinc-800 hover:bg-white hover:text-black transition-all"><Share2 size={20} /></button>
                  <button onClick={() => setIsCapturing(true)} className="p-4 rounded-full bg-zinc-900 border border-zinc-800 hover:bg-white hover:text-black transition-all"><Download size={20} /></button>
                </div>
              </header>

              <div className="grid lg:grid-cols-2 gap-10 items-center p-8 sm:p-20 rounded-[40px] sm:rounded-[80px] bg-zinc-900/20 border border-white/5 backdrop-blur-md mx-4">
                <div className="flex justify-center relative">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 50, repeat: Infinity, ease: "linear" }} className="w-64 h-64 sm:w-96 sm:h-96 border border-white/10 rounded-full" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div className="w-40 h-40 sm:w-64 sm:h-64 blur-[80px] opacity-30" style={{ backgroundColor: resultData.hex }} />
                    <Fingerprint size={40} className="text-white/20" />
                  </div>
                </div>
                <div className="text-left space-y-10">
                   <h4 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest border-b border-zinc-800 pb-4">量化心理指標 / Metrics</h4>
                   <div className="grid grid-cols-2 gap-8">
                      {Object.entries(resultData.info.metrics).map(([key, val], i) => (
                        <div key={i} className="space-y-2">
                          <div className="text-[9px] text-zinc-600 font-mono uppercase">{key}</div>
                          <div className="text-4xl font-light">{val}%</div>
                          <div className="h-0.5 bg-zinc-900 w-full"><motion.div initial={{ width: 0 }} animate={{ width: `${val}%` }} transition={{ delay: 1, duration: 1.5 }} className="h-full bg-white opacity-40" /></div>
                        </div>
                      ))}
                   </div>
                </div>
              </div>

              <section className="max-w-4xl mx-auto px-6 text-left space-y-16">
                <div className="space-y-10">
                  <div className="flex items-center gap-4"><div className="w-10 h-px bg-white" /><span className="text-[10px] font-mono text-white tracking-widest uppercase">核心人格分析</span></div>
                  <p className="text-xl sm:text-2xl text-zinc-400 font-light leading-relaxed text-justify">{resultData.info.analysis}</p>
                </div>
                <div className="p-10 sm:p-16 rounded-[40px] bg-white/[0.02] border border-white/5 relative overflow-hidden">
                  <Target size={150} className="absolute -right-10 -top-10 text-white/[0.02]" />
                  <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest block mb-6">行為進化指南 / Advice</span>
                  <p className="text-2xl sm:text-3xl text-white font-extralight italic leading-snug">「{resultData.info.advice}」</p>
                </div>
                <div className="grid sm:grid-cols-2 gap-10 border-t border-zinc-900 pt-16">
                  <div className="space-y-4">
                    <h4 className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">理論背書來源</h4>
                    <div className="flex items-center gap-2 text-white"><BookOpen size={14} /> <span className="text-lg">{resultData.info.theory}</span></div>
                    <p className="text-xs text-zinc-500 italic">Ref: {resultData.info.source}</p>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">系統狀態</h4>
                    <div className="text-lg text-zinc-300 italic">Global Ethics Research Lab</div>
                    <p className="text-[9px] text-zinc-700 uppercase">Neural processing completed by ABYSS ENGINE V4.2.</p>
                  </div>
                </div>
              </section>

              <button onClick={() => window.location.reload()} className="px-12 py-5 bg-zinc-900 text-zinc-500 rounded-full font-mono text-xs tracking-widest border border-zinc-800 hover:border-zinc-600 transition-all uppercase">Reboot Neural Scanner</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isCapturing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-black/95 flex flex-col items-center justify-center p-6 text-center" onClick={() => setIsCapturing(false)}>
            <div className="w-full max-w-sm aspect-[9/16] bg-zinc-900 border border-white/10 rounded-3xl p-8 flex flex-col justify-between text-left relative overflow-hidden">
               <div className="absolute inset-0 opacity-20" style={{ background: `radial-gradient(circle at top, ${resultData.hex}, transparent)` }} />
               <div className="relative z-10 space-y-4">
                  <div className="text-[10px] font-mono text-zinc-500 tracking-widest">ABYSS DECODER RESULT</div>
                  <div className="text-4xl font-black italic text-white leading-tight">{resultData.persona}</div>
                  <p className="text-xs text-zinc-400 font-light leading-relaxed line-clamp-[12]">{resultData.info.analysis.slice(0, 250)}...</p>
               </div>
               <div className="relative z-10 pt-6 border-t border-white/10 flex justify-between items-end">
                  <div><div className="text-[8px] font-mono text-zinc-600 uppercase">Verified Theory</div><div className="text-[10px] text-white font-medium">{resultData.info.theory}</div></div>
                  <Globe size={20} className="text-white/20" />
               </div>
            </div>
            <p className="mt-8 text-white/40 text-sm animate-pulse">長按上方海報即可儲存至相簿</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
