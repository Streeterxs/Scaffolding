import path from 'path';
import dotenvsafe from 'dotenv-safe';

const cwd = process.cwd();
console.log('process.cwd: ', cwd);
const root = path.join.bind(cwd);

dotenvsafe.config({
    path: root('.env'),
    sample: root('.env.example')
});

const ENV = process.env;

const config = {
    db_url: `${ENV.MONGODB_URL}`
};

export default config;