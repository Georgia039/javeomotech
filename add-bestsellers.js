// add-bestsellers.js
// Run this once from your javeomotech repo root:
//   node add-bestsellers.js
// It reads index.html, tags the 10 best-seller cards, and writes the file back.

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(filePath, 'utf8');

// Each entry: a unique string already in the file (the data-name value works great
// since it's unique per card), and the category label to insert for the tag row.
const bestsellers = [
  { match: `data-name="ducati v4s motorcycle model diecast alloy metal sound light sport bike collectible"`,
    catTag: `<span class="product-tag tag-cat">Collectibles</span>` },
  { match: `data-name="airfly pro 2 bluetooth adapter airplane wireless headphones 3.5mm aux travel twelve south"`,
    catTag: `<span class="product-tag tag-cat">Gadgets</span>` },
  { match: `data-name="pu leather desk pad mouse pad minimal workspace mat"`,
    catTag: `<span class="product-tag tag-cat">Smart Home</span>` },
  { match: `data-name="soundcore liberty 5 pro max wireless earbuds ai note-taker anc guinness world record"`,
    catTag: `<span class="product-tag tag-cat">Gadgets</span>` },
  { match: `data-name="edc pry bar multitool ratchet screwdriver wrench crowbar bottle opener"`,
    catTag: `<span class="product-tag tag-cat">Gadgets</span>` },
  { match: `data-name="la crosse battery tester digital portable aa aaa 9v button cell voltage"`,
    catTag: `<span class="product-tag tag-cat">Gadgets</span>` },
  { match: `data-name="joyroom magnetic cable clips desk organizer cord holder"`,
    catTag: `<span class="product-tag tag-cat">Gadgets</span>` },
  { match: `data-name="tec accessories embrite glow fob anodized aluminum key fob glow dark edc"`,
    catTag: `<span class="product-tag tag-cat">Gadgets</span>` },
  { match: `data-name="fanttik s2 pro electric screwdriver cordless torque bits 90 degree adapter household"`,
    catTag: `<span class="product-tag tag-cat">Tools</span>` },
  { match: `data-name="looi robot ai desktop companion chatgpt gemini voice wireless charging"`,
    catTag: `<span class="product-tag tag-cat">Gadgets</span>` },
];

let tagged = 0;
let missing = [];

bestsellers.forEach(({ match, catTag }) => {
  // Find the product-card div that contains this data-name, and insert data-bestseller="true"
  // right before the data-name attribute (only if not already present).
  const cardRegex = new RegExp(
    `(<div class="product-card"(?:(?!data-bestseller)[^>])*?)(\\s${escapeRegex(match)})`,
    's'
  );

  if (html.match(cardRegex)) {
    html = html.replace(cardRegex, `$1 data-bestseller="true"$2`);
    tagged++;
  } else {
    // Might already be tagged, or match string not found at all
    if (!html.includes(`data-bestseller="true"`) || !html.includes(match)) {
      missing.push(match);
    }
  }

  // Insert the Best Seller tag span right after the opening <div class="product-tags">
  // that immediately follows this card's data-name block. We locate the block by
  // searching forward from the data-name string to the next "product-tags" div.
  const nameIndex = html.indexOf(match);
  if (nameIndex !== -1) {
    const tagsDivIndex = html.indexOf('<div class="product-tags">', nameIndex);
    if (tagsDivIndex !== -1 && !html.slice(tagsDivIndex, tagsDivIndex + 300).includes('tag-bestseller')) {
      const insertPoint = tagsDivIndex + '<div class="product-tags">'.length;
      const bestSellerSpan = `\n          <span class="product-tag tag-bestseller">🔥 Best Seller</span>`;
      html = html.slice(0, insertPoint) + bestSellerSpan + html.slice(insertPoint);
    }
  }
});

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

fs.writeFileSync(filePath, html, 'utf8');

console.log(`✅ Done. Tagged ${tagged} card(s) with data-bestseller="true".`);
if (missing.length) {
  console.log(`⚠️  Could not find these (check spelling/content changed):`);
  missing.forEach(m => console.log('   -', m));
}
console.log(`Also inserted the 🔥 Best Seller tag span into each matching card's tags row.`);
console.log(`Don't forget: add the "Best Sellers" filter button and the applyFilters() JS update manually if not done yet.`);