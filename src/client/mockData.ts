/* ------------------------------------------------------------------ */
/*  Shared Mock Data Store (localStorage-based)                        */
/* ------------------------------------------------------------------ */

export interface Transaction {
  id: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  title: string;
  date: string;
  amount: string;
  amountColor: string;
}

export interface RewardEntry {
  id: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  title: string;
  date: string;
  points: number;
}

export interface FavoriteBiller {
  id: string;
  name: string;
  category: string;
  accountNumber: string;
  savedAt: string;
}

export interface FavoriteRecipient {
  id: string;
  bankValue: string;
  bankLabel: string;
  accountNumber: string;
  nickname: string;
  savedAt: string;
}

export interface FavoriteContact {
  id: string;
  network: string;
  mobileNumber: string;
  savedAt: string;
}

const TRANSACTIONS_KEY = "mock_transactions";
const REWARDS_KEY = "mock_rewards";
const POINTS_KEY = "mock_total_points";
const BALANCE_KEY = "mock_balance";
const FAV_BILLERS_KEY = "mock_fav_billers";
const FAV_RECIPIENTS_KEY = "mock_fav_recipients";
const FAV_CONTACTS_KEY = "mock_fav_contacts";

/* -- Default seed data -- */

const defaultTransactions: Transaction[] = [
  {
    id: "t1",
    icon: "shopping_bag",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    title: "SM Supermarket",
    date: "Feb 18, 2026 \u2022 2:15 PM",
    amount: "- 1,240.50",
    amountColor: "text-slate-900 dark:text-slate-100",
  },
  {
    id: "t2",
    icon: "download",
    iconBg: "bg-green-100 dark:bg-green-900/30",
    iconColor: "text-green-600",
    title: "Payroll Deposit",
    date: "Feb 15, 2026 \u2022 9:00 AM",
    amount: "+ 45,000.00",
    amountColor: "text-green-600",
  },
  {
    id: "t3",
    icon: "electric_bolt",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    title: "Meralco Payment",
    date: "Feb 12, 2026 \u2022 4:30 PM",
    amount: "- 3,500.00",
    amountColor: "text-slate-900 dark:text-slate-100",
  },
];

const defaultRewards: RewardEntry[] = [
  {
    id: "h1",
    icon: "add_circle",
    iconBg: "bg-green-100 dark:bg-green-900/30",
    iconColor: "text-green-600 dark:text-green-400",
    title: "Credit Card Spend",
    date: "Feb 18, 2026",
    points: 50,
  },
  {
    id: "h2",
    icon: "shopping_bag",
    iconBg: "bg-slate-100 dark:bg-slate-700/50",
    iconColor: "text-slate-600 dark:text-slate-400",
    title: "Starbucks Voucher",
    date: "Feb 14, 2026",
    points: -500,
  },
  {
    id: "h3",
    icon: "add_circle",
    iconBg: "bg-green-100 dark:bg-green-900/30",
    iconColor: "text-green-600 dark:text-green-400",
    title: "Grocery Reward",
    date: "Feb 10, 2026",
    points: 120,
  },
  {
    id: "h4",
    icon: "stars",
    iconBg: "bg-green-100 dark:bg-green-900/30",
    iconColor: "text-green-600 dark:text-green-400",
    title: "Tier Bonus",
    date: "Feb 01, 2026",
    points: 200,
  },
  {
    id: "h5",
    icon: "shopping_bag",
    iconBg: "bg-slate-100 dark:bg-slate-700/50",
    iconColor: "text-slate-600 dark:text-slate-400",
    title: "Grab Voucher",
    date: "Jan 25, 2026",
    points: -500,
  },
  {
    id: "h6",
    icon: "add_circle",
    iconBg: "bg-green-100 dark:bg-green-900/30",
    iconColor: "text-green-600 dark:text-green-400",
    title: "Bill Payment Reward",
    date: "Jan 20, 2026",
    points: 80,
  },
];

const DEFAULT_POINTS = 1250;
const DEFAULT_BALANCE = 125450.0;

/* ------------------------------------------------------------------ */
/*  Getters                                                            */
/* ------------------------------------------------------------------ */

export function getTransactions(): Transaction[] {
  const raw = localStorage.getItem(TRANSACTIONS_KEY);
  if (!raw) return defaultTransactions;
  try {
    return JSON.parse(raw);
  } catch {
    return defaultTransactions;
  }
}

export function getRewards(): RewardEntry[] {
  const raw = localStorage.getItem(REWARDS_KEY);
  if (!raw) return defaultRewards;
  try {
    return JSON.parse(raw);
  } catch {
    return defaultRewards;
  }
}

export function getTotalPoints(): number {
  const raw = localStorage.getItem(POINTS_KEY);
  if (!raw) return DEFAULT_POINTS;
  return parseFloat(raw) || DEFAULT_POINTS;
}

export function getBalance(): number {
  const raw = localStorage.getItem(BALANCE_KEY);
  if (!raw) return DEFAULT_BALANCE;
  return parseFloat(raw) || DEFAULT_BALANCE;
}

/* ------------------------------------------------------------------ */
/*  Setters                                                            */
/* ------------------------------------------------------------------ */

function saveTransactions(txs: Transaction[]) {
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(txs));
}

function saveRewards(entries: RewardEntry[]) {
  localStorage.setItem(REWARDS_KEY, JSON.stringify(entries));
}

function saveTotalPoints(pts: number) {
  localStorage.setItem(POINTS_KEY, String(pts));
}

function saveBalance(bal: number) {
  localStorage.setItem(BALANCE_KEY, String(bal));
}

/* ------------------------------------------------------------------ */
/*  Actions                                                            */
/* ------------------------------------------------------------------ */

function formatNow(): { dateStr: string; dateTimeStr: string } {
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const timeStr = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  return { dateStr, dateTimeStr: `${dateStr} \u2022 ${timeStr}` };
}

/** Record a bill payment transaction + earn 2% rewards */
export function recordBillPayment(billerName: string, amount: number) {
  const { dateStr, dateTimeStr } = formatNow();
  const rewardPoints = Math.round(amount * 0.02);

  // Add transaction
  const txs = getTransactions();
  txs.unshift({
    id: `t-${Date.now()}`,
    icon: "payments",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    title: `${billerName} Payment`,
    date: dateTimeStr,
    amount: `- ${amount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`,
    amountColor: "text-slate-900 dark:text-slate-100",
  });
  saveTransactions(txs);

  // Add reward entry
  const rewards = getRewards();
  rewards.unshift({
    id: `r-${Date.now()}`,
    icon: "add_circle",
    iconBg: "bg-green-100 dark:bg-green-900/30",
    iconColor: "text-green-600 dark:text-green-400",
    title: `Bill Payment Reward (${billerName})`,
    date: dateStr,
    points: rewardPoints,
  });
  saveRewards(rewards);

  // Update points
  saveTotalPoints(getTotalPoints() + rewardPoints);

  // Deduct balance
  saveBalance(getBalance() - amount);

  return rewardPoints;
}

/** Record a buy load transaction + earn 2% rewards */
export function recordBuyLoad(networkName: string, amount: number) {
  const { dateStr, dateTimeStr } = formatNow();
  const rewardPoints = Math.round(amount * 0.02);

  // Add transaction
  const txs = getTransactions();
  txs.unshift({
    id: `t-${Date.now()}`,
    icon: "smartphone",
    iconBg: "bg-blue-100 dark:bg-blue-900/30",
    iconColor: "text-blue-600",
    title: `${networkName} Load`,
    date: dateTimeStr,
    amount: `- ${amount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`,
    amountColor: "text-slate-900 dark:text-slate-100",
  });
  saveTransactions(txs);

  // Add reward entry
  const rewards = getRewards();
  rewards.unshift({
    id: `r-${Date.now()}`,
    icon: "add_circle",
    iconBg: "bg-green-100 dark:bg-green-900/30",
    iconColor: "text-green-600 dark:text-green-400",
    title: `Buy Load Reward (${networkName})`,
    date: dateStr,
    points: rewardPoints,
  });
  saveRewards(rewards);

  // Update points
  saveTotalPoints(getTotalPoints() + rewardPoints);

  // Deduct balance
  saveBalance(getBalance() - amount);

  return rewardPoints;
}

/** Record a fund transfer transaction */
export function recordTransfer(bankName: string, amount: number, fee: number) {
  const { dateTimeStr } = formatNow();

  const txs = getTransactions();
  txs.unshift({
    id: `t-${Date.now()}`,
    icon: "sync_alt",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    title: `Transfer to ${bankName}`,
    date: dateTimeStr,
    amount: `- ${(amount + fee).toLocaleString("en-PH", { minimumFractionDigits: 2 })}`,
    amountColor: "text-slate-900 dark:text-slate-100",
  });
  saveTransactions(txs);

  // Deduct balance
  saveBalance(getBalance() - amount - fee);
}

/** Redeem a voucher (deduct points) */
export function redeemVoucher(brandName: string, cost: number) {
  const { dateStr } = formatNow();

  const rewards = getRewards();
  rewards.unshift({
    id: `r-${Date.now()}`,
    icon: "shopping_bag",
    iconBg: "bg-slate-100 dark:bg-slate-700/50",
    iconColor: "text-slate-600 dark:text-slate-400",
    title: `${brandName} Voucher`,
    date: dateStr,
    points: -cost,
  });
  saveRewards(rewards);

  saveTotalPoints(getTotalPoints() - cost);
}

/* ------------------------------------------------------------------ */
/*  Favorites                                                          */
/* ------------------------------------------------------------------ */

export function getFavoriteBillers(): FavoriteBiller[] {
  try {
    return JSON.parse(localStorage.getItem(FAV_BILLERS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveFavoriteBiller(biller: { name: string; category: string; accountNumber: string }): boolean {
  const favs = getFavoriteBillers();
  const exists = favs.some(
    (f) => f.name === biller.name && f.accountNumber === biller.accountNumber,
  );
  if (exists) return false;
  favs.unshift({
    id: `fb-${Date.now()}`,
    name: biller.name,
    category: biller.category,
    accountNumber: biller.accountNumber,
    savedAt: new Date().toISOString(),
  });
  localStorage.setItem(FAV_BILLERS_KEY, JSON.stringify(favs));
  return true;
}

export function getFavoriteRecipients(): FavoriteRecipient[] {
  try {
    return JSON.parse(localStorage.getItem(FAV_RECIPIENTS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveFavoriteRecipient(recipient: {
  bankValue: string;
  bankLabel: string;
  accountNumber: string;
  nickname: string;
}): boolean {
  const favs = getFavoriteRecipients();
  const exists = favs.some(
    (f) => f.bankValue === recipient.bankValue && f.accountNumber === recipient.accountNumber,
  );
  if (exists) return false;
  favs.unshift({
    id: `fr-${Date.now()}`,
    bankValue: recipient.bankValue,
    bankLabel: recipient.bankLabel,
    accountNumber: recipient.accountNumber,
    nickname: recipient.nickname,
    savedAt: new Date().toISOString(),
  });
  localStorage.setItem(FAV_RECIPIENTS_KEY, JSON.stringify(favs));
  return true;
}

export function getFavoriteContacts(): FavoriteContact[] {
  try {
    return JSON.parse(localStorage.getItem(FAV_CONTACTS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveFavoriteContact(contact: { network: string; mobileNumber: string }): boolean {
  const favs = getFavoriteContacts();
  const exists = favs.some((f) => f.mobileNumber === contact.mobileNumber);
  if (exists) return false;
  favs.unshift({
    id: `fc-${Date.now()}`,
    network: contact.network,
    mobileNumber: contact.mobileNumber,
    savedAt: new Date().toISOString(),
  });
  localStorage.setItem(FAV_CONTACTS_KEY, JSON.stringify(favs));
  return true;
}

/* ------------------------------------------------------------------ */
/*  Receipt Download                                                   */
/* ------------------------------------------------------------------ */

export interface ReceiptData {
  title: string;
  refNo: string;
  date: string;
  time: string;
  rows: { label: string; value: string }[];
  total: { label: string; value: string };
}

export function downloadReceipt(data: ReceiptData) {
  const divider = "=".repeat(44);
  const thinDivider = "-".repeat(44);

  const lines: string[] = [
    divider,
    center("CHINABANK"),
    center("Consumer Banking Channel"),
    divider,
    "",
    center(data.title),
    "",
    thinDivider,
    `Reference No:    ${data.refNo}`,
    `Date:            ${data.date}`,
    `Time:            ${data.time}`,
    thinDivider,
    "",
  ];

  for (const row of data.rows) {
    lines.push(padRow(row.label, row.value));
  }

  lines.push("");
  lines.push(thinDivider);
  lines.push(padRow(data.total.label, data.total.value));
  lines.push(divider);
  lines.push("");
  lines.push(center("Thank you for using Chinabank!"));
  lines.push(center("Member: PDIC. Regulated by BSP."));
  lines.push("");

  const text = lines.join("\n");
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${data.refNo}-receipt.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function center(text: string): string {
  const pad = Math.max(0, Math.floor((44 - text.length) / 2));
  return " ".repeat(pad) + text;
}

function padRow(label: string, value: string): string {
  const gap = Math.max(1, 44 - label.length - value.length);
  return label + " ".repeat(gap) + value;
}
