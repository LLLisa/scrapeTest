const fs = require('fs');
const { spawn } = require('child_process');

const curl = spawn('curl', ['https://en.wikipedia.org/wiki/Tom_Anderson']);

const grep1 = spawn('grep', [
  '-m 1',
  '-z',
  '-o',
  '-P',
  '(?<=<p>)(?s).*(?=</p>)',
]);

const dataFetch = () => {
  curl.stdout.on('data', (data) => {
    grep1.stdin.write(data);
  });

  curl.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  curl.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
    grep1.stdin.end();
  });

  grep1.stdout.on('data', (data) => {
    const aggData = {};
    aggData['stdout'] = data.toString();
    console.log('aggdata:', aggData);
    fs.writeFile('./data.json', JSON.stringify(aggData, null, 2), (err) =>
      console.log(err)
    );
  });

  grep1.stderr.on('data', (data) => {
    console.error(`grep stderr: ${data}`);
  });

  grep1.on('close', (code) => {
    if (code !== 0) {
      console.log(`grep process exited with code ${code}`);
    }
  });
};

dataFetch();
