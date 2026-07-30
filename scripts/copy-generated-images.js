/* global __dirname */
const fs = require('fs');
const path = require('path');

const brainDir = 'C:\\Users\\rsumi\\.gemini\\antigravity\\brain\\eb9b9862-23dc-427b-906a-718b12f8a8e1';
const targetDir = path.join(__dirname, '..', 'assets', 'images');

const imageMappings = [
  { prefix: 'hdfc_regalia_card_', target: 'cc_hdfc_regalia.jpg' },
  { prefix: 'imtiaz_gold_card_', target: 'cc_imtiaz_gold.jpg' },
  { prefix: 'klysavo_infinite_card_', target: 'cc_klysavo_infinite.jpg' },
  { prefix: 'personal_loan_banner_', target: 'loan_personal.jpg' },
  { prefix: 'home_loan_banner_', target: 'loan_home.jpg' },
  { prefix: 'fast_track_car_banner_', target: 'loan_car_fasttrack.jpg' },
  { prefix: 'health_insurance_banner_', target: 'ins_health.jpg' },
  { prefix: 'car_insurance_banner_', target: 'ins_car.jpg' },
  { prefix: 'travel_insurance_banner_', target: 'ins_travel.jpg' },
];

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const files = fs.readdirSync(brainDir);

for (const map of imageMappings) {
  const matchedFile = files.find(f => f.startsWith(map.prefix) && (f.endsWith('.jpg') || f.endsWith('.png')));
  if (matchedFile) {
    const srcPath = path.join(brainDir, matchedFile);
    const destPath = path.join(targetDir, map.target);
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${matchedFile} -> assets/images/${map.target}`);
  } else {
    console.warn(`Warning: Could not find file with prefix ${map.prefix}`);
  }
}

console.log('Finished copying all 9 distinct card images!');
