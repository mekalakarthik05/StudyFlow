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

  // ── Valid base payload ───────────────────────────────────────────────────────
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
      { question: 'Which normal form deals with partial dependencies?', options: ['1NF', '2NF', '3NF', 'BCNF'], correctAnswer: 1 },
      { question: 'What does 1NF require for all column values?', options: ['Unique', 'Atomic', 'Indexed', 'Encrypted'], correctAnswer: 1 },
      { question: 'Transitive dependencies are eliminated in which form?', options: ['1NF', '2NF', '3NF', '4NF'], correctAnswer: 2 },
      { question: 'What is a candidate key?', options: ['Minimal superkey', 'Foreign key', 'Null key', 'Composite index'], correctAnswer: 0 },
      { question: 'BCNF requires every determinant to be what?', options: ['Candidate key', 'Foreign key', 'Unique value', 'Non-null'], correctAnswer: 0 },
    ],
  };

  // ── 1. Valid payload passes ─────────────────────────────────────────────────
  assert('Valid payload returns the same object (identity)', validateResult(validPayload) === validPayload);

  // ── 2. Spec test A — empty arrays ───────────────────────────────────────────
  assert('Test A: Empty flashcards and quiz rejected',
    validateResult({ title: 'DBMS', summary: 'test', flashcards: [], quiz: [] }) === null);

  // ── 3. Spec test B — wrong option count and quiz length ─────────────────────
  assert('Test B: 2 options and 1 quiz item rejected',
    validateResult({ title: 'DBMS', summary: 'test', flashcards: validPayload.flashcards,
      quiz: [{ question: 'Test', options: ['A', 'B'], correctAnswer: 0 }] }) === null);

  // ── 4. Spec test C — extra top-level field ──────────────────────────────────
  assert('Test C: Extra top-level field "difficulty" rejected',
    validateResult({ ...validPayload, difficulty: 'easy' }) === null);

  // ── 5. Null and primitives ──────────────────────────────────────────────────
  assert('null rejected', validateResult(null) === null);
  assert('undefined rejected', validateResult(undefined) === null);
  assert('number 42 rejected', validateResult(42) === null);
  assert('string rejected', validateResult('{"title":"x"}') === null);
  assert('array rejected', validateResult([validPayload]) === null);
  assert('empty object rejected', validateResult({}) === null);

  // ── 6. Missing top-level keys ───────────────────────────────────────────────
  const { title: _t, ...noTitle } = validPayload;
  assert('Missing "title" rejected', validateResult(noTitle) === null);

  const { summary: _s, ...noSummary } = validPayload;
  assert('Missing "summary" rejected', validateResult(noSummary) === null);

  const { flashcards: _f, ...noFlashcards } = validPayload;
  assert('Missing "flashcards" rejected', validateResult(noFlashcards) === null);

  const { quiz: _q, ...noQuiz } = validPayload;
  assert('Missing "quiz" rejected', validateResult(noQuiz) === null);

  // ── 7. Empty/whitespace strings for title and summary ──────────────────────
  assert('Empty title string rejected', validateResult({ ...validPayload, title: '' }) === null);
  assert('Whitespace-only title rejected', validateResult({ ...validPayload, title: '   ' }) === null);
  assert('Empty summary string rejected', validateResult({ ...validPayload, summary: '' }) === null);
  assert('Whitespace-only summary rejected', validateResult({ ...validPayload, summary: '   ' }) === null);

  // ── 8. Flashcards length boundaries ────────────────────────────────────────
  assert('Flashcards length 4 (too short) rejected',
    validateResult({ ...validPayload, flashcards: validPayload.flashcards.slice(0, 4) }) === null);

  const flashcards8 = {
    ...validPayload,
    flashcards: [
      ...validPayload.flashcards,
      { question: 'Extra 1', answer: 'Ans 1' },
      { question: 'Extra 2', answer: 'Ans 2' },
      { question: 'Extra 3', answer: 'Ans 3' },
    ],
  };
  assert('Flashcards length 8 (max valid) accepted', validateResult(flashcards8) !== null);

  assert('Flashcards length 9 (too long) rejected',
    validateResult({ ...flashcards8, flashcards: [...flashcards8.flashcards, { question: 'Extra 4', answer: 'Ans 4' }] }) === null);

  // ── 9. Flashcard item shape ─────────────────────────────────────────────────
  assert('Flashcard with extra key rejected',
    validateResult({ ...validPayload, flashcards: [...validPayload.flashcards.slice(0, 4), { question: 'Q', answer: 'A', extra: 'bad' }] }) === null);

  assert('Flashcard with empty question rejected',
    validateResult({ ...validPayload, flashcards: [...validPayload.flashcards.slice(0, 4), { question: '', answer: 'A' }] }) === null);

  assert('Flashcard with whitespace question rejected',
    validateResult({ ...validPayload, flashcards: [...validPayload.flashcards.slice(0, 4), { question: '  ', answer: 'A' }] }) === null);

  assert('Flashcard with empty answer rejected',
    validateResult({ ...validPayload, flashcards: [...validPayload.flashcards.slice(0, 4), { question: 'Q', answer: '' }] }) === null);

  assert('Flashcard missing question key rejected',
    validateResult({ ...validPayload, flashcards: [...validPayload.flashcards.slice(0, 4), { answer: 'A' }] }) === null);

  assert('Flashcard missing answer key rejected',
    validateResult({ ...validPayload, flashcards: [...validPayload.flashcards.slice(0, 4), { question: 'Q' }] }) === null);

  // ── 10. Quiz length ─────────────────────────────────────────────────────────
  assert('Quiz length 4 (too short) rejected',
    validateResult({ ...validPayload, quiz: validPayload.quiz.slice(0, 4) }) === null);

  const sixthItem = { question: 'Extra Q', options: ['A', 'B', 'C', 'D'], correctAnswer: 0 };
  assert('Quiz length 6 (too long) rejected',
    validateResult({ ...validPayload, quiz: [...validPayload.quiz, sixthItem] }) === null);

  // ── 11. Quiz item shape ─────────────────────────────────────────────────────
  assert('Quiz item with extra key "explanation" rejected',
    validateResult({ ...validPayload, quiz: [...validPayload.quiz.slice(0, 4),
      { question: 'Q', options: ['A', 'B', 'C', 'D'], correctAnswer: 0, explanation: 'bad' }] }) === null);

  assert('Quiz item with empty question rejected',
    validateResult({ ...validPayload, quiz: [...validPayload.quiz.slice(0, 4),
      { question: '', options: ['A', 'B', 'C', 'D'], correctAnswer: 0 }] }) === null);

  // ── 12. Options array ───────────────────────────────────────────────────────
  assert('Quiz item with 3 options rejected',
    validateResult({ ...validPayload, quiz: [...validPayload.quiz.slice(0, 4),
      { question: 'Q', options: ['A', 'B', 'C'], correctAnswer: 0 }] }) === null);

  assert('Quiz item with 5 options rejected',
    validateResult({ ...validPayload, quiz: [...validPayload.quiz.slice(0, 4),
      { question: 'Q', options: ['A', 'B', 'C', 'D', 'E'], correctAnswer: 0 }] }) === null);

  assert('Quiz item with blank option string rejected',
    validateResult({ ...validPayload, quiz: [...validPayload.quiz.slice(0, 4),
      { question: 'Q', options: ['A', 'B', '  ', 'D'], correctAnswer: 0 }] }) === null);

  assert('Quiz item with empty option string rejected',
    validateResult({ ...validPayload, quiz: [...validPayload.quiz.slice(0, 4),
      { question: 'Q', options: ['A', 'B', '', 'D'], correctAnswer: 0 }] }) === null);

  // ── 13. correctAnswer validity ──────────────────────────────────────────────
  assert('correctAnswer 0 (valid lower bound) accepted',
    validateResult({ ...validPayload, quiz: [...validPayload.quiz.slice(0, 4),
      { question: 'Q', options: ['A', 'B', 'C', 'D'], correctAnswer: 0 }] }) !== null);

  assert('correctAnswer 3 (valid upper bound) accepted',
    validateResult({ ...validPayload, quiz: [...validPayload.quiz.slice(0, 4),
      { question: 'Q', options: ['A', 'B', 'C', 'D'], correctAnswer: 3 }] }) !== null);

  assert('correctAnswer 4 (out of range) rejected',
    validateResult({ ...validPayload, quiz: [...validPayload.quiz.slice(0, 4),
      { question: 'Q', options: ['A', 'B', 'C', 'D'], correctAnswer: 4 }] }) === null);

  assert('correctAnswer -1 (out of range) rejected',
    validateResult({ ...validPayload, quiz: [...validPayload.quiz.slice(0, 4),
      { question: 'Q', options: ['A', 'B', 'C', 'D'], correctAnswer: -1 }] }) === null);

  assert('correctAnswer 1.5 (non-integer) rejected',
    validateResult({ ...validPayload, quiz: [...validPayload.quiz.slice(0, 4),
      { question: 'Q', options: ['A', 'B', 'C', 'D'], correctAnswer: 1.5 }] }) === null);

  assert('correctAnswer "0" (string) rejected',
    validateResult({ ...validPayload, quiz: [...validPayload.quiz.slice(0, 4),
      { question: 'Q', options: ['A', 'B', 'C', 'D'], correctAnswer: '0' }] }) === null);

  assert('correctAnswer null rejected',
    validateResult({ ...validPayload, quiz: [...validPayload.quiz.slice(0, 4),
      { question: 'Q', options: ['A', 'B', 'C', 'D'], correctAnswer: null }] }) === null);

  // ── 14. Non-object values inside arrays ────────────────────────────────────
  assert('Flashcards array containing null item rejected',
    validateResult({ ...validPayload, flashcards: [...validPayload.flashcards.slice(0, 4), null] }) === null);

  assert('Quiz array containing null item rejected',
    validateResult({ ...validPayload, quiz: [...validPayload.quiz.slice(0, 4), null] }) === null);

  // ── Summary ─────────────────────────────────────────────────────────────────
  console.log(`\nResults: ${passed} passed, ${failed} failed`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
