import fs from 'fs';
import path from 'path';

const runId = process.env.RUN_ID || new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const reportsDir = process.env.REPORTS_DIR || path.resolve('reports', runId);

export default class Logger {
    constructor(context = 'General') {
        this.context = context;
        fs.mkdirSync(reportsDir, { recursive: true });
        this.logFile = path.join(reportsDir, 'test-run.log');
    }

    formatEntry(level, message) {
        return `[${new Date().toISOString()}] [${level}] [${this.context}] ${message}`;
    }

    write(entry) {
        console.log(entry);
        fs.appendFileSync(this.logFile, entry + '\n');
    }

    info(message) { this.write(this.formatEntry('INFO', message)); }
    warn(message) { this.write(this.formatEntry('WARN', message)); }
    error(message) { this.write(this.formatEntry('ERROR', message)); }
}
