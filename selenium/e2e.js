const {By, Builder, until} = require('selenium-webdriver');
const assert = require("assert");

async function createPlayer(playerName){
  let player = await new Builder().forBrowser('chrome').build();
  await player.get('http://localhost:3000');
  
  await player.manage().setTimeouts({implicit: 2000});
  await player.findElement(By.tagName('button')).click();

  let name_field = await player.findElement(By.id("input_name"));
  await name_field.click();
  await player.actions().sendKeys(name_field, playerName).perform();

  return player
}

async function createTable(player, tableName,numberOfPlayers){
  await player.findElement(By.id("btn_create")).click();
  let min_players = await player.findElement(By.id("input_min_players"));
  await player.actions().sendKeys(min_players, String(numberOfPlayers)).perform();
  let input_tableName = await player.findElement(By.id("input_tableName"));
  await player.actions().sendKeys(input_tableName, tableName).perform();
  await player.findElement(By.id("btn_create")).click();
}

async function joinTable(player, tableName){
  await player.findElement(By.id("btn_join")).click();
  let table_name = await player.findElement(By.id("input_table_name"));
  await player.actions().sendKeys(table_name, tableName).perform();
  let joinbutton = await player.findElement(By.id("btn_join"));
  await joinbutton.click();
}

function runGame(noOfPlayers, tableName){
  return new Promise(async (res) => {
    let players = [];
    let player;
    for(let i=0; i<noOfPlayers; i++){
      player = await createPlayer("Player "+String(i));
      players.push(player);
    }
    await createTable(players[0], tableName, noOfPlayers);

    for(let i=1; i<noOfPlayers; i++){
      await joinTable(players[i], tableName)
    }

    let dropArea;
    let actions;
    let playerCards;
    let btn;
    let playerToFinish = 0;
    let roundOngoing=true;
    while(roundOngoing){
      for(let i = 0; i<noOfPlayers; i++){
        playerCards = await players[i].findElements(By.className("card"));
        try{
          let h1 = await players[i].findElement(By.tagName("h1"));
          let text = await h1.getText();
          roundOngoing = false;
          console.log(text)
        }catch(e){
          console.log("Ein Fehler trat auf.")
        }
        if(playerCards.length > 0 && playerToFinish == i){
          actions = players[i].actions({async: true});
          dropArea = await players[i].findElement(By.id("dropArea"));
          await actions.dragAndDrop(playerCards[Math.round(playerCards.length/2)], dropArea).perform();
          playerCards = await players[i].findElements(By.css("#cardFan .card"));
          console.log(playerCards)
          if(playerCards.length == 0){
            console.log("Updated player to finish")
            playerToFinish++;
          }
        }else if(playerToFinish != i){
          try{
            btn = await players[i].findElement(By.css("button"));
            await btn.click()
          }catch(e){
            console.log("Could not find button")
          }
          
        }
        console.log("playerTofinish: ", playerToFinish)
      }
    }
  })
  
}

(async function firstTest() {
  let player1;
  let player2;
  
  try {
    let a = runGame(3,"table")
    let b = runGame(4,"table2")

    await Promise.all([a,b])
  } catch (e) {
    console.log(e)
  } finally {
    await player1.quit();
    await player2.quit();
  }
}())