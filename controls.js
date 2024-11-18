import * as THREE from './libs/three.module.js';

export class ControlManager{

    constructor(params){

        this.animationManager=params.animationManager;
        this.player=params.player;
        this.playerPos=this.player.getCharacterPosition();

        this.InitInput();

    }

    InitInput() {

        this.keys_ = {
          spacebar: false,
          arrowR_d: false,
          arrowL_a: false,
        };

        this.oldKeys = {
          ...this.keys_
        };

        document.addEventListener('keydown', (e) => this.OnKeyDown_(e), false);
        document.addEventListener('keyup', (e) => this.OnKeyUp_(e), false);
    }

    OnKeyDown_(event) {

        switch (event.keyCode) {
          //spacebar
          case 32:
            this.keys_.spacebar = true;
            break;

            //right arrow or d
          case 39:
          case 68:
            this.keys_.arrowR_d = true;
            break;

            //left arrow or a
          case 37:
          case 65:
            this.keys_.arrowL_a = true;
            break;

          default:
          break;
        }

    }

    OnKeyUp_(event) {

        switch (event.keyCode) {
          case 32:
            this.keys_.spacebar = false;
            break;

          case 39:
          case 68:
            this.keys_.arrowR_d = false;
            break;

            //left arrow or a
          case 37:
          case 65:
            this.keys_.arrowL_a = false;
            break;
        }
    }

    Update(timeElapsed) {

        if (!this.keys_.spacebar && !this.animationManager.getJumpingFlag()){

            if(!this.animationManager.getRunnintFlag()){
                this.animationManager.startRunning();
            }

            if (this.keys_.arrowR_d) {

                switch (this.playerPos.x) {

                    case 0:
                        this.animationManager.rightDashTo2();
                    break;

                    case -2:
                        this.animationManager.rightDashTo0();
                    break;

                    default:
                    break;
                }
            }
            else if (this.keys_.arrowL_a) {

                switch (this.playerPos.x) {

                    case 0:
                        this.animationManager.leftDashToMinus2();
                    break;

                    case 2:
                        this.animationManager.leftDashTo0();
                    break;

                    default:
                    break;
                }
            }
        }

        else if (this.keys_.spacebar && !this.animationManager.getJumpingFlag()) {
          this.animationManager.stopRunning();
          this.animationManager.jumpAnimation();
        }

    }
}
