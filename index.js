const fs = require('fs');
const translate = require('@vitalets/google-translate-api');
const sleep = require('sleep-promise');

var masterFile = 'U:\\Program Files (x86)\\Steam\\steamapps\\common\\GarrysMod\\garrysmod\\addons\\fmainmenu\\lua\\fmainmenu\\lang\\cl_lang_en.lua'; // Set this to the file we will be editing translations for
var languageList = ['de', 'es', 'fr', 'pl', 'ru', 'tr']; // Set this to what languages (short code) we should create translations for
var translateTrigger = "translationList."; // When this string is found on a line, translate whatever is in quotes within that line

async function main(){
    var dataTable = {};
    var data = fs.readFileSync(masterFile, 'utf8');
    dataTable = data.split("\n");

    for(var languageCode of languageList){
        var newFileLocation = masterFile.substring(0, masterFile.lastIndexOf("\\")+9) + languageCode + ".lua"
        var logger = fs.createWriteStream(newFileLocation, {
            flags: 'w'
        })

        for(var line of dataTable){
            if(line.indexOf(translateTrigger) != -1){
                line = line.replace("\\n\\n","").replace("\\n","");

                var partToReplace = line.substring(line.indexOf("\"")+1, line.lastIndexOf("\""));
                var result = await translate(partToReplace, {from: 'en', to: languageCode});
                var translatedPart = result.text.replace("\ \"","\\\"");
                line = line.replace("\"" + partToReplace + "\"", "\"" + translatedPart + "\"");
                console.log(partToReplace + " -> " + translatedPart + " -> " + line);
            }

            logger.write(line);
            await sleep(1000);
        }

        logger.end();
    }
}

main();