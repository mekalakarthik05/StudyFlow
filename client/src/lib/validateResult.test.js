/**
 * Automated test suite for validateResult.js
 * Run with: node client/src/lib/validateResult.test.js
 */
import { validateResult } from './validateResult.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  ✓ ${message}`);
  } else {
    failed++;
    console.error(`  ✗ FAIL: ${message}`);
  }
}

console.log('\n--- Running validateResult.js Test Suite ---\n');

// 1. Valid flashcards
const validFlashcards = {
  title: 'Operating Systems',
  summary: 'Core concepts of OS process scheduling and memory.',
  flashcards: [
    { question: 'What is a process?', answer: 'A program in execution.' },
    { question: 'What is a thread?', answer: 'A lightweight unit of CPU utilization.' },
    { question: 'What is deadlock?', answer: 'A situation where a set of processes are blocked.' },
    { question: 'What is paging?', answer: 'A memory management scheme.' },
    { question: 'What is virtual memory?', answer: 'Separation of user logical memory from physical memory.' },
  ],
  relatedTopics: ['File Systems', 'Concurrency', 'Semaphores'],
};

assert(
  validateResult(validFlashcards, 'flashcards') !== null,
  'Accepts valid flashcards object with 5 cards and related topics'
);

// 2. Valid quiz
const validQuiz = {
  title: 'Data Structures',
  summary: 'Introduction to tree and graph structures.',
  quiz: [
    {
      question: 'What is the time complexity of searching in a balanced BST?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
      correctAnswer: 1,
    },
    {
      question: 'Which traversal visits left, root, right?',
      options: ['Preorder', 'Inorder', 'Postorder', 'Level-order'],
      correctAnswer: 1,
    },
  ],
  relatedTopics: ['AVL Trees', 'Red-Black Trees', 'Heaps'],
};

assert(
  validateResult(validQuiz, 'quiz') !== null,
  'Accepts valid quiz object with 2 questions and 4 options each'
);

// 3. Rejects null / non-object
assert(validateResult(null, 'flashcards') === null, 'Rejects null');
assert(validateResult('string instead of object', 'flashcards') === null, 'Rejects string');
assert(validateResult(12345, 'quiz') === null, 'Rejects number');
assert(validateResult([], 'flashcards') === null, 'Rejects array');

// 4. Missing / empty title or summary
assert(
  validateResult({ ...validFlashcards, title: '' }, 'flashcards') === null,
  'Rejects empty title'
);
assert(
  validateResult({ ...validFlashcards, summary: '   ' }, 'flashcards') === null,
  'Rejects whitespace-only summary'
);

// 5. Flashcards mode validations
assert(
  validateResult({ ...validFlashcards, flashcards: [] }, 'flashcards') === null,
  'Rejects empty flashcards array'
);
assert(
  validateResult(
    {
      ...validFlashcards,
      flashcards: [{ question: '', answer: 'Valid answer' }],
    },
    'flashcards'
  ) === null,
  'Rejects flashcard with empty question'
);
assert(
  validateResult(
    {
      ...validFlashcards,
      flashcards: [{ question: 'Valid question', answer: '  ' }],
    },
    'flashcards'
  ) === null,
  'Rejects flashcard with whitespace answer'
);

// 6. Quiz mode validations
assert(
  validateResult({ ...validQuiz, quiz: [] }, 'quiz') === null,
  'Rejects empty quiz array'
);
assert(
  validateResult(
    {
      ...validQuiz,
      quiz: [
        {
          question: 'Incomplete options',
          options: ['A', 'B', 'C'], // Only 3 options
          correctAnswer: 0,
        },
      ],
    },
    'quiz'
  ) === null,
  'Rejects quiz question with 3 options instead of 4'
);
assert(
  validateResult(
    {
      ...validQuiz,
      quiz: [
        {
          question: 'Out of bounds answer',
          options: ['A', 'B', 'C', 'D'],
          correctAnswer: 4, // Out of bounds
        },
      ],
    },
    'quiz'
  ) === null,
  'Rejects quiz question with correctAnswer index > 3'
);
assert(
  validateResult(
    {
      ...validQuiz,
      quiz: [
        {
          question: 'Negative answer index',
          options: ['A', 'B', 'C', 'D'],
          correctAnswer: -1,
        },
      ],
    },
    'quiz'
  ) === null,
  'Rejects quiz question with negative correctAnswer index'
);

console.log(`\nResults: ${passed} passed, ${failed} failed.\n`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log('All tests passed!\n');
}
