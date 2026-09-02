import fs from 'fs';
import path from 'path';

const DATA_FILE = process.env.NODE_ENV === 'production' 
  ? path.join('/app', 'portfolio-data.json') 
  : path.join(__dirname, '../../../portfolio-data.json');

export function getPortfolioData(): any {
    if (!fs.existsSync(DATA_FILE)) {
        return null;
    }
    const rawData = fs.readFileSync(DATA_FILE, 'utf8');
    try {
        return JSON.parse(rawData);
    } catch (e) {
        console.error("JSON parse error:", e);
        return null;
    }
}

export function savePortfolioData(data: any): void {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}
