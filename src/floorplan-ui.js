import { PLAN_META, L1_ROOMS, L2_ROOMS } from './world/floorplan-data.js'

/**
 * Interactive SVG floor plan — drawn like a residential sales plan,
 * not a campus diagram.
 */
export function mountFloorPlan(container, { onSelectRoom, activeId = null } = {}) {
  let level = 1

  const root = document.createElement('div')
  root.className = 'floorplan'
  container.appendChild(root)

  const { xMin, xMax, zMin, zMax, envelope, scaleBarMeters } = PLAN_META
  const pad = 6

  function worldToSvg(x, z) {
    const w = 100 - pad * 2
    const h = 100 - pad * 2
    const sx = pad + ((x - xMin) / (xMax - xMin)) * w
    const sy = pad + ((zMax - z) / (zMax - zMin)) * h
    return [sx, sy]
  }

  function rectFromBounds(b) {
    const [x0, y0] = worldToSvg(b.x0, b.z1)
    const [x1, y1] = worldToSvg(b.x1, b.z0)
    return {
      x: Math.min(x0, x1),
      y: Math.min(y0, y1),
      w: Math.abs(x1 - x0),
      h: Math.abs(y1 - y0),
    }
  }

  function render() {
    const rooms = level === 1 ? L1_ROOMS : L2_ROOMS
    const env = rectFromBounds(envelope)
    const scaleStart = worldToSvg(envelope.x0, envelope.z0 - 1.5)
    const scaleEnd = worldToSvg(envelope.x0 + scaleBarMeters, envelope.z0 - 1.5)

    const roomPolys = rooms
      .map((room) => {
        const r = rectFromBounds(room)
        const lx = r.x + r.w / 2
        const ly = r.y + r.h / 2
        const isActive = room.id === activeId
        const cls = [
          'fp-room',
          room.outdoor ? 'fp-room--out' : '',
          room.void ? 'fp-room--void' : '',
          room.stair ? 'fp-room--stair' : '',
          room.corridor ? 'fp-room--corridor' : '',
          isActive ? 'is-active' : '',
        ]
          .filter(Boolean)
          .join(' ')

        let extras = ''
        if (room.water) {
          const w = rectFromBounds(room.water)
          extras += `<rect class="fp-water" x="${w.x}" y="${w.y}" width="${w.w}" height="${w.h}" rx="0.35" />`
        }
        if (room.water2) {
          const w = rectFromBounds(room.water2)
          extras += `<rect class="fp-water fp-water--spa" x="${w.x}" y="${w.y}" width="${w.w}" height="${w.h}" rx="0.35" />`
        }

        const nameSize = Math.min(2.2, Math.max(1.35, Math.min(r.w, r.h) * 0.18))
        const showNote = room.note && r.w > 6 && r.h > 5

        return `
          <g class="${cls}" data-room="${room.id}" role="button" tabindex="0">
            <rect class="fp-room__fill" x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" />
            ${extras}
            <text class="fp-room__name" x="${lx}" y="${showNote ? ly - 0.7 : ly}" font-size="${nameSize}">${room.name}</text>
            ${showNote ? `<text class="fp-room__note" x="${lx}" y="${ly + 1.2}" font-size="${nameSize * 0.7}">${room.note}</text>` : ''}
          </g>
        `
      })
      .join('')

    const levelLabel = level === 1 ? 'Main Level' : 'Roof Terrace'
    const levelHint =
      level === 1
        ? 'Open living along the view · suites to the sides · elevator foyer'
        : 'Residential pool & spa on open roof · summer kitchen · sky lounge pavilion'

    root.innerHTML = `
      <header class="floorplan__head">
        <div>
          <p class="floorplan__eyebrow">Sales plan · duplex penthouse</p>
          <h2 class="floorplan__title">${PLAN_META.title}</h2>
          <p class="floorplan__sub">${PLAN_META.subtitle}</p>
        </div>
        <div class="floorplan__tabs" role="tablist">
          <button type="button" class="floorplan__tab ${level === 1 ? 'is-on' : ''}" data-level="1">Main Level</button>
          <button type="button" class="floorplan__tab ${level === 2 ? 'is-on' : ''}" data-level="2">Roof Terrace</button>
        </div>
      </header>

      <p class="floorplan__level-hint">${levelLabel} — ${levelHint}</p>

      <div class="floorplan__canvas">
        <svg viewBox="0 0 100 100" class="floorplan__svg" aria-label="${levelLabel} floor plan">
          <rect class="fp-bg" x="0" y="0" width="100" height="100" />

          ${
            level === 2
              ? `<rect class="fp-roof-plate" x="${env.x}" y="${env.y}" width="${env.w}" height="${env.h}" />`
              : ''
          }

          <rect class="fp-building" x="${env.x}" y="${env.y}" width="${env.w}" height="${env.h}" />

          ${roomPolys}

          <!-- Scale bar -->
          <line class="fp-scale" x1="${scaleStart[0]}" y1="${scaleStart[1]}" x2="${scaleEnd[0]}" y2="${scaleEnd[1]}" />
          <line class="fp-scale" x1="${scaleStart[0]}" y1="${scaleStart[1] - 0.6}" x2="${scaleStart[0]}" y2="${scaleStart[1] + 0.6}" />
          <line class="fp-scale" x1="${scaleEnd[0]}" y1="${scaleEnd[1] - 0.6}" x2="${scaleEnd[0]}" y2="${scaleEnd[1] + 0.6}" />
          <text class="fp-scale-label" x="${(scaleStart[0] + scaleEnd[0]) / 2}" y="${scaleStart[1] + 2.2}" font-size="1.5">${scaleBarMeters} m</text>

          <text class="fp-compass" x="90" y="10" font-size="2">N</text>
          <path class="fp-compass-arrow" d="M90 11.5 L90 16 M88.4 13 L90 11.5 L91.6 13" />
          <text class="fp-compass" x="50" y="96" font-size="1.5">Entry</text>
        </svg>
      </div>

      <footer class="floorplan__legend">
        <span><i class="fp-swatch fp-swatch--room"></i> Interior</span>
        <span><i class="fp-swatch fp-swatch--out"></i> Terrace</span>
        <span><i class="fp-swatch fp-swatch--water"></i> Pool / spa</span>
        <span><i class="fp-swatch fp-swatch--void"></i> Open living</span>
        <p class="floorplan__hint">Click a room · then rebuild 3D to match</p>
      </footer>
    `

    root.querySelectorAll('.floorplan__tab').forEach((btn) => {
      btn.addEventListener('click', () => {
        level = Number(btn.dataset.level)
        render()
      })
    })

    root.querySelectorAll('.fp-room').forEach((el) => {
      const id = el.dataset.room
      const activate = () => {
        activeId = id
        render()
        onSelectRoom?.(id)
      }
      el.addEventListener('click', activate)
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          activate()
        }
      })
    })
  }

  render()

  return {
    setActive(id) {
      activeId = id
      render()
    },
    setLevel(n) {
      level = n
      render()
    },
    destroy() {
      root.remove()
    },
  }
}
