import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

/**
 * The screen of last resort.
 *
 * Without this, anything that throws during a render leaves the student looking at a
 * blank white page with no way forward — not even a hint that something went wrong.
 * There is no such screen in the handoff because the prototype never failed, but a
 * shipped app needs one.
 *
 * It keeps the product's voice: it states what happened and what they can do, and it
 * does not blame them or dress the failure up. Their data is untouched, so the first
 * offer is simply to try again; clearing is there only if the stored data is what is
 * broken, and it says plainly what that costs.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Nothing leaves the device, so this is the only record there is.
    console.error('Student Money crashed:', error, info.componentStack)
  }

  private reload = () => {
    this.setState({ error: null })
    window.location.href = '/'
  }

  private clearAndReload = () => {
    try {
      localStorage.removeItem('student-money')
    } catch {
      /* nothing more to try */
    }
    this.reload()
  }

  render() {
    if (!this.state.error) return this.props.children

    return (
      <div className="phone">
        <main className="scroll">
          <div className="stack">
            <header className="sm-appbar">
              <p className="sm-eyebrow">Something went wrong</p>
              <h1 className="sm-appbar-title">This screen stopped working</h1>
              <p className="plans-lede">
                Your payments and plans are still on this phone. Nothing has been lost and nothing has been sent
                anywhere.
              </p>
            </header>

            <div className="exits">
              <button type="button" className="sm-button dark sm-full" onClick={this.reload}>
                Start again
              </button>
              <button type="button" className="plainlink" onClick={this.clearAndReload}>
                Still broken? Clear what is stored and start fresh
              </button>
            </div>

            <p className="fine">
              Clearing removes the payments, categories and plans held on this phone, and puts the demo month back.
            </p>
          </div>
        </main>
      </div>
    )
  }
}
