class Coodinate {
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

  static copy(a) {
    return new Coodinate(a.x, a.y)
  }

  static minus(a, b) {
    const r = new Coodinate(a.x, a.y)
    r.minus(b)
    return r
  }

  /**
   *
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
   *
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
  constructor(x, y) {
    this.x = x
    this.y = y
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
   *
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

class Fish extends AbstractObject {
  static maxAccelerationNorm = 0.1
  static counter = 0

  constructor(initPosition, sakuteki = 100) {
    super(initPosition)
    this.sakuteki = sakuteki
    this.dislikeDistance = 20
    Fish.counter += 1
    this.id = Fish.counter
  }
  /**
   *
   *
   * @param {[Fish]} nearlyFishes
   * @memberof Fish
   */
  nextAcceleration(nearlyFishes) {
    if (nearlyFishes.length === 0) return new Coodinate(0, 0)
    const vList = nearlyFishes.map(f => f.verocity)
    const vMean = Coodinate.mean(vList)
    const pMean = Coodinate.mean(nearlyFishes.map(f => f.position))
    const vDirection = Coodinate.minus(vMean, this.verocity)
      .norm()
      .multBy(0.7)
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
      const tooNearDirection = Coodinate.minus(tooNearMeanPos, this.position)
        .norm()
        .multBy(5)
      direction.minus(tooNearDirection)
    }

    return Coodinate.normalize(direction).multBy(Fish.maxAccelerationNorm)
  }
}

function filterByDistance(fishes, viewFrom, maxDistance) {
  return fishes.filter(fish => {
    const d = Coodinate.distance(fish.position, viewFrom)
    return d < maxDistance
  })
}

/**
 *
 *
 * @class Field
 */
export class Field {
  constructor(width = 1000, height = 500, sakutekiRange = 200) {
    this.width = width
    this.height = height
    this.fishes = []
    this.newFishes = []
    this.sakutekiRange = sakutekiRange
  }

  addFish() {
    const x = (this.width * (0.5 + Math.random())) / 2
    const y = (this.height * (0.5 + Math.random())) / 2
    const pos = new Coodinate(x, y)
    const newFish = new Fish(pos)
    this.newFishes.push(newFish)
  }

  next() {
    this.fishes = this.fishes.concat(this.newFishes.slice())
    this.newFishes = []

    const accelerations = this.fishes.map(fish => {
      const fishesCanView = filterByDistance(
        this.fishes.filter(f => f !== fish),
        fish.position,
        fish.sakuteki
      )
      return fish.nextAcceleration(fishesCanView)
    })

    this.fishes.forEach((fish, idx) => {
      const acc = accelerations[idx]

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
