var path = require('path'),
    spawn = require('child_process').spawn;

var bukkit = spawn('java', '-Xincgc -Xmx1024M -jar'.split(' ').concat(
  path.resolve(path.join(__dirname, '..', 'craftbukkit.jar'))
));

process.stdin.pipe(bukkit.stdin);
bukkit.stdout.pipe(process.stdout);
bukkit.stderr.pipe(process.stderr);

process.stdin.resume();

bukkit.on('exit', process.exit);
