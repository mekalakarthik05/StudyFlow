import { validateResult } from './validateResult.js';

function runTests() {
  console.log('Running validateResult test suite...\n');
  let passed = 0;
  let failed = 0;

  function assert(name, condition) {
    if (condition) {
      console.log(`  ✓ ${name}`);
      passed++;
    } else {
      console.error(`  ✕ FAIL: ${name}`);
      failed++;
    }
  }

  // Valid Base Payload
  const validPayload = {
    title: 'DBMS Normalization',
    summary: 'Database normalization organizes tables to reduce redundancy.',
    flashcards: [
      { question: 'What is 1NF?', answer: 'Eliminates duplicate columns and requires atomic values.' },
      { question: 'What is 2NF?', answer: 'Meets 1NF and eliminates partial dependencies.' },
      { question: 'What is 3NF?', answer: 'Meets 2NF and eliminates transitive dependencies.' },
      { question: 'What is BCNF?', answer: 'Boyce-Codd Normal Form, a stricter version of 3NF.' },
      { question: 'What is a Primary Key?', answer: 'A unique identifier for each record in a table.' },
    ],
    quiz: [
      {
        question: 'Which normal form deals with partial dependencies?',
        options: ['1NF', '2NF', '3NF', 'BCNF'],
        correctAnswer: 1,
      },
      {
        question: 'What does 1NF require for all column values?',
        options: ['Unique', 'Atomic', 'Indexed', 'Encrypted'],
        correctAnswer: 1,
      },
      {
        question: 'Transitive dependencies are eliminated in which form?',
        options: ['1NF', '2NF', '3NF', '4NF'],
        correctAnswer: 2,
      },
      {
        question: 'What is a candidate key?',
        options: ['Minimal superkey', 'Foreign key', 'Null key', 'Composite index'],
        correctAnswer: 0,
      },
      {
        question: 'BCNF requires every determinant to be what?',
        options: ['Candidate key', 'Foreign key', 'Unique value', 'Non-null'],
        correctAnswer: 0,
      },
    ],
  };

  // 1. Valid payload passes
  assert('Valid payload returns the object', validateResult(validPayload) === validPayload);

  // 2. Test A from Spec (Section 11) - wrong counts
  const testA = { title: 'DBMS', summary: 'test', flashcards: [], quiz: [] };
  assert('Test A: Empty flashcards and quiz rejected', validateResult(testA) === null);

  // 3. Test B from Spec (Section 11) - wrong option count
  const testB = {
    title: 'DBMS',
    summary: 'test',
    flashcards: validPayload.flashcards,
    quiz: [{ question: 'Test', options: ['A', 'B'], correctAnswer: 0 }],
  };
  assert('Test B: 2 options instead of 4 and 1 quiz item rejected', validateResult(testB) === null);

  // 4. Test C from Spec (Section 11) - extra top-level field
  const testC = {
    ...validPayload,
    difficulty: 'easy',
  };
  assert('Test C: Extra top-level field difficulty rejected', validateResult(testC) === null);

  // 5. Boundary: Flashcards length 4 (too short)
  const flashcards4 = {
    ...validPayload,
    flashcards: validPayload.flashcards.slice(0, 4),
  };
  assert('Flashcards length 4 is rejected', validateResult(flashcards4) === null);

  // 6. Boundary: Flashcards length 8 (max valid)
  const flashcards8 = {
    ...validPayload,
    flashcards: [
      ...validPayload.flashcards,
      { question: 'Extra 1', answer: 'Ans 1' },
      { question: 'Extra 2', answer: 'Ans 2' },
      { question: 'Extra 3', answer: 'Ans 3' },
    ],
  };
  assert('Flashcards length 8 is accepted', validateResult(flashcards8) !== null);

  // 7. Boundary: Flashcards length 9 (too long)
  const flashcards9 = {
    ...flashcards8,
    flashcards: [...flashcards8.flashcards, { question: 'Extra 4', answer: 'Ans 4' }],
  };
  assert('Flashcards length 9 is rejected', validateResult(flashcards9) === null);

  // 8. Quiz length 4 or 6 (must be exactly 5)
  const quiz4 = {
    ...validPayload,
    quiz: validPayload.quiz.slice(0, 4),
  };
  assert('Quiz length 4 is rejected', validateResult(quiz4) === null);

  // 9. Extra key in flashcard item
  const cardWithExtra = {
    ...validPayload,
    flashcards: [
      ...validPayload.flashcards.slice(0, 4),
      { question: 'Q', answer: 'A', extra: 'bad' },
    ],
  };
  assert('Flashcard with extra key rejected', validateResult(cardWithExtra) === null);

  // 10. Extra key in quiz item
  const quizWithExtra = {
    ...validPayload,
    quiz: [
      ...validPayload.quiz.slice(0, 4),
      { question: 'Q', options: ['A', 'B', 'C', 'D'], correctAnswer: 0, explanation: 'bad' },
    ],
  };
  assert('Quiz item with extra key rejected', validateResult(quizWithExtra) === null);

  // 11. Invalid correctAnswer index (e.g. 4 or -1)
  const quizBadIndex = {
    ...validPayload,
    quiz: [
      ...validPayload.quiz.slice(0, 4),
      { question: 'Q', options: ['A', 'B', 'C', 'D'], correctAnswer: 4 },
    ],
  };
  assert('Quiz item with correctAnswer out of range (4) rejected', validateResult(quizBadIndex) === null);

  // 12. Non-integer correctAnswer (e.g. 1.5)
  const quizFloatIndex = {
    ...validPayload,
    quiz: [
      ...validPayload.quiz.slice(0, 4),
      { question: 'Q', options: ['A', 'B', 'C', 'D'], correctAnswer: 1.5 },
    ],
  };
  assert('Quiz item with non-integer correctAnswer rejected', validateResult(quizFloatIndex) === null);

  // 13. Empty/whitespace strings in question or options
  const quizEmptyOption = {
    ...validPayload,
    quiz: [
      ...validPayload.quiz.slice(0, 4),
      { question: 'Q', options: ['A', 'B', '  ', 'D'], correctAnswer: 0 },
    ],
  };
  assert('Quiz item with blank option string rejected', validateResult(quizEmptyOption) === null);

  console.log(`\nResults: ${passed} passed, ${failed} failed`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
