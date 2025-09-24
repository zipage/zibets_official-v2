const Glossary = () => {
  const terms = [
    {
      term: "Moneyline",
      definition:
        "The simplest type of bet—just pick who wins. Negative odds (like -110) = favorite. Positive odds (like +200) = underdog.",
    },
    {
      term: "Spread",
      definition:
        "A bet on how much a team wins or loses by. The favorite must win by more than the spread. The underdog can lose but still “cover.”",
    },
    {
      term: "Over/Under",
      definition:
        "Bet on the total score of both teams combined. Choose whether it’ll be over or under a certain number.",
    },
    {
      term: "Odds (American)",
      definition:
        "A way of showing how much you win. +150 = bet $100 to win $150. -110 = bet $110 to win $100.",
    },
    {
      term: "Parlay",
      definition:
        "A combo of multiple bets in one. All bets must win for you to win. High risk, high reward.",
    },
    {
      term: "Push",
      definition: "A tie. Nobody wins or loses. You get your money back.",
    },
    {
      term: "Wager",
      definition: "The amount of money you’re risking on a bet.",
    },
    {
      term: "Payout",
      definition: "What you get back if your bet wins. Winnings + original wager.",
    },
    {
      term: "ROI",
      definition:
        "Stands for Return on Investment. It shows how well your bets are performing as a percentage.",
    },
    {
      term: "Bankroll",
      definition:
        "The total amount of money you’re using for betting. Don’t blow it all at once!",
    },
    {
      term: "Unit",
      definition:
        "A way to keep your bets consistent. Usually a small % of your bankroll (like $10).",
    },
    {
      term: "Prop Bet",
      definition:
        "A bet on something specific within a game, like “first player to score” or “coin toss.”",
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Glossary</h1>
      <p className="mb-4 text-gray-700">
        Here's a quick breakdown of common betting terms you'll see around ZiBets:
      </p>
      <ul className="space-y-4">
        {terms.map((item, index) => (
          <li key={index}>
            <strong className="text-blue-700">{item.term}:</strong>{" "}
            <span className="text-gray-800">{item.definition}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Glossary;
