
# Blackjack Learning Game

## Project Overview

The **Blackjack Learning Game** is an educational digital recreation of the classic casino card game **Blackjack**, designed to help users both **play and learn** the rules and strategies of the game. The project emphasizes accessibility for beginners while providing strategic depth for advanced players.

The game simulates real blackjack gameplay in a **simple, minimalistic interface**, helping users practice decision-making and learn core mechanics without the pressure of real betting environments.

---

## Background & Requirements Analysis

### Topic Summary

Blackjack is a well-known casino card game where the goal is to achieve a hand value **closer to 21 than the dealer’s** without going over. Players start with two cards, and the dealer also has two — one face-up and one hidden. Players may choose to:

* **Hit** → Draw another card.
* **Stand** → Keep their current hand.

After all players finish their turns, the dealer reveals the hidden card and plays according to the rules (drawing until reaching 17). Players win, lose, or push (tie) depending on their hand totals.

---

## Play Session Report

Our initial play session took place over **Discord’s game section**. Most team members were already familiar with blackjack, so the focus was on helping newer players understand the core rules.

### Major Points of Confusion for New Players

* Understanding that the goal is to **beat the dealer without exceeding 21**.
* The **dual value of aces** (1 or 11).
* Handling **bust scenarios** (both player and dealer).
* Recognizing **push situations** (ties).
* Advanced concepts like **splitting pairs**, **insurance bets**, and **casino etiquette**.

### Advanced Learning Observations

While new players learned the basic rules quickly, they struggled with **strategic betting** and **odds calculation**. To help them progress, the game will include teaching aids that introduce **basic strategy principles** used by experienced players.

---

## Requirements Summary

### Objective

Develop a **digital blackjack learning tool** that is:

* **Simple and accessible** for beginners.
* **Strategically enriching** for advanced players.
* **Interactive** to teach and reinforce blackjack concepts.

### Key Goals

* Deliver a functional, educational blackjack experience.
* Provide real-time **visual and textual guidance** to help users learn the game logic.
* Create an intuitive interface that supports both **learning and free play** modes.

---

## Functional Requirements (MoSCoW Prioritization)

### Must Have

* Dealing cards to player and dealer.
* Core game logic (hand value calculation, hit/stand actions).
* Multiple rounds of play.
* In-game instructions and hints.

### Should Have

* Betting system (place bets, adjust amount).
* Strategy hints or tooltips for beginners.

### Could Have

* Doubling down and splitting pairs.
* Display of win/loss record and player statistics.

### Won’t Have (for this version)

* Online multiplayer.
* Side bets, insurance, or advanced casino moves.

---

## Non-Functional Requirements (MoSCoW Prioritization)

### Must Have

* **Simple, intuitive interface**.
* **Fast, responsive gameplay** (no input lag).
* **Visual feedback** for outcomes (e.g., highlights for wins, busts, pushes).
* **Basic sound effects** for immersion.

### Should Have

* Accessibility options (colorblind/dark mode).
* Mobile-friendly design.

### Could Have

* Customizable themes.
* Optional animations or visual polish.

### Won’t Have

* Online/offline leaderboards.
* Advanced 3D graphics or complex animation systems.

---

## Learning Features

To support learning, the game will include:

* **Dealer Peek Mode**: Temporarily reveal the dealer’s face-down card to help players analyze outcomes.
* **Card Value Display**: Show each card’s value and running hand total to make the scoring system clearer.
* **Ace Assistance**: Automatically highlight when an ace counts as 1 or 11.
* **Strategy Prompts**: Context-based hints that teach basic blackjack strategy.

---
