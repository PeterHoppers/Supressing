"use strict"

var relax =
{
    fadeInSpeed: 5000,
    fadeOutSpeed: 4000,
    choiceTransitionTime: 10000,
    spawnFreq: 1000,
    fadeInPercent: 1
}

var flirt=
{
    fadeInSpeed: 10000,
    fadeOutSpeed: 1000,
    choiceTransitionTime: 50,
    spawnFreq: 500,
    fadeInPercent: .4
}


class Choice
{
    constructor(choiceKey, description, choiceToString, transLine, speeds)
    {
        this.choiceKey = choiceKey;
        this.description = description;        
        this.choiceToString = choiceToString;
        this.transLine = transLine;
        this.isFinished = false;
        this.isFocused = false;
        
        if (!speeds)
        {
            this.fadeInSpeed = 5000;
            this.fadeOutSpeed = 1000;
            this.choiceTransitionTime = 10000;
            this.spawnFreq = 500;
            this.fadeInPercent = 1;
        }
        else
        {
            this.fadeInSpeed = speeds.fadeInSpeed;
            this.fadeOutSpeed = speeds.fadeOutSpeed;
            this.choiceTransitionTime = speeds.choiceTransitionTime;
            this.spawnFreq = speeds.spawnFreq;
            this.fadeInPercent = speeds.fadeInPercent;
        }
    }

    hasFinished()
    {
        this.isFinished = true;
    }   
}
    
function createChoice()
{
    const choiceMap = new Map();
    //this is a bridge between choices and popUpThoughts. This way, you can reuse popUpThoughts, if needed
    const choicesToThoughtMap = new Map();
    
    //Here is where you create the choices for the game
    var introChoice = new Choice(
        "intro",
        ["Line one of the text",
        "Line two of the text",
        "Line three of the text",
        "Line four of the text"],
        "Trying to focus on the computer",
        "I can't focus on the computer.",
        Object.assign({}, relax)
    )

    var readingChoice = new Choice(
        "book",
        ["Look at me, I'm reading a book",
        "I'm readin a book kid, I'm readin a book",
        "Look a my eyes going down the page."],
        "Let's read a book right about now.",
        "Screw reading this book.",
        Object.assign({}, flirt)
    )

    var coworkersChoice = new Choice(
        "co-workers",
        ["Oh hey man, what you be doin'?",
          "Nothin much dude-o"],
        "I wonder what my co-workers are up to.",
        "Sorry man, I need to go.",
        Object.assign({}, relax)
    )

    var waterChoice = new Choice(
        "drank",
        ["Chug, chug, chug, chug, chug, chug",
          "Let's all go to the pisser."],
          "I am quire thirsty.",
          "You know, screw the water!"
    )

    var hugChoice = new Choice(
        "hug",
        ["Let's spread some love her by giving them some hugs.",
          "Bounding with the penguin's future."],
         "I want to give someone a hug.",
         "Yeah, no, that's weird." 
    )

    var funChoice = new Choice(
        "fun",
        ["WEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE",
        "WOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO",
        "YEEEEEEEAAAAAAAAAAHHHHHHH"],
        "Let's party!!",
        "No. Responible time."
    )

    choiceMap.set(introChoice.choiceKey, introChoice);
    choiceMap.set(readingChoice.choiceKey, readingChoice);
    choiceMap.set(coworkersChoice.choiceKey, coworkersChoice);
    choiceMap.set(waterChoice.choiceKey, waterChoice);
    choiceMap.set(hugChoice.choiceKey, hugChoice);
    choiceMap.set(funChoice.choiceKey, funChoice);

    choicesToThoughtMap.set(introChoice.choiceKey, [coworkersChoice, readingChoice]);
    choicesToThoughtMap.set(coworkersChoice.choiceKey, [waterChoice, hugChoice]);
    choicesToThoughtMap.set(readingChoice.choiceKey, [hugChoice, funChoice]);
    
    return {
        choiceMap,
        choicesToThoughtMap
    }
}        