/*

ObsGroup.js
creates either a row or column of obs which can be retrieved later
and used to calculate collisions or distance to objects in the group only,
as opposed to calculating distance to every obstacle in play.

*/


// obsgroup(dir)
//
// creates new group. accepts direction (horizontal or vertical)

function ObsGroup(dir){
  this.direction = dir;
  this.pos = [];
}

// addnew()
//
// add a new obstacle and save its x or y pos, depending on group direction.

ObsGroup.prototype.addNew = function(obs){
  // if group is a row
  if(this.direction ===0){
    this.pos.push(obs.x);
  }
  // if group is a column
  if(this.direction ===1){
    this.pos.push(obs.y);
  }
}
