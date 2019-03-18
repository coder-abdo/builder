import * as React from 'react'
import { getAnalytics } from 'decentraland-dapps/dist/modules/analytics/utils'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'

import SquaresGrid from 'components/SquaresGrid'
import Icon from 'components/Icon'
import { SceneMetrics } from 'modules/scene/types'
import { getExceededMetrics } from 'modules/scene/utils'
import { getDimensions } from 'lib/layout'
import { Props, State } from './Metrics.types'
import './Metrics.css'

export default class Metrics extends React.PureComponent<Props, State> {
  state = {
    isBubbleVisible: false
  }

  analytics = getAnalytics()
  metricsExceeded: (keyof SceneMetrics)[] = []

  componentWillMount() {
    document.addEventListener('click', this.handleClose)
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClose)
  }

  componentWillReceiveProps(nextProps: Props) {
    const { metrics, limits } = nextProps
    const metricsExceeded = getExceededMetrics(metrics, limits)

    for (const metric of metricsExceeded) {
      if (!this.metricsExceeded.includes(metric)) {
        this.analytics.track('Metrics exceeded', { metric })
      }
    }
    this.metricsExceeded = metricsExceeded
  }

  handleToggle = () => {
    const isBubbleVisible = !this.state.isBubbleVisible

    if (isBubbleVisible) {
      this.analytics.track('Show metrics')
    }
    this.setState({ isBubbleVisible })
  }

  handleClose = () => {
    this.setState({ isBubbleVisible: false })
  }

  handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.nativeEvent.stopImmediatePropagation()
  }

  renderMetrics() {
    return Object.keys(this.props.metrics).map(key => this.renderMetric(key as keyof SceneMetrics))
  }

  renderMetric(metric: keyof SceneMetrics) {
    const { metrics, limits } = this.props
    let classes = 'metric'
    if (metrics[metric] > limits[metric]) {
      classes += ' exceeded'
    }

    return (
      <div className={classes} key={metric}>
        <div className="label">{t(`metrics.${metric}`)}:</div>
        <div className="value">
          {metrics[metric].toLocaleString()}
          <span className="value-limit">&nbsp;/&nbsp;{limits[metric].toLocaleString()}</span>{' '}
        </div>
      </div>
    )
  }

  render() {
    const { rows, cols } = this.props
    const { isBubbleVisible } = this.state

    return (
      <div className={`Metrics ${this.metricsExceeded.length > 0 ? 'metric-exceeded' : ''}`} onClick={this.handleClick}>
        <SquaresGrid rows={2} cols={2} size="tiny" onClick={this.handleToggle} />

        {isBubbleVisible ? (
          <div className="bubble">
            <div className="bubble-title">
              <span>
                {rows}x{cols} LAND
              </span>
              &nbsp;
              <span className="dimensions">{getDimensions(rows, cols)}</span>
            </div>
            <div className="divider" />
            {this.renderMetrics()}
          </div>
        ) : null}
        {this.metricsExceeded.length > 0 ? (
          <span className="value-too-high" onClick={this.handleToggle}>
            <Icon name="alert" />
            {t('metrics.too_many', { metric: t(`metrics.${this.metricsExceeded[0]}`) })}
          </span>
        ) : null}
      </div>
    )
  }
}
