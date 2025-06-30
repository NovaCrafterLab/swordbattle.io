// client/src/game/hud/Countdown.ts
/* path: client/src/game/hud/Countdown.ts */

import HudComponent from './HudComponent';
import { getCurrentServer, getServer } from '@/ServerList';

const VISIBLE_THRESHOLD = 600; // 10 min

interface CycleInfo {
  epochIso: string;  // ISO-8601 anchor
  period  : number;  // seconds
  tz      : string;
}

class Countdown extends HudComponent {
  /* == state == */
  private remain   = 600;           // seconds
  private anchorMs = 0;             // UTC ms
  private periodMs = 30 * 60 * 1000;
  private text    !: Phaser.GameObjects.Text;

  private timerEvt?: Phaser.Time.TimerEvent;
  private started  = false;

  /* == init == */
  async initialize() {
    const cam = this.game.cameras.main;

    this.container = this.game.add.container(cam.centerX, cam.height * 0.15);
    this.text = this.game.add
      .text(0, 0, '--:--', {
        fontFamily: 'Arial',
        fontSize  : '64px',
        color     : '#ffffff',
        stroke    : '#000000',
        strokeThickness: 6,
      })
      .setOrigin(0.5);

    this.container.add(this.text);
    this.container.setAlpha(0);
    this.hud.add(this.container);

    await this.syncServerTime();
    this.refreshVisibility();
  }

  /* == public == */
  override setShow(show: boolean, force = true) {
    super.setShow(show, force);

    if (show && !this.started) this.startTimer();
    else if (!show && this.started) this.stopTimer();
  }

  resize() {
    const cam = this.game.cameras.main;
    this.container.setPosition(cam.centerX, cam.height * 0.15);
  }

  update() {/* noop */ }

  /* == sync == */
  private async syncServerTime() {
    try {
      let srv = getCurrentServer();
      if (!srv) srv = await getServer();
      if (!srv) throw new Error('No server selected');

      const url = `${globalThis.location.protocol}//${srv.address}/serverinfo?${Date.now()}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(res.statusText);

      const js   = await res.json();
      const info: CycleInfo | undefined = js.cycleInfo;
      if (!info) { this.remain = Number.MAX_SAFE_INTEGER; return; }

      this.anchorMs = Date.parse(info.epochIso);
      this.periodMs = info.period * 1000;

      this.updateRemain();
      this.text.setText(this.formatTime(this.remain));
    } catch (e) {
      console.error('Countdown sync failed', e);
      this.remain = Number.MAX_SAFE_INTEGER;
    }
  }

  /* == timer == */
  private startTimer() {
    this.stopTimer();
    this.started = true;

    this.timerEvt = this.game.time.addEvent({
      delay: 1000,
      loop : true,
      callback: () => {
        this.updateRemain();
        this.text.setText(this.formatTime(this.remain));

        if (this.remain === 0) {
          this.hud.scene.events.emit('countdownEnd');

          this.anchorMs += this.periodMs;
          this.updateRemain();
          this.refreshVisibility();
        }
      },
    });
  }

  private stopTimer() {
    this.timerEvt?.remove(false);
    this.timerEvt = undefined;
    this.started  = false;
  }

  /* == util == */
  private updateRemain() {
    const now    = Date.now();
    const diff   = (now - this.anchorMs) % this.periodMs;
    const leftMs = this.periodMs - diff;
    this.remain  = Math.floor(leftMs / 1000);
  }

  private refreshVisibility() {
    const shouldShow = this.remain <= VISIBLE_THRESHOLD;
    this.setShow(!shouldShow, /* force = */ false);
  }

  private formatTime(sec: number) {
    const s  = Math.max(0, sec);
    const mm = Math.floor(s / 60).toString().padStart(2, '0');
    const ss = (s % 60).toString().padStart(2, '0');
    return `${mm}:${ss}`;
  }
}

export default Countdown;
