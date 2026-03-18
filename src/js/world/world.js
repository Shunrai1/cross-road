import * as THREE from 'three'

import TextMesh from '../components/text-mesh.js'
import { CLOCK_EFFECT_DURATION_MS, SHEID_EFFECT_DURATION_MS, SHOE_EFFECT_DURATION_MS, SUPABASE_TABLE, ZONGZI_EFFECT_DURATION_MS } from '../constants.js'
import Experience from '../experience.js'
import { showItemDom, showItemEffectMask } from '../utils/itemUi.js'
import { supabase } from '../utils/supabase.js'
import Environment from './environment.js'
import { ITEM_TYPES } from './ItemManager.js'
