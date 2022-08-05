const fs = require('fs');
const { spawn } = require('child_process');

const curl = spawn('curl', [
  'https://en.wikipedia.org/wiki/Tom_Anderson',
  '|',
  'grep href',
]);

const grep1 = spawn('grep', ['href']);

const dataFetch = () => {
  const aggData = {};
  curl.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
    aggData['stdout'] = data.toString();
    console.log('aggdata:', aggData);
    fs.writeFile('./data.json', JSON.stringify(aggData, null, 2), (err) =>
      console.log(err)
    );
  });

  curl.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  curl.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
};

dataFetch();
