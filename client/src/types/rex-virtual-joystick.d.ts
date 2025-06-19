// types/rex-virtual-joystick.d.ts
/*  Precise typings for rexVirtualJoystick plugin  */

import type Phaser from 'phaser';
import type VirtualJoyStick from 'phaser3-rex-plugins/plugins/virtualjoystick';

export interface VirtualJoystickPlugin extends Phaser.Plugins.BasePlugin {
  add(
    scene: Phaser.Scene,
    config?: Record<string, unknown>,
  ): VirtualJoyStick;
}

declare global {
  namespace Phaser {
    namespace Plugins {
      interface BasePluginMap {
        rexVirtualJoystick: VirtualJoystickPlugin;
      }
    }
  }
}
