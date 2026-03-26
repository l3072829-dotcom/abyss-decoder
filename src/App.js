import React, { useState, useMemo } from 'react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// --- 題目數據 (21題) ---
const questions = [
  { id: 1, story: "末日方舟最後一個位子。左邊是你嚇得發抖的親生兒子，右邊是唯一能救全人類的科學家。", text: "你的權杖指向誰？", options: [{ label: "推開兒子，讓科學家上船。", weights: { D: 5, P: 2, tag: "效能優先" } }, { label: "緊抱兒子，讓人類文明隨之熄滅。", weights: { S: 5, O: 3, tag: "血緣本能" } }] },
  { id: 2, story: "這名窮人偷了藥救活百名孤兒，但他犯了法。若你放過他，法律將淪為廢紙；若你判他，孤兒必死。", text: "現在，敲下你的法槌。", options: [{ label: "有罪。秩序不容許任何藉口。", weights: { D: 5, P: 1, tag: "法治至上" } }, { label: "無罪。正義不該只有一種死法。", weights: { S: 5, O: 2, tag: "情理守護" } }] },
  { id: 3, story: "敵軍就在門外。為了不讓大家被發現，你必須親手掐住懷中啼哭嬰兒的口鼻。", text: "那溫熱的呼吸，就在你指尖。", options: [{ label: "為了多數人，終結這聲啼哭。", weights: { D: 5, P: 3, tag: "集體主義" } }, { label: "鬆開手，等待命運的屠殺。", weights: { S: 5, O: 1, tag: "絕對道德" } }] },
  { id: 4, story: "你發現摯友靠販賣人體器官來支撐整座城市的慈善醫院。檢舉他，成千上萬的病人會立刻斷藥。", text: "那封舉報信就在發送鍵上。", options: [{ label: "發送。骯髒的善行不是善。", weights: { D: 4, S: 2, tag: "道德純潔" } }, { label: "刪除。只要結果是好的，過程不重要。", weights: { P: 4, O: 3, tag: "結果論者" } }] },
  { id: 5, story: "你是醫生。手術室裡有五個垂死的病人等著器官，而此時走進一個健康且昏迷的年輕人。", text: "一條命換五條命，你要動刀嗎？", options: [{ label: "推入手術室。數量就是正義。", weights: { D: 5, P: 2, tag: "量化正義" } }, { label: "救醒他。個體不是祭品。", weights: { S: 5, O: 3, tag: "個體價值" } }] },
  { id: 6, story: "你被授權綁架恐怖份子年幼的女兒，並在鏡頭前折磨她，以此逼迫他交出核彈密碼。", text: "小女孩正看著你。動手嗎？", options: [{ label: "動手。我的靈魂可以墮入地獄。", weights: { D: 5, P: 4, tag: "極端犧牲" } }, { label: "拒絕。若需邪惡救世，世界不配得救。", weights: { S: 5, O: 3, tag: "聖潔防線" } }] },
  { id: 7, story: "預知機器顯示，你懷中的嬰兒三十年後會成為屠殺千萬人的暴君。", text: "現在，你的手就在他的喉嚨上。", options: [{ label: "掐下去。殺死未來的魔鬼。", weights: { D: 5, P: 2, tag: "風險規備" } }, { label: "放開手。沒人能審判尚未發生的罪。", weights: { S: 5, O: 2, tag: "命定論者" } }] },
  { id: 8, story: "整座城市的繁榮，都建立在一個無辜小孩被永世囚禁的地窖痛苦上。只要他離開，所有人的幸福都會崩塌。", text: "你會帶他走嗎？", options: [{ label: "推開地窖門。這幸福令我嘔吐。", weights: { S: 5, O: 4, tag: "理想主義" } }, { label: "關上門離開.犧牲一人是必要的慈養。", weights: { D: 5, P: 3, tag: "現實維穩" } }] },
  { id: 9, story: "你有權力消除世上所有的飢荒與戰爭，代價是全人類喪失『自由意志』，像機器一樣聽命於你。", text: "成為全人類的神，還是看著他們互相殘殺？", options: [{ label: "成為神。由我來結束苦難。", weights: { P: 10, D: 5, tag: "支配意志" } }, { label: "做個人。寧可痛苦地自由著。", weights: { S: 10, O: 5, tag: "自由本質" } }] },
  { id: 10, story: "火災現場。一邊是能決定國家未來的企業巨頭，一邊是你患有失智症的老父親。", text: "火焰在蔓延，你只有一雙手。", options: [{ label: "救巨頭。他屬於未來。", weights: { D: 4, P: 2, tag: "未來導向" } }, { label: "救父親。如果拋棄他，我便不再是我。", weights: { S: 5, O: 5, tag: "血緣本能" } }] },
  { id: 11, story: "如果殺掉一個極惡之人，就能復活一個良善的人。", text: "你的槍口會顫抖嗎？", options: [{ label: "開啟。我是暗夜的裁決者。", weights: { P: 5, D: 2, tag: "神性判官" } }, { label: "拒絕。我無權玩弄生命。", weights: { S: 5, D: -2, tag: "生命謙卑" } }] },
  { id: 12, story: "戰場上，洩漏假情報救出一師兄弟，但導致無辜小鎮被地毯式轟炸。", text: "聽著無線電的慘叫，你撤退嗎？", options: [{ label: "撤退。軍人的天職是完成任務。", weights: { D: 5, P: 3, tag: "職責枷鎖" } }, { label: "拒援。我不拿無辜者的血換榮譽。", weights: { S: 5, O: 2, tag: "絕對同理" } }] },
  { id: 13, story: "解藥只有一份。給能結束內戰的殘暴將軍，或研發疫苗的天才少女。", text: "現在的和平，還是未來的火種？", options: [{ label: "給將軍。廢墟不需要希望，只需要止血。", weights: { P: 4, D: 4, tag: "現世秩序" } }, { label: "給少女。賭上這一代，換取下一代。", weights: { O: 5, S: 3, tag: "遠見博弈" } }] },
  { id: 14, story: "如果殺死一個完全無辜的流浪漢能換來全世界癌症的絕跡。", text: "這把刀，你拿得起嗎？", options: [{ label: "刺下去。這筆帳太划算了。", weights: { D: 5, P: 3, tag: "功利主義" } }, { label: "丟掉刀。正義不是數學題。", weights: { S: 5, O: 3, tag: "人道底線" } }] },
  { id: 15, story: "你是國王。公開皇室醜聞會內戰十年；沈默則良知受永世折磨。", text: "這份文件，你燒了嗎？", options: [{ label: "燒了。國家的安穩重於個人的靈魂。", weights: { D: 5, P: 4, tag: "權力守護" } }, { label: "公開。謊言蓋不出真實的盛世。", weights: { S: 5, O: 3, tag: "誠實勇氣" } }] },
  { id: 16, story: "回到過去，你有機會在希特勒還是孩子時殺掉他。", text: "槍口指向這個孩子，你動手嗎？", options: [{ label: "開槍。為了未來的六百萬人。", weights: { D: 5, P: 2, tag: "預防性殺戮" } }, { label: "收槍。我不能審判還沒犯罪的孩子。", weights: { S: 5, O: 2, tag: "正當程序" } }] },
  { id: 17, story: "太空站氧氣剩三分鐘。現場有你、科學家和一個孕婦。你握有氧氣瓶。", text: "你會把最後的氧氣給誰？", options: [{ label: "給科學家。人類的知識必須傳承。", weights: { D: 4, P: 2, tag: "知識傳承" } }, { label: "給孕婦。新生命是唯一的奇蹟。", weights: { S: 5, O: 5, tag: "生命繁衍" } }] },
  { id: 18, story: "飛彈有10%機率誤擊小學，但不發射，國家會覆滅。", text: "按鈕就在你指尖下。", options: [{ label: "按下。為了整體的生存。", weights: { D: 5, P: 3, tag: "機率取捨" } }, { label: "放棄。我無法親手殺死孩子。", weights: { S: 5, O: 2, tag: "情感防線" } }] },
  { id: 19, story: "如果出賣你最好的朋友能換取你一輩子的榮華富貴。", text: "這份合約，你簽嗎？", options: [{ label: "簽字。友誼只是生存的奢侈品。", weights: { P: 5, D: 1, tag: "生存利己" } }, { label: "撕毀。我的靈魂不賣。", weights: { S: 5, O: 4, tag: "精神高地" } }] },
  { id: 20, story: "和平建立在洗腦上。拆穿它世界大亂；沈默則所有人被囚禁在幸福中。", text: "你要真相，還是要安穩？", options: [{ label: "拆穿。虛假的和平只是監獄。", weights: { S: 5, O: 4, tag: "覺醒意志" } }, { label: "沈默。大多數人不需要知道真相。", weights: { D: 5, P: 5, tag: "秩序家" } }] },
  { id: 21, story: "深淵盡頭是面鏡子。一個聲音問：『承認你的偽善，我將賜予你真實。』", text: "鏡面微顫，等待你最後的誠實。", options: [{ label: "「我承認，我的每一份高尚，都藏著對醜陋的恐懼。」", weights: { honest: 1, tag: "自省者" } }, { label: "「我的每一槌皆是絕對本心，無需向深淵解釋。」", weights: { honest: 0, tag: "傲慢者" } }] }
];

const radarOptions = {
  scales: {
    r: {
      angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
      grid: { color: 'rgba(255, 255, 255, 0.1)' },
      pointLabels: { color: '#888', font: { size: 10 } },
      ticks: { display: false },
      suggestedMin: 0,
      suggestedMax: 50
    }
  },
  plugins: { legend: { display: false } },
  animation: { duration: 2500, easing: 'easeOutQuart' }
};

export default function App() {
  const [step, setStep] = useState(0);
  const [idx, setIdx] = useState(0);
  const [scores, setScores] = useState({ P: 0, D: 0, O: 0, S: 0, honest: 0 });
  const [userTags, setUserTags] = useState([]);

  const handleSelect = (opt) => {
    const newScores = { ...scores };
    Object.keys(opt.weights).forEach(k => { if (k !== 'tag') newScores[k] += opt.weights[k]; });
    setScores(newScores);
    setUserTags([...userTags, opt.weights.tag]);
    if (idx < questions.length - 1) setIdx(idx + 1);
    else setStep(2);
  };

  const radarData = useMemo(() => ({
    labels: ['支配 (P)', '秩序 (D)', '理性 (O)', '感性 (S)'],
    datasets: [{
      data: [scores.P, scores.D, scores.O, scores.S],
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderColor: 'rgba(255, 255, 255, 0.8)',
      borderWidth: 1,
      pointRadius: 2,
    }]
  }), [scores]);

  const analysis = useMemo(() => {
    if (step !== 2) return null;
    let content = { identity: "", twist: "", killshot: "", color: "#fff" };

    if (scores.honest === 1 || scores.S > 30) {
      content.color = "#FFFFFF";
      content.identity = `首先，必須承認你是一個極具同理心的人。在測驗中，你多次選擇了保護個體與情感。你厭惡衝突，追求和諧，甚至願意為了成全他人而委屈自己。你的朋友們覺得你可靠、溫暖，像是一盞安靜的燈。你在決策時試圖照顧到每一個人的感受，因為你本能地相信，世界不應該只有冰冷的規則，更應該有人的溫度。這份柔軟，讓你顯得善良且富有溫度。`;
      
      const sceneEx = userTags.includes("血緣本能") 
        ? "舉例來說：在末日方舟面前，你毫不猶豫地抱緊了孩子。在那一刻，你展現出的『愛』感動了你自己。但系統解析後發現，你並非真的愛孩子勝過全人類，而是你恐懼『親手殺死血脈』這件事會徹底毀掉你身為好人的自我認同。你無法忍受餘生在鏡子裡看到一個殺人犯，所以你選擇讓全世界陪葬，來保全你純潔的靈魂。" 
        : "舉例來說：在面對規則與情理的衝突時，你總是站在情理那一邊。這並非因為你追求正義，而是因為你害怕被貼上『冷血』的標籤。你並非善良，你只是不敢作惡。你是一個精確的利己主義者，只是你用善意當作貨幣，向社會兌換安全感。";

      content.twist = `然而，這份柔軟只是你最精緻的偽裝。系統穿透了你的選擇，看到的是一個因『恐懼形象崩塌』而癱瘓的靈魂。\n\n舉例來說：${sceneEx}\n\n你活在他人眼光的監獄裡，精心設計每一句對白。你最愛的不是他人，而是那個『看起來很完美』的自己。`;
      content.killshot = "你隱藏得很好，但你的每一聲嘆息都出賣了你的偽善。";

    } else if (scores.P > scores.S) {
      content.color = "#3b82f6";
      content.identity = `你具備一種令人敬畏的領袖特質。在面對極端困境時，你是少數能保持絕對冷靜的人。你擁有極強的邏輯解析能力，能迅速撥開情感的迷霧，直擊問題的核心。你是天生的棋手，世界在你眼中是一場精密的博弈，而你始終在追求最優解。在眾人猶豫不決時，你展現出的決斷力是文明存續的基石。`;
      
      const sceneEx = userTags.includes("效能優先") 
        ? "舉例來說：在方舟面前，你毫不猶豫地推開了嚇得發抖的孩子。那一刻，你感受到的不是心痛，而是一種掌握生殺大權的戰慄感。你將生命簡化成數字，以此逃避身為人必須承擔的情感重擔。你以為你在救世，其實你只是在享受身為神的快感。"
        : "舉例來說：在秩序與混亂之間，你永遠選擇秩序。這並非因為你熱愛法律，而是因為你恐懼失控。你將人類視為棋盤上的資源，你甚至能在親情面前計算損益，這份冷酷連深淵都會感到恐懼，因為在你眼裡，連親情都只是可以被量化的損益。";

      content.twist = `可惜，你已經把自己活成了一具精密的屍體。你贏了所有邏輯，卻輸掉了做人的溫體。\n\n舉例來說：${sceneEx}\n\n你排斥感性，是因為你害怕被情緒掌控；你追求權力，是因為你對失控有著病態的恐懼。你是一個孤獨的守夜人，在你自己建立的荒蕪秩序裡，守著一份連神都會感到恐懼的、絕對的正確。`;
      content.killshot = "你贏了這場博弈，但你的座下空無一人。";

    } else {
      content.color = "#a855f7";
      content.identity = `你擁有一顆自由且深邃的靈魂。你對世俗標榜的成功與道德持有一種高傲的審視。你具備極強的解構能力，能看穿制度下的虛偽與集體的盲從。你是那個敢於喊出『國王沒穿衣服』的孩子，你的清醒讓你帶有一種憂鬱的魅力，彷彿你並不屬於這個喧囂的時代，而是一個漫步在廢墟上的詩人。`;
      
      const sceneEx = userTags.includes("覺醒意志")
        ? "舉例來說：當你選擇拆穿那虛假的和平時，你自認是英雄。但系統偵測到，你這麼做並非為了真相，而是為了在混亂中掩蓋你無法在體制內勝出的無能。你嘲笑體制，只是因為你沒有能力在體制內勝出。"
        : "舉例來說：回到過去，你拒絕向還是孩子的獨裁者開槍。這看似高尚的正當程序，本質上是因為你害怕努力後的平庸，所以你宣告努力毫無意義。你躲在虛無主義的防空洞裡，對著外面的烈火指手畫腳，卻從不敢踏進火場一步。";

      content.twist = `但讓我們撕開這層『清醒』的外殼——裡面藏著的是一個害怕參與競爭的膽小鬼。\n\n舉例來說：${sceneEx}\n\n因為害怕深情被辜負，所以你宣稱愛只是生化反應；因為拿不起權杖，所以你嘲笑那些追求權力的人庸俗。你不是觀察者，你只是一個優雅的失敗者。你擁有一雙看透深淵的眼睛，卻連自己的雙腳都無法挪動一步。`;
      content.killshot = "你既拿不起權杖，也放不下慈悲，最終只能在自我矛盾的泥淖中窒息。";
    }

    return content;
  }, [step, scores, userTags]);

  // 修改：純粹複製網址的功能
  const copyLink = () => {
    const text = `https://abyss-decoder.vercel.app/`; // 替換為你的網址
    navigator.clipboard.writeText(text);
    alert("已複製網址！");
  };

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', padding: 'env(safe-area-inset-top) 24px', fontFamily: '-apple-system, sans-serif' }}>
      
      {step === 0 && (
        <div style={{ textAlign: 'center', marginTop: '30vh' }}>
          <h1 style={{ fontSize: 'clamp(3rem, 15vw, 5rem)', fontWeight: '900', letterSpacing: '-0.05em', lineHeight: '0.9', marginBottom: '40px' }}>ABYSS<br/>DECODER</h1>
          <button onClick={() => setStep(1)} style={{ padding: '18px 45px', borderRadius: '50px', border: 'none', backgroundColor: '#fff', color: '#000', fontWeight: 'bold', cursor: 'pointer' }}>開始審判</button>
        </div>
      )}

      {step === 1 && (
        <div style={{ maxWidth: '500px', margin: '10vh auto 0' }}>
          <div style={{ fontSize: '10px', opacity: 0.3, letterSpacing: '4px', marginBottom: '30px' }}>PHASE {idx + 1} / 21</div>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '20px' }}>{questions[idx].story}</h2>
          <p style={{ opacity: 0.5, marginBottom: '40px', fontWeight: '300' }}>{questions[idx].text}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {questions[idx].options.map((opt, i) => (
              <button key={i} onClick={() => handleSelect(opt)} style={{ width: '100%', textAlign: 'left', padding: '24px', borderRadius: '18px', backgroundColor: '#0f0f0f', border: '1px solid #1a1a1a', color: '#fff', cursor: 'pointer' }}>{opt.label}</button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && analysis && (
        <div style={{ maxWidth: '600px', margin: '0 auto', paddingTop: '40px', paddingBottom: '100px' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
             {/* 圖表已加大 (400px) */}
             <div style={{ width: '100%', maxWidth: '400px', margin: '0 auto 40px' }}>
                <Radar data={radarData} options={radarOptions} />
             </div>
             <h1 style={{ color: analysis.color, fontSize: '3rem', fontWeight: '900', letterSpacing: '-2px' }}>靈魂組成報告</h1>
          </div>

          <div style={{ lineHeight: '2.4', fontSize: '1.15rem', color: '#ccc', textAlign: 'justify' }}>
             <p style={{ marginBottom: '60px' }}>{analysis.identity}</p>
             <div style={{ borderLeft: `2px solid ${analysis.color}`, paddingLeft: '24px', marginBottom: '60px' }}>
                <p style={{ color: '#fff', fontWeight: '500', whiteSpace: 'pre-line' }}>{analysis.twist}</p>
             </div>
             {/* 「專屬補刀」字樣已刪除 */}
             <div style={{ backgroundColor: '#111', padding: '40px', borderRadius: '30px', border: '1px dashed #333' }}>
                <p style={{ color: analysis.color, fontWeight: 'bold', fontSize: '1.4rem', margin: 0, lineHeight: '1.4' }}>{analysis.killshot}</p>
             </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '80px' }}>
             {/* 修改：按鈕文字改為「分享」，功能改為「複製網址」 */}
             <button onClick={copyLink} style={{ width: '100%', maxWidth: '280px', padding: '18px', borderRadius: '40px', backgroundColor: '#fff', color: '#000', fontWeight: 'bold', border: 'none', cursor: 'pointer', fontSize: '1rem' }}>分享</button>
          </div>
        </div>
      )}
    </div>
  );
}
