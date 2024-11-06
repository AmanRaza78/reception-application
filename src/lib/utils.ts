import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function generateToken() {
  const token = `JB${Math.floor(1000 + Math.random() * 9000)}`;
  
  return token;
}