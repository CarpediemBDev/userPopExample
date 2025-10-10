// src/utils/utils.js
/**
toastMsg('저장 완료',   { type: 'success' })  // 초록
toastMsg('유효성 오류', { type: 'danger'  })  // 빨강
toastMsg('알림',       { type: 'info'    })  // 하늘색
toastMsg('주의',       { type: 'warning' })  // 노랑
toastMsg('기본',       { type: 'dark'    })  // 진한 회색(검정톤)

 */
let toastContainer = null

export function toastMsg(text, { type = 'success', duration = 2000 } = {}) {
  if (!toastContainer) {
    toastContainer = document.createElement('div')
    toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3'
    toastContainer.style.zIndex = '2000' // 모달(1055)보다 크게
    document.body.appendChild(toastContainer)
  }

  const el = document.createElement('div')
  el.className = `toast text-bg-${type} border-0 show mb-2`
  el.style.display = 'block' // 혹시 BS 플러그인 없이도 보이게
  el.setAttribute('role', 'alert')
  el.setAttribute('aria-live', 'assertive')
  el.setAttribute('aria-atomic', 'true')

  // XSS를 피하려면 textContent로 넣자
  const body = document.createElement('div')
  body.className = 'toast-body'
  body.textContent = text // textContent로 넣어야 XSS 공격 방어 가능

  const close = document.createElement('button')
  close.type = 'button'
  close.className = 'btn-close btn-close-white me-2 m-auto' // 간단히 흰색으로 고정
  close.setAttribute('aria-label', 'Close')

  const row = document.createElement('div')
  row.className = 'd-flex'
  row.appendChild(body)
  row.appendChild(close)
  el.appendChild(row)

  const timer = duration > 0 ? setTimeout(() => el.remove(), duration) : null
  close.addEventListener('click', () => {
    if (timer) clearTimeout(timer)
    el.remove()
  })

  toastContainer.appendChild(el)
}
