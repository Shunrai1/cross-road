// 引入 Experience 单例和常量
import { GENERATION_COUNT } from '../constants.js';
import Experience from '../experience.js';
import Car from './Car.js';
import Grass from './Grass.js';
import ItemManager from './ItemManager.js';
import metaData from './metaData.js';
import Road from './Road.js';
import generateMetaRows from './tool.js';
import Tree from './Tree.js';

export default class Map {
  constructor() {
    // 获取 Experience 单例
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.debug = this.experience.debug;
    this.rowIndex = 0;

    // 地图元数据（深拷贝，避免全局污染）
    this.metadata = JSON.parse(JSON.stringify(metaData));
    // 存储所有地图tile的3D对象
    this.tiles = [];
    // 存储草地对象
    this.grassRows = [];
    // 存储树对象
    this.treeRows = [];
    // 存储道路对象
    this.roadRows = [];
    // 存储车辆对象
    this.carRows = [];
    // 新增：行号到车辆mesh数组的映射
    this.carMeshDict = {};
    // 新增：道具管理器
    this.itemManager = new ItemManager();
    // 初始化地图
    this.initializeMap();

    // Debug 面板
    if (this.debug.active) {
      this.debugInit();
    }
  }

  // 初始化地图内容
  initializeMap() {
    // 重置 rowIndex
    this.rowIndex = 0;
    this.addGrassRow(-5);
    this.addGrassRow(-4);
    this.addGrassRow(-3);
    this.addGrassRow(-2);
    this.addGrassRow(-1);
    this.addGrassRow(0);
    // 使用 forEach 遍历所有行
    this.metadata.forEach((rowData) => {
      this.rowIndex++;
      // 如果是森林行，添加树
      if (rowData && rowData.type === 'forest') {
        // 先生成草地
        this.addGrassRow(this.rowIndex);
        this.addTreeRow(rowData.trees, this.rowIndex);
      }
      if (rowData && rowData.type === 'road') {
        this.addRoadRow(this.rowIndex);
        this.addCarRow(
          rowData.vehicles,
          this.rowIndex,
          rowData.direction,
          rowData.speed
        );
      }
      // 新增：生成道具
      if (rowData.items && rowData.items.length > 0) {
        this.itemManager.addItems(rowData.items, this.rowIndex);
      }
    });
  }

  // 添加一行草地
  addGrassRow(rowIndex = 0) {
    const grass = new Grass(this.scene, this.resources.items.grass, rowIndex);
    this.grassRows.push(grass);
    this.tiles.push(...grass.tiles);
  }

  // 添加一行树
  addTreeRow(trees, rowIndex) {
    const treeRow = new Tree(this.scene, this.resources, trees, rowIndex);
    this.treeRows.push(treeRow);
  }

  // 添加一行道路
  addRoadRow(rowIndex = 0) {
    const road = new Road(this.scene, this.resources, rowIndex);
    this.roadRows.push(road);
  }

  // 添加一行车辆
  addCarRow(vehicles, rowIndex = 0, direction = false, speed = 1) {
    const carRow = new Car(
      this.scene,
      this.resources,
      vehicles,
      rowIndex,
      direction,
      speed
    );
    this.carRows.push(carRow);
    // 新增：记录每行车辆mesh
    this.carMeshDict[rowIndex] = carRow.getCarMeshes();
  }
}
