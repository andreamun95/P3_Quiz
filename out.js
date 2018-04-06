const figlet = require('figlet');
const chalk = require('chalk');

/**
 * Dar color a un String.
 *
 * @param msg    String al que hay que dar color
 * @param color  Color con que pintar msg
 * @returns {String} Devuelve el String msg con el color elegido.
 */
const colorize = (msg, color) => {

    if (typeof color !== "undefined") {
        msg =chalk[color].bold(msg);
    }
    return msg;
}


/**
 * Escribe un mensaje de log.
 *
 * @param msg El String a escribir.
 * @param color Color del texto.
 */
const log = (msg, color) => {

    console.log(colorize(msg, color));
}


/**
 * Escribe un mensaje de log grande.
 *
 * @param msg    Texto a escribir.
 * @param color  Color del texto.
 */
const biglog = (msg, color) => {
    log(figlet.textSync(msg, { horizontalLayout: 'full' }), color);
}


/**
 * Escribe el mensaje de error emsg.
 *
 * @param emsg  Texto del mensaje de error.
 */
const errorlog = (emsg) => {
    console.log(`${colorize("Error", "red")}: ${colorize(colorize(emsg, "red"), "bgYellowBright")}`);
}

exports = module.exports = {
    colorize,
    log,
    biglog,
    errorlog
};