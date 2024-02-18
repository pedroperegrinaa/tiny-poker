#!/usr/bin/env node

import { program } from "commander";
import { log } from "console";
import * as ReadLine from "readline";

import inquirer from 'inquirer';

const readline = ReadLine.createInterface({
  input: process.stdin,
  output: process.stdout,
});

program.parse();

function main() {
  log("Iniciando jogo de poker Five Card Draw");
  log("Embaralhando o baralho...");
  log("Baralho embaralhado");
  log("Dando 5 cartas para o jogador...");
  const playerHand = createPlayerHand();
  log("Mão do jogador:", playerHand.join(" "));
  inquirer
    .prompt([
      {
        type: 'checkbox',
        name: 'dropCards',
        message: 'Quais cartas você quer descartar?',
        choices: playerHand,
      },
    ])
    .then(answers => {
      console.info('Answer:', answers.dropCards);
      log("Descartando cartas...");
      const newPlayerHand = createPlayerHand(answers.dropCards.length, answers.dropCards, playerHand);
      log("Nova mão do jogador:", newPlayerHand.join(" "));
      log("Dando 5 cartas para o river...");
      const river = createRiver(newPlayerHand);
      log("River:", river.join(" "));
      log("Verificando mão do jogador...");
      const verifiedHand = verifyHand(["1♠", "3♣", "2♠", "4♠", "5♠"]);
      log("Mão do jogador:", verifiedHand);
    });
}

main()

export function sameNipe(hand) {
  let ultimoCaractere = hand[0].charAt(hand[0].length - 1);

  for (let i = 1; i < hand.length; i++) {
    if (hand[i].charAt(hand[i].length - 1) !== ultimoCaractere) {
      return false;
    }
  }
  return true;
}

export function verifyHand(playerHand) {
  log(playerHand)
  switch (true) {
    case verifyRoyalFlush(playerHand):
      return "Royal Flush";
    case verifyStraightFlush(playerHand):
      return "Straight Flush";
    case verifyFourOfAKind(playerHand):
      return "Four of a Kind";
    case verifyFullHouse(playerHand):
      return "Full House";
    case verifyFlush(playerHand):
      return "Flush";
    case verifyStraight(playerHand):
      return "Straight";
    case verifyThreeOfAKind(playerHand):
      return "Three of a Kind";
    case verifyTwoPairs(playerHand):
      return "Two Pairs";
    default:
      return "High Card";
  }
}

function verifyRoyalFlush(hand) {
  const royalFlush = ["10", "J", "Q", "K", "A"];
  const handValues = hand.map(card => card.slice(0, -1));
  const sameSuit = sameNipe(hand);

  return sameSuit && royalFlush.every(card => handValues.includes(card));
}

function verifyStraightFlush(hand) {
  const handValues = hand.map(card => card.slice(0, -1));
  const sameSuit = sameNipe(hand);
  const sortedHandValues = handValues.sort();
  const firstCard = sortedHandValues[0];
  const lastCard = sortedHandValues[sortedHandValues.length - 1];
  const straight = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  const straightFlush = straight.slice(straight.indexOf(firstCard), straight.indexOf(lastCard) + 1);

  return sameSuit && straightFlush.every(card => handValues.includes(card));
}

function verifyFourOfAKind(hand) {
  const handValues = hand.map(card => card.slice(0, -1));
  const values = handValues.map(card => handValues.filter(c => c === card).length);

  return values.includes(4);
}

function verifyTwoPairs(hand) {
  const handValues = hand.map(card => card.slice(0, -1));
  log(handValues)
  const values = handValues.map(card => handValues.filter(c => c === card).length);
  log(values)
  return values.filter(value => value === 2).length === 2;
}

function verifyFullHouse(hand) {
  const handValues = hand.map(card => card.slice(0, -1));
  const values = handValues.map(card => handValues.filter(c => c === card).length);

  return values.includes(3) && values.includes(2);
}

function verifyFlush(hand) {
  return sameNipe(hand);
}

function verifyStraight(hand) {
  const handValues = hand.map(card => card.slice(0, -1));
  const sortedHandValues = handValues.sort();
  const firstCard = sortedHandValues[0];
  const lastCard = sortedHandValues[sortedHandValues.length - 1];
  const straight = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
 
  return straight.includes(firstCard) && straight.includes(lastCard);
}

function verifyThreeOfAKind(hand) {
  const handValues = hand.map(card => card.slice(0, -1));
  const values = handValues.map(card => handValues.filter(c => c === card).length);

  return values.includes(3);
}

export function deckObject() {
  return {
    pokerCards: ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"],
    pokerSuits: ["♠", "♣", "♥", "♦"],
  }
}

export function createPlayerHand(numberOfCards = 5, cardsDropped = [], playerHand = []) {
  const { pokerCards, pokerSuits } = deckObject();

  if (cardsDropped.length > 0) {
    for (let i = 0; i < cardsDropped.length; i++) {
      playerHand = playerHand.filter(card => card !== cardsDropped[i]);
    }
  }

  for (let i = 0; i <= numberOfCards - 1; i++) {
    const randomNumber = pokerCards[Math.floor(Math.random() * pokerCards.length)];
    const randomSuit = pokerSuits[Math.floor(Math.random() * pokerSuits.length)];

    if (playerHand.includes(randomNumber + randomSuit)) {
      i--;
      continue;
    }

    if (cardsDropped.includes(randomNumber + randomSuit)) {
      i--;
      continue;
    }

    playerHand.push(randomNumber + randomSuit);
  }

  log(playerHand)

  return playerHand;
}

export function createRiver(playerHand) {
  const { pokerCards, pokerSuits } = deckObject();
  const river = [];

  for (let i = 0; i <= 4; i++) {
    const randomNumber = pokerCards[Math.floor(Math.random() * pokerCards.length)];
    const randomSuit = pokerSuits[Math.floor(Math.random() * pokerSuits.length)];

    if (river.includes(randomNumber + randomSuit)) {
      i--;
      continue;
    }

    if (playerHand.includes(randomNumber + randomSuit)) {
      i--;
      continue;
    }

    river.push(randomNumber + randomSuit);
  }

  log(river)

  return river;

}

// export function allDeck() {
//   const { pokerCards, pokerSuits } = deckObject();
//   const allDeck = [];

//   for (let i = 0; i < pokerCards.length; i++) {
//     for (let j = 0; j < pokerSuits.length; j++) {
//       allDeck.push(pokerCards[i] + pokerSuits[j]);
//     }
//   }

//   return allDeck;
// }
