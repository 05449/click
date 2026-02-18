// ===============================================
// クッキークリッカー 神ゲー版 - メインスクリプト
// ===============================================

const VERSION = '3.0.0';
const STORAGE_KEY = 'cookie_clicker_save_v4';

// ===============================================
// ゲームデータ定義
// ===============================================

const BUILDINGS = [
  { id: 0, name: 'カーソル', emoji: '👆', baseCost: 15, baseCps: 0.1, desc: '自動でクリックしてくれる' },
  { id: 1, name: 'おばあちゃん', emoji: '👵', baseCost: 100, baseCps: 1, desc: '優しいおばあちゃんがクッキーを焼く' },
  { id: 2, name: '農場', emoji: '🌾', baseCost: 1100, baseCps: 8, desc: 'クッキーの種を育てる' },
  { id: 3, name: '工場', emoji: '🏭', baseCost: 12000, baseCps: 47, desc: '大量生産でクッキーを製造' },
  { id: 4, name: '鉱山', emoji: '⛏️', baseCost: 130000, baseCps: 260, desc: 'チョコチップを採掘' },
  { id: 5, name: '研究所', emoji: '🔬', baseCost: 1400000, baseCps: 1400, desc: '新しいクッキーを研究' },
  { id: 6, name: '寺院', emoji: '⛩️', baseCost: 20000000, baseCps: 7800, desc: 'クッキーの神に祈る' },
  { id: 7, name: '魔法塔', emoji: '🗼', baseCost: 330000000, baseCps: 44000, desc: '魔法でクッキーを召喚' },
  { id: 8, name: '宇宙船', emoji: '🚀', baseCost: 5100000000, baseCps: 260000, desc: '宇宙からクッキーを収穫' },
  { id: 9, name: '錬金術', emoji: '⚗️', baseCost: 75000000000, baseCps: 1600000, desc: '金をクッキーに変換' },
  { id: 10, name: 'ポータル', emoji: '🌀', baseCost: 1e12, baseCps: 10000000, desc: '異次元からクッキーを輸入' },
  { id: 11, name: '時間マシン', emoji: '⏰', baseCost: 1.4e13, baseCps: 65000000, desc: '未来からクッキーを持ってくる' },
  { id: 12, name: '反物質変換機', emoji: '⚛️', baseCost: 1.7e14, baseCps: 430000000, desc: '反物質をクッキーに' },
  { id: 13, name: 'プリズム', emoji: '💎', baseCost: 2.1e15, baseCps: 2900000000, desc: '光をクッキーに変換' },
  { id: 14, name: 'チャンスメーカー', emoji: '🎲', baseCost: 2.6e16, baseCps: 21000000000, desc: '確率を操作してクッキーを生成' },
];

const UPGRADES = [
  // クリック強化
  { id: 'click1', name: '強化された指', icon: '👆', cost: 100, type: 'click', mult: 2, desc: 'クリック力2倍', req: () => game.stats.totalClicks >= 15 },
  { id: 'click2', name: '手首サポーター', icon: '🦾', cost: 500, type: 'click', mult: 2, desc: 'クリック力さらに2倍', req: () => hasUpgrade('click1') },
  { id: 'click3', name: '超高速タップ', icon: '⚡', cost: 10000, type: 'click', mult: 2, desc: 'クリック力さらに2倍', req: () => hasUpgrade('click2') },
  { id: 'click4', name: '量子クリック', icon: '🔮', cost: 100000, type: 'click', mult: 2, desc: 'クリック力さらに2倍', req: () => hasUpgrade('click3') },
  { id: 'click5', name: '神の指', icon: '✨', cost: 10000000, type: 'click', mult: 5, desc: 'クリック力5倍', req: () => hasUpgrade('click4') },
  
  // CPSの％がクリックに加算
  { id: 'clickCps1', name: 'クッキーの連鎖', icon: '🔗', cost: 1000, type: 'clickCps', value: 0.01, desc: 'CPSの1%がクリックに加算', req: () => game.cps >= 10 },
  { id: 'clickCps2', name: 'クッキーの波動', icon: '🌊', cost: 50000, type: 'clickCps', value: 0.01, desc: 'CPSの追加1%がクリックに加算', req: () => hasUpgrade('clickCps1') },
  { id: 'clickCps3', name: 'クッキーの嵐', icon: '🌪️', cost: 5000000, type: 'clickCps', value: 0.03, desc: 'CPSの追加3%がクリックに加算', req: () => hasUpgrade('clickCps2') },
  
  // 建物強化 - カーソル
  { id: 'cursor1', name: '補強された指', icon: '👆', cost: 100, type: 'building', target: 0, mult: 2, desc: 'カーソル効率2倍', req: () => getBuildingCount(0) >= 1 },
  { id: 'cursor2', name: 'Ambidextrous', icon: '🤲', cost: 500, type: 'building', target: 0, mult: 2, desc: 'カーソル効率2倍', req: () => getBuildingCount(0) >= 5 },
  { id: 'cursor3', name: '千手観音', icon: '🙏', cost: 10000, type: 'building', target: 0, mult: 2, desc: 'カーソル効率2倍', req: () => getBuildingCount(0) >= 25 },
  
  // 建物強化 - おばあちゃん
  { id: 'grandma1', name: '秘伝のレシピ', icon: '📖', cost: 1000, type: 'building', target: 1, mult: 2, desc: 'おばあちゃん効率2倍', req: () => getBuildingCount(1) >= 1 },
  { id: 'grandma2', name: '電動ミキサー', icon: '🔌', cost: 5000, type: 'building', target: 1, mult: 2, desc: 'おばあちゃん効率2倍', req: () => getBuildingCount(1) >= 5 },
  { id: 'grandma3', name: 'おばあちゃん軍団', icon: '👵👵👵', cost: 50000, type: 'building', target: 1, mult: 2, desc: 'おばあちゃん効率2倍', req: () => getBuildingCount(1) >= 25 },
  
  // 建物強化 - 農場
  { id: 'farm1', name: '高級肥料', icon: '🌱', cost: 11000, type: 'building', target: 2, mult: 2, desc: '農場効率2倍', req: () => getBuildingCount(2) >= 1 },
  { id: 'farm2', name: '遺伝子改良', icon: '🧬', cost: 55000, type: 'building', target: 2, mult: 2, desc: '農場効率2倍', req: () => getBuildingCount(2) >= 5 },
  { id: 'farm3', name: 'メガファーム', icon: '🚜', cost: 550000, type: 'building', target: 2, mult: 2, desc: '農場効率2倍', req: () => getBuildingCount(2) >= 25 },
  
  // 建物強化 - 工場
  { id: 'factory1', name: 'ロボットアーム', icon: '🦾', cost: 130000, type: 'building', target: 3, mult: 2, desc: '工場効率2倍', req: () => getBuildingCount(3) >= 1 },
  { id: 'factory2', name: 'AI管理システム', icon: '🤖', cost: 650000, type: 'building', target: 3, mult: 2, desc: '工場効率2倍', req: () => getBuildingCount(3) >= 5 },
  
  // 建物強化 - 鉱山
  { id: 'mine1', name: 'ダイヤドリル', icon: '💎', cost: 1200000, type: 'building', target: 4, mult: 2, desc: '鉱山効率2倍', req: () => getBuildingCount(4) >= 1 },
  { id: 'mine2', name: '地底探査機', icon: '🔦', cost: 6000000, type: 'building', target: 4, mult: 2, desc: '鉱山効率2倍', req: () => getBuildingCount(4) >= 5 },
  
  // 建物強化 - 研究所
  { id: 'lab1', name: '特許取得', icon: '📜', cost: 14000000, type: 'building', target: 5, mult: 2, desc: '研究所効率2倍', req: () => getBuildingCount(5) >= 1 },
  { id: 'lab2', name: '量子コンピュータ', icon: '💻', cost: 70000000, type: 'building', target: 5, mult: 2, desc: '研究所効率2倍', req: () => getBuildingCount(5) >= 5 },
  
  // 全体強化
  { id: 'global1', name: 'クッキーの祝福', icon: '🙏', cost: 10000000, type: 'global', mult: 1.1, desc: '全ての生産+10%', req: () => game.stats.totalCookies >= 1000000 },
  { id: 'global2', name: 'クッキーの恩恵', icon: '🌟', cost: 100000000, type: 'global', mult: 1.15, desc: '全ての生産+15%', req: () => hasUpgrade('global1') },
  { id: 'global3', name: 'クッキーの奇跡', icon: '✨', cost: 1000000000, type: 'global', mult: 1.2, desc: '全ての生産+20%', req: () => hasUpgrade('global2') },
  
  // ゴールデンクッキー強化
  { id: 'golden1', name: 'ラッキーデイ', icon: '🍀', cost: 7777777, type: 'golden', value: 'duration', mult: 1.5, desc: 'ゴールデンクッキー効果時間+50%', req: () => game.stats.goldenClicked >= 7 },
  { id: 'golden2', name: 'セレンディピティ', icon: '🌠', cost: 77777777, type: 'golden', value: 'frequency', mult: 0.75, desc: 'ゴールデンクッキー出現間隔-25%', req: () => game.stats.goldenClicked >= 27 },
  { id: 'golden3', name: 'ゴールドハンド', icon: '🏆', cost: 777777777, type: 'golden', value: 'power', mult: 1.5, desc: 'ゴールデンクッキー効果+50%', req: () => game.stats.goldenClicked >= 77 },
];

const ACHIEVEMENTS = [
  // クリック系
  { id: 'click_1', name: '初めの一歩', icon: '👆', desc: '1回クリックした', check: () => game.stats.totalClicks >= 1 },
  { id: 'click_100', name: 'クリッカー', icon: '✊', desc: '100回クリックした', check: () => game.stats.totalClicks >= 100 },
  { id: 'click_1k', name: 'タップマスター', icon: '🤛', desc: '1,000回クリックした', check: () => game.stats.totalClicks >= 1000 },
  { id: 'click_10k', name: '連打の達人', icon: '💪', desc: '10,000回クリックした', check: () => game.stats.totalClicks >= 10000 },
  { id: 'click_100k', name: '伝説のクリッカー', icon: '🦾', desc: '100,000回クリックした', check: () => game.stats.totalClicks >= 100000 },
  { id: 'click_1m', name: '神指', icon: '☝️', desc: '1,000,000回クリックした', check: () => game.stats.totalClicks >= 1000000 },
  
  // 獲得数系
  { id: 'bake_100', name: '見習いベイカー', icon: '🍪', desc: '100クッキー獲得', check: () => game.stats.totalCookies >= 100 },
  { id: 'bake_1k', name: 'アマチュア', icon: '🥠', desc: '1,000クッキー獲得', check: () => game.stats.totalCookies >= 1000 },
  { id: 'bake_100k', name: 'プロベイカー', icon: '👨‍🍳', desc: '100,000クッキー獲得', check: () => game.stats.totalCookies >= 100000 },
  { id: 'bake_1m', name: 'クッキー長者', icon: '💰', desc: '1,000,000クッキー獲得', check: () => game.stats.totalCookies >= 1000000 },
  { id: 'bake_100m', name: 'クッキー億万長者', icon: '💎', desc: '100,000,000クッキー獲得', check: () => game.stats.totalCookies >= 100000000 },
  { id: 'bake_1b', name: 'クッキー王', icon: '👑', desc: '1,000,000,000クッキー獲得', check: () => game.stats.totalCookies >= 1000000000 },
  { id: 'bake_1t', name: 'クッキー帝王', icon: '🏰', desc: '1,000,000,000,000クッキー獲得', check: () => game.stats.totalCookies >= 1000000000000 },
  
  // CPS系
  { id: 'cps_10', name: '自動化の始まり', icon: '⚙️', desc: 'CPS 10達成', check: () => game.cps >= 10 },
  { id: 'cps_100', name: '量産体制', icon: '🏭', desc: 'CPS 100達成', check: () => game.cps >= 100 },
  { id: 'cps_1k', name: 'クッキー工場長', icon: '👷', desc: 'CPS 1,000達成', check: () => game.cps >= 1000 },
  { id: 'cps_10k', name: '産業革命', icon: '🚂', desc: 'CPS 10,000達成', check: () => game.cps >= 10000 },
  { id: 'cps_100k', name: 'メガファクトリー', icon: '🏗️', desc: 'CPS 100,000達成', check: () => game.cps >= 100000 },
  { id: 'cps_1m', name: 'ギガ生産', icon: '🌐', desc: 'CPS 1,000,000達成', check: () => game.cps >= 1000000 },
  
  // 建物系
  { id: 'buildings_10', name: 'コレクター', icon: '🏠', desc: '建物を合計10個所有', check: () => getTotalBuildings() >= 10 },
  { id: 'buildings_50', name: '不動産王', icon: '🏙️', desc: '建物を合計50個所有', check: () => getTotalBuildings() >= 50 },
  { id: 'buildings_100', name: '都市開発者', icon: '🌆', desc: '建物を合計100個所有', check: () => getTotalBuildings() >= 100 },
  { id: 'buildings_500', name: '帝国建設者', icon: '🗺️', desc: '建物を合計500個所有', check: () => getTotalBuildings() >= 500 },
  
  // ゴールデンクッキー系
  { id: 'golden_1', name: 'ラッキー！', icon: '🌟', desc: 'ゴールデンクッキーをクリック', check: () => game.stats.goldenClicked >= 1 },
  { id: 'golden_7', name: 'ラッキーセブン', icon: '🎰', desc: 'ゴールデンクッキーを7回クリック', check: () => game.stats.goldenClicked >= 7 },
  { id: 'golden_27', name: '幸運の持ち主', icon: '🍀', desc: 'ゴールデンクッキーを27回クリック', check: () => game.stats.goldenClicked >= 27 },
  { id: 'golden_77', name: 'ゴールドラッシュ', icon: '💫', desc: 'ゴールデンクッキーを77回クリック', check: () => game.stats.goldenClicked >= 77 },
  
  // 転生系
  { id: 'prestige_1', name: '転生者', icon: '🔄', desc: '初めて転生した', check: () => game.stats.timesPrestiged >= 1 },
  { id: 'prestige_10', name: '輪廻の達人', icon: '♻️', desc: '10回転生した', check: () => game.stats.timesPrestiged >= 10 },
  { id: 'chips_100', name: '天国の旅人', icon: '☁️', desc: '天国チップを100獲得', check: () => game.heavenlyChips >= 100 },
  { id: 'chips_1000', name: '天使', icon: '👼', desc: '天国チップを1,000獲得', check: () => game.heavenlyChips >= 1000 },
  
  // ドラゴン系
  { id: 'dragon_1', name: 'ドラゴンの卵', icon: '🥒', desc: 'ドラゴンを育て始めた', check: () => game.dragon.level >= 1 },
  { id: 'dragon_5', name: 'ドラゴンテイマー', icon: '🐉', desc: 'ドラゴンをLv5に', check: () => game.dragon.level >= 5 },
  { id: 'dragon_10', name: 'ドラゴンマスター', icon: '🔥', desc: 'ドラゴンをLv10に', check: () => game.dragon.level >= 10 },
  
  // 特殊
  { id: 'speed_100', name: 'スピードベイカー', icon: '⚡', desc: '1分以内に100クッキー', check: () => false }, // 特殊チェック
  { id: 'combo_10', name: 'コンボマスター', icon: '🔥', desc: 'コンボ10倍達成', check: () => game.combo >= 10 },
  { id: 'all_upgrades', name: 'アップグレードコレクター', icon: '📚', desc: '全てのアップグレードを購入', check: () => game.upgrades.length >= UPGRADES.length },
  
  // クリティカル系
  { id: 'crit_1', name: '会心の一撃', icon: '💫', desc: '初めてクリティカルヒット', check: () => game.stats.criticalHits >= 1 },
  { id: 'crit_50', name: 'クリティカルマスター', icon: '⭐', desc: 'クリティカル50回', check: () => game.stats.criticalHits >= 50 },
  { id: 'crit_500', name: 'ラッキーストライカー', icon: '🌟', desc: 'クリティカル500回', check: () => game.stats.criticalHits >= 500 },
  
  // 宝箱系
  { id: 'treasure_1', name: 'トレジャーハンター', icon: '📦', desc: '初めて宝箱を開けた', check: () => game.stats.treasuresOpened >= 1 },
  { id: 'treasure_10', name: '宝探しの達人', icon: '🎁', desc: '宝箱10個開封', check: () => game.stats.treasuresOpened >= 10 },
  { id: 'treasure_100', name: 'トレジャーマスター', icon: '👑', desc: '宝箱100個開封', check: () => game.stats.treasuresOpened >= 100 },
  
  // ルーレット系
  { id: 'roulette_1', name: 'ギャンブラー', icon: '🎰', desc: '初めてルーレットを回した', check: () => game.stats.spinsUsed >= 1 },
  { id: 'roulette_10', name: 'ハイローラー', icon: '🎲', desc: 'ルーレット10回', check: () => game.stats.spinsUsed >= 10 },
  { id: 'roulette_jackpot', name: 'ジャックポット！', icon: '💎', desc: 'ルーレットでジャックポット獲得', check: () => game.stats.jackpots >= 1 },
  
  // スキル系
  { id: 'skill_1', name: 'スキルユーザー', icon: '✨', desc: '初めてスキルを使用', check: () => game.stats.skillsUsed >= 1 },
  { id: 'skill_100', name: 'スキルマスター', icon: '🔮', desc: 'スキル100回使用', check: () => game.stats.skillsUsed >= 100 },
  
  // ログインボーナス系
  { id: 'login_7', name: '皆勤賞', icon: '📅', desc: '7日間連続ログイン', check: () => game.daily.streak >= 7 },
  { id: 'login_30', name: '常連さん', icon: '🗓️', desc: '30日間連続ログイン', check: () => game.daily.streak >= 30 },
];

const HEAVENLY_UPGRADES = [
  { id: 'heaven1', name: '天国の光', icon: '✨', cost: 1, desc: 'CPS +5%', mult: 1.05, req: () => true },
  { id: 'heaven2', name: '天使の祝福', icon: '👼', cost: 5, desc: 'CPS +10%', mult: 1.10, req: () => hasHeavenlyUpgrade('heaven1') },
  { id: 'heaven3', name: '神の恵み', icon: '🙏', cost: 25, desc: 'CPS +25%', mult: 1.25, req: () => hasHeavenlyUpgrade('heaven2') },
  { id: 'heavenClick', name: '天国のクリック', icon: '👆', cost: 10, desc: 'クリック力+100%', clickMult: 2, req: () => game.heavenlyChips >= 10 },
  { id: 'heavenGolden', name: '黄金の雨', icon: '🌟', cost: 50, desc: 'ゴールデンクッキー+50%効果', goldenMult: 1.5, req: () => game.heavenlyChips >= 50 },
  { id: 'heavenOffline', name: '永遠のベイカー', icon: '🌙', cost: 100, desc: 'オフライン生産効率100%', offlineMult: 1.0, req: () => game.heavenlyChips >= 100 },
];

const DRAGON_STAGES = [
  { level: 0, name: 'クリッキー（卵）', emoji: '🥚', bonus: null },
  { level: 1, name: 'クリッキー（孵化）', emoji: '🐣', bonus: { type: 'cps', value: 1.03, desc: 'CPS +3%' } },
  { level: 2, name: 'クリッキー（幼竜）', emoji: '🦎', bonus: { type: 'cps', value: 1.05, desc: 'CPS +5%' } },
  { level: 3, name: 'クリッキー（若竜）', emoji: '🐲', bonus: { type: 'cps', value: 1.08, desc: 'CPS +8%' } },
  { level: 4, name: 'クリッキー', emoji: '🐉', bonus: { type: 'cps', value: 1.12, desc: 'CPS +12%' } },
  { level: 5, name: 'クリッキー（成竜）', emoji: '🐉', bonus: { type: 'click', value: 1.2, desc: 'クリック +20%' } },
  { level: 6, name: 'クリッキー（古竜）', emoji: '🐉', bonus: { type: 'golden', value: 1.15, desc: 'ゴールデン +15%' } },
  { level: 7, name: 'クリッキー（龍王）', emoji: '🐉', bonus: { type: 'all', value: 1.05, desc: '全て +5%' } },
  { level: 8, name: 'クリッキー（神竜）', emoji: '🐉', bonus: { type: 'all', value: 1.08, desc: '全て +8%' } },
  { level: 9, name: 'クリッキー（永遠の竜）', emoji: '🐉', bonus: { type: 'all', value: 1.12, desc: '全て +12%' } },
  { level: 10, name: 'クリッキー（創造の竜）', emoji: '🐉', bonus: { type: 'all', value: 1.2, desc: '全て +20%' } },
];

const NEWS_MESSAGES = [
  'クッキー産業が史上最高の成長率を記録！',
  '科学者「クッキーは宇宙の謎を解く鍵かもしれない」',
  '世界中でクッキー消費量が急増中',
  'おばあちゃん連合、新記録のクッキー生産を達成',
  '「クッキーは愛」地元のパン屋が語る',
  '宇宙飛行士「月にもクッキー工場を」',
  'クッキー愛好家が集う祭典が開催',
  '研究者「毎日クッキーを食べると幸福度が上がる」',
  'クッキーの香りが世界を包む日',
  '未来のクッキーは光の速さで届く？',
  'ドラゴンがクッキー工場を守護しているとの噂',
  '黄金のクッキーを見つけた人は幸運になるらしい',
  'クッキーマスターへの道は険しいが甘い',
  '今日のおやつ：もちろんクッキー',
  '「click click click」謎のメッセージが世界中に',
  'クッキーの海で泳ぎたい...という夢を見た',
  'あなたのクッキー帝国は順調に成長中',
  '伝説によると1000個のクッキーで願いが叶う',
  'クッキーモンスター、平和条約に署名',
  '今週のトレンド：#クッキークリッカー',
];

const GOLDEN_EFFECTS = [
  { type: 'frenzy', name: 'フレンジー', duration: 30, mult: 3, emoji: '🔥', desc: '生産が3倍に！' },
  { type: 'lucky', name: 'ラッキー', duration: 0, mult: 0, emoji: '🍀', desc: 'クッキーを獲得！' },
  { type: 'clickFrenzy', name: 'クリックフレンジー', duration: 10, clickMult: 77, emoji: '⚡', desc: 'クリックが77倍！' },
  { type: 'dragonHarvest', name: 'ドラゴンの収穫', duration: 30, mult: 5, emoji: '🐉', desc: '生産が5倍に！' },
  { type: 'cookieStorm', name: 'クッキーストーム', duration: 5, emoji: '🌪️', desc: 'クッキーの嵐！' },
];

// スキルシステム（インフレ抑制版）
const SKILLS = [
  { id: 'powerClick', name: 'パワークリック', icon: '💥', cooldown: 60, duration: 5, effect: { clickMult: 3 }, desc: '5秒間クリック3倍！' },
  { id: 'goldenTouch', name: 'ゴールデンタッチ', icon: '✨', cooldown: 180, duration: 8, effect: { cpsMult: 2 }, desc: '8秒間CPS2倍！' },
  { id: 'lucky7', name: 'ラッキー7', icon: '🎰', cooldown: 300, duration: 0, effect: { instant: 'lucky7' }, desc: '7%の確率で77倍獲得！' },
  { id: 'timeWarp', name: 'タイムワープ', icon: '⏰', cooldown: 600, duration: 0, effect: { instant: 'timeWarp' }, desc: '30秒分のCPSを即座に獲得！' },
];

// 宝箱の中身（インフレ抑制版）
const TREASURE_TYPES = [
  { type: 'cookies', weight: 45, min: 50, max: 300, emoji: '🍪' },
  { type: 'cookiesMult', weight: 25, min: 5, max: 20, emoji: '🍪🍪' }, // CPS秒数分
  { type: 'goldenTime', weight: 15, value: 5, emoji: '⏱️' }, // ゴールデン効果延長
  { type: 'skillReset', weight: 8, emoji: '🔄' }, // スキルクールダウンリセット
  { type: 'jackpot', weight: 5, min: 30, max: 60, emoji: '💎' }, // 大当たり（CPS秒数分）
  { type: 'legendary', weight: 2, emoji: '👑' }, // 永続ボーナス（レア度アップ）
];

// ルーレットの項目（インフレ抑制版）
const ROULETTE_ITEMS = [
  { label: 'CPS x1.5 (30s)', effect: { type: 'buff', cpsMult: 1.5, duration: 30 }, weight: 22, color: '#4CAF50' },
  { label: 'CPS x2 (15s)', effect: { type: 'buff', cpsMult: 2, duration: 15 }, weight: 12, color: '#8BC34A' },
  { label: '+5秒CPS', effect: { type: 'instant', cpsSecs: 5 }, weight: 25, color: '#2196F3' },
  { label: '+10秒CPS', effect: { type: 'instant', cpsSecs: 10 }, weight: 15, color: '#03A9F4' },
  { label: 'クリック x3 (15s)', effect: { type: 'buff', clickMult: 3, duration: 15 }, weight: 12, color: '#FF9800' },
  { label: 'ハズレ', effect: { type: 'none' }, weight: 10, color: '#9E9E9E' },
  { label: '+20秒CPS', effect: { type: 'instant', cpsSecs: 20 }, weight: 6, color: '#E91E63' },
  { label: '★ JACKPOT ★', effect: { type: 'jackpot', cpsSecs: 60 }, weight: 2, color: '#FFD700' },
];

// 連続ログインボーナス
const LOGIN_BONUSES = [
  { day: 1, reward: { type: 'cookies', value: 1000 }, desc: '1000クッキー' },
  { day: 2, reward: { type: 'cookies', value: 5000 }, desc: '5000クッキー' },
  { day: 3, reward: { type: 'spin', value: 1 }, desc: 'ルーレット1回' },
  { day: 4, reward: { type: 'cookies', value: 20000 }, desc: '2万クッキー' },
  { day: 5, reward: { type: 'treasure', value: 1 }, desc: '宝箱1個' },
  { day: 6, reward: { type: 'cookies', value: 100000 }, desc: '10万クッキー' },
  { day: 7, reward: { type: 'legendary', value: 1 }, desc: '★伝説の報酬★' },
];

// 庭園の植物
const GARDEN_PLANTS = [
  { id: 'cookieSeed', name: 'クッキーの種', icon: '🌱', growTime: 60, reward: { type: 'cookies', min: 50, max: 200 }, cost: 10 },
  { id: 'goldenFlower', name: '黄金の花', icon: '🌻', growTime: 300, reward: { type: 'cookies', min: 500, max: 2000 }, cost: 100 },
  { id: 'crystalTree', name: 'クリスタルツリー', icon: '🌳', growTime: 900, reward: { type: 'cookies', min: 5000, max: 20000 }, cost: 1000 },
  { id: 'rainbowBush', name: 'レインボーブッシュ', icon: '🌈', growTime: 1800, reward: { type: 'buff', effect: 'cps', mult: 1.5, duration: 300 }, cost: 5000 },
  { id: 'starFruit', name: 'スターフルーツ', icon: '⭐', growTime: 3600, reward: { type: 'treasure', value: 1 }, cost: 10000 },
  { id: 'legendaryLotus', name: '伝説の蓮', icon: '🪷', growTime: 7200, reward: { type: 'permanent', bonus: 'cps', value: 0.01 }, cost: 50000 },
];

// マイルストーン報酬（インフレ抑制版）
const MILESTONES = [
  { id: 'cookies_1k', name: '千枚達成', icon: '🎯', check: () => game.stats.totalCookies >= 1000, reward: { cookies: 100 }, claimed: false },
  { id: 'cookies_10k', name: '万枚達成', icon: '🎯', check: () => game.stats.totalCookies >= 10000, reward: { cookies: 500 }, claimed: false },
  { id: 'cookies_100k', name: '10万枚達成', icon: '🏆', check: () => game.stats.totalCookies >= 100000, reward: { cookies: 2000, spin: 1 }, claimed: false },
  { id: 'cookies_1m', name: '100万枚達成', icon: '🏆', check: () => game.stats.totalCookies >= 1000000, reward: { cookies: 10000, treasure: 1 }, claimed: false },
  { id: 'clicks_1k', name: '千クリック', icon: '👆', check: () => game.stats.totalClicks >= 1000, reward: { cookies: 200 }, claimed: false },
  { id: 'clicks_10k', name: '万クリック', icon: '👆', check: () => game.stats.totalClicks >= 10000, reward: { cookies: 1000, spin: 1 }, claimed: false },
  { id: 'buildings_25', name: '建物25個', icon: '🏠', check: () => getTotalBuildings() >= 25, reward: { cookies: 500 }, claimed: false },
  { id: 'buildings_100', name: '建物100個', icon: '🏙️', check: () => getTotalBuildings() >= 100, reward: { treasure: 1 }, claimed: false },
  { id: 'golden_10', name: 'ゴールデン10回', icon: '⭐', check: () => game.stats.goldenClicked >= 10, reward: { spin: 1 }, claimed: false },
  { id: 'prestige_1', name: '初転生', icon: '🔄', check: () => game.stats.timesPrestiged >= 1, reward: { permanent_cps: 0.02 }, claimed: false },
];

// チャレンジモード（インフレ抑制版）
const CHALLENGES = [
  { id: 'speedrun', name: 'スピードラン', icon: '⚡', desc: '5分以内に10000クッキー獲得', timeLimit: 300, goal: 10000, reward: { spin: 2 } },
  { id: 'noClick', name: 'ノークリック', icon: '🙅', desc: '3分間クリックせずに1000CPS達成', timeLimit: 180, goal: 1000, type: 'cps', reward: { treasure: 1 } },
  { id: 'clickMaster', name: 'クリックマスター', icon: '👆', desc: '1分間で500回クリック', timeLimit: 60, goal: 500, type: 'clicks', reward: { permanent_click: 0.05 } },
];

// ===============================================
// ゲーム状態
// ===============================================

const defaultGame = () => ({
  cookies: 0,
  cps: 0,
  clickValue: 1,
  baseClickValue: 1,
  globalMult: 1,
  clickMult: 1,
  goldenMult: 1,
  
  buildings: BUILDINGS.map(b => ({ ...b, owned: 0, totalProduced: 0 })),
  upgrades: [],
  achievements: [],
  heavenlyUpgrades: [],
  
  heavenlyChips: 0,
  heavenlyChipsSpent: 0,
  prestigeMult: 1,
  
  dragon: {
    level: 0,
    name: 'クリッキー（卵）',
    emoji: '🥚',
    aura: null,
  },
  
  combo: 1,
  maxCombo: 1,
  comboTimer: 0,
  lastClickTime: 0,
  
  activeEffects: [],
  
  stats: {
    totalCookies: 0,
    totalClicks: 0,
    totalCookiesFromClicks: 0,
    goldenClicked: 0,
    timesPrestiged: 0,
    totalCookiesAllTime: 0,
    startTime: Date.now(),
    playTime: 0,
    lastSave: Date.now(),
    sessionStart: Date.now(),
    treasuresOpened: 0,
    spinsUsed: 0,
    criticalHits: 0,
    highestCrit: 0,
    jackpots: 0,
    skillsUsed: 0,
  },
  
  // 新機能用データ
  skills: {
    powerClick: { cooldownEnd: 0, activeEnd: 0 },
    goldenTouch: { cooldownEnd: 0, activeEnd: 0 },
    lucky7: { cooldownEnd: 0, activeEnd: 0 },
    timeWarp: { cooldownEnd: 0, activeEnd: 0 },
  },
  
  treasures: 0,
  spins: 3,
  
  daily: {
    lastClaim: 0,
    streak: 0,
    todayClaimed: false,
  },
  
  critChance: 0.05, // 5%確率でクリティカル
  critMult: 3, // クリティカル倍率
  
  permanentBonuses: {
    clickBonus: 0,
    cpsBonus: 0,
    critChanceBonus: 0,
    critMultBonus: 0,
  },
  
  // 庭園システム
  garden: {
    plots: [null, null, null, null, null, null], // 6つの植え場所
    unlocked: 1, // アンロックされた区画数
  },
  
  // マイルストーン
  claimedMilestones: [],
  
  // チャレンジ
  challenge: {
    active: null,
    startTime: 0,
    startCookies: 0,
    startClicks: 0,
    completed: [],
  },
  
  settings: {
    theme: 'dark',
    bgmVolume: 30,
    sfxVolume: 50,
    numberFormat: 'short',
    particlesEnabled: true,
    screenshakeEnabled: true,
    autosaveInterval: 30,
    tutorialCompleted: false,
  },
  
  lastTick: performance.now(),
});

let game = defaultGame();

// ===============================================
// サウンドシステム
// ===============================================

const AudioSystem = {
  ctx: null,
  bgmOsc: null,
  bgmGain: null,
  bgmPlaying: false,
  sfxEnabled: true,
  
  init() {
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.log('Audio not supported');
    }
  },
  
  playClick() {
    if (!this.ctx || !this.sfxEnabled) return;
    const vol = game.settings.sfxVolume / 100 * 0.15;
    this.playTone(800 + Math.random() * 200, 0.05, vol, 'sine');
  },
  
  playCrit() {
    if (!this.ctx || !this.sfxEnabled) return;
    const vol = game.settings.sfxVolume / 100 * 0.25;
    this.playTone(1200, 0.08, vol, 'sawtooth');
    setTimeout(() => this.playTone(1500, 0.1, vol * 0.8, 'sawtooth'), 50);
    setTimeout(() => this.playTone(1800, 0.12, vol * 0.6, 'sine'), 100);
  },
  
  playTreasure() {
    if (!this.ctx || !this.sfxEnabled) return;
    const vol = game.settings.sfxVolume / 100 * 0.2;
    [523, 659, 784, 1047, 1319].forEach((f, i) => {
      setTimeout(() => this.playTone(f, 0.12, vol * (1 - i * 0.15), 'sine'), i * 60);
    });
  },
  
  playRoulette() {
    if (!this.ctx || !this.sfxEnabled) return;
    const vol = game.settings.sfxVolume / 100 * 0.15;
    this.playTone(600, 0.05, vol, 'square');
  },
  
  playJackpot() {
    if (!this.ctx || !this.sfxEnabled) return;
    const vol = game.settings.sfxVolume / 100 * 0.3;
    const notes = [523, 659, 784, 1047, 1319, 1568, 2093];
    notes.forEach((f, i) => {
      setTimeout(() => this.playTone(f, 0.25, vol * (1 - i * 0.1), 'sine'), i * 80);
    });
  },
  
  playSkill() {
    if (!this.ctx || !this.sfxEnabled) return;
    const vol = game.settings.sfxVolume / 100 * 0.2;
    this.playTone(440, 0.1, vol, 'sine');
    setTimeout(() => this.playTone(880, 0.15, vol, 'sine'), 100);
  },
  
  playBuy() {
    if (!this.ctx || !this.sfxEnabled) return;
    const vol = game.settings.sfxVolume / 100 * 0.15;
    this.playTone(523, 0.08, vol, 'triangle');
    setTimeout(() => this.playTone(659, 0.08, vol * 0.8, 'triangle'), 80);
  },
  
  playUpgrade() {
    if (!this.ctx || !this.sfxEnabled) return;
    const vol = game.settings.sfxVolume / 100 * 0.15;
    this.playTone(523, 0.1, vol, 'triangle');
    setTimeout(() => this.playTone(659, 0.1, vol, 'triangle'), 100);
    setTimeout(() => this.playTone(784, 0.15, vol, 'triangle'), 200);
  },
  
  playAchievement() {
    if (!this.ctx || !this.sfxEnabled) return;
    const vol = game.settings.sfxVolume / 100 * 0.2;
    [523, 659, 784, 1047].forEach((f, i) => {
      setTimeout(() => this.playTone(f, 0.15, vol, 'sine'), i * 100);
    });
  },
  
  playGolden() {
    if (!this.ctx || !this.sfxEnabled) return;
    const vol = game.settings.sfxVolume / 100 * 0.2;
    this.playTone(1047, 0.2, vol, 'sine');
    setTimeout(() => this.playTone(1319, 0.2, vol, 'sine'), 100);
    setTimeout(() => this.playTone(1568, 0.3, vol, 'sine'), 200);
  },
  
  playPrestige() {
    if (!this.ctx || !this.sfxEnabled) return;
    const vol = game.settings.sfxVolume / 100 * 0.25;
    [262, 330, 392, 523, 659, 784, 1047].forEach((f, i) => {
      setTimeout(() => this.playTone(f, 0.2, vol * (1 - i * 0.1), 'sine'), i * 80);
    });
  },
  
  playTone(freq, dur, vol, type) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + dur);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + dur);
  },
  
  toggleBGM() {
    if (!this.ctx) return;
    if (this.bgmPlaying) {
      this.stopBGM();
    } else {
      this.startBGM();
    }
  },
  
  startBGM() {
    if (!this.ctx || this.bgmPlaying) return;
    const vol = game.settings.bgmVolume / 100 * 0.1;
    
    this.bgmGain = this.ctx.createGain();
    this.bgmGain.gain.value = vol;
    this.bgmGain.connect(this.ctx.destination);
    
    // シンプルなアンビエント音
    this.bgmOsc = this.ctx.createOscillator();
    this.bgmOsc.type = 'sine';
    this.bgmOsc.frequency.value = 110;
    
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.value = 0.1;
    lfoGain.gain.value = 20;
    lfo.connect(lfoGain);
    lfoGain.connect(this.bgmOsc.frequency);
    
    this.bgmOsc.connect(this.bgmGain);
    this.bgmOsc.start();
    lfo.start();
    
    this.bgmPlaying = true;
    document.getElementById('btn-music')?.classList.remove('off');
  },
  
  stopBGM() {
    if (this.bgmOsc) {
      this.bgmOsc.stop();
      this.bgmOsc = null;
    }
    this.bgmPlaying = false;
    document.getElementById('btn-music')?.classList.add('off');
  },
  
  updateVolume() {
    if (this.bgmGain) {
      this.bgmGain.gain.value = game.settings.bgmVolume / 100 * 0.1;
    }
  }
};

// ===============================================
// ユーティリティ関数
// ===============================================

function formatNumber(n, forceFull = false) {
  if (n < 0) return '-' + formatNumber(-n);
  if (n < 1000 || forceFull) return Math.floor(n).toLocaleString();
  
  const format = game.settings.numberFormat;
  
  if (format === 'scientific') {
    return n.toExponential(2);
  }
  
  if (format === 'full') {
    return Math.floor(n).toLocaleString();
  }
  
  // short format
  const units = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc', 'UDc', 'DDc'];
  let u = 0;
  while (n >= 1000 && u < units.length - 1) { n /= 1000; u++; }
  return n.toFixed(u === 0 ? 0 : 2) + units[u];
}

function formatTime(ms) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);
  
  if (d > 0) return `${d}日${h % 24}時間`;
  if (h > 0) return `${h}時間${m % 60}分`;
  if (m > 0) return `${m}分${s % 60}秒`;
  return `${s}秒`;
}

function hasUpgrade(id) {
  return game.upgrades.includes(id);
}

function hasHeavenlyUpgrade(id) {
  return game.heavenlyUpgrades.includes(id);
}

function hasAchievement(id) {
  return game.achievements.includes(id);
}

function getBuildingCount(id) {
  return game.buildings.find(b => b.id === id)?.owned || 0;
}

function getTotalBuildings() {
  return game.buildings.reduce((sum, b) => sum + b.owned, 0);
}

function getBuildingCost(building, amount = 1) {
  let total = 0;
  for (let i = 0; i < amount; i++) {
    total += Math.floor(building.baseCost * Math.pow(1.15, building.owned + i));
  }
  return total;
}

function getBuildingCps(building) {
  let cps = building.baseCps;
  
  // アップグレード倍率
  UPGRADES.filter(u => u.type === 'building' && u.target === building.id && hasUpgrade(u.id))
    .forEach(u => cps *= u.mult);
  
  return cps * game.globalMult * game.prestigeMult;
}

function getMaxAffordable(building) {
  let count = 0;
  let total = 0;
  while (total + getBuildingCost(building, count + 1) - total <= game.cookies) {
    const nextCost = Math.floor(building.baseCost * Math.pow(1.15, building.owned + count));
    if (total + nextCost > game.cookies) break;
    total += nextCost;
    count++;
    if (count > 10000) break; // 安全装置
  }
  return count;
}

// ===============================================
// 計算関数
// ===============================================

function recalculateAll() {
  recalculateGlobalMult();
  recalculateCps();
  recalculateClickValue();
  recalculatePrestigeMult();
}

function recalculateGlobalMult() {
  let mult = 1;
  
  // アップグレード
  UPGRADES.filter(u => u.type === 'global' && hasUpgrade(u.id))
    .forEach(u => mult *= u.mult);
  
  // 実績ボーナス (1%ずつ)
  mult *= 1 + game.achievements.length * 0.01;
  
  // ドラゴンボーナス
  const stage = DRAGON_STAGES[game.dragon.level];
  if (stage?.bonus) {
    if (stage.bonus.type === 'cps' || stage.bonus.type === 'all') {
      mult *= stage.bonus.value;
    }
  }
  
  // 天国アップグレード
  HEAVENLY_UPGRADES.filter(u => hasHeavenlyUpgrade(u.id) && u.mult)
    .forEach(u => mult *= u.mult);
  
  // アクティブエフェクト
  game.activeEffects.forEach(e => {
    if (e.mult) mult *= e.mult;
  });
  
  // 永続CPSボーナス（宝箱・ルーレット）
  if (game.permanentBonuses?.cpsBonus) {
    mult *= 1 + game.permanentBonuses.cpsBonus;
  }
  
  game.globalMult = mult;
}

function recalculateCps() {
  let cps = 0;
  
  game.buildings.forEach(b => {
    cps += b.owned * getBuildingCps(b);
  });
  
  game.cps = cps;
}

function recalculateClickValue() {
  let value = game.baseClickValue;
  
  // クリックアップグレード
  UPGRADES.filter(u => u.type === 'click' && hasUpgrade(u.id))
    .forEach(u => value *= u.mult);
  
  // CPSの一部をクリックに加算
  let cpsPercent = 0;
  UPGRADES.filter(u => u.type === 'clickCps' && hasUpgrade(u.id))
    .forEach(u => cpsPercent += u.value);
  value += game.cps * cpsPercent;
  
  // ドラゴンボーナス
  const stage = DRAGON_STAGES[game.dragon.level];
  if (stage?.bonus) {
    if (stage.bonus.type === 'click' || stage.bonus.type === 'all') {
      value *= stage.bonus.value;
    }
  }
  
  // 天国アップグレード
  HEAVENLY_UPGRADES.filter(u => hasHeavenlyUpgrade(u.id) && u.clickMult)
    .forEach(u => value *= u.clickMult);
  
  // クリックフレンジー
  game.activeEffects.forEach(e => {
    if (e.clickMult) value *= e.clickMult;
  });
  
  // コンボボーナス
  value *= game.combo;
  
  // 転生倍率
  value *= game.prestigeMult;
  
  // 永続クリックボーナス（宝箱・ルーレット）
  if (game.permanentBonuses?.clickBonus) {
    value *= 1 + game.permanentBonuses.clickBonus;
  }
  
  game.clickValue = value;
  game.clickMult = value / game.baseClickValue;
}

function recalculatePrestigeMult() {
  // 天国チップ1つにつき+1%
  game.prestigeMult = 1 + game.heavenlyChips * 0.01;
}

function calculatePrestigeGain() {
  // 1兆クッキーで1チップ、その後は平方根でスケール
  const trillion = 1e12;
  if (game.stats.totalCookies < trillion) return 0;
  return Math.floor(Math.pow(game.stats.totalCookies / trillion, 0.5));
}

// ===============================================
// ゲームアクション
// ===============================================

function clickCookie(e) {
  const now = performance.now();
  
  // コンボシステム
  const timeSinceLastClick = now - game.lastClickTime;
  if (timeSinceLastClick < 500) {
    game.combo = Math.min(game.combo + 0.1, 20);
    game.comboTimer = 2000;
  }
  game.lastClickTime = now;
  
  // クリック値を再計算（コンボ反映）
  recalculateClickValue();
  
  // クリティカル判定
  const critChance = game.critChance + game.permanentBonuses.critChanceBonus;
  const isCrit = Math.random() < critChance;
  const critMult = isCrit ? (game.critMult + game.permanentBonuses.critMultBonus) : 1;
  
  let gained = game.clickValue * critMult;
  
  // スキル効果: パワークリック
  if (game.skills.powerClick.activeEnd > now) {
    gained *= 10;
  }
  
  game.cookies += gained;
  game.stats.totalCookies += gained;
  game.stats.totalCookiesAllTime += gained;
  game.stats.totalClicks++;
  game.stats.totalCookiesFromClicks += gained;
  
  if (isCrit) {
    game.stats.criticalHits++;
    if (gained > game.stats.highestCrit) {
      game.stats.highestCrit = gained;
    }
  }
  
  // エフェクト
  const isHighCombo = game.combo >= 5;
  spawnFloatText('+' + formatNumber(gained), e?.clientX, e?.clientY, isCrit || isHighCombo, isCrit);
  
  if (game.settings.particlesEnabled) {
    const particleCount = isCrit ? 15 : Math.min(Math.floor(game.combo), 8);
    spawnParticles(e?.clientX, e?.clientY, particleCount, isCrit);
  }
  
  if (game.settings.screenshakeEnabled && (game.combo >= 3 || isCrit)) {
    shakeScreen(isCrit ? 2 : 1);
  }
  
  if (isCrit) {
    AudioSystem.playCrit();
  } else {
    AudioSystem.playClick();
  }
  
  checkAchievements();
  updateUI();
}

function buyBuilding(id, amount = 1) {
  const building = game.buildings.find(b => b.id === id);
  if (!building) return;
  
  if (amount === 'max') {
    amount = getMaxAffordable(building);
  }
  
  const cost = getBuildingCost(building, amount);
  if (game.cookies < cost || amount <= 0) return;
  
  game.cookies -= cost;
  building.owned += amount;
  
  recalculateAll();
  AudioSystem.playBuy();
  checkAchievements();
  updateUI();
}

function buyUpgrade(id) {
  const upgrade = UPGRADES.find(u => u.id === id);
  if (!upgrade || hasUpgrade(id)) return;
  if (game.cookies < upgrade.cost) return;
  
  game.cookies -= upgrade.cost;
  game.upgrades.push(id);
  
  recalculateAll();
  AudioSystem.playUpgrade();
  showNotification(`🎉 ${upgrade.name} を購入！`, 'upgrade');
  checkAchievements();
  updateUI();
}

function buyHeavenlyUpgrade(id) {
  const upgrade = HEAVENLY_UPGRADES.find(u => u.id === id);
  if (!upgrade || hasHeavenlyUpgrade(id)) return;
  
  const available = game.heavenlyChips - game.heavenlyChipsSpent;
  if (available < upgrade.cost) return;
  
  game.heavenlyChipsSpent += upgrade.cost;
  game.heavenlyUpgrades.push(id);
  
  recalculateAll();
  AudioSystem.playUpgrade();
  showNotification(`✨ ${upgrade.name} を獲得！`, 'prestige');
  updateUI();
}

function doPrestige() {
  const gain = calculatePrestigeGain();
  if (gain <= 0) return;
  
  if (!confirm(`転生して ${formatNumber(gain)} 天国チップを獲得しますか？\nゲームがリセットされます。`)) {
    return;
  }
  
  // 統計を保存
  game.heavenlyChips += gain;
  game.stats.timesPrestiged++;
  game.stats.totalCookiesAllTime = game.stats.totalCookies;
  
  // 永続データを保持
  const preserved = {
    heavenlyChips: game.heavenlyChips,
    heavenlyChipsSpent: game.heavenlyChipsSpent,
    heavenlyUpgrades: [...game.heavenlyUpgrades],
    achievements: [...game.achievements],
    dragon: { ...game.dragon },
    stats: {
      timesPrestiged: game.stats.timesPrestiged,
      totalCookiesAllTime: game.stats.totalCookiesAllTime,
      goldenClicked: game.stats.goldenClicked,
      criticalHits: game.stats.criticalHits,
      highestCrit: game.stats.highestCrit,
      treasuresOpened: game.stats.treasuresOpened,
      spinsUsed: game.stats.spinsUsed,
      jackpots: game.stats.jackpots,
      skillsUsed: game.stats.skillsUsed,
    },
    settings: { ...game.settings },
    daily: { ...game.daily },
    permanentBonuses: { ...game.permanentBonuses },
  };
  
  // リセット
  game = defaultGame();
  
  // 復元
  Object.assign(game, {
    heavenlyChips: preserved.heavenlyChips,
    heavenlyChipsSpent: preserved.heavenlyChipsSpent,
    heavenlyUpgrades: preserved.heavenlyUpgrades,
    achievements: preserved.achievements,
    dragon: preserved.dragon,
    settings: preserved.settings,
    daily: preserved.daily,
    permanentBonuses: preserved.permanentBonuses,
  });
  game.stats.timesPrestiged = preserved.stats.timesPrestiged;
  game.stats.totalCookiesAllTime = preserved.stats.totalCookiesAllTime;
  game.stats.goldenClicked = preserved.stats.goldenClicked;
  game.stats.criticalHits = preserved.stats.criticalHits;
  game.stats.highestCrit = preserved.stats.highestCrit;
  game.stats.treasuresOpened = preserved.stats.treasuresOpened;
  game.stats.spinsUsed = preserved.stats.spinsUsed;
  game.stats.jackpots = preserved.stats.jackpots;
  game.stats.skillsUsed = preserved.stats.skillsUsed;
  
  recalculateAll();
  AudioSystem.playPrestige();
  showNotification(`✨ 転生完了！+${formatNumber(gain)} 天国チップ`, 'prestige');
  saveGame();
  updateUI();
}

function feedDragon() {
  if (game.dragon.level >= DRAGON_STAGES.length - 1) return;
  
  const cost = getDragonFeedCost();
  if (game.cookies < cost) return;
  
  game.cookies -= cost;
  game.dragon.level++;
  
  const stage = DRAGON_STAGES[game.dragon.level];
  game.dragon.name = stage.name;
  game.dragon.emoji = stage.emoji;
  
  recalculateAll();
  AudioSystem.playUpgrade();
  showNotification(`🐉 ${stage.name} に進化！`, 'dragon');
  checkAchievements();
  updateUI();
  updateDragonModal();
}

function getDragonFeedCost() {
  return Math.floor(1000 * Math.pow(10, game.dragon.level));
}

// ===============================================
// スキルシステム
// ===============================================

function useSkill(skillId) {
  const skill = SKILLS.find(s => s.id === skillId);
  if (!skill) return;
  
  const now = Date.now();
  const skillState = game.skills[skillId];
  
  // クールダウン中かチェック
  if (skillState.cooldownEnd > now) {
    const remaining = Math.ceil((skillState.cooldownEnd - now) / 1000);
    showNotification(`⏳ ${skill.name} はあと ${remaining}秒`, 'warning');
    return;
  }
  
  // スキル発動
  skillState.cooldownEnd = now + skill.cooldown * 1000;
  game.stats.skillsUsed++;
  
  AudioSystem.playSkill();
  
  if (skill.effect.instant) {
    // 即時効果
    if (skill.effect.instant === 'lucky7') {
      if (Math.random() < 0.07) {
        const bonus = game.clickValue * 77;
        game.cookies += bonus;
        game.stats.totalCookies += bonus;
        showNotification(`🎰 ラッキー7！ +${formatNumber(bonus)}`, 'jackpot');
        AudioSystem.playJackpot();
      } else {
        const bonus = game.clickValue * 7;
        game.cookies += bonus;
        game.stats.totalCookies += bonus;
        showNotification(`🎰 +${formatNumber(bonus)} でした...`, 'normal');
      }
    } else if (skill.effect.instant === 'timeWarp') {
      const bonus = game.cps * 30;
      game.cookies += bonus;
      game.stats.totalCookies += bonus;
      showNotification(`⏰ タイムワープ！ +${formatNumber(bonus)}`, 'skill');
    }
  } else {
    // 持続効果
    skillState.activeEnd = now + skill.duration * 1000;
    showNotification(`${skill.icon} ${skill.name} 発動！`, 'skill');
    
    // ゴールデンタッチの場合はアクティブエフェクトに追加
    if (skillId === 'goldenTouch') {
      game.activeEffects.push({
        type: 'skill_goldenTouch',
        name: 'ゴールデンタッチ',
        emoji: '✨',
        mult: 2,
        endsAt: skillState.activeEnd,
      });
      recalculateAll();
    }
  }
  
  updateSkillsUI();
  updateUI();
}

function updateSkillsUI() {
  const container = document.getElementById('skills-container');
  if (!container) return;
  
  const now = Date.now();
  
  container.innerHTML = SKILLS.map(skill => {
    const state = game.skills[skill.id];
    const isOnCooldown = state.cooldownEnd > now;
    const isActive = state.activeEnd > now;
    const cooldownRemaining = isOnCooldown ? Math.ceil((state.cooldownEnd - now) / 1000) : 0;
    const activeRemaining = isActive ? Math.ceil((state.activeEnd - now) / 1000) : 0;
    
    return `
      <button class="skill-btn ${isOnCooldown ? 'cooldown' : ''} ${isActive ? 'active' : ''}" 
              data-skill="${skill.id}" 
              title="${skill.desc}"
              ${isOnCooldown ? 'disabled' : ''}>
        <span class="skill-icon">${skill.icon}</span>
        <span class="skill-name">${skill.name}</span>
        ${isOnCooldown ? `<span class="skill-timer">${cooldownRemaining}s</span>` : ''}
        ${isActive ? `<span class="skill-active">${activeRemaining}s</span>` : ''}
      </button>
    `;
  }).join('');
  
  container.querySelectorAll('.skill-btn').forEach(btn => {
    btn.addEventListener('click', () => useSkill(btn.dataset.skill));
  });
}

// ===============================================
// 宝箱システム
// ===============================================

function openTreasure() {
  if (game.treasures <= 0) {
    showNotification('📦 宝箱がありません！', 'warning');
    return;
  }
  
  game.treasures--;
  game.stats.treasuresOpened++;
  
  // 重み付きランダム選択
  const totalWeight = TREASURE_TYPES.reduce((sum, t) => sum + t.weight, 0);
  let rand = Math.random() * totalWeight;
  let selected = TREASURE_TYPES[0];
  
  for (const t of TREASURE_TYPES) {
    rand -= t.weight;
    if (rand <= 0) {
      selected = t;
      break;
    }
  }
  
  AudioSystem.playTreasure();
  
  let reward = '';
  
  switch (selected.type) {
    case 'cookies':
      const amount = Math.floor(selected.min + Math.random() * (selected.max - selected.min));
      game.cookies += amount;
      game.stats.totalCookies += amount;
      reward = `🍪 ${formatNumber(amount)} クッキー`;
      break;
      
    case 'cookiesMult':
      const secs = Math.floor(selected.min + Math.random() * (selected.max - selected.min));
      const bonus = game.cps * secs;
      game.cookies += bonus;
      game.stats.totalCookies += bonus;
      reward = `🍪🍪 ${secs}秒分のCPS (${formatNumber(bonus)})`;
      break;
      
    case 'goldenTime':
      // アクティブなゴールデン効果を延長
      game.activeEffects.forEach(e => {
        if (e.endsAt) e.endsAt += 10000;
      });
      reward = '⏱️ 全効果時間+10秒！';
      break;
      
    case 'skillReset':
      const now = Date.now();
      Object.keys(game.skills).forEach(k => {
        game.skills[k].cooldownEnd = 0;
      });
      reward = '🔄 全スキルクールダウンリセット！';
      updateSkillsUI();
      break;
      
    case 'jackpot':
      const jackpotSecs = Math.floor(selected.min + Math.random() * (selected.max - selected.min));
      const jackpotBonus = game.cps * jackpotSecs;
      game.cookies += jackpotBonus;
      game.stats.totalCookies += jackpotBonus;
      reward = `💎 JACKPOT！${formatNumber(jackpotBonus)} クッキー！`;
      AudioSystem.playJackpot();
      break;
      
    case 'legendary':
      // 永続ボーナスをランダムに付与（上限あり）
      const bonusTypes = ['clickBonus', 'cpsBonus', 'critChanceBonus', 'critMultBonus'];
      const bonusType = bonusTypes[Math.floor(Math.random() * bonusTypes.length)];
      const BONUS_CAPS = { clickBonus: 1.0, cpsBonus: 0.5, critChanceBonus: 0.15, critMultBonus: 2.0 };
      
      if (bonusType === 'clickBonus' && game.permanentBonuses.clickBonus < BONUS_CAPS.clickBonus) {
        game.permanentBonuses.clickBonus = Math.min(game.permanentBonuses.clickBonus + 0.05, BONUS_CAPS.clickBonus);
        reward = '👑 永続クリック+5%！';
      } else if (bonusType === 'cpsBonus' && game.permanentBonuses.cpsBonus < BONUS_CAPS.cpsBonus) {
        game.permanentBonuses.cpsBonus = Math.min(game.permanentBonuses.cpsBonus + 0.02, BONUS_CAPS.cpsBonus);
        reward = '👑 永続CPS+2%！';
      } else if (bonusType === 'critChanceBonus' && game.permanentBonuses.critChanceBonus < BONUS_CAPS.critChanceBonus) {
        game.permanentBonuses.critChanceBonus = Math.min(game.permanentBonuses.critChanceBonus + 0.005, BONUS_CAPS.critChanceBonus);
        reward = '👑 クリティカル率+0.5%！';
      } else if (game.permanentBonuses.critMultBonus < BONUS_CAPS.critMultBonus) {
        game.permanentBonuses.critMultBonus = Math.min(game.permanentBonuses.critMultBonus + 0.2, BONUS_CAPS.critMultBonus);
        reward = '👑 クリティカル倍率+0.2！';
      } else {
        // 全てキャップ到達時は代わりにクッキー
        const fallbackBonus = game.cps * 30;
        game.cookies += fallbackBonus;
        game.stats.totalCookies += fallbackBonus;
        reward = `👑 +${formatNumber(fallbackBonus)} クッキー！`;
      }
      AudioSystem.playJackpot();
      break;
  }
  
  showNotification(`📦 ${reward}`, 'treasure');
  updateUI();
  updateTreasureUI();
}

function updateTreasureUI() {
  const countEl = document.getElementById('treasure-count');
  if (countEl) countEl.textContent = game.treasures;
  
  const btn = document.getElementById('btn-open-treasure');
  if (btn) btn.disabled = game.treasures <= 0;
}

// ===============================================
// ルーレットシステム
// ===============================================

let rouletteSpinning = false;
let rouletteAngle = 0;

function spinRoulette() {
  if (game.spins <= 0) {
    showNotification('🎰 スピンチケットがありません！', 'warning');
    return;
  }
  
  if (rouletteSpinning) return;
  
  game.spins--;
  game.stats.spinsUsed++;
  rouletteSpinning = true;
  
  const wheel = document.getElementById('roulette-wheel');
  if (!wheel) return;
  
  // ランダムに結果を決定
  const totalWeight = ROULETTE_ITEMS.reduce((sum, i) => sum + i.weight, 0);
  let rand = Math.random() * totalWeight;
  let selectedIndex = 0;
  
  for (let i = 0; i < ROULETTE_ITEMS.length; i++) {
    rand -= ROULETTE_ITEMS[i].weight;
    if (rand <= 0) {
      selectedIndex = i;
      break;
    }
  }
  
  const selectedItem = ROULETTE_ITEMS[selectedIndex];
  
  // 回転角度を計算（3-5回転 + 止まる位置）
  const segmentAngle = 360 / ROULETTE_ITEMS.length;
  const targetAngle = 360 * (3 + Math.random() * 2) + (selectedIndex * segmentAngle) + segmentAngle / 2;
  
  wheel.style.transition = 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)';
  wheel.style.transform = `rotate(${rouletteAngle + targetAngle}deg)`;
  rouletteAngle += targetAngle;
  
  // 回転中のサウンド
  const tickInterval = setInterval(() => {
    AudioSystem.playRoulette();
  }, 150);
  
  setTimeout(() => {
    clearInterval(tickInterval);
    rouletteSpinning = false;
    applyRouletteReward(selectedItem);
    wheel.style.transition = '';
    updateRouletteUI();
  }, 4000);
  
  updateRouletteUI();
}

function applyRouletteReward(item) {
  if (item.effect.type === 'none') {
    showNotification('😢 ハズレ...次は当たる！', 'normal');
    return;
  }
  
  if (item.effect.type === 'instant') {
    const bonus = game.cps * item.effect.cpsSecs;
    game.cookies += bonus;
    game.stats.totalCookies += bonus;
    showNotification(`🎉 ${item.label}！+${formatNumber(bonus)}`, 'roulette');
  } else if (item.effect.type === 'buff') {
    const effect = {
      type: 'roulette_buff',
      name: item.label,
      emoji: '🎰',
      endsAt: Date.now() + item.effect.duration * 1000,
    };
    
    if (item.effect.cpsMult) effect.mult = item.effect.cpsMult;
    if (item.effect.clickMult) effect.clickMult = item.effect.clickMult;
    
    game.activeEffects.push(effect);
    recalculateAll();
    showNotification(`🎰 ${item.label}！`, 'roulette');
  } else if (item.effect.type === 'jackpot') {
    const bonus = game.cps * item.effect.cpsSecs;
    game.cookies += bonus;
    game.stats.totalCookies += bonus;
    game.stats.jackpots++;
    showNotification(`🌟 JACKPOT！+${formatNumber(bonus)}！`, 'jackpot');
    AudioSystem.playJackpot();
    
    // ジャックポットで宝箱ボーナス
    game.treasures += 3;
    showNotification('📦 ボーナス宝箱×3！', 'treasure');
  }
  
  updateUI();
}

function updateRouletteUI() {
  const countEl = document.getElementById('spin-count');
  if (countEl) countEl.textContent = game.spins;
  
  const btn = document.getElementById('btn-spin-roulette');
  if (btn) btn.disabled = game.spins <= 0 || rouletteSpinning;
}

// ===============================================
// デイリーボーナス
// ===============================================

function checkDailyBonus() {
  const now = Date.now();
  const today = new Date().toDateString();
  const lastClaimDate = new Date(game.daily.lastClaim).toDateString();
  
  if (lastClaimDate === today) {
    game.daily.todayClaimed = true;
    return;
  }
  
  game.daily.todayClaimed = false;
  
  // 連続ログインチェック
  const oneDayMs = 24 * 60 * 60 * 1000;
  const daysSinceLastClaim = Math.floor((now - game.daily.lastClaim) / oneDayMs);
  
  if (daysSinceLastClaim > 1) {
    // 連続が途切れた
    game.daily.streak = 0;
  }
  
  // デイリーボーナスモーダルを表示
  showDailyBonusModal();
}

function claimDailyBonus() {
  if (game.daily.todayClaimed) return;
  
  game.daily.streak = (game.daily.streak % 7) + 1;
  game.daily.lastClaim = Date.now();
  game.daily.todayClaimed = true;
  
  const bonus = LOGIN_BONUSES[game.daily.streak - 1];
  
  switch (bonus.reward.type) {
    case 'cookies':
      game.cookies += bonus.reward.value;
      game.stats.totalCookies += bonus.reward.value;
      break;
    case 'spin':
      game.spins += bonus.reward.value;
      break;
    case 'treasure':
      game.treasures += bonus.reward.value;
      break;
    case 'legendary':
      game.treasures += 5;
      game.spins += 5;
      game.cookies += game.cps * 600;
      break;
  }
  
  AudioSystem.playAchievement();
  showNotification(`📅 デイリーボーナス Day${game.daily.streak}: ${bonus.desc}！`, 'daily');
  
  closeDailyBonusModal();
  updateUI();
  saveGame();
}

function showDailyBonusModal() {
  const modal = document.getElementById('daily-modal');
  if (!modal) return;
  
  const content = document.getElementById('daily-content');
  if (content) {
    content.innerHTML = LOGIN_BONUSES.map((bonus, i) => {
      const day = i + 1;
      const isToday = day === (game.daily.streak % 7) + 1 && !game.daily.todayClaimed;
      const isClaimed = day <= game.daily.streak || (game.daily.streak === 7 && day === 7);
      
      return `
        <div class="daily-day ${isToday ? 'today' : ''} ${isClaimed ? 'claimed' : ''}">
          <div class="daily-day-num">Day ${day}</div>
          <div class="daily-day-reward">${bonus.desc}</div>
          ${isClaimed && !isToday ? '<span class="daily-check">✓</span>' : ''}
        </div>
      `;
    }).join('');
  }
  
  const claimBtn = document.getElementById('btn-claim-daily');
  if (claimBtn) {
    claimBtn.disabled = game.daily.todayClaimed;
    claimBtn.textContent = game.daily.todayClaimed ? '受取済み' : '受け取る！';
  }
  
  modal.classList.remove('hidden');
}

function closeDailyBonusModal() {
  document.getElementById('daily-modal')?.classList.add('hidden');
}

// ===============================================
// 庭園システム
// ===============================================

function openGardenModal() {
  updateGardenUI();
  document.getElementById('garden-modal')?.classList.remove('hidden');
}

function closeGardenModal() {
  document.getElementById('garden-modal')?.classList.add('hidden');
}

function plantSeed(plotIndex, plantId) {
  if (plotIndex >= game.garden.unlocked) {
    showNotification('🔒 この区画はまだアンロックされていません', 'warning');
    return;
  }
  
  if (game.garden.plots[plotIndex]) {
    showNotification('🌱 この区画には既に植物があります', 'warning');
    return;
  }
  
  const plant = GARDEN_PLANTS.find(p => p.id === plantId);
  if (!plant) return;
  
  if (game.cookies < plant.cost) {
    showNotification(`❌ クッキーが足りません（必要: ${formatNumber(plant.cost)}）`, 'warning');
    return;
  }
  
  game.cookies -= plant.cost;
  game.garden.plots[plotIndex] = {
    plantId: plantId,
    plantedAt: Date.now(),
    readyAt: Date.now() + plant.growTime * 1000,
  };
  
  AudioSystem.playClick();
  showNotification(`${plant.icon} ${plant.name}を植えました！`, 'normal');
  updateGardenUI();
  updateUI();
}

function harvestPlant(plotIndex) {
  const plot = game.garden.plots[plotIndex];
  if (!plot) return;
  
  const now = Date.now();
  if (now < plot.readyAt) {
    const remaining = Math.ceil((plot.readyAt - now) / 1000);
    showNotification(`⏳ あと${remaining}秒で収穫できます`, 'normal');
    return;
  }
  
  const plant = GARDEN_PLANTS.find(p => p.id === plot.plantId);
  if (!plant) return;
  
  // 収穫報酬
  if (plant.reward.type === 'cookies') {
    const amount = Math.floor(Math.random() * (plant.reward.max - plant.reward.min + 1)) + plant.reward.min;
    game.cookies += amount;
    game.stats.totalCookies += amount;
    showNotification(`${plant.icon} 収穫！+${formatNumber(amount)}クッキー`, 'treasure');
  } else if (plant.reward.type === 'buff') {
    game.activeEffects.push({
      type: 'garden_buff',
      name: plant.name,
      emoji: plant.icon,
      mult: plant.reward.mult,
      endsAt: Date.now() + plant.reward.duration * 1000,
    });
    recalculateAll();
    showNotification(`${plant.icon} ${plant.name}の効果発動！CPS +${Math.round((plant.reward.mult - 1) * 100)}%`, 'skill');
  } else if (plant.reward.type === 'treasure') {
    game.treasures += plant.reward.value;
    showNotification(`${plant.icon} 収穫！宝箱×${plant.reward.value}`, 'treasure');
  } else if (plant.reward.type === 'permanent') {
    const CPS_CAP = 0.5;
    if (game.permanentBonuses.cpsBonus < CPS_CAP) {
      game.permanentBonuses.cpsBonus = Math.min(game.permanentBonuses.cpsBonus + plant.reward.value, CPS_CAP);
      recalculateAll();
      showNotification(`${plant.icon} 永続ボーナス！CPS +${Math.round(plant.reward.value * 100)}%`, 'legendary');
    } else {
      // キャップ到達時は代わりにクッキー
      const bonus = game.cps * 20;
      game.cookies += bonus;
      game.stats.totalCookies += bonus;
      showNotification(`${plant.icon} +${formatNumber(bonus)} クッキー（上限到達）`, 'treasure');
    }
  }
  
  game.garden.plots[plotIndex] = null;
  AudioSystem.playTreasure();
  updateGardenUI();
  updateUI();
}

function updateGardenUI() {
  const container = document.getElementById('garden-plots');
  if (!container) return;
  
  const now = Date.now();
  
  container.innerHTML = game.garden.plots.map((plot, index) => {
    const isLocked = index >= game.garden.unlocked;
    
    if (isLocked) {
      const unlockCost = Math.pow(10, index + 3);
      return `
        <div class="garden-plot locked" data-index="${index}">
          <span class="plot-icon">🔒</span>
          <span class="plot-label">アンロック</span>
          <span class="plot-cost">${formatNumber(unlockCost)}</span>
        </div>
      `;
    }
    
    if (!plot) {
      return `
        <div class="garden-plot empty" data-index="${index}">
          <span class="plot-icon">➕</span>
          <span class="plot-label">空き区画</span>
        </div>
      `;
    }
    
    const plant = GARDEN_PLANTS.find(p => p.id === plot.plantId);
    const isReady = now >= plot.readyAt;
    const progress = Math.min(100, ((now - plot.plantedAt) / (plot.readyAt - plot.plantedAt)) * 100);
    const remaining = isReady ? 0 : Math.ceil((plot.readyAt - now) / 1000);
    
    return `
      <div class="garden-plot ${isReady ? 'ready' : 'growing'}" data-index="${index}">
        <span class="plot-icon">${plant.icon}</span>
        <span class="plot-label">${plant.name}</span>
        ${isReady ? 
          '<span class="plot-ready">収穫可能！</span>' : 
          `<div class="plot-progress"><div class="plot-bar" style="width: ${progress}%"></div></div>
           <span class="plot-time">${remaining}s</span>`
        }
      </div>
    `;
  }).join('');
  
  // 植物選択パネル
  const plantsPanel = document.getElementById('garden-plants');
  if (plantsPanel) {
    plantsPanel.innerHTML = GARDEN_PLANTS.map(plant => `
      <button class="plant-btn" data-plant="${plant.id}" ${game.cookies < plant.cost ? 'disabled' : ''}>
        <span class="plant-icon">${plant.icon}</span>
        <span class="plant-name">${plant.name}</span>
        <span class="plant-cost">${formatNumber(plant.cost)}</span>
        <span class="plant-time">${plant.growTime}s</span>
      </button>
    `).join('');
  }
}

function unlockGardenPlot(index) {
  const unlockCost = Math.pow(10, index + 3);
  if (game.cookies < unlockCost) {
    showNotification(`❌ クッキーが足りません（必要: ${formatNumber(unlockCost)}）`, 'warning');
    return;
  }
  
  game.cookies -= unlockCost;
  game.garden.unlocked = Math.max(game.garden.unlocked, index + 1);
  AudioSystem.playUpgrade();
  showNotification(`🔓 庭園区画${index + 1}をアンロック！`, 'skill');
  updateGardenUI();
  updateUI();
}

// ===============================================
// マイルストーンシステム
// ===============================================

function openMilestonesModal() {
  updateMilestonesUI();
  document.getElementById('milestones-modal')?.classList.remove('hidden');
}

function closeMilestonesModal() {
  document.getElementById('milestones-modal')?.classList.add('hidden');
}

function checkMilestones() {
  let newMilestones = false;
  
  for (const milestone of MILESTONES) {
    if (game.claimedMilestones.includes(milestone.id)) continue;
    if (milestone.check()) {
      newMilestones = true;
    }
  }
  
  if (newMilestones) {
    const btn = document.getElementById('btn-milestones');
    if (btn) btn.classList.add('has-new');
  }
}

function claimMilestone(milestoneId) {
  const milestone = MILESTONES.find(m => m.id === milestoneId);
  if (!milestone || game.claimedMilestones.includes(milestoneId)) return;
  if (!milestone.check()) return;
  
  game.claimedMilestones.push(milestoneId);
  
  const CPS_CAP = 0.5;
  const CLICK_CAP = 1.0;
  
  // 報酬適用
  if (milestone.reward.cookies) {
    game.cookies += milestone.reward.cookies;
    game.stats.totalCookies += milestone.reward.cookies;
  }
  if (milestone.reward.spin) {
    game.spins += milestone.reward.spin;
  }
  if (milestone.reward.treasure) {
    game.treasures += milestone.reward.treasure;
  }
  if (milestone.reward.permanent_cps) {
    game.permanentBonuses.cpsBonus = Math.min(game.permanentBonuses.cpsBonus + milestone.reward.permanent_cps, CPS_CAP);
    recalculateAll();
  }
  if (milestone.reward.permanent_click) {
    game.permanentBonuses.clickBonus = Math.min(game.permanentBonuses.clickBonus + milestone.reward.permanent_click, CLICK_CAP);
    recalculateAll();
  }
  
  AudioSystem.playAchievement();
  showNotification(`🏆 マイルストーン達成！ ${milestone.name}`, 'achievement');
  updateMilestonesUI();
  updateUI();
}

function updateMilestonesUI() {
  const container = document.getElementById('milestones-list');
  if (!container) return;
  
  container.innerHTML = MILESTONES.map(milestone => {
    const isClaimed = game.claimedMilestones.includes(milestone.id);
    const isAvailable = milestone.check();
    
    let rewardText = [];
    if (milestone.reward.cookies) rewardText.push(`${formatNumber(milestone.reward.cookies)}🍪`);
    if (milestone.reward.spin) rewardText.push(`${milestone.reward.spin}回転🎰`);
    if (milestone.reward.treasure) rewardText.push(`${milestone.reward.treasure}宝箱📦`);
    if (milestone.reward.permanent_cps) rewardText.push(`CPS+${Math.round(milestone.reward.permanent_cps * 100)}%`);
    if (milestone.reward.permanent_click) rewardText.push(`クリック+${Math.round(milestone.reward.permanent_click * 100)}%`);
    
    return `
      <div class="milestone-item ${isClaimed ? 'claimed' : ''} ${isAvailable && !isClaimed ? 'available' : ''}">
        <span class="milestone-icon">${milestone.icon}</span>
        <div class="milestone-info">
          <span class="milestone-name">${milestone.name}</span>
          <span class="milestone-reward">${rewardText.join(', ')}</span>
        </div>
        ${isClaimed ? '<span class="milestone-status">✅ 獲得済み</span>' : 
          isAvailable ? `<button class="btn-claim-milestone" data-id="${milestone.id}">受け取る</button>` : 
          '<span class="milestone-status">🔒</span>'}
      </div>
    `;
  }).join('');
  
  container.querySelectorAll('.btn-claim-milestone').forEach(btn => {
    btn.addEventListener('click', () => claimMilestone(btn.dataset.id));
  });
}

// ===============================================
// チャレンジシステム
// ===============================================

function openChallengeModal() {
  updateChallengeUI();
  document.getElementById('challenge-modal')?.classList.remove('hidden');
}

function closeChallengeModal() {
  document.getElementById('challenge-modal')?.classList.add('hidden');
}

function startChallenge(challengeId) {
  if (game.challenge.active) {
    showNotification('⚠️ 既にチャレンジ中です！', 'warning');
    return;
  }
  
  const challenge = CHALLENGES.find(c => c.id === challengeId);
  if (!challenge) return;
  
  if (game.challenge.completed.includes(challengeId)) {
    showNotification('✅ このチャレンジは既にクリア済みです', 'normal');
    return;
  }
  
  game.challenge.active = challengeId;
  game.challenge.startTime = Date.now();
  game.challenge.startCookies = game.stats.totalCookies;
  game.challenge.startClicks = game.stats.totalClicks;
  
  AudioSystem.playSkill();
  showNotification(`⚡ ${challenge.name} 開始！`, 'skill');
  closeChallengeModal();
  updateChallengeUI();
}

function checkChallengeProgress() {
  if (!game.challenge.active) return;
  
  const challenge = CHALLENGES.find(c => c.id === game.challenge.active);
  if (!challenge) return;
  
  const elapsed = Date.now() - game.challenge.startTime;
  const timeRemaining = challenge.timeLimit * 1000 - elapsed;
  
  // 時間切れ
  if (timeRemaining <= 0) {
    showNotification(`⏰ ${challenge.name} 失敗...`, 'warning');
    game.challenge.active = null;
    updateChallengeUI();
    return;
  }
  
  // 目標達成チェック
  let achieved = false;
  
  if (challenge.type === 'cps') {
    achieved = game.cps >= challenge.goal;
  } else if (challenge.type === 'clicks') {
    const clicksDone = game.stats.totalClicks - game.challenge.startClicks;
    achieved = clicksDone >= challenge.goal;
  } else {
    const cookiesEarned = game.stats.totalCookies - game.challenge.startCookies;
    achieved = cookiesEarned >= challenge.goal;
  }
  
  if (achieved) {
    game.challenge.completed.push(challenge.id);
    game.challenge.active = null;
    
    const CLICK_CAP = 1.0;
    
    // 報酬付与
    if (challenge.reward.spin) game.spins += challenge.reward.spin;
    if (challenge.reward.treasure) game.treasures += challenge.reward.treasure;
    if (challenge.reward.permanent_click) {
      game.permanentBonuses.clickBonus = Math.min(game.permanentBonuses.clickBonus + challenge.reward.permanent_click, CLICK_CAP);
      recalculateAll();
    }
    
    AudioSystem.playJackpot();
    showNotification(`🎉 ${challenge.name} クリア！`, 'jackpot');
    checkAchievements();
    updateChallengeUI();
    updateUI();
  }
}

function updateChallengeUI() {
  const container = document.getElementById('challenge-list');
  if (!container) return;
  
  container.innerHTML = CHALLENGES.map(challenge => {
    const isCompleted = game.challenge.completed.includes(challenge.id);
    const isActive = game.challenge.active === challenge.id;
    
    let progress = '';
    if (isActive) {
      const elapsed = Date.now() - game.challenge.startTime;
      const timeRemaining = Math.max(0, challenge.timeLimit - Math.floor(elapsed / 1000));
      
      let current = 0;
      if (challenge.type === 'cps') {
        current = game.cps;
      } else if (challenge.type === 'clicks') {
        current = game.stats.totalClicks - game.challenge.startClicks;
      } else {
        current = game.stats.totalCookies - game.challenge.startCookies;
      }
      
      progress = `<div class="challenge-progress">
        <span>進捗: ${formatNumber(current)} / ${formatNumber(challenge.goal)}</span>
        <span>残り: ${timeRemaining}秒</span>
      </div>`;
    }
    
    let rewardText = [];
    if (challenge.reward.spin) rewardText.push(`${challenge.reward.spin}回転🎰`);
    if (challenge.reward.treasure) rewardText.push(`${challenge.reward.treasure}宝箱📦`);
    if (challenge.reward.permanent_click) rewardText.push(`クリック+${Math.round(challenge.reward.permanent_click * 100)}%`);
    
    return `
      <div class="challenge-item ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}">
        <span class="challenge-icon">${challenge.icon}</span>
        <div class="challenge-info">
          <span class="challenge-name">${challenge.name}</span>
          <span class="challenge-desc">${challenge.desc}</span>
          <span class="challenge-reward">報酬: ${rewardText.join(', ')}</span>
          ${progress}
        </div>
        ${isCompleted ? '<span class="challenge-status">✅ クリア</span>' : 
          isActive ? '<span class="challenge-status">⏱️ 進行中</span>' : 
          `<button class="btn-start-challenge" data-id="${challenge.id}">挑戦</button>`}
      </div>
    `;
  }).join('');
  
  container.querySelectorAll('.btn-start-challenge').forEach(btn => {
    btn.addEventListener('click', () => startChallenge(btn.dataset.id));
  });
  
  // アクティブチャレンジの表示
  const activeDisplay = document.getElementById('active-challenge');
  if (activeDisplay) {
    if (game.challenge.active) {
      const challenge = CHALLENGES.find(c => c.id === game.challenge.active);
      const elapsed = Date.now() - game.challenge.startTime;
      const timeRemaining = Math.max(0, challenge.timeLimit - Math.floor(elapsed / 1000));
      activeDisplay.innerHTML = `<span>${challenge.icon} ${challenge.name}</span><span>${timeRemaining}s</span>`;
      activeDisplay.classList.remove('hidden');
    } else {
      activeDisplay.classList.add('hidden');
    }
  }
}

// ===============================================
// ゴールデンクッキー
// ===============================================

let goldenTimeout = null;

function scheduleGoldenCookie() {
  if (goldenTimeout) clearTimeout(goldenTimeout);
  
  let baseDelay = 60000 + Math.random() * 120000; // 60-180秒
  
  // アップグレードで頻度アップ
  if (hasUpgrade('golden2')) {
    baseDelay *= 0.75;
  }
  
  goldenTimeout = setTimeout(spawnGoldenCookie, baseDelay);
}

function spawnGoldenCookie() {
  const layer = document.getElementById('golden-layer');
  if (!layer) return;
  
  const el = document.createElement('div');
  el.className = 'golden-cookie';
  el.textContent = '🍪';
  el.style.left = (10 + Math.random() * 70) + '%';
  el.style.top = (10 + Math.random() * 60) + '%';
  
  el.addEventListener('click', (e) => {
    e.stopPropagation();
    onGoldenClick();
    el.remove();
  });
  
  layer.appendChild(el);
  
  // 15秒後に消える
  setTimeout(() => {
    if (el.parentNode) el.remove();
  }, 15000);
  
  scheduleGoldenCookie();
}

function onGoldenClick() {
  game.stats.goldenClicked++;
  
  // ランダム効果
  const weights = [40, 30, 20, 7, 3]; // 各効果の重み
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  let rand = Math.random() * totalWeight;
  let effectIndex = 0;
  
  for (let i = 0; i < weights.length; i++) {
    rand -= weights[i];
    if (rand <= 0) {
      effectIndex = i;
      break;
    }
  }
  
  const effectTemplate = GOLDEN_EFFECTS[effectIndex];
  
  if (effectTemplate.type === 'lucky') {
    // 即時ボーナス
    let bonus = Math.min(game.cps * 900, game.cookies * 0.15);
    bonus = Math.max(bonus, 13);
    
    // ゴールデン強化
    if (hasUpgrade('golden3')) bonus *= 1.5;
    const stage = DRAGON_STAGES[game.dragon.level];
    if (stage?.bonus?.type === 'golden' || stage?.bonus?.type === 'all') {
      bonus *= stage.bonus.value;
    }
    
    game.cookies += bonus;
    game.stats.totalCookies += bonus;
    game.stats.totalCookiesAllTime += bonus;
    showNotification(`🍀 ラッキー！+${formatNumber(bonus)} クッキー！`);
  } else if (effectTemplate.type === 'cookieStorm') {
    // クッキーストーム（大量のミニクッキーが降る）
    startCookieStorm();
    showNotification(`🌪️ クッキーストーム！`);
  } else {
    // 持続効果
    let duration = effectTemplate.duration * 1000;
    if (hasUpgrade('golden1')) duration *= 1.5;
    
    const effect = {
      ...effectTemplate,
      endsAt: Date.now() + duration,
    };
    
    game.activeEffects.push(effect);
    recalculateAll();
    showNotification(`${effectTemplate.emoji} ${effectTemplate.name}！${effectTemplate.desc}`);
  }
  
  AudioSystem.playGolden();
  checkAchievements();
  updateUI();
}

function startCookieStorm() {
  const layer = document.getElementById('float-layer');
  if (!layer) return;
  
  const count = 50;
  const interval = 100;
  let spawned = 0;
  
  const storm = setInterval(() => {
    if (spawned >= count) {
      clearInterval(storm);
      return;
    }
    
    const x = Math.random() * window.innerWidth;
    const el = document.createElement('div');
    el.className = 'golden-cookie';
    el.textContent = '🍪';
    el.style.fontSize = '1.5rem';
    el.style.position = 'fixed';
    el.style.left = x + 'px';
    el.style.top = '-50px';
    el.style.transition = 'top 2s linear';
    el.style.cursor = 'pointer';
    el.style.zIndex = '9000';
    
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const bonus = game.cps * 0.5 + 1;
      game.cookies += bonus;
      game.stats.totalCookies += bonus;
      spawnFloatText('+' + formatNumber(bonus), e.clientX, e.clientY);
      el.remove();
    });
    
    document.body.appendChild(el);
    
    requestAnimationFrame(() => {
      el.style.top = (window.innerHeight + 50) + 'px';
    });
    
    setTimeout(() => {
      if (el.parentNode) el.remove();
    }, 2500);
    
    spawned++;
  }, interval);
}

// ===============================================
// エフェクト
// ===============================================

function spawnFloatText(text, x, y, isHighCombo = false, isCrit = false) {
  const layer = document.getElementById('float-layer');
  if (!layer) return;
  
  x = x || window.innerWidth / 2;
  y = y || 200;
  
  const el = document.createElement('div');
  let className = 'float-text';
  if (isCrit) className += ' crit';
  else if (isHighCombo) className += ' combo';
  el.className = className;
  
  if (isCrit) {
    el.textContent = '💥 CRIT! ' + text;
  } else {
    el.textContent = text;
  }
  
  el.style.left = (x + (Math.random() - 0.5) * 40) + 'px';
  el.style.top = y + 'px';
  
  layer.appendChild(el);
  
  requestAnimationFrame(() => {
    el.style.transform = 'translateY(-120px) scale(1.1)';
    el.style.opacity = '0';
  });
  
  setTimeout(() => el.remove(), 1000);
}

function spawnParticles(x, y, count = 5, isCrit = false) {
  const layer = document.getElementById('particle-layer');
  if (!layer) return;
  
  x = x || window.innerWidth / 2;
  y = y || 200;
  
  const emojis = isCrit ? ['💥', '⚡', '✨', '🌟'] : ['🍪'];
  
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'particle' + (isCrit ? ' crit-particle' : '');
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    
    const angle = Math.random() * Math.PI * 2;
    const dist = (isCrit ? 100 : 60) + Math.random() * 80;
    el.style.setProperty('--tx', Math.cos(angle) * dist + 'px');
    el.style.setProperty('--ty', Math.sin(angle) * dist + 'px');
    el.style.setProperty('--rot', (Math.random() * 360) + 'deg');
    
    layer.appendChild(el);
    setTimeout(() => el.remove(), isCrit ? 1200 : 800);
  }
}

function shakeScreen(intensity = 1) {
  const cookie = document.getElementById('cookie-button');
  if (cookie) {
    cookie.style.setProperty('--shake-intensity', intensity);
    cookie.classList.add('shake');
    setTimeout(() => cookie.classList.remove('shake'), 150 * intensity);;
  }
}

function showNotification(text, type = '') {
  const container = document.getElementById('notifications');
  if (!container) return;
  
  const el = document.createElement('div');
  el.className = 'notification ' + type;
  el.textContent = text;
  container.appendChild(el);
  
  setTimeout(() => el.classList.add('show'), 10);
  setTimeout(() => {
    el.classList.remove('show');
    setTimeout(() => el.remove(), 300);
  }, 4000);
}

// ===============================================
// UI更新
// ===============================================

function updateUI() {
  // ヘッダー
  document.getElementById('cookies').textContent = formatNumber(game.cookies);
  document.getElementById('cps').textContent = formatNumber(game.cps);
  document.getElementById('click-value').textContent = formatNumber(game.clickValue);
  document.getElementById('heavenly-chips').textContent = formatNumber(game.heavenlyChips);
  document.getElementById('prestige-mult').textContent = game.prestigeMult.toFixed(2);
  
  // コンボ
  const comboCount = document.getElementById('combo-count');
  const comboProgress = document.getElementById('combo-progress');
  if (comboCount) comboCount.textContent = game.combo.toFixed(1);
  if (comboProgress) comboProgress.style.width = (game.comboTimer / 2000 * 100) + '%';
  
  // クッキー情報
  const cookiePerClick = document.getElementById('cookie-per-click');
  if (cookiePerClick) {
    cookiePerClick.innerHTML = `クリックで <strong>${formatNumber(game.clickValue)}</strong> クッキー`;
  }
  
  // ドラゴン
  document.getElementById('dragon-emoji').textContent = game.dragon.emoji;
  document.getElementById('dragon-name').textContent = game.dragon.name;
  document.getElementById('dragon-level').textContent = game.dragon.level;
  
  renderBuildings();
  renderUpgrades();
  renderEffects();
  renderPrestige();
}

function renderBuildings() {
  const container = document.getElementById('buildings');
  if (!container) return;
  
  const buyAmount = getCurrentBuyAmount();
  
  container.innerHTML = game.buildings.map(b => {
    const amount = buyAmount === 'max' ? getMaxAffordable(b) : buyAmount;
    const cost = getBuildingCost(b, amount);
    const canAfford = game.cookies >= cost && amount > 0;
    const cps = getBuildingCps(b);
    const totalProd = b.owned * cps;
    
    return `
      <div class="building ${canAfford ? 'can-afford' : ''}" data-id="${b.id}">
        <div class="building-icon">${b.emoji}</div>
        <div class="building-main">
          <div class="building-header">
            <span class="building-name">${b.name}</span>
            <span class="building-owned">(${b.owned})</span>
          </div>
          <div class="building-production">+${formatNumber(cps)}/s each</div>
        </div>
        <div class="building-right">
          <div class="building-cost">${formatNumber(cost)}</div>
          <div class="building-total">${formatNumber(totalProd)}/s</div>
        </div>
      </div>
    `;
  }).join('');
  
  container.querySelectorAll('.building').forEach(el => {
    el.addEventListener('click', () => {
      const id = parseInt(el.dataset.id);
      buyBuilding(id, getCurrentBuyAmount());
    });
  });
}

function getCurrentBuyAmount() {
  const active = document.querySelector('.buy-amt-btn.active');
  const amount = active?.dataset.amount;
  if (amount === 'max') return 'max';
  return parseInt(amount) || 1;
}

function renderUpgrades() {
  const container = document.getElementById('upgrades');
  const owned = document.getElementById('owned-upgrades');
  if (!container) return;
  
  const available = UPGRADES.filter(u => !hasUpgrade(u.id) && u.req());
  
  // カテゴリ別に分類
  const categories = {
    click: { name: '👆 クリック強化', items: [] },
    clickCps: { name: '🔗 クリック+CPS', items: [] },
    building: { name: '🏠 建物強化', items: [] },
    global: { name: '🌟 全体強化', items: [] },
    golden: { name: '✨ ゴールデン', items: [] },
  };
  
  available.forEach(u => {
    if (categories[u.type]) {
      categories[u.type].items.push(u);
    }
  });
  
  let html = '';
  
  Object.entries(categories).forEach(([type, cat]) => {
    if (cat.items.length === 0) return;
    
    html += `<div class="upgrade-category">
      <h4 class="upgrade-category-title">${cat.name}</h4>
      <div class="upgrade-list">`;
    
    cat.items.forEach(u => {
      const canAfford = game.cookies >= u.cost;
      const targetInfo = u.target !== undefined ? `（${BUILDINGS[u.target]?.name || ''}）` : '';
      
      html += `
        <div class="upgrade-card ${canAfford ? 'can-afford' : ''}" data-id="${u.id}">
          <div class="upgrade-card-icon">${u.icon}</div>
          <div class="upgrade-card-info">
            <div class="upgrade-card-name">${u.name} ${targetInfo}</div>
            <div class="upgrade-card-desc">${u.desc}</div>
          </div>
          <div class="upgrade-card-cost ${canAfford ? 'affordable' : ''}">
            <span class="cost-label">🍪</span>
            <span class="cost-value">${formatNumber(u.cost)}</span>
          </div>
        </div>`;
    });
    
    html += '</div></div>';
  });
  
  if (html === '') {
    html = '<p class="no-upgrades">現在購入可能なアップグレードはありません</p>';
  }
  
  container.innerHTML = html;
  
  container.querySelectorAll('.upgrade-card').forEach(el => {
    el.addEventListener('click', () => buyUpgrade(el.dataset.id));
  });
  
  if (owned) {
    owned.innerHTML = game.upgrades.map(id => {
      const u = UPGRADES.find(x => x.id === id);
      return `<span class="owned-upgrade" title="${u?.desc || ''}">${u?.icon || '✓'} ${u?.name || id}</span>`;
    }).join('');
  }
}

function renderEffects() {
  const container = document.getElementById('effects');
  if (!container) return;
  
  const now = Date.now();
  game.activeEffects = game.activeEffects.filter(e => e.endsAt > now);
  
  container.innerHTML = game.activeEffects.map(e => {
    const remaining = Math.ceil((e.endsAt - now) / 1000);
    const className = e.type === 'frenzy' || e.type === 'dragonHarvest' ? 'frenzy' : 
                     e.type === 'clickFrenzy' ? 'click-frenzy' : '';
    return `<div class="effect-badge ${className}">${e.emoji} ${e.name} ${remaining}s</div>`;
  }).join('');
  
  if (game.activeEffects.length === 0) {
    recalculateAll();
  }
}

function renderPrestige() {
  const gain = calculatePrestigeGain();
  const newTotal = game.heavenlyChips + gain;
  const newMult = 1 + newTotal * 0.01;
  
  document.getElementById('current-chips').textContent = formatNumber(game.heavenlyChips);
  document.getElementById('current-mult').textContent = 'x' + game.prestigeMult.toFixed(2);
  document.getElementById('prestige-gain').textContent = '+' + formatNumber(gain);
  document.getElementById('new-mult').textContent = 'x' + newMult.toFixed(2);
  
  const btn = document.getElementById('btn-prestige');
  if (btn) {
    btn.disabled = gain <= 0;
  }
  
  // 天国アップグレード
  const container = document.getElementById('heavenly-upgrades');
  if (container) {
    const available = game.heavenlyChips - game.heavenlyChipsSpent;
    container.innerHTML = HEAVENLY_UPGRADES.map(u => {
      const owned = hasHeavenlyUpgrade(u.id);
      const canAfford = available >= u.cost && u.req();
      return `
        <div class="upgrade ${owned ? 'owned' : canAfford ? 'can-afford' : ''}" 
             data-id="${u.id}" 
             title="${u.desc}"
             ${owned ? 'data-owned="true"' : ''}>
          <div class="upgrade-icon">${u.icon}</div>
          <div class="upgrade-cost">${owned ? '✓' : u.cost}</div>
        </div>
      `;
    }).join('');
    
    container.querySelectorAll('.upgrade:not([data-owned])').forEach(el => {
      el.addEventListener('click', () => buyHeavenlyUpgrade(el.dataset.id));
    });
  }
}

function renderAchievements() {
  const container = document.getElementById('achievements-list');
  if (!container) return;
  
  document.getElementById('achievement-count').textContent = game.achievements.length;
  document.getElementById('achievement-total').textContent = ACHIEVEMENTS.length;
  document.getElementById('achievement-bonus').textContent = game.achievements.length;
  
  container.innerHTML = ACHIEVEMENTS.map(a => {
    const unlocked = hasAchievement(a.id);
    return `
      <div class="achievement ${unlocked ? 'unlocked' : 'locked'}">
        <span class="achievement-icon">${unlocked ? a.icon : '❓'}</span>
        <div class="achievement-info">
          <span class="achievement-name">${unlocked ? a.name : '???'}</span>
          <span class="achievement-desc">${unlocked ? a.desc : '???'}</span>
        </div>
      </div>
    `;
  }).join('');
}

function renderStats() {
  const container = document.getElementById('stats');
  if (!container) return;
  
  const playTime = Date.now() - game.stats.startTime + game.stats.playTime;
  const sessionTime = Date.now() - game.stats.sessionStart;
  const critChance = ((game.critChance + game.permanentBonuses.critChanceBonus) * 100).toFixed(1);
  const critMult = (game.critMult + game.permanentBonuses.critMultBonus).toFixed(1);
  
  container.innerHTML = `
    <div class="stat-row"><span>現在のクッキー</span><span>${formatNumber(game.cookies)}</span></div>
    <div class="stat-row"><span>総獲得クッキー</span><span>${formatNumber(game.stats.totalCookies)}</span></div>
    <div class="stat-row"><span>全期間の総獲得</span><span>${formatNumber(game.stats.totalCookiesAllTime)}</span></div>
    <div class="stat-row"><span>クリックで獲得</span><span>${formatNumber(game.stats.totalCookiesFromClicks)}</span></div>
    
    <div class="stat-section">
      <h4>📊 クリック統計</h4>
      <div class="stat-row"><span>総クリック数</span><span>${formatNumber(game.stats.totalClicks)}</span></div>
      <div class="stat-row"><span>クリティカル発生</span><span>${formatNumber(game.stats.criticalHits)}</span></div>
      <div class="stat-row"><span>最高クリティカル</span><span>${formatNumber(game.stats.highestCrit)}</span></div>
      <div class="stat-row"><span>クリティカル率</span><span>${critChance}%</span></div>
      <div class="stat-row"><span>クリティカル倍率</span><span>x${critMult}</span></div>
      <div class="stat-row"><span>最高コンボ</span><span>x${game.maxCombo.toFixed(1)}</span></div>
    </div>
    
    <div class="stat-section">
      <h4>🏠 建物・強化</h4>
      <div class="stat-row"><span>建物数</span><span>${getTotalBuildings()}</span></div>
      <div class="stat-row"><span>アップグレード</span><span>${game.upgrades.length}/${UPGRADES.length}</span></div>
      <div class="stat-row"><span>実績</span><span>${game.achievements.length}/${ACHIEVEMENTS.length}</span></div>
      <div class="stat-row"><span>ゴールデンクリック</span><span>${game.stats.goldenClicked}</span></div>
    </div>
    
    <div class="stat-section">
      <h4>🎁 ボーナス</h4>
      <div class="stat-row"><span>宝箱を開けた回数</span><span>${game.stats.treasuresOpened}</span></div>
      <div class="stat-row"><span>ルーレット回数</span><span>${game.stats.spinsUsed}</span></div>
      <div class="stat-row"><span>連続ログイン</span><span>${game.daily.streak}日</span></div>
      <div class="stat-row"><span>永続クリック+</span><span>${(game.permanentBonuses.clickBonus * 100).toFixed(0)}%</span></div>
      <div class="stat-row"><span>永続CPS+</span><span>${(game.permanentBonuses.cpsBonus * 100).toFixed(0)}%</span></div>
    </div>
    
    <div class="stat-section">
      <h4>✨ 転生</h4>
      <div class="stat-row"><span>天国チップ</span><span>${formatNumber(game.heavenlyChips)}</span></div>
      <div class="stat-row"><span>転生回数</span><span>${game.stats.timesPrestiged}</span></div>
      <div class="stat-row"><span>転生倍率</span><span>x${game.prestigeMult.toFixed(2)}</span></div>
    </div>
    
    <div class="stat-section">
      <h4>⏱️ 時間</h4>
      <div class="stat-row"><span>総プレイ時間</span><span>${formatTime(playTime)}</span></div>
      <div class="stat-row"><span>今回のセッション</span><span>${formatTime(sessionTime)}</span></div>
    </div>
  `;
}

function updateDragonModal() {
  document.getElementById('dragon-avatar').textContent = game.dragon.emoji;
  document.getElementById('dragon-modal-name').textContent = game.dragon.name;
  document.getElementById('dragon-modal-level').textContent = game.dragon.level;
  
  const stage = DRAGON_STAGES[game.dragon.level];
  const bonusText = document.getElementById('dragon-bonus-text');
  if (bonusText) {
    bonusText.textContent = stage?.bonus ? `ボーナス: ${stage.bonus.desc}` : 'ボーナス: なし';
  }
  
  document.getElementById('dragon-feed-cost').textContent = formatNumber(getDragonFeedCost());
  
  const feedBtn = document.getElementById('btn-feed-dragon');
  if (feedBtn) {
    feedBtn.disabled = game.cookies < getDragonFeedCost() || game.dragon.level >= DRAGON_STAGES.length - 1;
  }
  
  // オーラリスト
  const aurasList = document.getElementById('dragon-auras-list');
  if (aurasList) {
    aurasList.innerHTML = DRAGON_STAGES.filter(s => s.level > 0 && s.level <= game.dragon.level).map(s => `
      <div class="aura-item ${game.dragon.level === s.level ? 'active' : ''}">
        <span>${s.emoji} ${s.name}</span>
        <span>${s.bonus?.desc || ''}</span>
      </div>
    `).join('');
  }
}

// ===============================================
// 実績チェック
// ===============================================

function checkAchievements() {
  let newAchievement = false;
  
  ACHIEVEMENTS.forEach(a => {
    if (!hasAchievement(a.id) && a.check()) {
      game.achievements.push(a.id);
      newAchievement = true;
      showNotification(`🏆 実績解除: ${a.name}`, 'achievement');
      AudioSystem.playAchievement();
    }
  });
  
  if (newAchievement) {
    recalculateAll();
  }
  
  // 最高コンボ更新
  if (game.combo > game.maxCombo) {
    game.maxCombo = game.combo;
  }
}

// ===============================================
// ニュースティッカー
// ===============================================

let newsIndex = 0;

function updateNews() {
  const el = document.getElementById('news-text');
  if (!el) return;
  
  el.textContent = NEWS_MESSAGES[newsIndex];
  newsIndex = (newsIndex + 1) % NEWS_MESSAGES.length;
}

// ===============================================
// ゲームループ
// ===============================================

function gameLoop(now) {
  const dt = (now - game.lastTick) / 1000;
  game.lastTick = now;
  
  // CPS生産
  if (game.cps > 0) {
    const gained = game.cps * dt;
    game.cookies += gained;
    game.stats.totalCookies += gained;
    game.stats.totalCookiesAllTime += gained;
  }
  
  // コンボ減衰
  if (game.comboTimer > 0) {
    game.comboTimer -= dt * 1000;
    if (game.comboTimer <= 0) {
      game.combo = Math.max(1, game.combo - 0.5);
      game.comboTimer = 0;
    }
  }
  
  // エフェクト終了チェック
  const now2 = Date.now();
  const hadEffects = game.activeEffects.length > 0;
  game.activeEffects = game.activeEffects.filter(e => e.endsAt > now2);
  if (hadEffects && game.activeEffects.length === 0) {
    recalculateAll();
  }
  
  checkAchievements();
  updateUI();
  
  requestAnimationFrame(gameLoop);
}

// ===============================================
// セーブ/ロード
// ===============================================

function saveGame() {
  game.stats.playTime += Date.now() - game.stats.sessionStart;
  game.stats.sessionStart = Date.now();
  game.stats.lastSave = Date.now();
  
  const saveData = JSON.stringify(game);
  localStorage.setItem(STORAGE_KEY, saveData);
  
  document.getElementById('last-save').textContent = `最終セーブ: ${new Date().toLocaleTimeString()}`;
}

function loadGame() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return false;
  
  try {
    const saved = JSON.parse(raw);
    
    // デフォルト値とマージ
    game = { ...defaultGame(), ...saved };
    
    // 建物データを復元
    game.buildings = BUILDINGS.map(b => {
      const savedB = saved.buildings?.find(sb => sb.id === b.id);
      return { ...b, owned: savedB?.owned || 0, totalProduced: savedB?.totalProduced || 0 };
    });
    
    // オフライン収益
    const offlineTime = (Date.now() - game.stats.lastSave) / 1000;
    if (offlineTime > 5) {
      let offlineMult = 0.5;
      if (hasHeavenlyUpgrade('heavenOffline')) {
        offlineMult = 1.0;
      }
      
      recalculateAll();
      const offlineGain = game.cps * offlineTime * offlineMult;
      
      if (offlineGain > 0) {
        game.cookies += offlineGain;
        game.stats.totalCookies += offlineGain;
        game.stats.totalCookiesAllTime += offlineGain;
        showNotification(`⏰ オフラインボーナス: +${formatNumber(offlineGain)} (${formatTime(offlineTime * 1000)})`);
      }
    }
    
    game.stats.sessionStart = Date.now();
    
    recalculateAll();
    applySettings();
    
    return true;
  } catch (e) {
    console.error('Load failed:', e);
    return false;
  }
}

function exportSave() {
  saveGame();
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    showNotification('セーブデータがありません');
    return;
  }
  
  const encoded = btoa(unescape(encodeURIComponent(raw)));
  
  navigator.clipboard.writeText(encoded).then(() => {
    showNotification('📋 セーブデータをコピーしました！');
  }).catch(() => {
    prompt('セーブデータ（コピーして保存）:', encoded);
  });
}

function importSave() {
  const input = prompt('セーブデータを貼り付けてください:');
  if (!input) return;
  
  try {
    const decoded = decodeURIComponent(escape(atob(input)));
    JSON.parse(decoded); // 検証
    localStorage.setItem(STORAGE_KEY, decoded);
    location.reload();
  } catch (e) {
    showNotification('インポートに失敗しました');
  }
}

function resetGame() {
  if (!confirm('本当にリセットしますか？\n全てのデータが失われます。')) return;
  if (!confirm('本当に？この操作は取り消せません。')) return;
  
  localStorage.removeItem(STORAGE_KEY);
  location.reload();
}

// ===============================================
// 設定
// ===============================================

function applySettings() {
  document.body.dataset.theme = game.settings.theme;
  
  // テーマボタンの状態
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.theme === game.settings.theme);
  });
  
  // ボリュームスライダー
  document.getElementById('bgm-volume').value = game.settings.bgmVolume;
  document.getElementById('sfx-volume').value = game.settings.sfxVolume;
  document.getElementById('bgm-volume-label').textContent = game.settings.bgmVolume + '%';
  document.getElementById('sfx-volume-label').textContent = game.settings.sfxVolume + '%';
  
  // トグル
  document.getElementById('particles-enabled').checked = game.settings.particlesEnabled;
  document.getElementById('screenshake-enabled').checked = game.settings.screenshakeEnabled;
  
  // セレクト
  document.getElementById('number-format').value = game.settings.numberFormat;
  document.getElementById('autosave-interval').value = game.settings.autosaveInterval;
  
  AudioSystem.updateVolume();
}

function openModal(id) {
  document.getElementById(id)?.classList.remove('hidden');
  
  if (id === 'dragon-modal') {
    updateDragonModal();
  }
}

function closeModal(id) {
  document.getElementById(id)?.classList.add('hidden');
}

// ===============================================
// チュートリアル
// ===============================================

function startTutorial() {
  if (game.settings.tutorialCompleted) return;
  
  document.getElementById('tutorial-overlay')?.classList.remove('hidden');
}

function nextTutorialStep() {
  const currentStep = document.querySelector('.tutorial-step:not(.hidden)');
  const stepNum = parseInt(currentStep?.dataset.step || '1');
  
  currentStep?.classList.add('hidden');
  
  const nextStep = document.querySelector(`.tutorial-step[data-step="${stepNum + 1}"]`);
  if (nextStep) {
    nextStep.classList.remove('hidden');
  } else {
    // チュートリアル終了
    document.getElementById('tutorial-overlay')?.classList.add('hidden');
    game.settings.tutorialCompleted = true;
    saveGame();
  }
}

// ===============================================
// ミニゲーム
// ===============================================

const MiniGames = {
  current: null,
  
  open(gameType) {
    this.current = gameType;
    const content = document.getElementById('minigame-area-content');
    if (!content) return;
    
    document.querySelectorAll('.minigame-option').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.game === gameType);
    });
    
    if (gameType === 'slots') {
      this.initSlots(content);
    } else if (gameType === 'click-race') {
      this.initClickRace(content);
    } else if (gameType === 'memory') {
      this.initMemory(content);
    }
  },
  
  initSlots(container) {
    const cost = Math.floor(game.cookies * 0.01) || 100;
    
    container.innerHTML = `
      <div class="slots-container">
        <div class="slots-reels">
          <div class="slot-reel" id="reel1">🍪</div>
          <div class="slot-reel" id="reel2">🍪</div>
          <div class="slot-reel" id="reel3">🍪</div>
        </div>
        <p class="slots-cost">コスト: ${formatNumber(cost)} クッキー</p>
        <button class="btn-spin" id="btn-spin">🎰 スピン</button>
        <div class="slots-result" id="slots-result"></div>
      </div>
    `;
    
    document.getElementById('btn-spin').addEventListener('click', () => this.spinSlots(cost));
  },
  
  spinSlots(cost) {
    if (game.cookies < cost) {
      showNotification('クッキーが足りません！');
      return;
    }
    
    game.cookies -= cost;
    updateUI();
    
    const symbols = ['🍪', '🍫', '🍬', '🍩', '⭐', '💎', '🌟'];
    const reels = [
      document.getElementById('reel1'),
      document.getElementById('reel2'),
      document.getElementById('reel3'),
    ];
    
    const btn = document.getElementById('btn-spin');
    btn.disabled = true;
    
    // スピンアニメーション
    reels.forEach(r => r.classList.add('spinning'));
    
    const results = [];
    
    reels.forEach((reel, i) => {
      setTimeout(() => {
        reel.classList.remove('spinning');
        const symbol = symbols[Math.floor(Math.random() * symbols.length)];
        reel.textContent = symbol;
        results.push(symbol);
        
        if (results.length === 3) {
          this.checkSlotsResult(results, cost);
          btn.disabled = false;
        }
      }, 500 + i * 300);
    });
  },
  
  checkSlotsResult(results, cost) {
    const resultEl = document.getElementById('slots-result');
    
    if (results[0] === results[1] && results[1] === results[2]) {
      // 大当たり！
      let mult = results[0] === '💎' ? 100 : results[0] === '🌟' ? 50 : results[0] === '⭐' ? 20 : 10;
      const win = cost * mult;
      game.cookies += win;
      game.stats.totalCookies += win;
      resultEl.textContent = `🎉 大当たり！ +${formatNumber(win)}`;
      resultEl.className = 'slots-result win';
      AudioSystem.playGolden();
    } else if (results[0] === results[1] || results[1] === results[2] || results[0] === results[2]) {
      // 小当たり
      const win = cost * 2;
      game.cookies += win;
      game.stats.totalCookies += win;
      resultEl.textContent = `✨ 当たり！ +${formatNumber(win)}`;
      resultEl.className = 'slots-result win';
      AudioSystem.playBuy();
    } else {
      resultEl.textContent = '残念...';
      resultEl.className = 'slots-result lose';
    }
    
    updateUI();
  },
  
  initClickRace(container) {
    container.innerHTML = `
      <div class="click-race-container">
        <div class="click-race-timer" id="race-timer">10</div>
        <div class="click-race-count">クリック: <span id="race-count">0</span></div>
        <div class="click-race-target" id="race-target" style="display:none">🎯</div>
        <button class="btn-start-race" id="btn-start-race">🏁 スタート</button>
        <p id="race-result"></p>
      </div>
    `;
    
    document.getElementById('btn-start-race').addEventListener('click', () => this.startClickRace());
  },
  
  startClickRace() {
    const timerEl = document.getElementById('race-timer');
    const countEl = document.getElementById('race-count');
    const targetEl = document.getElementById('race-target');
    const startBtn = document.getElementById('btn-start-race');
    const resultEl = document.getElementById('race-result');
    
    startBtn.style.display = 'none';
    targetEl.style.display = 'flex';
    resultEl.textContent = '';
    
    let timeLeft = 10;
    let clicks = 0;
    
    timerEl.textContent = timeLeft;
    countEl.textContent = clicks;
    
    const clickHandler = () => {
      clicks++;
      countEl.textContent = clicks;
      AudioSystem.playClick();
    };
    
    targetEl.addEventListener('click', clickHandler);
    
    const timer = setInterval(() => {
      timeLeft--;
      timerEl.textContent = timeLeft;
      
      if (timeLeft <= 0) {
        clearInterval(timer);
        targetEl.removeEventListener('click', clickHandler);
        targetEl.style.display = 'none';
        startBtn.style.display = 'block';
        
        // 報酬計算
        const reward = clicks * game.cps * 0.1;
        game.cookies += reward;
        game.stats.totalCookies += reward;
        
        resultEl.textContent = `${clicks}クリック！ +${formatNumber(reward)} クッキー`;
        
        if (clicks >= 100) {
          showNotification('🎉 連打マスター！');
          AudioSystem.playAchievement();
        }
        
        updateUI();
      }
    }, 1000);
  },
  
  initMemory(container) {
    container.innerHTML = `
      <div class="memory-container" style="text-align:center">
        <p>🚧 準備中...</p>
        <p style="color:var(--text-secondary)">神経衰弱ミニゲームは今後追加予定です！</p>
      </div>
    `;
  }
};

// ===============================================
// 初期化
// ===============================================

function init() {
  console.log('init() called');
  
  // ローディング画面
  setTimeout(() => {
    document.getElementById('loading-screen')?.classList.add('hidden');
    console.log('Loading screen hidden');
  }, 1800);
  
  // オーディオ初期化
  AudioSystem.init();
  
  // ゲームロード
  const loaded = loadGame();
  
  if (!loaded) {
    // 新規ゲーム
    game = defaultGame();
    startTutorial();
  }
  
  recalculateAll();
  applySettings();
  updateUI();
  renderAchievements();
  renderStats();
  updateSkillsUI();
  updateTreasureUI();
  updateRouletteUI();
  
  // イベントリスナー
  setupEventListeners();
  
  // ゲームループ開始
  game.lastTick = performance.now();
  requestAnimationFrame(gameLoop);
  
  // ゴールデンクッキー
  scheduleGoldenCookie();
  
  // ニュースティッカー
  updateNews();
  setInterval(updateNews, 20000);
  
  // スキルUI更新（1秒ごと）
  setInterval(updateSkillsUI, 1000);
  
  // 庭園UI更新（5秒ごと）
  setInterval(updateGardenUI, 5000);
  
  // マイルストーンチェック（10秒ごと）
  setInterval(checkMilestones, 10000);
  
  // チャレンジ進捗チェック（1秒ごと）
  setInterval(() => {
    checkChallengeProgress();
    updateChallengeUI();
  }, 1000);
  
  // 宝箱スポーン（5分ごとにチャンス）
  setInterval(() => {
    if (Math.random() < 0.3) {
      game.treasures++;
      showNotification('📦 宝箱が届いた！', 'treasure');
      updateTreasureUI();
    }
  }, 300000);
  
  // デイリーボーナスチェック
  setTimeout(() => {
    checkDailyBonus();
  }, 2000);
  
  // オートセーブ
  setInterval(() => saveGame(), game.settings.autosaveInterval * 1000);
  
  // ページ離脱時にセーブ
  window.addEventListener('beforeunload', saveGame);
}

function setupEventListeners() {
  // クッキークリック
  const cookieBtn = document.getElementById('cookie-button');
  console.log('cookieBtn:', cookieBtn);
  cookieBtn?.addEventListener('click', (e) => {
    console.log('Cookie clicked!');
    clickCookie(e);
  });
  cookieBtn?.addEventListener('touchstart', (e) => {
    e.preventDefault();
    clickCookie(e.touches[0]);
  });
  
  // 購入数量ボタン
  document.querySelectorAll('.buy-amt-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.buy-amt-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderBuildings();
    });
  });
  
  // タブ
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('tab-' + btn.dataset.tab)?.classList.add('active');
      
      if (btn.dataset.tab === 'achievements') renderAchievements();
      if (btn.dataset.tab === 'stats') renderStats();
    });
  });
  
  // コントロール
  document.getElementById('save')?.addEventListener('click', () => {
    saveGame();
    showNotification('💾 セーブしました！');
  });
  document.getElementById('export')?.addEventListener('click', exportSave);
  document.getElementById('import')?.addEventListener('click', importSave);
  document.getElementById('reset')?.addEventListener('click', resetGame);
  
  // ヘッダーボタン
  document.getElementById('btn-settings')?.addEventListener('click', () => openModal('settings-modal'));
  document.getElementById('btn-music')?.addEventListener('click', () => AudioSystem.toggleBGM());
  document.getElementById('btn-sound')?.addEventListener('click', () => {
    AudioSystem.sfxEnabled = !AudioSystem.sfxEnabled;
    document.getElementById('btn-sound').textContent = AudioSystem.sfxEnabled ? '🔊' : '🔇';
  });
  
  // 転生
  document.getElementById('btn-prestige')?.addEventListener('click', doPrestige);
  
  // ドラゴン
  document.getElementById('btn-dragon')?.addEventListener('click', () => openModal('dragon-modal'));
  document.getElementById('btn-feed-dragon')?.addEventListener('click', feedDragon);
  
  // ミニゲーム
  document.getElementById('btn-minigame')?.addEventListener('click', () => {
    openModal('minigame-modal');
    MiniGames.open('slots');
  });
  document.querySelectorAll('.minigame-option').forEach(btn => {
    btn.addEventListener('click', () => MiniGames.open(btn.dataset.game));
  });
  
  // 宝箱
  document.getElementById('btn-treasure')?.addEventListener('click', () => {
    openModal('treasure-modal');
    document.getElementById('treasure-modal-count').textContent = game.treasures;
  });
  document.getElementById('btn-open-treasure')?.addEventListener('click', openTreasure);
  
  // ルーレット
  document.getElementById('btn-roulette')?.addEventListener('click', () => {
    openModal('roulette-modal');
    document.getElementById('spin-modal-count').textContent = game.spins;
  });
  document.getElementById('btn-spin-roulette')?.addEventListener('click', spinRoulette);
  
  // デイリーボーナス
  document.getElementById('btn-claim-daily')?.addEventListener('click', claimDailyBonus);
  
  // 庭園
  document.getElementById('btn-garden')?.addEventListener('click', openGardenModal);
  
  // マイルストーン
  document.getElementById('btn-milestones')?.addEventListener('click', openMilestonesModal);
  
  // チャレンジ
  document.getElementById('btn-challenge')?.addEventListener('click', openChallengeModal);
  
  // 庭園のプロットクリック
  document.getElementById('garden-plots')?.addEventListener('click', (e) => {
    const plot = e.target.closest('.garden-plot');
    if (!plot) return;
    
    const index = parseInt(plot.dataset.index);
    if (plot.classList.contains('locked')) {
      unlockGardenPlot(index);
    } else if (plot.classList.contains('ready')) {
      harvestPlant(index);
    } else if (plot.classList.contains('empty')) {
      // 選択中の植物があれば植える（とりあえず最初の植物）
      const selectedPlant = document.querySelector('.plant-btn.selected');
      if (selectedPlant) {
        plantSeed(index, selectedPlant.dataset.plant);
      }
    }
  });
  
  // 植物選択
  document.getElementById('garden-plants')?.addEventListener('click', (e) => {
    const btn = e.target.closest('.plant-btn');
    if (!btn || btn.disabled) return;
    
    document.querySelectorAll('.plant-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    
    // 空きプロットがあれば植える
    const emptyPlotIndex = game.garden.plots.findIndex((p, i) => !p && i < game.garden.unlocked);
    if (emptyPlotIndex !== -1) {
      plantSeed(emptyPlotIndex, btn.dataset.plant);
      btn.classList.remove('selected');
    }
  });
  
  // モーダル閉じる
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => closeModal(btn.dataset.modal));
  });
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal(modal.id);
    });
  });
  
  // チュートリアル
  document.querySelectorAll('.btn-tutorial-next').forEach(btn => {
    btn.addEventListener('click', nextTutorialStep);
  });
  
  // 設定
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      game.settings.theme = btn.dataset.theme;
      applySettings();
      saveGame();
    });
  });
  
  document.getElementById('bgm-volume')?.addEventListener('input', (e) => {
    game.settings.bgmVolume = parseInt(e.target.value);
    document.getElementById('bgm-volume-label').textContent = game.settings.bgmVolume + '%';
    AudioSystem.updateVolume();
  });
  
  document.getElementById('sfx-volume')?.addEventListener('input', (e) => {
    game.settings.sfxVolume = parseInt(e.target.value);
    document.getElementById('sfx-volume-label').textContent = game.settings.sfxVolume + '%';
  });
  
  document.getElementById('particles-enabled')?.addEventListener('change', (e) => {
    game.settings.particlesEnabled = e.target.checked;
  });
  
  document.getElementById('screenshake-enabled')?.addEventListener('change', (e) => {
    game.settings.screenshakeEnabled = e.target.checked;
  });
  
  document.getElementById('number-format')?.addEventListener('change', (e) => {
    game.settings.numberFormat = e.target.value;
    updateUI();
  });
  
  document.getElementById('autosave-interval')?.addEventListener('change', (e) => {
    game.settings.autosaveInterval = parseInt(e.target.value);
  });
  
  // キーボードショートカット
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    if (e.code === 'Space') {
      e.preventDefault();
      clickCookie({ clientX: window.innerWidth / 2, clientY: 300 });
    }
    if (e.code === 'KeyS' && e.ctrlKey) {
      e.preventDefault();
      saveGame();
      showNotification('💾 セーブしました！');
    }
  });
}

// DOMが読み込まれたら初期化
document.addEventListener('DOMContentLoaded', init);
