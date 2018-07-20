
import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import TopNav, { TopNavItem, StaticItem } from '@voiceofamerica/voa-shared/components/TopNav'
import ThemeProvider from '@voiceofamerica/voa-shared/components/ThemeProvider'

import analytics, { AnalyticsProps } from '@voiceofamerica/voa-shared/helpers/analyticsHelper'
import ErrorBoundary from 'components/ErrorBoundary'
import Category from 'types/Category'
import { programsScreenLabels } from 'labels'

import TopNavTheme from './TopNavTheme'
import Params from './Params'
import VideoPrograms from './VideoPrograms'
import AudioPrograms from './AudioPrograms'
import { programsScreen, programTypeNav, typeItem, active } from './ProgramsScreen.scss'

type ProgramType = 'audio' | 'video'

const VIDEO: ProgramType = 'video'
const AUDIO: ProgramType = 'audio'
const DEFAULT = VIDEO

const VIDEO_ZONES: Category[] = [
  {
    id: 0,
    name: 'ལེ་ཚན་ཚང་མ།',
  },
  {
    id: 2642,
    name: 'ཀུན་གླེང་།',
  },
  {
    id: 2643,
    name: 'ཀུན་གླེང་གསར་འགྱུར།',
  },
  {
    id: 2644,
    name: 'དྲ་སྣང་གི་བོད།',
  },
  {
    id: 3380,
    name: 'ཁ་བའི་མི་སྣ།',
  },
  {
    id: 2887,
    name: 'ཀུན་གླེང་གསར་ཤོས།',
  },
]

const AUDIO_ZONES: Category[] = [
  {
    id: 0,
    name: 'ལེ་ཚན་ཚང་མ།',
  },
  {
    id: 2623,
    name: 'སྔ་དྲོའི་གསར་འགྱུར།',
  },
  {
    id: 2650,
    name: 'ཉིན་གུང་གི་གསར་འགྱུར།',
  },
  {
    id: 4006,
    name: 'བོད་པའི་གནད་དོན།',
  },
  {
    id: 2651,
    name: 'དགོང་དྲོའི་གསར་འགྱུར།',
  },
  {
    id: 2624,
    name: 'ཆོས་རིག་ལེ་ཚན།',
  },
  {
    id: 2684,
    name: 'བགྲོ་གླེང་མདུན་ལྕོག',
  },
  {
    id: 2685,
    name: 'གཞོན་སྐྱེས་དང་ཤེས་ཡོན།',
  },
  {
    id: 2652,
    name: 'ཕ་ཡུལ་གླེང་སྟེགས།',
  },
  {
    id: 2641,
    name: 'འཕྲོད་བསྟེན་དང་དོན་ལྡན་གྱི་མི་ཚེ།',
  },
  {
    id: 2649,
    name: 'གངས་རིའི་བྲག་ཅ།',
  },
  {
    id: 2648,
    name: 'སོ་ཡ་ལ། བོད་ཀྱི་དེང་རབས་གླུ་གཞས།',
  },
  {
    id: 2686,
    name: 'མི་ལོ་ལྔ་བཅུའི་དྲན་ཐོ།།',
  },
]

interface Props extends RouteComponentProps<Params>, AnalyticsProps {
}

class ProgramsScreen extends React.Component<Props> {
  setProgramType = (programType: ProgramType) => {
    const { history, match } = this.props
    const { type } = match.params

    if (type === programType) {
      return
    }

    history.replace(`/programs/${programType}`)
  }

  setZoneId = (zoneId: number) => {
    const { history, match } = this.props
    const { type = DEFAULT } = match.params
    history.replace(`/programs/${type}/${zoneId}`)
  }

  renderPrograms () {
    const { history, match } = this.props
    const { type = DEFAULT } = match.params
    if (type === VIDEO) {
      return <VideoPrograms history={history} zoneId={this.getZoneId()} />
    } else if (type === AUDIO) {
      return <AudioPrograms history={history} zoneId={this.getZoneId()} />
    } else {
      throw new Error(`Invalid programType ${type}`)
    }
  }

  renderProgramTypes () {
    const { type = DEFAULT } = this.props.match.params

    return (
      <div className={programTypeNav}>
        <div className={type === VIDEO ? `${typeItem} ${active}` : typeItem} onClick={() => this.setProgramType(VIDEO)}>
          {programsScreenLabels.videos}
        </div>
        <div className={type === AUDIO ? `${typeItem} ${active}` : typeItem} onClick={() => this.setProgramType(AUDIO)}>
          {programsScreenLabels.audio}
        </div>
      </div>
    )
  }

  render () {
    return (
      <div className={programsScreen}>
        {this.renderTopNav()}
        <ErrorBoundary>
          {this.renderPrograms()}
        </ErrorBoundary>
        {this.renderProgramTypes()}
      </div>
    )
  }

  private getZoneId = () => {
    const { zone = 0 } = this.props.match.params
    return typeof zone === 'number' ? zone : parseInt(zone, 10)
  }

  private renderTopNav () {
    const { type = DEFAULT } = this.props.match.params

    if (type === VIDEO) {
      return this.renderTopNavFromItems(VIDEO_ZONES)
    } else if (type === AUDIO) {
      return this.renderTopNavFromItems(AUDIO_ZONES)
    } else {
      throw new Error(`Unrecognized program type ${type}`)
    }
  }

  private renderTopNavFromItems (items: Category[]) {
    const zoneId = this.getZoneId()

    return (
      <ThemeProvider value={TopNavTheme}>
        <TopNav flex>
          <StaticItem />
          {
            items.map(({ id, name }) => {
              const selected = zoneId === id

              return (
                <TopNavItem
                  key={id}
                  selected={selected}
                  onClick={() => this.setZoneId(id)}
                >
                  {name}
                </TopNavItem>
              )
            })
          }
          <TopNavItem />
        </TopNav>
      </ThemeProvider>
    )
  }
}

const withAnalytics = analytics<Props>({
  state: 'Programs',
  title: 'Programs',
})

export default withAnalytics(ProgramsScreen)
