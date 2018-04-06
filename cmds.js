const model = require('./model');
const {log, biglog, errorlog, colorize} = require("./out");

/**
 * Muestra la ayuda
 *
 * @param rl Objeto readline usado para implementar el CLI
 */
exports.helpCmd = rl => {
    log("Comandos:");
    log("   h|help - Muestra esta ayuda.");
    log("   List - Listar los quizzes existentes.");
    log("   show <id> - Muestra la pregunta y la respuesta el quiz indicado.");
    log("   add - Añadir un uevo quizz interactivamente.");
    log("   delete <id> - Borrar el quiz indicado.");
    log("   edit <id> - Editar el quiz indicado.");
    log("   test <id> - Probar el quiz indicado.");
    log("   p|play - Jugar a preguntar aleatoriamente todos los quizzes.");
    log("   credits - Créditos.");
    log("   q|quit - Salir del programa.");
    rl.prompt();
};


/**
 * Lista los quizzes existentes en el modelo
 *
 * @param rl Objeto readline usado para implementar el CLI
 */
exports.listCmd = rl => {

    model.getAll().forEach((quiz, id) => {
        log(` [${colorize(id, 'magenta')}]: ${quiz.question} `);
    });
    rl.prompt();
};


/**
 * Muestra el quiz indicando en el parámetro: pregunta y respuesta
 *
 * @param rl Objeto readline usado para implementar el CLI
 *@param id  Clave del quiz a mostrar
 */
exports.showCmd = (rl, id) => {

    if (typeof id === "undefined") {
        errorlog(`Falta el parámetro id.`);
    } else {
        try {
            const quiz = model.getByIndex(id);
            log(`[${colorize(id, 'magenta')}]: ${quiz.question} ${colorize('=>', 'magenta')} ${quiz.answer}`);
        } catch(error) {
            errorlog(error.message);
        }
    }
    rl.prompt();
};


/**
 * Añade un nuevo quiz al modelo.
 * Pregunta interactivamente por la pregunta y la respuesta
 *
 * Hay que recordar que el funcionamiento de la funcion rl.question es asíncrono.
 * El prompt hay que sacarlo cuando ya se ha terminado la interacción con el usuario,
 * es decir, la llamada a rl.prompt() se debe hacer en la callback de la segunda
 * llamada a rl.question.
 *
 * @param rl Objeto readline usado para implementar el CLI
 */
exports.addCmd = rl => {
    rl.question(colorize(' Introduzca una pregunta: ', 'red'), question => {
        rl.question(colorize(' Introduzca una pregunta: ', 'red'), answer => {
            model.add(question, answer);
            log(`${colorize('Se ha añadido', 'magenta')}: ${question} ${colorize('=>', 'magenta')} ${answer}`);
            rl.prompt();
        });
    });
};


/**
 * Borra un quiz del modelo
 *
 * @param rl Objeto readline usado para implementar el CLI
 * @param id clave del quiz a borrar
 */
exports.deleteCmd = (rl,id) => {
    if (typeof id === "undefined") {
        errorlog(`Falta el parámetro id.`);
    } else {
        try {
            model.deleteByIndex(id);
        } catch(error) {
            errorlog(error.message);
        }
    }
    rl.prompt();
};


/**
 * Edita un quiz del modelo
 *
 * @param rl
 * @param id
 */
exports.editCmd = (rl, id) => {
    if (typeof id === "undefined") {
        errorlog(`Falta el parámetro id.`);
        rl.prompt();
    } else {
        try {
            const quiz = model.getByIndex(id);

            process.stdout.isTTY && setTimeout(() => {rl.write(quiz.question)},0);

            rl.question(colorize(' Introduzca una pregunta: ', 'red'), question => {

                process.stdout.isTTY && setTimeout(() => {rl.write(quiz.answer)},0);

                rl.question(colorize(' Introduzca la respuesta ', 'red'), answer => {
                    model.update(id, question, answer);
                    log(` Se ha cambiado el quiz ${colorize(id, 'magenta')} por: ${question} ${colorize('=>', 'magenta')} ${answer}`);
                    rl.prompt();
                });
            });
        } catch (error) {
            errorlog(error.message);
            rl.prompt();
        }
    }
};


/**
 * Prueba un quiz, es decir, hace una pregunta del modelo a la que debemos contestar
 *
 * @param rl
 * @param id
 */
exports.testCmd = (rl, id) => {
    if (typeof id === "undefined") {
        errorlog(`Falta el parámetro id.`);
        rl.prompt();
    } else {
        try {
            const quiz = model.getByIndex(id);
            rl.question(colorize(quiz.question + '?' , 'red'), respuesta => {
                if(respuesta.toLowerCase().trim() === quiz.answer.toLowerCase().trim()) {
                    log('Su respuesta es: ');
                    biglog('CORRECTO' + '!' , 'green');

                }else {
                    log('Su respuesta es: ');
                    biglog('INCORRECTO' , 'red');
                }
                rl.prompt();
            });

        }catch (error) {
            errorlog(error.message);
            rl.prompt();
        }
    }
};


exports.playCmd = rl => {

    let score = 0; //numero de preguntas acertadas
    /*
    let toBeResolved = []; //array con ids de las preguntas para asi no repetirlas
    const quizzes = model.getAll();
    for (i = 0 ; i < quizzes.length; i++){

        toBeResolved[i]=quizzes[i];

    }
    */
    let toBeResolved = model.getAll();

    // funcion para jugar
    const playOne = () => {
        if (toBeResolved.length === 0) {
            log(`No hay nada mas que preguntar`);
            log(`Fin del juego. Aciertos: ${score} `);
            biglog(` ${score}`,`magenta`);
            rl.prompt();

        } else {
            let id = Math.floor(Math.random()*toBeResolved.length);
            let quiz = toBeResolved[id];
            toBeResolved.splice(id, 1);

            rl.question(colorize(' ¿ ' + quiz.question + ' ? ', 'red'), answer => {
                if(answer.toLowerCase().trim() === quiz.answer.toLowerCase().trim()) {
                    score = score + 1;
                    log(` CORRECTO - LLeva ${score} aciertos ` );
                    playOne();
                }else{
                    log(` INCORRECTO `);
                    log(` Fin del juego - Aciertos ${score} ` );
                    biglog(` ${score}`, 'magenta');
                    rl.prompt();
                }
            });
        }

    };
    playOne();


};


exports.creditsCmd = rl => {
    log('Autor de la práctica:');
    log('Andrea Muñoz', 'green');
    rl.prompt();
};


exports.quitCmd = rl => {
    rl.close();
};