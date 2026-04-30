const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const assert = require('assert');

function runScript(db, script) {
  const sql = fs.readFileSync(script, 'utf8');
  return new Promise((resolve, reject) => {
    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

function getAllFromGrocery(db) {
  const sql = `select * from Grocery`;
  return new Promise((resolve, reject) => {
    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

function getAllFromInventory(db) {
  const sql = `select * from Inventory`;
  return new Promise((resolve, reject) => {
    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

const doResultsContainEveryRow = (results, rows) => {
  let containsAllRows = true;
  rows.forEach((row) => {
    if (!results.some((result) => result["PRODUCT_NAME"] === row["PRODUCT_NAME"] && result["PRICE"] === row["PRICE"])) {
      containsAllRows = false;
    }
  })
  return containsAllRows;
}

describe('the SQL in the `exercise.sql` file', () => {
  let db;
  let scriptPath;

  beforeAll(() => {
    const dbPath = path.resolve(__dirname, '..', 'lesson18.db');
    db = new sqlite3.Database(dbPath);

    scriptPath = path.resolve(__dirname, '..', 'exercise.sql');
  });

  afterAll(() => {
    db.close();
  });

it('Should retrieve the combined results of `Employee` and `Contact_Info` using UNION', async () => {
    const results = await runScript(db, scriptPath);
    const groceries = await getAllFromGrocery(db);
    const inventories = await getAllFromInventory(db);

    expect(doResultsContainEveryRow(results, groceries)).toBe(true);
    expect(doResultsContainEveryRow(results, inventories)).toBe(true);
  });
});
