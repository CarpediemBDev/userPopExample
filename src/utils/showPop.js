/**
 * 모달/팝업 관리 시스템 (3가지 사용 방식 제공)
 *
 * 방식 1: 헬퍼 함수 (추천) - openUserPopup()
 * 방식 2: 직접 호출 - show(Component, params, options)
 * 방식 3: 전역 플러그인 - this.$modal.show()
 */
import { createApp } from 'vue'

class ModalManager {
  constructor() {
    this.modals = new Map()
    this.zIndex = 1050
  }

  /**
   * 모달을 표시합니다
   * @param {Object} component - Vue 컴포넌트
   * @param {Object} params - 컴포넌트에 전달할 props
   * @param {Object} options - 모달 옵션 { width, height, draggable, etc }
   * @returns {Promise} 모달 결과를 반환하는 Promise
   */
  show(component, params = {}, options = {}) {
    const modalId = `modal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    return new Promise((resolve, reject) => {
      // 컨테이너 생성
      const container = document.createElement('div')
      container.style.position = 'fixed'
      container.style.top = '0'
      container.style.left = '0'
      container.style.width = '100%'
      container.style.height = '100%'
      container.style.zIndex = this.zIndex++

      // 옵션 적용
      if (options.width) {
        container.style.setProperty(
          '--modal-width',
          typeof options.width === 'number' ? `${options.width}px` : options.width
        )
      }
      if (options.height && options.height !== 'auto') {
        container.style.setProperty(
          '--modal-height',
          typeof options.height === 'number' ? `${options.height}px` : options.height
        )
      }

      document.body.appendChild(container)

      // Vue 앱 생성
      const app = createApp(component, {
        ...params,
        modalId,
        onClose: (result = null) => {
          this.close(modalId, result, resolve)
        },
        onConfirm: (result) => {
          this.close(modalId, result, resolve)
        },
      })

      const instance = app.mount(container)

      // 모달 정보 저장
      this.modals.set(modalId, {
        app,
        instance,
        container,
        component,
        resolve,
        reject,
        options,
      })

      // ESC 키 핸들러
      const handleEsc = (e) => {
        if (e.key === 'Escape' && options.closeOnEsc !== false) {
          this.close(modalId, null, resolve)
        }
      }
      document.addEventListener('keydown', handleEsc)

      // 핸들러 저장 (정리용)
      this.modals.get(modalId).escHandler = handleEsc
    })
  }

  /**
   * 모달을 닫습니다
   */
  close(modalId, result, resolve) {
    const modal = this.modals.get(modalId)
    if (!modal) return

    const { app, container, escHandler } = modal

    // 정리
    app.unmount()
    if (document.body.contains(container)) {
      document.body.removeChild(container)
    }
    if (escHandler) {
      document.removeEventListener('keydown', escHandler)
    }

    this.modals.delete(modalId)

    if (resolve) {
      resolve(result)
    }
  }

  /**
   * 모든 모달을 닫습니다
   */
  closeAll() {
    this.modals.forEach((modal, modalId) => {
      this.close(modalId, null, modal.resolve)
    })
  }

  /**
   * 특정 컴포넌트의 모든 모달을 닫습니다
   */
  closeByComponent(component) {
    this.modals.forEach((modal, modalId) => {
      if (modal.component === component) {
        this.close(modalId, null, modal.resolve)
      }
    })
  }
}

// 전역 모달 매니저 인스턴스
const Modal = new ModalManager()

/* ========================================
 * 방식 1: 헬퍼 함수 (Helper Function) - 추천 ⭐
 * 사용법: openUserPopup(params)
 * ======================================== */

/**
 * UserPopup 전용 헬퍼 함수 - 가장 간단한 사용법
 * @param {Object} params - UserPopup 컴포넌트에 전달할 props
 * @returns {Promise} 선택된 사용자 목록
 *
 * @example
 * import { openUserPopup } from '../utils/showPop.js'
 *
 * const users = await openUserPopup({ preselectedIds: [1,2] })
 * if (users) {
 *   console.log('선택된 사용자:', users)
 * }
 */
export const openUserPopup = (params = {}) => {
  // UserPopup 동적 import (필요시에만 로드)
  return import('../components/UserPopup.vue').then(({ default: UserPopup }) => {
    return show(UserPopup, params, {
      width: '850px',
      height: 'auto',
      draggable: true,
    })
  })
}

/* ========================================
 * 방식 2: 직접 호출 (Direct Call)
 * 사용법: show(Component, params, options)
 * ======================================== */

/**
 * 전역 show 함수 - 모든 컴포넌트에 사용 가능
 * @param {Object} modal - Vue 컴포넌트
 * @param {Object} params - 컴포넌트 props
 * @param {Object} options - 모달 옵션
 * @returns {Promise} 모달 결과
 *
 * @example
 * import { show } from '../utils/showPop.js'
 * import UserPopup from '../components/UserPopup.vue'
 *
 * const users = await show(UserPopup, { preselectedIds: [1,2] }, { width: '800px' })
 */
export const show = (modal, ...args) => {
  return Modal.show(modal, ...args)
}

/* ========================================
 * 방식 3: 전역 플러그인 (Global Plugin)
 * 사용법: this.$modal.show()
 * ======================================== */

/**
 * Vue 플러그인으로 등록하여 전역에서 사용
 *
 * @example
 * // main.js에서 등록
 * import ModalPlugin from './utils/showPop.js'
 * app.use(ModalPlugin)
 *
 * // 컴포넌트에서 사용
 * const users = await this.$modal.show(UserPopup, params, options)
 */
export default {
  install(app) {
    app.config.globalProperties.$modal = Modal
    app.provide('$modal', Modal)
  },
}

/* ========================================
 * 개발자 편의를 위한 전역 접근 (선택사항)
 * ======================================== */

// 전역 객체로도 접근 가능 (디버깅용)
if (typeof window !== 'undefined') {
  window.Modal = Modal // window.Modal.show()
  window.show = show // window.show()
  window.openUserPopup = openUserPopup // window.openUserPopup()
}
