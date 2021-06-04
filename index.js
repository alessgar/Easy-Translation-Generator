const fs = require('fs');
const translate = require('@vitalets/google-translate-api');
const sleep = require('sleep-promise');

var masterFile = 'U:\\Program Files (x86)\\Steam\\steamapps\\common\\GarrysMod\\garrysmod\\addons\\fmainmenu\\lua\\fmainmenu\\lang\\cl_lang_en.lua'; // Set this to the file we will be editing translations for
var languageCode = 'fr'; // Set this to what language (short code) we should create a translation for
var translateTrigger = "translationList."; // When this string is found on a line, translate whatever is in quotes within that line

async function main(){
    var dataTable = {};
    var data = fs.readFileSync(masterFile, 'utf8');
    dataTable = data.split("\n");

    var newFileLocation = masterFile.substring(0, masterFile.lastIndexOf("\\")+9) + languageCode + ".lua"
    var logger = fs.createWriteStream(newFileLocation, {
        flags: 'w'
    })

    for(var line of dataTable){
        if(line.indexOf(translateTrigger) != -1){
            var partToReplace = line.substring(line.indexOf("\"")+1, line.lastIndexOf("\""))
            var result = await translate(partToReplace, {from: 'en', to: languageCode});
            var translatedPart = result.text;
            line = line.replace("\"" + partToReplace + "\"", "\"" + translatedPart + "\"");
            console.log(partToReplace + " -> " + translatedPart + " -> " + line);
        }

        logger.write(line);
        await sleep(1000);
    }

    logger.end();
}

main();