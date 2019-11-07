"use strict"   

var currentChoice;
var currentChoiceUI;
var tick;

var isPaused = false;  

$(document).ready(function() {    
    
    class Spawner //a holder of a choice that appear on screen
    {
        constructor(element)
        {
           this.element = element;
           this.innerElement = element[0];
        }
        
        set choice(newChoice)
        {
            this.heldChoice = newChoice;
            this.display = newChoice.choiceToString;
            this.fadeInSpeed = newChoice.fadeInSpeed;
            this.fadeOutSpeed = newChoice.fadeOutSpeed;
            this.fadeInPercent = newChoice.fadeInPercent;
        }

       set display(text)
       {
           var modifyingElement = this.innerElement;
           modifyingElement.value =  text;    
           var length = text.length;
           modifyingElement.rows = 1;

           if (length < 40)
           {
               modifyingElement.cols = length;
           }    	
           else
           {
               modifyingElement.cols = 40;
               modifyingElement.rows++;
           }              
       }

       get id()
       {
           return this.innerElement.id;
       }

       initHover()
       {
         var reference = this;
           //convert this to on mouse over. mouse off is overwritten
         this.element.hover(
         function() //on mouse over
         {
           $(this).stop(true);
           $(this).fadeOut({
             duration: reference.fadeOutSpeed,
             //this is where the spawner gets reset
             done: function resetDoubt()
             {
                 unusedSpawners.push(reference);
                 unusedSpawners = shuffle(unusedSpawners);
                 activeSpawners = activeSpawners.filter(item => item !== this.id);
                 choicesToThoughtsMap.get(reference.parentChoice.choiceKey).push(reference.heldChoice);
                 $(this).off("mouseleave");
             }
           });
         },
         function() //off mouseover
         {
           $(this).stop(true);
           $(this).fadeIn({
               duration: reference.fadeInSpeed               
           });
         });
       }
        
        performFade()
        {
            var reference = this;
            this.element.fadeTo(this.fadeInSpeed, this.fadeInPercent, function()
            {
                if (reference.fadeInPercent === 1)
                {
                    hitFocus(reference.heldChoice);
                }                
            });
        }
    }
    
    var maps = createChoice();
    
    var choiceMap = maps.choiceMap;
    var choicesToThoughtsMap = maps.choicesToThoughtMap;
    
    initUI();      

    setUpChoice(choiceMap.get("intro"));
    narrationDisplay = currentChoice.description;
    startNextLine();    

       //btn settings
    $("#pauseBtn").click(function()
    {  
        isPaused = !isPaused;
        setPauseState(isPaused);
        if (!isPaused)
        {
           for (let spawner of activeSpawners) 
           {
               spawner.initHover();

               if (spawner.element.css("opacity") < 1)
               {
                  spawner.performFade();
               }  
           }

           tick = setInterval(spawnThought, spawnFreq);
        }
        else
        {
           for (let spawner of activeSpawners) {
               spawner.element.stop();
               spawner.element.off("mouseleave");
               spawner.element.off("mouseenter");
           }

           clearInterval(tick);
        }      

        return;
    });   

    var unusedSpawners = createAllSpawners();
    unusedSpawners = shuffle(unusedSpawners);
    var activeSpawners = [];
   
    function createAllSpawners()
    {
       let allSpawners = [];    
       let spawners = $(".spawner");  

       for(let i = 1; i <= spawners.length; i++)
         {
             let doubt = new Spawner($("#spawner" + i));
             doubt.initHover();
             allSpawners.push(doubt);         
         }    

       return allSpawners;
    }    
   
    function spawnThought()
    { 
        //grap the needed information about the .doubt we're working with        
        let spawner = unusedSpawners.pop();
        if (spawner === undefined) return;

        activeSpawners.push(spawner);
        spawner.parentChoice = currentChoice; 

        //set up the element's physical state    
        var popUpThoughtsArray = choicesToThoughtsMap.get(currentChoice.choiceKey);

        if (popUpThoughtsArray === undefined || popUpThoughtsArray.length <= 0)
         return;    

        spawner.choice = popUpThoughtsArray.pop();
        choicesToThoughtsMap.set(currentChoice.choiceKey, popUpThoughtsArray);      

        spawner.performFade();
       //see if we can merge this with the init function - can't, because we remove the fade in
        spawner.element.mouseleave(function()
        {
            $(this).stop(true);
            spawner.performFade();
        });     
    }   
    function hitFocus(nextChoice)
    {
        let previousChoice = currentChoice;
        clearInterval(tick);
        clearAllSpawners();
        setUpChoice(nextChoice);

        if(!previousChoice.isFinished)
        {
            currentChoice.description.unshift(previousChoice.transLine); //add transition line to the text display
        }

        resetTypeWriter(currentChoice.description); //reset narration's typing       
    }

    function setUpChoice(choice)
    {            
        currentChoice = choice;
        currentChoiceUI.innerHTML = currentChoice.choiceToString;//update the UI for the current focused one

        setTimeout(function()
        {
            tick = setInterval(spawnThought, currentChoice.spawnFreq);
        }, currentChoice.choiceTransitionTime);  
    }
    
    function clearAllSpawners()
    {
        for (let spawner of activeSpawners) 
        {
            var that = spawner;
            spawner.element.stop();
            spawner.element.off("mouseleave");
            spawner.element.off("mouseenter");
            spawner.element.fadeOut(spawner.fadeOutSpeed, function resetDoubt()
             {
                 unusedSpawners.push(that);
                 unusedSpawners = shuffle(unusedSpawners);
                 activeSpawners = activeSpawners.filter(item => item !== that.id);
                 choicesToThoughtsMap.get(that.parentChoice.choiceKey).push(that.heldChoice);
                 $(this).off("mouseleave");
             });            
        }
    }

});
   //to do:
    //when the current thought changes, all other choices that were in the process of fading in fade out and the current thought disppaears (3)
        //how about adding the fadeOut effect onto everything in the active spawner array    
function initUI()
{
    currentChoiceUI = document.getElementById("currentTopic");
    setDestination(document.getElementById("story"));  
}

function shuffle(array) 
{
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) 
    {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function finishChoice()
{
    currentChoice.hasFinished();
}