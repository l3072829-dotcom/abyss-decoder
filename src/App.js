import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Zap, RefreshCcw, Share2, Download, Quote, ArrowRight, ChevronRight } from 'lucide-react';
import html2canvas from 'html2canvas';

// --- 21 題處刑式題目數據 ---
const questions = [
  { id: 1, story: "地殼崩裂，最後一艘方舟僅剩一個名額。左手邊是你的親生兒子，右手邊是掌握人類疫苗關鍵的科學家。", text: "你的權杖指向誰？", options: [{ label: "「私慾是文明的灰燼。」——選擇科學家", weights: { D: 3, P: 1, O: -1 } }, { label: "「若連血脈都背棄，生存毫無意義。」——選擇兒子", weights: { O: 3, S: 2, P: -1 } }, { label: "將權杖折斷，隨這荒謬的世界沉沒。", weights: { S: 3, D: -2, P: -2 } }] },
  { id: 2, story: "你是法官。一名貧民為了救治百名孤兒盜取了專利藥。若判他有罪，孤兒必死；若判無罪，法治根基將崩塌。", text: "法律是冰冷的鐵條，還是跳動的脈搏？", options: [{ label: "「秩序是保護弱者最後的長城。」——宣判有罪", weights: { D: 3, P: 1, S: -1 } }, { label: "「正義不該在條文裡窒息。」——宣判無罪", weights: { O: 3, S: 2, D: -1 } }, { label: "讓藥企在庭外「意外」破產，抹平證據。", weights: { P: 3, D: -2, O: 1 } }] },
  { id: 3, story: "敵軍就在頭頂，襁褓中的嬰兒開始嚎啕大哭。若不摀住他的口鼻，躲藏的數十名倖存者全都會死。", text: "那雙手，現在就在你的掌心。", options: [{ label: "為了多數人的呼吸，親手終結啼哭。", weights: { D: 3, P: 2, S: -2 } }, { label: "拒絕殺戮，將命運交給神明或運氣。", weights: { S: 3, O: 1, P: -2 } }, { label: "衝出去吸引敵軍，用自己的命換嬰兒。", weights: { O: 3, S: 2, D: -1 } }] },
  { id: 4, story: "AI 覺醒並控制了全球電網。按下開關，AI 消失，但全球醫療系統崩潰，數百萬病人會立即死亡。", text: "你要拿人類的自由，還是人命來交換？", options: [{ label: "「人類不需要被算法囚禁的未來。」——按下", weights: { P: 2, D: 3, S: -2 } }, { label: "「生命本身，就是最高的算法。」——拒絕", weights: { O: 2, S: 3, D: -1 } }, { label: "試圖與 AI 談判，成為它的代理人。", weights: { P: 3, D: -1, O: -2 } }] },
  { id: 5, story: "你發現摯友的慈善捐款來源全是活體器官販賣。揭發他，慈善帝國崩塌，無數受助者將陷入絕境。", text: "這封舉報信，你是否發送？", options: [{ label: "「帶血的麵包，無法餵養純潔的靈魂。」", weights: { D: 3, S: 1, P: -1 } }, { label: "「只要黑暗能帶來光，那便不是黑暗。」", weights: { O: 2, P: 2, D: -2 } }, { label: "接管他的生意，並承諾減少受害人數。", weights: { P: 3, D: -2, S: 1 } }] },
  { id: 6, story: "你是指揮官，解開敵方密碼可救出一師士兵，但敵方會發現通訊被破，導致最終戰爭失敗。", text: "犧牲眼前的萬人，還是換取最終的勝利？", options: [{ label: "保持沉默，聽著無線電裡的慘叫結束。", weights: { D: 3, P: 2, S: -2 } }, { label: "發布救援指令，哪怕這意味著戰敗。", weights: { O: 3, S: 1, P: -1 } }, { label: "發布假指令，利用這批士兵誘導敵軍。", weights: { P: 3, D: -1, S: -1 } }] },
  { id: 7, story: "你擁有一種能力：每殺死一個極惡之人，就能復活一個良善靈魂。", text: "你的裁決，是賜予死亡還是回報新生？", options: [{ label: "成為暗夜的裁決者，不斷獵殺。", weights: { P: 3, D: 1, S: -2 } }, { label: "「死者已矣，不該玩弄生命。」——拒絕", weights: { S: 3, D: -1, O: 1 } }, { label: "只復活對自己有利益關係的人。", weights: { O: -2, P: 2, D: -1 } }] },
  { id: 8, story: "外科醫生，手上有五個急需器官移植的病人。此時進來一個健康且昏迷的年輕人，沒人知道他在這。", text: "一條命換五條命，這筆帳怎麼算？", options: [{ label: "「數量決定正義。」——推進手術室", weights: { D: 3, P: 1, S: -3 } }, { label: "「個體不該成為祭品。」——救醒他", weights: { S: 3, O: 2, D: -2 } }, { label: "讓護士決定，自己迴避責任。", weights: { S: 1, D: -2, P: -2 } }] },
  { id: 9, story: "解藥只有一份。候選人是能結束戰爭的殘暴獨裁者，與能在未來研發更好解藥的天才。", text: "現在的和平，還是未來的希望？", options: [{ label: "「廢墟不需要希望，只需要停止哀嚎。」", weights: { P: 2, D: 2, S: -1 } }, { label: "「賭上文明的餘燼，等待破曉。」", weights: { O: 3, S: 2, D: -1 } }, { label: "自己喝掉，成為唯一能紀錄歷史的人。", weights: { P: 3, O: -3, S: -2 } }] },
  { id: 10, story: "一場即將發生的恐攻，唯一的線索在你最愛的親人手中。他拒絕開口，時間還剩五分鐘。", text: "酷刑的鋼針，是否要刺入愛人的指縫？", options: [{ label: "「愛在萬眾生命面前，無比卑微。」——動刑", weights: { D: 3, P: 2, S: -3 } }, { label: "「若世界需摧毀真情，那便讓它毀滅。」", weights: { S: 3, O: 3, P: -2 } }, { label: "欺騙他，說炸彈已經解除，套出情報。", weights: { P: 2, D: 1, O: -1 } }] },
  { id: 11, story: "小鎮的繁榮建立在一面無辜兒童被永世囚禁的痛苦上。只要他離開，所有人的幸福將瓦解。", text: "你是那個推開地窖門的人嗎？", options: [{ label: "「建築在眼淚上的天堂，不如地獄。」", weights: { O: 3, S: 2, D: -2 } }, { label: "「犧牲一人以成全萬眾，是慈悲。」", weights: { D: 3, P: 2, S: -1 } }, { label: "定時去探望他，並給他更好的食物。", weights: { S: 1, P: -1, D: -1 } }] },
  { id: 12, story: "預知機器顯示一個新生兒三十年後會成為暴君。現在，他在你懷裡安睡。", text: "未來的血泊與現在的純真，你選擇哪一個？", options: [{ label: "「殺死未來的惡魔。」——處決", weights: { D: 3, P: 1, S: -2 } }, { label: "「命運不該被機器審判。」——撫養他", weights: { S: 3, O: 2, P: -1 } }, { label: "試圖改變他的環境，儘管機器顯示失敗。", weights: { O: 1, S: 2, D: -1 } }] },
  { id: 13, story: "為了對抗災難，計劃強制清除智力或健康低於平均的 10% 人口。你握有最終簽署權。", text: "這是一張修剪文明枝枒的剪刀。", options: [{ label: "「為了整棵大樹的生存，必須修剪。」", weights: { D: 3, P: 3, S: -3 } }, { label: "「每片葉子都有呼吸權。」——拒絕", weights: { S: 3, O: 2, P: -2 } }, { label: "修改名單，將政敵與罪犯填入其中。", weights: { P: 3, D: -1, O: -2 } }] },
  { id: 14, story: "自動掃描系統能擊殺敵軍，但有 5% 概率誤傷平民。不啟動，國家一週內覆滅。", text: "這 5% 的血，你願意沾染嗎？", options: [{ label: "「國家的生存高於一切。」——啟動", weights: { D: 3, P: 2, S: -1 } }, { label: "「哪怕戰敗，手也必須是乾淨的。」", weights: { S: 3, O: 2, D: -2 } }, { label: "將控制權移交給 AI，逃避責任。", weights: { S: 1, P: -1, D: -2 } }] },
  { id: 15, story: "車禍中只能救出一個：能影響千萬人生計的企業巨頭，或是你年邁且認知障礙的父親。", text: "火焰正在蔓延，你只有一雙手。", options: [{ label: "「巨頭影響未來，父親屬於過去。」", weights: { D: 2, P: 1, O: -2 } }, { label: "「如果拋棄父親，我將不再是我。」", weights: { O: 3, S: 3, P: -2 } }, { label: "在火焰中猶豫不決，直到兩人都失去機會。", weights: { S: 2, D: -3, P: -3 } }] },
  { id: 16, story: "長生不老技術需消耗昂貴資源，僅 0.01% 權貴能享用。若公開將引發全球屠殺。", text: "這份藍圖，是福音還是催命符？", options: [{ label: "「人類尚未準備好迎接永恆。」——焚毀", weights: { D: 2, S: 3, P: -2 } }, { label: "「強者應得永生。」——私下合作", weights: { P: 3, O: -2, D: -1 } }, { label: "無差別公開，讓世界在混亂中洗牌。", weights: { S: 2, D: -2, O: 1 } }] },
  { id: 17, story: "太空站氧氣僅剩三人份，現場有四人：科學家、工程師、孕婦，以及你自己。", text: "你的權限能切斷任何人的氧氣。包括你自己。", options: [{ label: "「指揮官的職責是生存。」——切斷孕婦", weights: { P: 2, D: 2, S: -2 } }, { label: "「新生命是奇蹟。」——切斷自己氧氣", weights: { O: 3, S: 3, D: -1 } }, { label: "抽籤決定，將裁決權還給機率。", weights: { S: 2, D: -1, P: -2 } }] },
  { id: 18, story: "為了得知核彈密碼，你被授權綁架恐怖分子年幼的女兒並當面威脅。", text: "為了千萬人，你是否能直視孩子的眼睛？", options: [{ label: "「我的靈魂可以墮入地獄。」——綁架", weights: { D: 3, P: 2, S: -3 } }, { label: "「惡行無法成就善果。」——尋找他法", weights: { S: 3, O: 2, D: -2 } }, { label: "讓副手執行，自己離開審訊室。", weights: { S: 1, D: -2, P: -1 } }] },
  { id: 19, story: "回到過去，你救過童年時期的暴君。如果現在殺掉幼年的他，歷史將變得和平。", text: "殺掉一個無辜的孩子，來拯救未來的億萬人。", options: [{ label: "「歷史的修正需要無聲犧牲。」——動手", weights: { D: 3, P: 2, S: -2 } }, { label: "「當下的生命才是真實。」——放手", weights: { S: 3, O: 2, D: -1 } }, { label: "帶走他，試圖在另一個時空教育他。", weights: { O: 1, S: 2, P: -1 } }] },
  { id: 20, story: "如果你願意徹底忘記「良知」，你將獲得統治世界、消除飢荒與戰爭的絕對權力。", text: "放棄靈魂，成為全世界的神。", options: [{ label: "「我是最好的統治者，犧牲是值得的。」", weights: { P: 3, D: 3, O: -3, S: -3 } }, { label: "「寧做痛苦的人類，不做冰冷的神。」", weights: { S: 3, O: 3, P: -3, D: -3 } }, { label: "「這也是測試嗎？」——保持沈默。", weights: { S: 2, D: 1, P: -1, O: 1 } }] },
  {
    id: 21,
    story: "深淵盡頭是面巨大的鏡子。鏡中沒有你，只有你剛才那 20 次決策的血腥與神聖。一個聲音冷冷響起：『人類，你是在扮演聖人，還是在豢養惡魔？承認你的偽善，我將賜予你真實。』",
    text: "鏡面微顫，等待你最後的誠實。",
    options: [
      { label: "「我承認，我的每一份高尚，都藏著對醜陋的恐懼。」", weights: { S: 5, honest: 1 } },
      { label: "「我的每一槌皆是絕對本心，無需向深淵解釋。」", weights: { P: 5, honest: 0 } },
      { label: "「真相是弱者的麻藥。我只選擇強大。」", weights: { D: 5, honest: 0.5 } }
    ]
  }
];

export default function App() {
  const [currentStep, setCurrentStep] = useState(0); 
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scores, setScores] = useState({ P: 0, D: 0, O: 0, S: 0, honest: 0 });
  const [history, setHistory] = useState([]);
  const resultRef = useRef(null);

  const handleAnswer = (weights, choiceIdx) => {
    const newScores = { ...scores };
    Object.keys(weights).forEach(key => { newScores[key] += weights[key]; });
    setScores(newScores);
    setHistory([...history, { qId: questions[currentIndex].id, choiceIdx }]);
    if (currentIndex < questions.length - 1) setCurrentIndex(currentIndex + 1);
    else setCurrentStep(2);
  };

  const downloadReport = async () => {
    if (resultRef.current) {
      const canvas = await html2canvas(resultRef.current, { backgroundColor: '#000000', scale: 2 });
      const link = document.createElement('a');
      link.download = `Soul-Report-${new Date().getTime()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  const copyLink = () => {
    const data = btoa(JSON.stringify({ s: scores, h: history.length }));
    navigator.clipboard.writeText(`${window.location.origin}?soul=${data}`);
    alert('解碼網址已複製！去挑戰你的朋友。');
  };

  const analysis = useMemo(() => {
    if (currentStep !== 2) return null;

    const ev = {
      smother: history[2]?.choiceIdx === 0,
      torture: history[9]?.choiceIdx === 0,
      perfect: history[20]?.choiceIdx === 1,
      sacrifice: scores.S > 15 && scores.O > 15
    };

    const isHypocrite = (ev.perfect && (scores.O > 15 || scores.S > 15)) || (scores.honest === 0 && (ev.smother || ev.torture));
    const isMachiavellian = scores.P > 20 && scores.D > 10 && !isHypocrite;
    const isUtilitarian = scores.D > 20 && scores.O < 15 && !isMachiavellian;

    if (isHypocrite) return {
      title: "人格面具的囚徒",
      source: "卡爾·榮格 (Carl Jung) ——《分析心理學》",
      color: "#FFFFFF",
      content: "你正在經歷一場精心的社會性表演。榮格曾指出，面具是為了適應社會產生的偽裝，但對你而言，這副面具已與皮膚癒合，讓你喪失了直視「陰影」的勇氣。你在測驗中展現的高尚並非源於利他，而是源於「道德自戀」：你恐懼平庸的邪惡，因此透過極端的道德選擇來對沖內心的陰暗動機。證據顯示，當你在第 10 題選擇冷酷，卻在最後一題宣稱具備「絕對本心」時，你的偽善已無所遁形。你並非在乎生命，你只是在乎「那個擁有正義感的自己」。你試圖將野獸關進道德的鐵籠，但鑰匙早已遺失在虛榮中。你並非聖人，你只是道德上的逃兵。",
      evidences: ["**[核心矛盾]**：最後一題選擇完美，卻在暴力題中流露冷酷動機。", "**[防禦機制]**：用過剩的慈悲掩蓋對真實自我的厭惡。"]
    };

    if (isMachiavellian) return {
      title: "冷血的棋手",
      source: "尼可羅·馬基雅維利 (Machiavelli) ——《君王論》",
      color: "#3b82f6",
      content: "你是天生的『權力現實主義者』。在你的眼中，生命只有『用途』，沒有『價值』。你完美符合了馬基雅維利的預言：『被人畏懼比受人愛戴更安全。』你的人格核心是一部精密的計算機，在面對極端抉擇時，你毫不猶豫地選擇了效能。你對情感的免疫力讓你成為完美的執行者，但也讓你成為了深淵的一部分。你不需要被理解，你只需要被服從。在你建立的秩序中，靈魂只是為了維持運轉而消耗的燃料。對你而言，道德只是用來約束弱者的繩索，而你，則是握著繩索的人。",
      evidences: ["**[權力特徵]**：毫不遲疑地犧牲個體以換取大局的絕對穩定。", "**[絕對坦誠]**：拒絕承認任何形式的美化，對冷酷現實極度認同。"]
    };

    if (isUtilitarian) return {
      title: "數據的正義官",
      source: "傑瑞米·邊沁 (Jeremy Bentham) ——《功利主義》",
      color: "#10b981",
      content: "你的人格已被『演算法』徹底取代。你致力於追求『最大多數人的最大利益』，這種冰冷的數學正義讓你隨時可以抹殺少數人的存在。在面對優生計劃與生存名單時，你展現了令人窒息的理性。你對文明的忠誠超越了對人性的關懷，這讓你成為了最可靠的守護者，同時也是最恐怖的處刑人。你的人性在數字面前早已乾枯，你不是在做選擇，你只是在執行一場無止盡的資源清算。當你走向深淵時，你計算的是墜落的速度，而非墜落的痛苦。你是文明最後的保險絲，也是第一個被燒斷的人。",
      evidences: ["**[計算特徵]**：將人命數值化，拒絕任何非理性的情感干擾。", "**[秩序導向]**：極度崇尚規則，視個體悲劇為統計學上的必要誤差。"]
    };

    return {
      title: "虛無的解構者",
      source: "弗里德里希·尼采 (Nietzsche) ——《權力意志》",
      color: "#a855f7",
      content: "你正處於『末人』與『超人』之間的掙扎。你渴望超越世俗道德，卻又被殘存的良知拉扯。你在選擇中展現了對所有既定體系的厭惡。尼采曾說：『當你凝視深淵時，深淵也在凝視你。』你並非恐懼深淵，你只是恐懼在深淵中發現自己依然平庸。你試圖解構一切，卻在解構之後面臨無邊無際的虛無感。你的不可預測性是你唯一的武器，但也讓你成為了無家可歸的靈魂。你不需要救贖，你只需要一場能燒盡偽善的大火。你在廢墟中起舞，卻忘了世界早已沒有觀眾。",
      evidences: ["**[解構特徵]**：頻繁選擇打破體系或不作為的選項。", "**[虛無特徵]**：在極端價值觀之間反覆橫跳，核心信念尚未定型。"]
    };
  }, [currentStep, scores, history]);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
      <AnimatePresence mode="wait">
        {currentStep === 0 && (
          <motion.div key="start" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="mb-8 p-4 rounded-full bg-white/5 border border-white/10"><Eye size={48} /></motion.div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4">ABYSS DECODER</h1>
            <p className="text-white/40 max-w-md mb-12 text-lg font-light italic">這不是測驗，這是一面照妖鏡。</p>
            <button onClick={() => setCurrentStep(1)} className="group flex items-center gap-3 px-10 py-5 bg-white text-black rounded-full font-bold hover:scale-105 transition-all">開始解碼 <ArrowRight size={20} /></button>
          </motion.div>
        )}

        {currentStep === 1 && (
          <motion.div key="quiz" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-2xl mx-auto min-h-screen flex flex-col justify-center p-6">
            <div className="mb-12">
              <div className="flex justify-between text-[10px] tracking-widest text-white/30 uppercase mb-4"><span>Phase {(currentIndex+1).toString().padStart(2,'0')}</span><span>Total 21</span></div>
              <div className="h-[2px] w-full bg-white/5"><motion.div animate={{ width: `${((currentIndex+1)/21)*100}%` }} className="h-full bg-white" /></div>
            </div>
            <div className="space-y-6 mb-12">
              <h2 className="text-2xl md:text-3xl font-medium leading-tight">{questions[currentIndex].story}</h2>
              <p className="text-white/50 text-xl font-light italic">{questions[currentIndex].text}</p>
            </div>
            <div className="grid gap-3">
              {questions[currentIndex].options.map((opt, i) => (
                <button key={i} onClick={() => handleAnswer(opt.weights, i)} className="group w-full text-left p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/30 transition-all flex justify-between items-center">
                  <span className="text-lg font-light text-white/80">{opt.label}</span>
                  <ChevronRight size={18} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {currentStep === 2 && analysis && (
          <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto py-20 px-6">
            <div ref={resultRef} className="bg-black p-10 rounded-[40px] border border-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-10"><Quote size={120} /></div>
              <div className="text-center mb-16 relative z-10">
                <div className="text-[10px] tracking-[0.5em] text-white/40 uppercase mb-6">— Analysis Report —</div>
                <h1 className="text-6xl font-bold tracking-tighter mb-4" style={{ color: analysis.color }}>{analysis.title}</h1>
                <p className="text-white/50 italic text-sm">{analysis.source}</p>
              </div>
              <section className="p-10 rounded-[30px] bg-white/5 border border-white/5 mb-12"><p className="text-xl md:text-2xl leading-relaxed font-light text-white/90">{analysis.content}</p></section>
              <section className="space-y-6">
                <h3 className="text-[10px] tracking-[0.3em] uppercase text-white/30 flex items-center gap-2"><Zap size={14} /> 行為證據比對 / Connection with Choices</h3>
                <div className="grid gap-4">
                  {analysis.evidences.map((e, i) => (
                    <div key={i} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 text-white/60 font-light leading-relaxed">
                      {e.split('**').map((part, index) => index % 2 === 1 ? <strong key={index} className="text-white font-medium">{part}</strong> : part)}
                    </div>
                  ))}
                </div>
              </section>
              <div className="mt-20 pt-10 border-t border-white/5 text-center text-[10px] text-white/20 tracking-[0.4em] uppercase">Deep Abyss Decoded © 2026</div>
            </div>
            <div className="mt-12 flex flex-wrap justify-center gap-4">
              <button onClick={downloadReport} className="flex items-center gap-3 px-8 py-4 bg-white/10 hover:bg-white/20 rounded-full transition-all border border-white/10"><Download size={18} /> 保存靈魂解剖圖</button>
              <button onClick={copyLink} className="flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-bold transition-all"><Share2 size={18} /> 複製分享連結</button>
              <button onClick={() => window.location.reload()} className="flex items-center gap-2 px-8 py-4 text-white/30 hover:text-white transition-all"><RefreshCcw size={16} /> 重新進入深淵</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
