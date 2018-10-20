class Coodinate {
  /**
   *Creates an instance of Coodinate.
   * @param {Number} x
   * @param {Number} y
   * @memberof Coodinate
   */
  constructor(x, y) {
    this.x = x
    this.y = y
  }
  /**
   *
   *
   * @static
   * @param {Coodinate} a
   * @param {Coodinate} b
   * @memberof Coodinate
   */
  static distance(a, b) {
    const d = (a.x - b.x) ** 2 + (a.y - b.y) ** 2
    return d ** 0.5
  }
  /**
   * 座標をコピーします
   *
   * @static
   * @param {Coodinate} a コピーする座標
   * @returns
   * @memberof Coodinate
   */
  static copy(a) {
    return new Coodinate(a.x, a.y)
  }

  /**
   * 座標同士を引き算した結果を返します
   *
   * @static
   * @param {Coodinate} a
   * @param {Coodinate} b
   * @returns
   * @memberof Coodinate
   */
  static minus(a, b) {
    const r = new Coodinate(a.x, a.y)
    r.minus(b)
    return r
  }

  /**
   * 座標に数値を掛け算した座標を返します
   *
   * @static
   * @param {Coodinate} a
   * @param {Number} x
   * @memberof Coodinate
   */
  static mult(a, x) {
    const retval = new Coodinate(a.x * x, a.y * x)
    return retval
  }
  /**
   * 座標の平均値を返します
   * x, y それぞれについて平均が取られます
   *
   * @static
   * @param {[Coodinate]} list
   * @memberof Coodinate
   */
  static mean(list) {
    const retval = new Coodinate(0, 0)
    list.forEach(c => {
      retval.plus(c)
    })
    retval.multBy(1 / list.length)
    return retval
  }

  /**
   * ベクトルを正規化して L2 の意味で 1 に変換します
   *
   * @static
   * @param {Coodinate} x
   * @memberof Coodinate
   */
  static normalize(x) {
    const norm = Coodinate.distance(x, new Coodinate(0, 0))
    return Coodinate.mult(x, 1 / norm)
  }

  distanceBetween(a) {
    return Coodinate.distance(this, a)
  }
  /**
   *
   *
   * @param {Coodinate} a
   * @memberof Coodinate
   */
  plus(a) {
    this.x += a.x
    this.y += a.y
    return this
  }

  /**
   *
   *
   * @param {Coodinate} a
   * @memberof Coodinate
   */
  minus(a) {
    this.x -= a.x
    this.y -= a.y
    return this
  }

  multBy(r) {
    this.x *= r
    this.y *= r
    return this
  }

  norm() {
    return Coodinate.normalize(this)
  }
}

class AbstractObject {
  /**
   *Creates an instance of AbstractObject.
   * @param {Coodinate} initPosition
   * @param {Numbe} maxVerocity オブジェクトの最大速度
   * @memberof AbstractObject
   */
  constructor(initPosition, maxVerocity = 5) {
    this.position = initPosition
    this.verocity = new Coodinate(Math.random(), Math.random())
    this.acceleration = new Coodinate(0, 0)
    this.maxVerocity = maxVerocity
    this.history = []
    this.ratio = null
  }

  /**
   * 加速度を元に座標と速度を更新するメソッドです
   *
   * @param {Coodinate} newAcceleration
   * @memberof AbstractObject
   */
  update(newAcceleration) {
    this.acceleration = newAcceleration
    this.verocity.plus(this.acceleration)
    const vNorm = Coodinate.distance(this.verocity, new Coodinate(0, 0))
    this.ratio = vNorm

    if (this.maxVerocity < vNorm) {
      const ratio = this.maxVerocity / vNorm
      this.verocity = this.verocity.multBy(ratio)
    }
    this.position.plus(this.verocity)

    this.history.push(Coodinate.copy(this.position))
  }
}

/**
 * 魚の boid model
 *
 * @class Fish
 * @extends {AbstractObject}
 */
class Fish extends AbstractObject {
  static maxAccelerationNorm = 0.1
  static meanForceRatio = 0.7
  static dislikeForceRatio = 5.0
  static counter = 0

  /**
   * 魚のインスタンスを作成します
   * @param {Coodinate} initPosition
   * @param {number} [sakuteki=100] 魚が見える範囲です。この範囲内の魚に対して boid の3原則を適用します
   * @param {number} [dislikeDistance=20] この範囲内の魚からは遠ざかる動きをします.
   * @memberof Fish
   */
  constructor(initPosition, sakuteki = 100, dislikeDistance = 20) {
    super(initPosition)
    this.sakuteki = sakuteki
    this.dislikeDistance = dislikeDistance
    Fish.counter += 1
    this.id = Fish.counter
  }
  /**
   * 次のフレームでの自分の加速度(意志)を決定します
   *
   * @param {[Fish]} nearlyFishes
   * @memberof Fish
   */
  nextAcceleration(nearlyFishes) {
    // 近くに魚が居ない時加速しません
    if (nearlyFishes.length === 0) return new Coodinate(0, 0)

    const vList = nearlyFishes.map(f => f.verocity)
    const vMean = Coodinate.mean(vList)
    const pMean = Coodinate.mean(nearlyFishes.map(f => f.position))

    // 速度の平均値にどれぐらい合わせるかを計算 (法則2)
    const vDirection = Coodinate.minus(vMean, this.verocity)
      .norm()
      .multBy(Fish.meanForceRatio)

    // 中心に移動するちからのベクトルを計算 (法則3)
    const pDirection = Coodinate.minus(pMean, this.position).norm()

    let direction = pDirection.plus(vDirection)

    // 近すぎるおさかな
    const tooNearFishPositions = filterByDistance(
      nearlyFishes,
      this.position,
      this.dislikeDistance
    )

    if (tooNearFishPositions.length > 0) {
      const tooNearMeanPos = Coodinate.mean(
        tooNearFishPositions.map(f => f.position)
      )
      // 近すぎる魚からどのぐらい離れるかのベクトルを計算(法則1)
      const tooNearDirection = Coodinate.minus(tooNearMeanPos, this.position)
        .norm()
        .multBy(Fish.dislikeForceRatio)
      direction.minus(tooNearDirection)
    }

    return Coodinate.normalize(direction).multBy(Fish.maxAccelerationNorm)
  }
}

/**
 * viewFrom から特定の距離離れた魚のみを返す関数
 *
 * @param {[AbstractObject]} fishes
 * @param {Coodinate} viewFrom
 * @param {number} maxDistance
 * @returns
 */
function filterByDistance(fishes, viewFrom, maxDistance) {
  return fishes.filter(fish => {
    const d = Coodinate.distance(fish.position, viewFrom)
    return d < maxDistance
  })
}

/**
 * 魚を泳がせるフィールドクラス
 *
 * @class Field
 */
export class Field {
  /**
   *Creates an instance of Field.
   * @param {number} [width=1000] フィールドの横幅
   * @param {number} [height=500] フィールドの縦幅
   * @param {number} [sakutekiRange=200] 新しく作る魚がどれぐらいの範囲を見れるか
   * @param {number} [dislikeDistance=20] 新しく作る魚はこの範囲以下の魚から離れようとします。
   * @memberof Field
   */
  constructor(
    width = 1000,
    height = 500,
    sakutekiRange = 200,
    dislikeDistance = 20
  ) {
    this.width = width
    this.height = height
    this.fishes = []
    this.newFishes = []
    this.sakutekiRange = sakutekiRange
    this.dislikeDistance = dislikeDistance
    this.isUpdating = false
  }

  /**
   *ランダムな位置に魚を追加します
   *
   * @memberof Field
   */
  addFish() {
    const x = (this.width * (0.5 + Math.random())) / 2
    const y = (this.height * (0.5 + Math.random())) / 2
    const pos = new Coodinate(x, y)
    const newFish = new Fish(pos, this.sakutekiRange, this.dislikeDistance)
    this.newFishes.push(newFish)

    if (this.isUpdating) return
    this.fishes = this.fishes.concat(this.newFishes)
    this.newFishes = []
  }

  /**
   * フィールドの時間を一つ進めます
   *
   * @memberof Field
   */
  next() {
    this.fishes = this.fishes.concat(this.newFishes.slice())
    this.newFishes = []

    // 初めに魚全員の行動(加速度)を決定する
    const accelerations = this.fishes.map(fish => {
      const fishesCanView = filterByDistance(
        this.fishes.filter(f => f !== fish),
        fish.position,
        fish.sakuteki
      )
      return fish.nextAcceleration(fishesCanView)
    })

    // 決めた行動（加速度）にしたがって更新
    this.fishes.forEach((fish, idx) => {
      const acc = accelerations[idx]

      // フィールドから外に出ようとする魚に対しては強制的に元に戻るような加速度をつける
      if (fish.position.x > this.width) {
        acc.plus(new Coodinate(-1, 0))
      }
      if (fish.position.x < 0) {
        acc.plus(new Coodinate(1, 0))
      }

      if (fish.position.y > this.height) {
        acc.plus(new Coodinate(0, -1))
      }
      if (fish.position.y < 0) {
        acc.plus(new Coodinate(0, 1))
      }

      fish.update(accelerations[idx])
    })
  }
}
