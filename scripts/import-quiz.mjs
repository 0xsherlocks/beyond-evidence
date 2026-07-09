/**
 * ═══════════════════════════════════════════════════════════════
 *  BEYOND EVIDENCE — Bulk Quiz Importer (CSV → Sanity)
 * ═══════════════════════════════════════════════════════════════
 *
 *  Usage:
 *    node scripts/import-quiz.mjs <path-to-csv> "<Subject Name>"
 *
 *  Example:
 *    node scripts/import-quiz.mjs ../forensic_science_quiz1.csv "Forensic Science"
 *
 *  CSV Format (7 columns — last one is optional):
 *    Question,OptionA,OptionB,OptionC,OptionD,CorrectAnswer,Explanation
 *
 *    - CorrectAnswer must be: OptionA, OptionB, OptionC, or OptionD
 *    - Explanation is optional. Leave blank or skip the column entirely.
 *
 *  What it does:
 *    1. Reads the CSV file
 *    2. Creates a new Subject document in Sanity (or reuses existing)
 *    3. Creates a Quiz document with all questions linked to that subject
 *    4. Everything appears in Sanity Studio for manual editing
 * ═══════════════════════════════════════════════════════════════
 */

import { createClient } from '@sanity/client';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !token) {
  console.error('\n❌ Missing environment variables!');
  console.error('   Make sure .env.local has:');
  console.error('   NEXT_PUBLIC_SANITY_PROJECT_ID="your-project-id"');
  console.error('   SANITY_API_TOKEN="your-token"');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2024-01-01',
  useCdn: false,
});

// ─── CSV Parser ──────────────────────────────────────────────
function parseCSV(csvText) {
  const lines = csvText.split('\n').filter(line => line.trim() !== '');
  
  // Skip header row
  const dataLines = lines.slice(1);
  const questions = [];

  for (const line of dataLines) {
    // Handle quoted fields properly
    const fields = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        fields.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    fields.push(current.trim());

    if (fields.length >= 6) {
      const [question, optionA, optionB, optionC, optionD, correctAnswer, explanation] = fields;

      // Map "OptionA" → 0, "OptionB" → 1, etc.
      const answerMap = { 'OptionA': 0, 'OptionB': 1, 'OptionC': 2, 'OptionD': 3 };
      const correctIndex = answerMap[correctAnswer] ?? 0;

      const questionObj = {
        _key: crypto.randomUUID().replace(/-/g, '').slice(0, 12),
        _type: 'object',
        question,
        options: [optionA, optionB, optionC, optionD],
        correctAnswer: correctIndex,
      };

      // Add explanation only if it exists (optional 7th column)
      if (explanation && explanation.trim()) {
        questionObj.explanation = explanation.trim();
      }

      questions.push(questionObj);
    }
  }

  return questions;
}

// ─── Main Import Function ────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.error('\n📋 Usage: node scripts/import-quiz.mjs <csv-file> "<Subject Name>"');
    console.error('   Example: node scripts/import-quiz.mjs ../forensic_science_quiz1.csv "Forensic Science"\n');
    process.exit(1);
  }

  const csvPath = resolve(process.cwd(), args[0]);
  const subjectName = args[1];

  console.log('\n═══════════════════════════════════════════════');
  console.log('  BEYOND EVIDENCE — Quiz Importer');
  console.log('═══════════════════════════════════════════════');
  console.log(`  📁 CSV File    : ${csvPath}`);
  console.log(`  📚 Subject     : ${subjectName}`);
  console.log(`  🗄️  Dataset     : ${dataset}`);
  console.log('═══════════════════════════════════════════════\n');

  // 1. Read and parse CSV
  let csvText;
  try {
    csvText = readFileSync(csvPath, 'utf-8');
  } catch (err) {
    console.error(`❌ Could not read file: ${csvPath}`);
    process.exit(1);
  }

  const questions = parseCSV(csvText);
  console.log(`✅ Parsed ${questions.length} questions from CSV\n`);

  if (questions.length === 0) {
    console.error('❌ No questions found. Check your CSV format.');
    process.exit(1);
  }

  // Show a preview of first 3 questions
  console.log('📋 Preview (first 3 questions):');
  questions.slice(0, 3).forEach((q, i) => {
    console.log(`   ${i + 1}. ${q.question}`);
    q.options.forEach((opt, j) => {
      const marker = j === q.correctAnswer ? ' ✅' : '';
      console.log(`      ${String.fromCharCode(65 + j)}. ${opt}${marker}`);
    });
    console.log('');
  });

  // 2. Find or create Subject
  console.log(`🔍 Looking for existing subject: "${subjectName}"...`);
  const slug = subjectName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  let subjectDoc = await client.fetch(
    `*[_type == "subject" && slug.current == $slug][0]`,
    { slug }
  );

  if (subjectDoc) {
    console.log(`   ✅ Found existing subject: ${subjectDoc._id}\n`);
  } else {
    console.log(`   📝 Creating new subject: "${subjectName}"...`);
    subjectDoc = await client.create({
      _type: 'subject',
      name: subjectName,
      slug: { _type: 'slug', current: slug },
      description: `Quiz questions for ${subjectName}`,
      order: 0,
    });
    console.log(`   ✅ Created subject: ${subjectDoc._id}\n`);
  }

  // 3. Create Quiz document linked to the subject
  console.log(`📤 Uploading ${questions.length} questions to Sanity...`);

  const quizDoc = await client.create({
    _type: 'quiz',
    subject: {
      _type: 'reference',
      _ref: subjectDoc._id,
    },
    quizQuestions: questions,
    order: 0,
  });

  console.log(`\n✅ SUCCESS! Quiz uploaded to Sanity!`);
  console.log(`   Quiz ID  : ${quizDoc._id}`);
  console.log(`   Subject  : ${subjectName}`);
  console.log(`   Questions: ${questions.length}`);
  console.log(`\n🎉 You can now see and edit it in Sanity Studio!\n`);
}

main().catch((err) => {
  console.error('\n❌ Import failed:', err.message);
  process.exit(1);
});
