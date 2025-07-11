// client/src/game/hud/EvolutionSelect.ts
import HudComponent from './HudComponent';
import { Evolutions } from '@/game/Evolutions';
// import { config } from '@/config';
import logger from '@/utils/logger';

class EvolutionSelect extends HudComponent {
  spritesContainer: Phaser.GameObjects.Container | null = null;
  hideButton: Phaser.GameObjects.Text | null = null;
  spriteSize = 125;
  indent = 50;
  minimized = false;
  updateList = false;

  initialize() {
    if (!this.hud.scene) return;

    this.hideButton = this.hud.scene.add
      .text(0, -170, 'Evolutions', {
        fontSize: 22,
        fontStyle: 'bold',
        stroke: '#000',
        strokeThickness: 5,
      })
      .setOrigin(0.5)
      .setVisible(false)
      .setInteractive()
      .on('pointerdown', () => this.toggleMinimize());

    this.spritesContainer = this.hud.scene.add.container(0, -70);
    this.container = this.hud.scene.add.container(0, 0, [
      this.spritesContainer,
      this.hideButton,
    ]);
    this.hud.add(this.container);
  }

  resize() {
    if (!this.container) return;
    this.container.x = this.game.scale.width / 2;
    this.container.y = 200 * this.scale;
  }

  toggleMinimize() {
    this.minimized = !this.minimized;

    this.hud.scene!.tweens.add({
      targets: this.spritesContainer,
      alpha: this.minimized ? 0 : 1,
      y: this.minimized ? -140 : -70,
      duration: 250,
    });
  }

  selectEvolution(type: any) {
    this.game.gameState.selectedEvolution = type;
    this.game.gameState.self.entity!.possibleEvolutions = {};
    this.updateList = true;
  }

  update() {
    const player = this.game.gameState.self.entity;
    if (!this.container || !this.spritesContainer || !player) return;

    if (this.updateList) {
      this.spritesContainer.removeAll(true);

      // guard: ensure evolutions data exist
      if (!player.possibleEvolutions) return;

      const count = Object.keys(player.possibleEvolutions).length;

      // abnormal state—log and exit
      if (!this.container || !this.hideButton) {
        logger.error('EvolutionSelect: container or hideButton is null');
        return;
      }

      const alpha = 0.8;

      /* ----- container visibility ----- */
      if (count === 0 && this.container.visible) {
        this.hud.scene!.tweens.add({
          targets: this.container,
          alpha: 0,
          duration: 1000,
          onComplete: () => this.container?.setVisible(false),
        });
      } else if (
        count !== 0 &&
        (!this.container.visible || this.container.alpha < 1)
      ) {
        this.container.setVisible(true).setAlpha(0);
        this.hud.scene!.tweens.add({
          targets: this.container,
          alpha: 1,
          duration: 1000,
          onComplete: () => {
            this.container?.setAlpha(1);
            this.container?.setVisible(true);
          },
        });
      }

      /* ----- hideButton visibility ----- */
      if (count === 0 && this.hideButton.visible) {
        this.hud.scene!.tweens.add({
          targets: this.hideButton,
          alpha: 0,
          duration: 1000,
          onComplete: () => this.hideButton?.setVisible(false),
        });
      } else if (
        count !== 0 &&
        (!this.hideButton.visible || this.hideButton.alpha < 1)
      ) {
        this.hideButton.setVisible(true).setAlpha(0);
        this.hud.scene!.tweens.add({
          targets: this.hideButton,
          alpha: 1,
          duration: 1000,
          onComplete: () => {
            this.hideButton?.setAlpha(1);
            this.hideButton?.setVisible(true);
          },
        });
      }

      /* ----- build evolution choices ----- */
      let i = 0;
      for (const evol in player.possibleEvolutions) {
        i += 1;
        const evolution = Evolutions[evol];

        const body = this.hud.scene.add
          .sprite(0, 0, this.game.gameState.self.entity!.skinName + 'Body')
          .setOrigin(0.5);

        const overlay = this.hud.scene.add
          .sprite(0, 0, evolution[1])
          .setOrigin(evolution[3][0], evolution[3][1]);
        overlay.setScale((body.width / overlay.width) * evolution[2]);

        const container = this.hud.scene.add
          .container((this.spriteSize + 50) * (i - (count + 1) / 2), 0, [
            body,
            overlay,
          ])
          .setScale(this.spriteSize / body.height)
          .setAlpha(alpha);

        const text = this.hud.scene.add
          .text(0, 0, evolution[0], {
            fontSize: 40,
            fontStyle: 'bold',
            stroke: '#000',
            strokeThickness: 6,
          })
          .setAlpha(alpha);

        body
          .setInteractive()
          .on('pointerover', () => {
            container.setAlpha(1);
            text.setAlpha(1);
          })
          .on('pointerout', () => {
            container.setAlpha(alpha);
            text.setAlpha(alpha);
          })
          .on('pointerdown', () => this.selectEvolution(evol));

        container.add(text);
        Phaser.Display.Align.In.BottomCenter(text, body, 0, 40);
        this.spritesContainer.add(container);
      }

      this.updateList = false;
      logger.debug('EvolutionSelect list updated, count:', count);
    }
  }
}

export default EvolutionSelect;
