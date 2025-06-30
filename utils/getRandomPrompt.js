// utils/getRandomPrompt.js

export function getRandomPrompt() {
    const prompts = [
      "image of ls3 bv contact lens with air bubbles",
      "image of ls3 lpc contact lens with big saline bubble",
      "image of ls3 bv contact lens with bottle cap edge",
      "image of ls3 lpc contact lens with bright edge",
      "image of ls3 bv contact lens with clipped edge",
      "image of ls3 bv contact lens with dirty cuvette",
      "image of ls3 bv contact lens with dosing bubble",
      "image of ls3 bv contact lens with edge gap",
      "image of ls3 bv contact lens with edge tear",
      "image of ls3 bv contact lens with ehacm",
      "image of ls3 lpc contact lens with folded center",
      "image of ls3 lpc contact lens with folded edge(type b)",
      "image of ls3 lpc contact lens with folded edge(type c)",
      "image of ls3 lpc contact lens with folded lens(type a)",
      "image of ls3 bv contact lens with ionization bubbles",
      "image of ls3 bv contact lens with material foam",
      "image of ls3 bv contact lens with mold contamination",
      "image of ls3 bv contact lens with particle inclusion",
      "image of ls3 bv contact lens with schlieren with crease",
      "image of ls3 bv contact lens with star burst",
      "image of ls3 bv contact lens with water schlieren",
      "image of ls3 bv contact lens with air bubbles some star burst and ionization bubble",
      "image of ls3 bv contact lens with ehacm and star burst",
      "image of ls3 bv contact lens with ehacm some star burst and ionization bubble",
      "image of ls3 bv contact lens with star burst and ionization bubble",
      "image of ls3 bv contact lens with bottle cap edge and mold contamination",
      "image of ls3 bv contact lens with dirty cuvette with ionization bubble and clipped edge",
      "image of ls3 bv contact lens with edge tear and mold contamination",
      "image of ls3 bv contact lens with more edge tear and few air bubbles",
      "image of ls3 lpc contact lens with big saline bubble and bright edge",
      "image of ls3 lpc contact lens with folded edge(type b) and big saline bubble"
    ];
  
    const randomIndex = Math.floor(Math.random() * prompts.length);
    return prompts[randomIndex];
  }
  