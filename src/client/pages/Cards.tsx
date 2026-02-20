import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type CardNetwork = "VISA" | "Mastercard";
type CardType = "Credit" | "Debit";

interface Card {
  id: string;
  cardType: CardType;
  cardTier: string;
  network: CardNetwork;
  lastFour: string;
  holderName: string;
  expiry: string;
  isLocked: boolean;
}

interface CardTransaction {
  icon: string;
  title: string;
  date: string;
  amount: string;
}

interface ControlAction {
  icon: string;
  label: string;
  destructive?: boolean;
}

interface AddCardForm {
  cardNumber: string;
  holderName: string;
  expiry: string;
  cardType: CardType;
  network: CardNetwork;
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const INITIAL_CARDS: Card[] = [
  {
    id: "1",
    cardType: "Credit",
    cardTier: "Platinum Credit",
    network: "VISA",
    lastFour: "8888",
    holderName: "JUAN DELA CRUZ",
    expiry: "12/28",
    isLocked: false,
  },
  {
    id: "2",
    cardType: "Debit",
    cardTier: "Gold Debit",
    network: "Mastercard",
    lastFour: "4521",
    holderName: "JUAN DELA CRUZ",
    expiry: "06/27",
    isLocked: false,
  },
  {
    id: "3",
    cardType: "Credit",
    cardTier: "Classic Credit",
    network: "VISA",
    lastFour: "1234",
    holderName: "JUAN DELA CRUZ",
    expiry: "03/29",
    isLocked: false,
  },
];

const recentActivity: CardTransaction[] = [
  { icon: "shopping_bag", title: "Starbucks Coffee", date: "Today, 09:45 AM", amount: "-PHP 650.00" },
  { icon: "restaurant", title: "Bella Italia Restaurant", date: "Yesterday, 07:20 PM", amount: "-PHP 3,200.00" },
];

const controlActions: ControlAction[] = [
  { icon: "pin", label: "View PIN" },
  { icon: "payments", label: "Online Payments" },
  { icon: "replace_video", label: "Replace Card" },
  { icon: "delete", label: "Remove Card", destructive: true },
];

const EMPTY_FORM: AddCardForm = {
  cardNumber: "",
  holderName: "",
  expiry: "",
  cardType: "Credit",
  network: "VISA",
};

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export function Cards() {
  const navigate = useNavigate();
  const carouselRef = useRef<HTMLDivElement>(null);

  const [cards, setCards] = useState<Card[]>(INITIAL_CARDS);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [addForm, setAddForm] = useState<AddCardForm>(EMPTY_FORM);

  const activeCard = cards[activeCardIndex];

  /* -- Carousel helpers -- */

  const scrollToCard = useCallback((index: number) => {
    if (!carouselRef.current) return;
    const cardWidth = carouselRef.current.offsetWidth;
    carouselRef.current.scrollTo({ left: cardWidth * index, behavior: "smooth" });
  }, []);

  function handleScroll() {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    const cardWidth = container.offsetWidth;
    const newIndex = Math.round(container.scrollLeft / cardWidth);
    if (newIndex >= 0 && newIndex < cards.length) {
      setActiveCardIndex(newIndex);
    }
  }

  /* -- Card lock toggle -- */

  function handleToggleLock(checked: boolean) {
    setCards((prev) =>
      prev.map((c) => (c.id === activeCard.id ? { ...c, isLocked: checked } : c))
    );
  }

  /* -- Remove card -- */

  function handleRemoveCard() {
    const removedId = activeCard.id;
    setCards((prev) => prev.filter((c) => c.id !== removedId));
    setShowRemoveDialog(false);
    setActiveCardIndex((prev) => Math.max(0, Math.min(prev, cards.length - 2)));
  }

  /* -- Add card -- */

  function handleAddCard() {
    if (!addForm.cardNumber || !addForm.holderName || !addForm.expiry) return;

    const newCard: Card = {
      id: Date.now().toString(),
      cardType: addForm.cardType,
      cardTier: addForm.cardType === "Credit" ? "Classic Credit" : "Standard Debit",
      network: addForm.network,
      lastFour: addForm.cardNumber.replace(/\s/g, "").slice(-4),
      holderName: addForm.holderName.toUpperCase(),
      expiry: addForm.expiry,
      isLocked: false,
    };

    setCards((prev) => [...prev, newCard]);
    setAddForm(EMPTY_FORM);
    setShowAddForm(false);
    setTimeout(() => scrollToCard(cards.length), 100);
  }

  /* -- Control action handler -- */

  function handleControlAction(action: ControlAction) {
    if (action.destructive) {
      setShowRemoveDialog(true);
    }
  }

  return (
    <main className="flex-1 overflow-y-auto px-6 pt-6 pb-24">
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Card Management</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Manage your cards, security, and transactions
        </p>
      </div>

      {/* Card Carousel */}
      <div
        ref={carouselRef}
        onScroll={handleScroll}
        className="flex gap-0 overflow-x-auto snap-x snap-mandatory scrollbar-hide mb-4 -mx-6 px-6"
      >
        {cards.map((card) => (
          <div key={card.id} className="snap-center shrink-0 w-full pr-4 last:pr-0">
            <CardVisual card={card} />
          </div>
        ))}
      </div>

      {/* Dot Indicators */}
      {cards.length > 1 && (
        <div className="flex justify-center gap-2 mb-6">
          {cards.map((card, i) => (
            <button
              key={card.id}
              onClick={() => scrollToCard(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === activeCardIndex
                  ? "w-6 bg-primary"
                  : "w-2 bg-slate-300 dark:bg-slate-600"
              }`}
              aria-label={`Go to card ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Add Card Button */}
      <button
        onClick={() => setShowAddForm(true)}
        className="w-full mb-4 flex items-center gap-4 p-4 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-dashed border-primary/30 hover:bg-primary/5 transition-colors group"
      >
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          <span className="material-symbols-outlined text-2xl">add_card</span>
        </div>
        <div className="flex-1 text-left">
          <p className="font-bold text-slate-900 dark:text-slate-100">Add a Card</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Register an existing card to manage</p>
        </div>
        <span className="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">
          arrow_forward
        </span>
      </button>

      {/* Apply for Credit Card */}
      <button
        onClick={() => navigate("/apply-card")}
        className="w-full mb-8 flex items-center gap-4 p-4 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-dashed border-primary/30 hover:bg-primary/5 transition-colors group"
      >
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          <span className="material-symbols-outlined text-2xl">credit_card</span>
        </div>
        <div className="flex-1 text-left">
          <p className="font-bold text-slate-900 dark:text-slate-100">Apply for a Credit Card</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Pre-qualified customers only</p>
        </div>
        <span className="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">
          arrow_forward
        </span>
      </button>

      {/* Add Card Form (expandable) */}
      {showAddForm && (
        <AddCardFormPanel
          form={addForm}
          onChange={setAddForm}
          onSubmit={handleAddCard}
          onCancel={() => { setShowAddForm(false); setAddForm(EMPTY_FORM); }}
        />
      )}

      {/* Security & Controls */}
      {activeCard && (
        <section className="bg-white dark:bg-slate-900 rounded-xl p-5 shadow-sm border border-slate-100 dark:border-slate-800">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">security</span>
            Security & Controls
            <span className="text-xs font-normal text-slate-400 ml-auto">
              ****{activeCard.lastFour}
            </span>
          </h2>

          {/* Lock/Unlock Toggle */}
          <div className="flex items-center justify-between py-4">
            <div className="flex-1 pr-4">
              <h3 className="font-semibold text-slate-800 dark:text-slate-100">Lock/Unlock Card</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Temporarily disable your card for security
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={activeCard.isLocked}
                onChange={(e) => handleToggleLock(e.target.checked)}
              />
              <div className="w-14 h-7 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary" />
            </label>
          </div>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* Action Rows */}
          <div className="grid grid-cols-1 gap-1 mt-2">
            {controlActions.map((action, i) => {
              const isRemove = action.destructive;
              const removeDisabled = isRemove && cards.length <= 1;

              return (
                <div key={action.label}>
                  <button
                    onClick={() => handleControlAction(action)}
                    disabled={removeDisabled}
                    className={`flex items-center justify-between py-4 w-full group ${
                      removeDisabled ? "opacity-40 cursor-not-allowed" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                          isRemove
                            ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                            : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-primary/10 group-hover:text-primary"
                        }`}
                      >
                        <span className="material-symbols-outlined">{action.icon}</span>
                      </div>
                      <span
                        className={`font-medium ${
                          isRemove
                            ? "text-red-600 dark:text-red-400"
                            : "text-slate-700 dark:text-slate-200"
                        }`}
                      >
                        {action.label}
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-slate-400">chevron_right</span>
                  </button>
                  {i < controlActions.length - 1 && (
                    <hr className="border-slate-100 dark:border-slate-800 ml-12" />
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Recent Activity */}
      <section className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Recent Activity</h2>
          <button className="text-primary text-sm font-semibold">View All</button>
        </div>
        <div className="space-y-3">
          {recentActivity.map((tx) => (
            <div
              key={tx.title + tx.date}
              className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300">
                  <span className="material-symbols-outlined">{tx.icon}</span>
                </div>
                <div>
                  <p className="font-semibold text-sm">{tx.title}</p>
                  <p className="text-xs text-slate-500">{tx.date}</p>
                </div>
              </div>
              <p className="font-bold text-slate-900 dark:text-slate-100">{tx.amount}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Remove Card Confirmation Dialog */}
      {showRemoveDialog && activeCard && (
        <RemoveCardDialog
          card={activeCard}
          onConfirm={handleRemoveCard}
          onCancel={() => setShowRemoveDialog(false)}
        />
      )}
    </main>
  );
}

/* ------------------------------------------------------------------ */
/*  CardVisual                                                         */
/* ------------------------------------------------------------------ */

function CardVisual({ card }: { card: Card }) {
  const gradientClass =
    card.network === "Mastercard"
      ? "from-slate-800 to-slate-950"
      : "from-primary to-[#8b0b20]";

  return (
    <div
      className={`relative w-full aspect-[1.58/1] rounded-xl overflow-hidden shadow-2xl bg-gradient-to-br ${gradientClass} p-6 flex flex-col justify-between text-white`}
    >
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <span className="text-xs font-medium opacity-80 uppercase tracking-widest">
            {card.cardTier}
          </span>
          <span className="text-lg font-bold">Chinabank</span>
        </div>
        <div className="w-12 h-8 bg-white/20 rounded-md flex items-center justify-center backdrop-blur-sm">
          <span className="material-symbols-outlined text-white">contactless</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4 text-xl font-mono tracking-[0.2em]">
          <span>****</span>
          <span>****</span>
          <span>****</span>
          <span>{card.lastFour}</span>
        </div>
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <span className="text-[10px] uppercase opacity-70 block">Card Holder</span>
            <span className="text-sm font-semibold tracking-wide uppercase">
              {card.holderName}
            </span>
          </div>
          <div className="space-y-1 text-right">
            <span className="text-[10px] uppercase opacity-70 block">Expiry</span>
            <span className="text-sm font-semibold">{card.expiry}</span>
          </div>
          <div className="w-12 h-8 flex items-center justify-center">
            <span className="text-2xl font-bold italic opacity-90 tracking-tighter">
              {card.network}
            </span>
          </div>
        </div>
      </div>

      {/* Glow effect */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-3xl" />

      {/* Lock overlay */}
      {card.isLocked && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center rounded-xl">
          <div className="flex flex-col items-center gap-2">
            <span className="material-symbols-outlined text-4xl text-white/80">lock</span>
            <span className="text-sm font-semibold text-white/80">Card Locked</span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Add Card Form Panel                                                */
/* ------------------------------------------------------------------ */

function AddCardFormPanel({
  form,
  onChange,
  onSubmit,
  onCancel,
}: {
  form: AddCardForm;
  onChange: React.Dispatch<React.SetStateAction<AddCardForm>>;
  onSubmit: () => void;
  onCancel: () => void;
}) {
  function update(patch: Partial<AddCardForm>) {
    onChange((prev) => ({ ...prev, ...patch }));
  }

  const canSubmit = form.cardNumber.replace(/\s/g, "").length >= 4 && form.holderName && form.expiry;

  return (
    <section className="bg-white dark:bg-slate-900 rounded-xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 mb-8">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">add_card</span>
        Add a Card
      </h2>

      <div className="flex flex-col gap-4">
        {/* Card Number */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Card Number</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-xl">
              credit_card
            </span>
            <input
              type="text"
              value={form.cardNumber}
              onChange={(e) => update({ cardNumber: e.target.value })}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
            />
          </div>
        </div>

        {/* Cardholder Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Cardholder Name</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-xl">
              person
            </span>
            <input
              type="text"
              value={form.holderName}
              onChange={(e) => update({ holderName: e.target.value })}
              placeholder="Name as shown on card"
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
            />
          </div>
        </div>

        {/* Expiry */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Expiry Date</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-xl">
              calendar_today
            </span>
            <input
              type="text"
              value={form.expiry}
              onChange={(e) => update({ expiry: e.target.value })}
              placeholder="MM/YY"
              maxLength={5}
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
            />
          </div>
        </div>

        {/* Card Type & Network row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Card Type</label>
            <select
              value={form.cardType}
              onChange={(e) => update({ cardType: e.target.value as CardType })}
              className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none appearance-none"
            >
              <option value="Credit">Credit</option>
              <option value="Debit">Debit</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Network</label>
            <select
              value={form.network}
              onChange={(e) => update({ network: e.target.value as CardNetwork })}
              className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none appearance-none"
            >
              <option value="VISA">VISA</option>
              <option value="Mastercard">Mastercard</option>
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-2">
          <button
            onClick={onCancel}
            className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold py-3 rounded-xl transition-colors hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={!canSubmit}
            className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Card
          </button>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Remove Card Dialog                                                 */
/* ------------------------------------------------------------------ */

function RemoveCardDialog({
  card,
  onConfirm,
  onCancel,
}: {
  card: Card;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-6">
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        {/* Warning Icon */}
        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
          <span className="material-symbols-outlined text-red-600 text-3xl">warning</span>
        </div>

        <h3 className="text-lg font-bold text-center mb-2">Remove Card?</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-6">
          Are you sure you want to remove your {card.cardTier} ending in {card.lastFour}?
          This action cannot be undone.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={onConfirm}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-colors"
          >
            Remove Card
          </button>
          <button
            onClick={onCancel}
            className="w-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold py-3 rounded-xl transition-colors hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
