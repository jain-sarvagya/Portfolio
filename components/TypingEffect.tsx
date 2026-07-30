'use client';

import React, { useEffect, useState } from 'react';

interface TypingEffectProps {
  words: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
}

export default function TypingEffect({
  words,
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseDuration = 2000,
}: TypingEffectProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (words.length === 0) return;

    let timer: NodeJS.Timeout;
    const currentWord = words[currentWordIndex];

    if (!isDeleting && currentText === currentWord) {
      // Pause at full word
      timer = setTimeout(() => setIsDeleting(true), pauseDuration);
    } else if (isDeleting && currentText === '') {
      // Move to next word after deleting
      setIsDeleting(false);
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    } else {
      // Typing or deleting progress
      const nextText = isDeleting
        ? currentWord.substring(0, currentText.length - 1)
        : currentWord.substring(0, currentText.length + 1);

      const delay = isDeleting ? deletingSpeed : typingSpeed;
      timer = setTimeout(() => setCurrentText(nextText), delay);
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIndex, words, typingSpeed, deletingSpeed, pauseDuration]);

  return (
    <span className="inline-block min-h-[1.5em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-400 to-indigo-400 font-bold">
      {currentText}
      <span className="ml-1 inline-block w-[3px] h-[1em] align-middle bg-cyan-400 animate-pulse">|</span>
    </span>
  );
}
