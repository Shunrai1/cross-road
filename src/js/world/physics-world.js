import CANNON from 'cannon'

import Experience from '../experience.js'

export default class PhysicsWorld {
  constructor(gravity = 9.81) {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.world = new CANNON.World()
    this.deltaTime = this.experience.time.delta
    // this.world.gravity.set(0, -gravity, 0);
    this.world.gravity.set(0, -gravity, 0)
  }

  update() {
    //     这是物理引擎的**“心跳”**。
    // - 1 / 60 ：期望的物理帧率（每秒 60 次计算）。
    // - this.deltaTime ：实际经过的时间（从上一帧到现在过了多久）。
    // - 3 ：最大子步数（如果电脑卡了，一帧时间很长，为了追赶进度，最多允许额外计算 3 次，防止死循环卡死）。
    // - 作用 ：在每一帧渲染前，物理引擎会根据这些参数，算出所有物体在这一瞬间应该运动到哪里、撞到了谁、反弹到哪里
    this.world.step(1 / 60, this.deltaTime, 3)
  }
}
