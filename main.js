const readline = require('readline');
const model = require('./model');
const {log, bigLog, errorLog, colorize} = require("./out");
const comandos = require ("./cmds");


//Mensaje inicial
bigLog('CORE QUIZ', 'blue');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: colorize("quiz > ", 'green'),
    completer : (line) => {
        const completions = 'h help add delete edit list test p play credits q quit'.split(' ');
        const hits = completions.filter((c) => c.startsWith(line));
        // show all completions if none found
        return [hits.length ? hits : completions, line];
    }
});

rl.prompt();

rl
    .on('line', (line) => {

        let args = line.split(" ");
        let comando = args[0].toLowerCase().trim();

        switch (comando) {
            case '':
                rl.prompt();
                break;

            case 'h':
            case 'help':
                comandos.helpCmd(rl);
                break;

            case 'quit':
            case 'q':
                comandos.quitCmd(rl);
                break;

            case 'add':
                comandos.addCmd(rl);
                break;

            case 'list':
                comandos.listCmd(rl);
                break;

            case 'show':
                comandos.showCmd(rl, args[1]);
                break;

            case 'test':
                comandos.testCmd(rl, args[1]);
                break;

            case 'play':
            case 'p':
                comandos.playCmd(rl);
                break;

            case 'delete':
                comandos.deleteCmd(rl,args[1]);
                break;

            case 'edit':
                comandos.editCmd(rl,args[1]);
                break;

            case 'credits':
                comandos.creditsCmd(rl);
                break;

            default:
                console.log(`Comando desconocido: '${colorize(cmd, 'red')}'`);
                console.log(`Use ${colorize('help', 'green')} para ver todos los comandos disponibles.`);
                rl.prompt();
                break;
        }


    })
    .on('close', () => {
        log('Adiós');
        process.exit(0);
    });