// @flow
import { PureComponent } from 'react'

type Props = {
  src: string,
  alt: string,
}

type State = {
  width: number,
  height: number,
  loaded: boolean,
}

export default class Image extends PureComponent<void, Props, State> {
  static calcImageSize (el: HTMLImageElement): { width: number, height: number } {
    const parentEl = el.getRootNode().children[0]
    let { width, height } = el
    const bottom = el.clientHeight + el.offsetTop
    const parentBottom = parentEl.clientHeight + parentEl.offsetTop
    if (bottom > parentBottom) {
      const ratio = (parentBottom - el.offsetTop) / height
      width *= ratio
      height *= ratio
    }
    return { width, height }
  }

  constructor (props: Props) {
    super(props)
    this.state = {
      width: 0,
      height: 0,
      loaded: false,
    }
  }

  // for typecheck
  state: State
  el: HTMLImageElement

  get size (): { width?: number, height?: number } {
    const { width, height, loaded } = this.state
    return Object.assign(
      {},
      loaded ? { width } : {},
      loaded ? { height } : {},
    )
  }

  get style (): Object {
    return {
      maxWidth: '100%',
    }
  }

  onLoad = (e: any) => {
    const size = Image.calcImageSize(e.target)
    this.setState(Object.assign({}, size, { loaded: true }))
  }

  render () {
    const { src, alt, ...rest } = this.props
    return (
      <img
        {...{ ...rest, ...this.size }}
        src={src}
        alt={alt}
        ref={(el) => { this.el = el }}
        onLoad={this.onLoad}
        style={this.style}
      />
    )
  }
}
