import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

let previousIndex = -1;

const colors = [
  "hsla(0, 90%, 50%, 0.5)",
  "hsla(30, 90%, 50%, 0.5)",
  "hsla(60, 90%, 50%, 0.5)",
  "hsla(120, 90%, 50%, 0.5)",
  "hsla(180, 90%, 50%, 0.5)",
  "hsla(240, 90%, 50%, 0.5)",
  "hsla(270, 90%, 50%, 0.5)",
  "hsla(150, 90%, 50%, 0.5)",
  "hsla(255, 90%, 50%, 0.5)",
];

export const getRandomColor = () => {
  previousIndex++;
  // reset the index to 0 if it exceeds the length of the colors array
  if (previousIndex >= colors.length) {
    previousIndex = 0;
  }
  return colors[previousIndex];
};
