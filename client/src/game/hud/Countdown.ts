// client/src/game/hud/Countdown.ts
/* path: client/src/game/hud/Countdown.ts */

import HudComponent from './HudComponent';
import { getCurrentServer, getServer } from '@/ServerList';

/* == constants & types == */
const VISIBLE_THRESHOLD = 600; // seconds, 10 min

interface CycleInfo {
  epochIso: string; // ISO-8601 anchor
  period: number; // seconds
  tz: string;
}

interface ServerInfoResp {
  isRaceServer: boolean;
  cycleInfo?: CycleInfo;
}

/* == Countdown HUD component== */
class Countdown extends HudComponent {
  /* == state == */
  private remain = Infinity; // seconds left
  private anchorMs = 0; // UTC ms anchor
  private periodMs = 30 * 60 * 1000; // default 30 min

  private text!: Phaser.GameObjects.Text;
  private timerEvt?: Phaser.Time.TimerEvent;

  private localVisible = false; // α tween state
  private raceServer = false; // from /serverinfo

  /* == init == */
  override async initialize() {
    /* build UI container */
    const cam = this.game.cameras.main;
    this.container = this.game.add.container(cam.centerX, cam.height * 0.15);
    this.text = this.game.add
      .text(0, 0, '--:--', {
        fontFamily: 'Arial',
        fontSize: '64px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 6,
      })
      .setOrigin(0.5);

    this.container.add(this.text);
    this.container.setAlpha(0);
    this.hud.add(this.container);

    await this.syncServerTime();

    if (!this.raceServer) {
      super.setShow(false, true);
      return;
    }

    this.updateRemain();
    this.updateText();
    this.updateLocalVisibility();
  }

  /* == lifecycle hooks == */
  override resize() {
    const cam = this.game.cameras.main;
    this.container.setPosition(cam.centerX, cam.height * 0.15);
  }

  override setShow(show: boolean, force = true) {
    if (!this.raceServer) return;
    super.setShow(show, force);
    if (show) this.startTimer();
    else this.stopTimer();
  }

  /* == server sync == */
  private async syncServerTime() {
    try {
      let srv = getCurrentServer() ?? (await getServer());
      if (!srv) throw new Error('No server selected');

      const url = `${globalThis.location.protocol}//${srv.address}/serverinfo?${Date.now()}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(res.statusText);

      const js: ServerInfoResp = await res.json();
      // this.raceServer = js.isRaceServer;

      if (!js.cycleInfo) return;

      this.raceServer = true;
      this.anchorMs = Date.parse(js.cycleInfo.epochIso);
      this.periodMs = js.cycleInfo.period * 1000;
    } catch (e) {
      console.error('Countdown sync failed', e);
    }
  }

  /* == timer control == */
  private startTimer() {
    if (this.timerEvt) return; // already running
    this.timerEvt = this.game.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => {
        this.updateRemain();
        this.updateText();
        this.updateLocalVisibility();

        if (this.remain === 0) {
          this.hud.scene.events.emit('countdownEnd');
          this.anchorMs += this.periodMs; // roll forward
        }
      },
    });
  }

  private stopTimer() {
    this.timerEvt?.remove(false);
    this.timerEvt = undefined;
  }

  /* == helpers == */
  private updateRemain() {
    if (!this.raceServer) {
      this.remain = Infinity;
      return;
    }
    const now = Date.now();
    const diff = (now - this.anchorMs) % this.periodMs;
    const left = this.periodMs - diff;
    this.remain = Math.floor(left / 1000);
  }

  private updateText() {
    const mm = String(Math.floor(this.remain / 60)).padStart(2, '0');
    const ss = String(this.remain % 60).padStart(2, '0');
    this.text.setText(`${mm}:${ss}`);
  }

  private updateLocalVisibility() {
    const wantVisible = this.remain <= VISIBLE_THRESHOLD;

    if (wantVisible === this.localVisible) return;
    this.localVisible = wantVisible;

    /* tween α */
    this.game.add.tween({
      targets: this.container,
      alpha: wantVisible ? 1 : 0,
      duration: 300,
      onComplete: () => {
        if (wantVisible) this.startTimer();
        else this.stopTimer();
      },
    });
  }
}

export default Countdown;
