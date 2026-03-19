import * as THREE from 'three'

import TextMesh from '../components/text-mesh.js'
import { CLOCK_EFFECT_DURATION_MS, SHEID_EFFECT_DURATION_MS, SHOE_EFFECT_DURATION_MS, ZONGZI_EFFECT_DURATION_MS } from '../constants.js'
import Experience from '../experience.js'
import { showItemDom, showItemEffectMask } from '../utils/itemUi.js'
import Environment from './environment.js'
import { ITEM_TYPES } from './ItemManager.js'
import Map from './Map.js'
import { debounce } from './tool.js'
import User from './User.js'

export default class World {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.camera = this.experience.camera
    this.resources = this.experience.resources

    // 游戏结束防抖标志
    this.isGameOver = false

    // 上传分数方法防抖
    this.uploadScore = debounce(this.uploadScore.bind(this), 1000)

    // 资源加载完成后初始化世界
    this.resources.on('ready', () => this.initializeWorld())
  }

  // 初始化方法，拆分各部分初始化逻辑
  initializeWorld() {
    this.setupSceneComponents()
    this.setupEventListeners()
  }

  // 场景组件初始化
  setupSceneComponents() {
    // 初始化环境、地图、用户
    this.environment = new Environment()
    this.map = new Map()
    this.user = new User()
    this.itemManager = this.map.itemManager
    // 相机和光照跟随用户
    this.user.agentGroup.add(this.camera.instance)
    this.user.agentGroup.add(this.environment.sunLight)

    // ===== 新增：添加 3D 文字到场景正后方 =====
    this.textMesh = new TextMesh({
      texts: ['Pass the Road'], // 可自定义内容
      position: new THREE.Vector3(0, 0.9, -6), // 场景正后方
      rotation: new THREE.Euler(0, 0, 0),
    })
  }

  // 事件监听初始化
  setupEventListeners() {
    // 监听游戏重启事件
    this.experience.on('restart', () => {
      this.onRestart()
    })

    // 监听道具拾取事件
    this.experience.on('itemCollected', (type) => {
      // 简单分数加成和提示
      let addScore = 0
      switch (type) {
        case ITEM_TYPES.RANDOM:
          addScore = 1
          break
        case ITEM_TYPES.SHOE:
          addScore = 2
          break
        case ITEM_TYPES.CLOCK:
          addScore = 3
          break
        case ITEM_TYPES.SHEID:
          addScore = 4
          break
        case ITEM_TYPES.ZONGZI:
          addScore = 5
          break
      }

      if (addScore > 0) {
        // 只触发 itemScore 事件
        this.experience.trigger('itemScore', [addScore])
        console.warn(`[道具] 拾取${type}道具，分数+${addScore}`)
      }
      else {
        console.warn(`[道具] 拾取${type}道具`)
      }

      // === 新增：道具遮罩效果 ===
      let duration = 0
      switch (type) {
        case ITEM_TYPES.SHOE:
          duration = SHOE_EFFECT_DURATION_MS
          this.user.setSpeedUp(true, SHOE_EFFECT_DURATION_MS)
          console.warn('[道具] 获得加速鞋，小鸡加速5秒')
          break
        case ITEM_TYPES.CLOCK:
          duration = CLOCK_EFFECT_DURATION_MS
          break
        case ITEM_TYPES.SHEID:
          duration = SHEID_EFFECT_DURATION_MS
          // 3秒无敌
          this.user.setInvincible(true, SHEID_EFFECT_DURATION_MS)
          // 可选：提示无敌状态
          console.warn('[道具] 获得无敌盾，小鸡无敌3秒')
          break
        case ITEM_TYPES.ZONGZI:
          duration = ZONGZI_EFFECT_DURATION_MS
          break
        default:
          duration = SHEID_EFFECT_DURATION_MS // 默认3秒
      }
      showItemDom(type, duration)
      showItemEffectMask(type, duration)
    })
  }

  update() {
    // 如果游戏已结束，直接返回，防止继续执行 update 逻辑
    if (this.map) {
      this.map.update()
      if (this.user && !this.isGameOver) {
        this.map.checkAndExtendMap(this.user.currentTile.z)
      }
    }
  }
}
