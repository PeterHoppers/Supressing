//====Code Imported From https://css-tricks.com/snippets/css/typewriter-effect/=====
// set up text to print, each item in array is new line
var narrationDisplay = new Array(
"There are only 10 types of people in the world:", 
"Those who understand binary, and those who don't",
 "There are only 10 types of people in the world:", 
"Those who understand binary, and those who don't",
 "There are only 10 types of people in the world:", 
"Those who understand binary, and those who don't",
 "There are only 10 types of people in the world:", 
"Those who understand binary, and those who don't",
 "There are only 10 types of people in the world:", 
"Those who understand binary, and those who don't",
 "There are only 10 types of people in the world:", 
"Those who understand binary, and those who don't",
 "There are only 10 types of people in the world:", 
"Those who understand binary, and those who don't",
);

var iSpeed = 200; // time delay of print out
var iIndex = 0; // start printing array at this posision
var iArrLength = narrationDisplay[0].length; // the length of the text array
var iScrollAt = 10; // start scrolling up at this many lines

var destination;

var iTextPos = 0; // initialise text position
var sContents = ''; // initialise contents variable
var iRow; // initialise current row    
var isFinished = false;

function typewriter()
{
    if (isFinished) return;
    sContents =  ' ';
    iRow = Math.max(0, iIndex-iScrollAt);  

    while ( iRow < iIndex ) 
    {
        sContents += narrationDisplay[iRow++] + '<br />';
    }
    destination.innerHTML = sContents + narrationDisplay[iIndex].substring(0, iTextPos) + "|";
    if ( iTextPos++ == iArrLength ) 
    {
        iTextPos = 0;
        iIndex++;
        if (iIndex != narrationDisplay.length) 
        {
            startNextLine();
        }
        else
        {
            isFinished = true;
            finishChoice();
        }
    } 
    else 
    {
        setTimeout(typewriter, iSpeed);
    }
}

function resetTypeWriter(newText)
{
    var oldText = new Array();
    //convert written text back into an array of text
    for (let i = 0; i < iIndex; i ++) //grabs the wrong rows of strings. Draw it out and you'll
    {
        oldText.push(narrationDisplay[i]);
    }
    //second time around, iIndex is still 1, therefore pulling the same information
    if (!isFinished)
    {
        oldText.push(narrationDisplay[iIndex].substring(0, iTextPos - 1) + "-"); //minus one to get rid of the cusor
        iIndex++;
    }
    else
    {        
        setTimeout(typewriter, iSpeed);
    }
    
    //add new text to the end of that array
    narrationDisplay = oldText.concat(newText);
    //increment row counter to start typing at that spot
    
    iTextPos = 0;
    iArrLength = narrationDisplay[iIndex].length;
    isFinished = false;
    //startNextLine();
}

function setDestination(destinLocation)
{
    destination = destinLocation;
}

function startNextLine()
{
    iArrLength = narrationDisplay[iIndex].length;
    setTimeout(typewriter, 500);
}

function setPauseState(pauseState)
{
    isFinished = pauseState;
    
    if (!pauseState)
         typewriter();
}