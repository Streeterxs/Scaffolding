import path from 'path';
import dotenvsafe from 'dotenv-safe';

const cwd = process.cwd();
console.log('cwd: ', cwd);
const root = path.join.bind(cwd);

dotenvsafe.config({
    path: root('.env'),
    sample: root('.env.example')
});

const ENV = process.env;

const config = {
    db_url: `${ENV.MONGODB_URL}`
};

console.log('config: ', config);

export default config;