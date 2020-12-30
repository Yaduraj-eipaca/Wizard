# JS-platformer
A platformer game written in JavaScript for the "Daj się poznać" competition. early development prototype.

Known Bugs:

- FIXED! When crouching on an edge of a platform, the player falls through it.
- being on a moving platform that goes up to a regular one, pushes the player off the platform.
- when player is idle while on the ladder for some time and finally gets off he is falling with great velocity.
- when game state is closed, the arrows, are not removed from the game.
- FIXED! when changing spell type, while shooting, the exisitng missiles start behaving like the ones player has just changed to.
- killing an enemy generates an error in the blockRect method. Sometimes leads to funny behaviour (objects falling through platforms for example)

Things I need to do:

- move platform types into separate modules
