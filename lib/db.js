import path from 'path';
import Database from 'better-sqlite3';

const DB_PATH = path.join(process.cwd(), 'data', 'chat.sqlite');

let _db;

function ensureDir(filePath) {
	const fs = require('fs');
	const dir = path.dirname(filePath);
	if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function getDb() {
	if (_db) return _db;
	ensureDir(DB_PATH);
	_db = new Database(DB_PATH);
	_db.pragma('journal_mode = WAL');
	_db.exec(`
		CREATE TABLE IF NOT EXISTS messages (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			room TEXT NOT NULL,
			username TEXT NOT NULL,
			message TEXT NOT NULL,
			created_at INTEGER NOT NULL
		);
		CREATE INDEX IF NOT EXISTS idx_messages_room_created
			ON messages(room, created_at);
	`);
	return _db;
}

export const sanitizeRoom = (s) =>
	String(s || '').trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-').slice(0, 64);

const HISTORY_LIMIT = 200;

export function addMessage({ room, username, message }) {
	const db = getDb();
	const stmt = db.prepare(
		'INSERT INTO messages (room, username, message, created_at) VALUES (?, ?, ?, ?)'
	);
	const info = stmt.run(room, username, message, Date.now());
	return info.lastInsertRowid;
}

export function getMessages(room, limit = HISTORY_LIMIT) {
	const db = getDb();
	const rows = db
		.prepare(
			`SELECT id, username, message, created_at
			 FROM messages
			 WHERE room = ?
			 ORDER BY id DESC
			 LIMIT ?`
		)
		.all(room, limit);
	return rows.reverse();
}
