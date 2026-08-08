import { PLAN_META, L1_ROOMS, L2_ROOMS } from './world/floorplan-data.js'

/**
 * Renders an interactive SVG floor plan into a container.
 * Click a room → callback(roomId).
 */
export function mountFloorPlan(container, { onSelectRoom, activeId = null } = {}) {
  let level = 1

  const root = document.createElement('div')
  root.className = 'floorplan'
  container.appendChild(root)

  function worldToSvg(x, z) {
    // Plan: X right, Z down on screen (entrance at bottom)
    const { xMin, xMax, zMin, zMax } = PLAN_META
    const pad = 4
    const w = 100 - pad * 2
    const h = 100 - pad * 2
    const sx = pad + ((x - xMin) / (xMax - xMin)) * w
    const sy = pad + ((zMax - z) / (zMax - zMin)) * h
    return [sx, sy]
  }

  function roomRect(room) {
    const [x0, y0] = worldToSvg(room.x0, room.z1)
    const [x1, y1] = worldToSvg(room.x1, room.z0)
    return {
      x: Math.min(x0, x1),
      y: Math.min(y0, y1),
      w: Math.abs(x1 - x0),
      h: Math.abs(y1 - y0),
    }
  }

  function waterRect(w) {
    const [x0, y0] = worldToSvg(w.x0, w.z1)
    const [x1, y1] = worldToSvg(w.x1, w.z0)
    return {
      x: Math.min(x0, x1),
      y: Math.min(y0, y1),
      w: Math.abs(x1 - x0),
      h: Math.abs(y1 - y0),
    }
  }

  function labelPos(room) {
    const r = roomRect(room)
    return [r.x + r.w / 2, r.y + r.h / 2]
  }

  function render() {
    const rooms = level === 1 ? L1_ROOMS : L2_ROOMS
    const glassY = worldToSvg(0, PLAN_META.glassLineZ)[1]
    const l2LimitY = worldToSvg(0, PLAN_META.l2LimitZ)[1]

    const roomPolys = rooms
      .map((room) => {
        const r = roomRect(room)
        const [lx, ly] = labelPos(room)
        const isActive = room.id === activeId
        const cls = [
          'fp-room',
          room.outdoor ? 'fp-room--out' : '',
          room.void ? 'fp-room--void' : '',
          room.stair ? 'fp-room--stair' : '',
          isActive ? 'is-active' : '',
        ]
          .filter(Boolean)
          .join(' ')

        let waterSvg = ''
        if (room.water) {
          const w = waterRect(room.water)
          waterSvg += `<rect class="fp-water" x="${w.x}" y="${w.y}" width="${w.w}" height="${w.h}" rx="0.4" />`
        }
        if (room.water2) {
          const w = waterRect(room.water2)
          waterSvg += `<rect class="fp-water" x="${w.x}" y="${w.y}" width="${w.w}" height="${w.h}" rx="0.4" />`
        }

        const fontSize = Math.min(2.4, Math.max(1.5, r.w * 0.12))
        return `
          <g class="${cls}" data-room="${room.id}" role="button" tabindex="0">
            <rect class="fp-room__fill" x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" />
            ${waterSvg}
            <text class="fp-room__name" x="${lx}" y="${ly - 0.6}" font-size="${fontSize}">${room.name}</text>
            <text class="fp-room__note" x="${lx}" y="${ly + 1.4}" font-size="${fontSize * 0.65}">${room.note || ''}</text>
          </g>
        `
      })
      .join('')

    // Building outline (enclosed)
    const [bx0, by0] = worldToSvg(-44, 26)
    const [bx1, by1] = worldToSvg(44, -26)
    const building = {
      x: Math.min(bx0, bx1),
      y: Math.min(by0, by1),
      w: Math.abs(bx1 - bx0),
      h: Math.abs(by1 - by0),
    }

    // Terrace outline
    const [tx0, ty0] = worldToSvg(-42, -26)
    const [tx1, ty1] = worldToSvg(42, -50)
    const terrace = {
      x: Math.min(tx0, tx1),
      y: Math.min(ty0, ty1),
      w: Math.abs(tx1 - tx0),
      h: Math.abs(ty1 - ty0),
    }

    root.innerHTML = `
      <header class="floorplan__head">
        <div>
          <p class="floorplan__eyebrow">Architectural plan</p>
          <h2 class="floorplan__title">${PLAN_META.title}</h2>
          <p class="floorplan__sub">${PLAN_META.subtitle}</p>
        </div>
        <div class="floorplan__tabs" role="tablist">
          <button type="button" class="floorplan__tab ${level === 1 ? 'is-on' : ''}" data-level="1">Level 1</button>
          <button type="button" class="floorplan__tab ${level === 2 ? 'is-on' : ''}" data-level="2">Level 2</button>
        </div>
      </header>

      <div class="floorplan__canvas">
        <svg viewBox="0 0 100 100" class="floorplan__svg" aria-label="Floor plan level ${level}">
          <rect class="fp-bg" x="0" y="0" width="100" height="100" />

          ${
            level === 1
              ? `<rect class="fp-terrace-plate" x="${terrace.x}" y="${terrace.y}" width="${terrace.w}" height="${terrace.h}" />`
              : ''
          }

          <rect class="fp-building" x="${building.x}" y="${building.y}" width="${building.w}" height="${building.h}" />

          ${
            level === 1
              ? `<line class="fp-glass" x1="${building.x}" y1="${glassY}" x2="${building.x + building.w}" y2="${glassY}" />
                 <text class="fp-axis" x="50" y="${glassY - 1.2}" font-size="1.6">Glass line · open to terrace</text>`
              : `<line class="fp-limit" x1="${building.x}" y1="${l2LimitY}" x2="${building.x + building.w}" y2="${l2LimitY}" />
                 <text class="fp-axis" x="50" y="${l2LimitY - 1.2}" font-size="1.6">L2 setback · terrace open below</text>
                 <rect class="fp-void-hint" x="${terrace.x}" y="${terrace.y}" width="${terrace.w}" height="${terrace.h + (building.y + building.h - l2LimitY) * 0}" opacity="0" />
                 <text class="fp-axis fp-axis--muted" x="50" y="${(terrace.y + l2LimitY) / 2}" font-size="1.5">Open to sky (no slab)</text>`
          }

          ${roomPolys}

          <text class="fp-compass" x="92" y="8" font-size="1.8">N</text>
          <path class="fp-compass-arrow" d="M92 10 L92 14 M90.5 11.2 L92 10 L93.5 11.2" />
          <text class="fp-compass" x="50" y="97" font-size="1.5">Entrance</text>
        </svg>
      </div>

      <footer class="floorplan__legend">
        <span><i class="fp-swatch fp-swatch--room"></i> Room</span>
        <span><i class="fp-swatch fp-swatch--water"></i> Pool</span>
        <span><i class="fp-swatch fp-swatch--out"></i> Outdoor</span>
        <span><i class="fp-swatch fp-swatch--void"></i> Double height</span>
        <p class="floorplan__hint">Click a room to visit in 3D</p>
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
