
const {
  deck,
  buildDeck,
  shuffleDeck,
  calculateHandValue,
  calculateBustChance,
  getSuggestedMove,
} = require("../js/game.js");

// ---- Deck tests ----
describe("Deck functions", () => {
  test("buildDeck creates 52 unique cards", () => {
    buildDeck();
    expect(deck.length).toBe(52);
    expect(new Set(deck).size).toBe(52);
  });

  test("shuffleDeck keeps 52 cards but usually changes order", () => {
    buildDeck();
    const original = [...deck];

    shuffleDeck();

    expect(deck.length).toBe(52);
    expect(new Set(deck).size).toBe(52);
    // Very small chance it'll be identical, but fine for this assignment
    expect(deck).not.toEqual(original);
  });
});

// ---- Hand value tests ----
describe("calculateHandValue", () => {
  test("counts number cards correctly", () => {
    const value = calculateHandValue(["2-H", "9-S"]);
    expect(value).toBe(11);
  });

  test("treats face cards and 10 as 10", () => {
    const value = calculateHandValue(["K-H", "Q-S", "10-D"]);
    expect(value).toBe(30);
  });

  test("single Ace as 11 when safe", () => {
    const value = calculateHandValue(["A-H", "7-S"]);
    expect(value).toBe(18);
  });

  test("downgrades Ace to avoid bust", () => {
    const value = calculateHandValue(["A-H", "9-S", "8-D"]); // 11+9+8=28 -> 18
    expect(value).toBe(18);
  });

  test("handles multiple Aces", () => {
    const value = calculateHandValue(["A-H", "A-S", "9-D"]); // 11+11+9=31 -> 21
    expect(value).toBe(21);
  });
});

// ---- Bust chance tests ----
describe("calculateBustChance", () => {
  test("low total has 0% bust chance", () => {
    const { bustChance, hitChance } = calculateBustChance(["4-H", "4-S"]); // total 8
    expect(bustChance).toBe(0);
    expect(hitChance).toBe(100);
  });

  test("very high total has 100% bust chance", () => {
    const { bustChance, hitChance } = calculateBustChance(["K-H", "Q-S"]); // total 20
    expect(bustChance).toBe(100);
    expect(hitChance).toBe(0);
  });
});

// ---- Suggested move tests ----
describe("getSuggestedMove", () => {
  test("stands automatically on high totals", () => {
    const move = getSuggestedMove(0, 100, 18);
    expect(move).toBe("Stand (High total)");
  });

  test("stands when bust risk is high", () => {
    const move = getSuggestedMove(80, 20, 10);
    expect(move).toBe("Stand (High bust risk)");
  });

  test("hits when hitChance is high", () => {
    const move = getSuggestedMove(10, 70, 12);
    expect(move).toBe("Hit (Good odds)");
  });

  test("borderline case uses final rule", () => {
    const move = getSuggestedMove(40, 59, 15);
    expect(move).toBe("Stand");
  });
});
