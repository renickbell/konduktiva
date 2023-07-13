//--------------------------------------------------------------------------
//-- defaultSuperDirtPlayers-revised.js
//-- Wed Feb  2 07:20:11 PM JST 2022
//--------------------------------------------------------------------------

// change this path to the path on your computer
//let superDirtSamplesPath = "/home/renick/.local/share/SuperCollider/downloaded-quarks/Dirt-Samples/"
samples4 = buildSampleArray (superDirtSamplesPath)

e.players.kick = new Player("kick")
e.players.snare = new Player("snare")
e.players.perc = new Player("perc")
e.players.hat = new Player("hat")
e.players.sub = new Player("sub")
e.players.stab1 = new Player("stab1")
e.players.stab2 = new Player("stab2")
e.players.atmo = new Player("atmo")

e.players.kick.rhythmMap = "straight";
e.players.snare.rhythmMap = "straight";
e.players.perc.rhythmMap = "straight";
e.players.hat.rhythmMap = "straight";
e.players.sub.rhythmMap = "straight";
e.players.stab1.rhythmMap = "straight";
e.players.stab2.rhythmMap = "straight";
e.players.atmo.rhythmMap = "straight";

e.players.atmo.densityGraph = "defaultTechno";

e.players.kick.samplePattern = "kick"
e.players.snare.samplePattern = "snare";
e.players.perc.samplePattern = "perc";
e.players.hat.samplePattern = "hat";
e.players.sub.samplePattern = "sub";
e.players.stab1.samplePattern = "stab1";
e.players.stab2.samplePattern = "stab2";
e.players.atmo.samplePattern = "atmo";

{
e.players.kick.action = "superDirt"
e.players.snare.action = "superDirt";
e.players.perc.action = "superDirt";
e.players.hat.action = "superDirt";
e.players.sub.action = "superDirt";
e.players.stab1.action = "superDirt";
e.players.stab2.action = "superDirt";
e.players.atmo.action = "superDirt";
    }


e.players.atmo.densityGraph = 'sparse';

{
e.players.kick.cut = pick([0,1,1,2]) 
e.players.snare.cut = pick([3,4]) 
e.players.perc.cut = pick([5,6]) 
e.players.hat.cut = pick([7]) 
e.players.sub.cut = pick([8,8,8]) 
e.players.stab1.cut = pick([9,9,10]) 
e.players.stab2.cut = pick([9,9,10]) 
e.players.atmo.cut = pick([11,11,12]) 
e.players.atmo.cut = 11 
    }

