/* cms.js — Homepage CMS Engine v1.0
 * 관리자 모드에서 홈페이지 모든 섹션을 실시간 편집·저장
 * 의존성: 없음 (fetch API만 사용)
 */
'use strict';
(() => {

/* ───────────────────────────────────────────────
   설정
─────────────────────────────────────────────── */
const SB_URL = 'https://mvbxcrxykyyshdwtuedl.supabase.co';
const SB_KEY = 'sb_publishable_xyA4rNrKXrOK0Yy_qPgL5w_8UbP7Vaa';

/* ───────────────────────────────────────────────
   기본 콘텐츠 (Supabase에 데이터 없을 때 폴백)
─────────────────────────────────────────────── */
const DEFAULTS = {
  hero: {
    main_badge: '🌿 중부대학교 자연치유학과 공식 과정',
    rise_badge: '경기 RISE 지원',
    h1_line1: '자연치유 지식을',
    h1_em: '건강콘텐츠',
    h1_line3: '세상에 전하다',
    description: '누구나 시작할 수 있는 실전 중심 교육 — 영상 제작부터 SNS 운영, 개인 브랜드 상표 등록까지 체계적으로 지원합니다.',
    btn_main: '지금 신청하기',
    btn_ghost: '교육 과정 보기 →',
    card_title: '✦ 핵심 혜택',
    card_items: [
      { icon: '💰', title: '교육비 전액 무료',      desc: '경기도 RISE 지원으로 수강료 100% 면제' },
      { icon: '🎬', title: '영상 제작 전 과정',     desc: '기획·촬영·편집·채널 운영까지 실전 실습' },
      { icon: '™️',  title: '개인 상표 등록 지원',   desc: '수료 후 개인 브랜드 상표 등록 무료 지원' },
      { icon: '🤝', title: '1:1 개인 멘토링',       desc: '담당 교수와 채널 성장 전략 수립' }
    ]
  },
  stats: {
    items: [
      { num: '100', unit: '%',  label: '교육비 전액 지원' },
      { num: '16',  unit: '주', label: '집중 커리큘럼' },
      { num: '1',   unit: ':1', label: '개인 멘토링' },
      { num: '무료', unit: '',   label: '상표 등록 지원' }
    ]
  },
  features_header: {
    tag: 'PROGRAM FEATURES',
    h2:  '왜 자연치유학과\n크리에이터 과정인가',
    p:   '건강·치유 분야의 전문 지식과 디지털 콘텐츠 제작 역량을 동시에 키웁니다.'
  },
  rise_support: {
    tag: 'RISE SUPPORT',
    h2:  '경기 RISE 사업단이\n함께합니다',
    p:   '경기도 대학혁신지원(RISE) 사업의 특별 지원으로 진행되는 과정입니다.',
    items: [
      { icon: '💰', title: '교육비 전액 지원',          badge: 'RISE 지원', desc: '수강료·교재비 포함 교육비 전액을 경기도 RISE 사업단에서 지원합니다. 개인 부담 없이 전문 교육을 받을 수 있습니다.' },
      { icon: '🖥️', title: '장비·소프트웨어 무상 지원',  badge: '',         desc: '촬영 장비, 편집 소프트웨어 라이선스를 교육 기간 동안 무상으로 제공합니다.' },
      { icon: '🏢', title: '기업 연계 실습 기회',        badge: '',         desc: '경기도 RISE 얼라이언스 기업들과 연계한 실무 인턴십 및 프로젝트 참여 기회를 제공합니다.' },
      { icon: '📜', title: '공식 수료 인증서 발급',       badge: '',         desc: '중부대학교 총장 명의 수료 인증서 및 경기도 RISE 사업단 인증서를 함께 발급합니다.' }
    ]
  },
  curriculum_header: {
    tag: 'CURRICULUM',
    h2:  '16주 집중 커리큘럼',
    p:   '이론과 실습을 균형 있게 구성한 자연치유 크리에이터 양성 과정입니다.'
  },
  steps: {
    h2: '간단한 신청 절차',
    p:  '온라인 신청 후 담당자 확인 → 합격 통보까지 빠르게 진행됩니다.',
    items: [
      { icon: '📝', title: '온라인 신청', desc: '신청 양식 작성 및 지원 동기 제출',    status: 'done' },
      { icon: '📋', title: '서류 검토',   desc: '담당자 검토 후 3일 내 결과 통보',    status: 'done' },
      { icon: '📞', title: '개별 상담',   desc: '유선 또는 대면 간단 상담 진행',      status: 'active' },
      { icon: '✅', title: '최종 합격',   desc: '합격 통보 및 OT 안내',            status: '' },
      { icon: '🎬', title: '교육 시작',   desc: '16주 집중 교육 수강',             status: '' }
    ]
  },
  cta_banner: {
    h2:        '지금 바로 신청하세요',
    p:         '교육비 전액 무료 · 선착순 모집 · 2026학년도 모집 중',
    btn_main:  '수강 신청',
    btn_ghost: '교육 과정 보기'
  },
  footer: {
    address:   '경기도 고양시 덕양구 동헌로 305, 중부대학교 고양캠퍼스',
    phone:     '031-8075-1000',
    email:     'chiyu@joongbu.ac.kr',
    copyright: '© 2025 중부대학교 자연치유학과. 경기도 RISE 사업단 연계 교육과정.'
  }
};

/* ───────────────────────────────────────────────
   섹션 편집기 스키마 (label + 필드 정의)
─────────────────────────────────────────────── */
const SCHEMA = {
  hero: {
    label: '🌟 히어로',
    simple: [
      { key: 'main_badge', label: '메인 배지',   type: 'text' },
      { key: 'rise_badge', label: 'RISE 배지',   type: 'text' },
      { key: 'h1_line1',   label: '제목 1행',    type: 'text' },
      { key: 'h1_em',      label: '강조 텍스트', type: 'text' },
      { key: 'h1_line3',   label: '제목 3행',    type: 'text' },
      { key: 'description',label: '부제 설명',   type: 'textarea' },
      { key: 'btn_main',   label: '메인 버튼',   type: 'text' },
      { key: 'btn_ghost',  label: '보조 버튼',   type: 'text' },
      { key: 'card_title', label: '카드 제목',   type: 'text' }
    ],
    arrays: [{
      key: 'card_items', label: '핵심 혜택 항목',
      cols: [
        { key: 'icon',  label: '아이콘', w: '60px' },
        { key: 'title', label: '제목',   w: '1fr' },
        { key: 'desc',  label: '설명',   w: '2fr' }
      ]
    }]
  },
  stats: {
    label: '📊 통계 바',
    arrays: [{
      key: 'items', label: '통계 항목',
      cols: [
        { key: 'num',   label: '숫자', w: '80px' },
        { key: 'unit',  label: '단위', w: '60px' },
        { key: 'label', label: '레이블', w: '1fr' }
      ]
    }]
  },
  features_header: {
    label: '✨ 과정 특징 헤더',
    simple: [
      { key: 'tag', label: '태그',  type: 'text' },
      { key: 'h2',  label: '제목', type: 'textarea' },
      { key: 'p',   label: '설명', type: 'textarea' }
    ]
  },
  rise_support: {
    label: '🏛 RISE 지원',
    simple: [
      { key: 'tag', label: '태그',  type: 'text' },
      { key: 'h2',  label: '제목', type: 'textarea' },
      { key: 'p',   label: '설명', type: 'textarea' }
    ],
    arrays: [{
      key: 'items', label: '지원 항목',
      cols: [
        { key: 'icon',  label: '아이콘', w: '60px' },
        { key: 'title', label: '제목',   w: '1fr' },
        { key: 'badge', label: '배지',   w: '80px' },
        { key: 'desc',  label: '설명',   w: '2fr' }
      ]
    }]
  },
  curriculum_header: {
    label: '📚 커리큘럼 헤더',
    simple: [
      { key: 'tag', label: '태그',  type: 'text' },
      { key: 'h2',  label: '제목', type: 'text' },
      { key: 'p',   label: '설명', type: 'textarea' }
    ]
  },
  steps: {
    label: '📋 신청 절차',
    simple: [
      { key: 'h2', label: '제목', type: 'text' },
      { key: 'p',  label: '설명', type: 'textarea' }
    ],
    arrays: [{
      key: 'items', label: '단계 항목',
      cols: [
        { key: 'icon',   label: '아이콘', w: '60px' },
        { key: 'title',  label: '단계명', w: '1fr' },
        { key: 'desc',   label: '설명',   w: '2fr' },
        { key: 'status', label: '상태',   w: '80px', options: ['', 'done', 'active'] }
      ]
    }]
  },
  cta_banner: {
    label: '📢 CTA 배너',
    simple: [
      { key: 'h2',        label: '제목',      type: 'text' },
      { key: 'p',         label: '부제',      type: 'text' },
      { key: 'btn_main',  label: '메인 버튼', type: 'text' },
      { key: 'btn_ghost', label: '보조 버튼', type: 'text' }
    ]
  },
  footer: {
    label: '🔻 푸터',
    simple: [
      { key: 'address',   label: '주소',    type: 'text' },
      { key: 'phone',     label: '전화',    type: 'text' },
      { key: 'email',     label: '이메일',  type: 'text' },
      { key: 'copyright', label: '저작권',  type: 'text' }
    ]
  }
};

/* ───────────────────────────────────────────────
   상태
─────────────────────────────────────────────── */
let _data      = {};
let _editMode  = false;
let _activeId  = null;

/* ───────────────────────────────────────────────
   Supabase REST helpers
─────────────────────────────────────────────── */
const SB_HEADERS = {
  'apikey': SB_KEY,
  'Authorization': `Bearer ${SB_KEY}`,
  'Content-Type': 'application/json'
};

async function sbFetch(path, opts = {}) {
  try {
    const res = await fetch(SB_URL + path, { headers: SB_HEADERS, ...opts });
    if (!res.ok) return null;
    return res.status === 204 ? true : res.json();
  } catch { return null; }
}

async function loadAllContent() {
  const rows = await sbFetch('/rest/v1/homepage_content?select=id,content');
  if (!Array.isArray(rows)) return;
  rows.forEach(r => { _data[r.id] = r.content; });
}

async function saveSection(sectionId, content) {
  return sbFetch('/rest/v1/homepage_content', {
    method: 'POST',
    headers: { ...SB_HEADERS, Prefer: 'resolution=merge-duplicates' },
    body: JSON.stringify({ id: sectionId, content, updated_at: new Date().toISOString() })
  });
}

/* ───────────────────────────────────────────────
   콘텐츠 → DOM 적용
─────────────────────────────────────────────── */
function get(sectionId, field) {
  return (_data[sectionId]?.[field]) ?? DEFAULTS[sectionId]?.[field] ?? '';
}

function getSection(sectionId) {
  const def = DEFAULTS[sectionId] || {};
  const db  = _data[sectionId] || {};
  return { ...def, ...db };
}

function applyField(el, value) {
  if (typeof value !== 'string') return;
  if (value.includes('\n')) {
    el.innerHTML = value.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/\n/g,'<br>');
  } else {
    el.textContent = value;
  }
}

function applyContent() {
  /* 단순 텍스트 필드 */
  document.querySelectorAll('[data-cms-field]').forEach(el => {
    const [sid, field] = el.dataset.cmsField.split('.');
    const val = get(sid, field);
    if (val !== undefined && val !== '') applyField(el, val);
  });

  /* 복합 섹션 렌더 */
  renderStatsList();
  renderHeroCardList();
  renderStepsList();
  renderRiseSupportList();
}

/* ── 통계 바 ── */
function renderStatsList() {
  const el = document.querySelector('[data-cms-list="stats.items"]');
  if (!el) return;
  const items = getSection('stats').items || [];
  el.innerHTML = items.map(it => `
    <div class="stat-item">
      <div class="stat-num">${esc(it.num)}<span>${esc(it.unit)}</span></div>
      <div class="stat-label">${esc(it.label)}</div>
    </div>`).join('');
}

/* ── 히어로 카드 목록 ── */
function renderHeroCardList() {
  const el = document.querySelector('[data-cms-list="hero.card_items"]');
  if (!el) return;
  const items = getSection('hero').card_items || [];
  el.innerHTML = items.map(it => `
    <li>
      <span class="ico">${esc(it.icon)}</span>
      <span><strong>${esc(it.title)}</strong><br>${esc(it.desc)}</span>
    </li>`).join('');
}

/* ── 신청 절차 ── */
function renderStepsList() {
  const el = document.querySelector('[data-cms-list="steps.items"]');
  if (!el) return;
  const items = getSection('steps').items || [];
  el.innerHTML = items.map(it => `
    <div class="step-item${it.status ? ' ' + it.status : ''}">
      <div class="step-num">${esc(it.icon)}</div>
      <div class="step-title">${esc(it.title)}</div>
      <div class="step-desc">${esc(it.desc)}</div>
    </div>`).join('');
}

/* ── RISE 지원 목록 ── */
function renderRiseSupportList() {
  const el = document.querySelector('[data-cms-list="rise_support.items"]');
  if (!el) return;
  const items = getSection('rise_support').items || [];
  el.innerHTML = items.map(it => `
    <li class="support-item">
      <div class="support-item-icon">${esc(it.icon)}</div>
      <div>
        <div class="support-item-title">
          ${esc(it.title)}
          ${it.badge ? `<span class="support-item-badge">${esc(it.badge)}</span>` : ''}
        </div>
        <div class="support-item-desc">${esc(it.desc)}</div>
      </div>
    </li>`).join('');
}

function esc(s) {
  return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ───────────────────────────────────────────────
   관리자 UI 마운트
─────────────────────────────────────────────── */
function mountAdminUI() {
  injectStyles();
  createFAB();
  createPanel();
}

function injectStyles() {
  const style = document.createElement('style');
  style.textContent = `
  /* ── FAB ── */
  #cms-fab {
    position: fixed; bottom: 28px; right: 28px; z-index: 8000;
    background: #17422e; color: #fff;
    border: none; border-radius: 100px;
    padding: 13px 22px; font-size: 14px; font-weight: 700;
    cursor: pointer; box-shadow: 0 6px 24px rgba(23,66,46,.45);
    display: flex; align-items: center; gap: 8px;
    font-family: 'Paperlogy','Noto Sans KR',sans-serif;
    transition: background .15s, transform .15s;
  }
  #cms-fab:hover { background: #0f2e1f; transform: translateY(-2px); }
  #cms-fab.active { background: #b07d1a; box-shadow: 0 6px 24px rgba(176,125,26,.45); }

  /* ── 섹션 편집 테두리 ── */
  .cms-editable-section {
    outline: 2.5px dashed rgba(176,125,26,.7) !important;
    outline-offset: 4px;
    position: relative;
  }
  .cms-edit-overlay {
    position: absolute; top: 10px; right: 10px; z-index: 7000;
    background: #b07d1a; color: #fff;
    border: none; border-radius: 8px;
    padding: 6px 14px; font-size: 12px; font-weight: 700;
    cursor: pointer; display: flex; align-items: center; gap: 5px;
    font-family: 'Paperlogy','Noto Sans KR',sans-serif;
    box-shadow: 0 3px 12px rgba(0,0,0,.2);
    pointer-events: all;
  }
  .cms-edit-overlay:hover { background: #8a5f12; }

  /* ── 사이드 패널 ── */
  #cms-panel {
    position: fixed; top: 0; right: -460px; bottom: 0; z-index: 9000;
    width: 440px; background: #fff;
    box-shadow: -8px 0 40px rgba(0,0,0,.18);
    display: flex; flex-direction: column;
    transition: right .3s cubic-bezier(.4,0,.2,1);
    font-family: 'Paperlogy','Noto Sans KR',sans-serif;
  }
  #cms-panel.open { right: 0; }

  .cms-panel-header {
    background: #17422e; color: #fff;
    padding: 18px 22px; display: flex; align-items: center; justify-content: space-between;
    flex-shrink: 0;
  }
  .cms-panel-header h3 { font-size: 15px; font-weight: 800; }
  .cms-panel-close {
    background: rgba(255,255,255,.18); border: none; color: #fff;
    width: 32px; height: 32px; border-radius: 50%;
    font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center;
  }
  .cms-panel-close:hover { background: rgba(255,255,255,.3); }

  /* 섹션 탭 */
  .cms-section-tabs {
    display: flex; flex-wrap: wrap; gap: 6px;
    padding: 14px 18px 0; flex-shrink: 0;
    border-bottom: 1px solid #eee;
    padding-bottom: 14px;
    background: #f9fafb;
  }
  .cms-stab {
    padding: 6px 13px; border-radius: 20px; font-size: 12px; font-weight: 700;
    border: 1.5px solid #ddd; background: #fff; color: #555;
    cursor: pointer; transition: all .15s;
    font-family: 'Paperlogy','Noto Sans KR',sans-serif;
  }
  .cms-stab.active { background: #17422e; color: #fff; border-color: #17422e; }
  .cms-stab:hover:not(.active) { border-color: #17422e; color: #17422e; }

  /* 폼 영역 */
  .cms-panel-body {
    flex: 1; overflow-y: auto;
    padding: 20px 18px;
    display: flex; flex-direction: column; gap: 0;
  }
  .cms-field-group { margin-bottom: 16px; }
  .cms-field-group label {
    display: block; font-size: 12px; font-weight: 700; color: #374151;
    margin-bottom: 6px;
  }
  .cms-field-group input, .cms-field-group textarea, .cms-field-group select {
    width: 100%; padding: 9px 12px;
    border: 1.5px solid #d1d5db; border-radius: 8px;
    font-size: 14px; color: #111827;
    font-family: 'Paperlogy','Noto Sans KR',sans-serif;
    transition: border-color .15s; outline: none;
    box-sizing: border-box;
  }
  .cms-field-group input:focus,
  .cms-field-group textarea:focus,
  .cms-field-group select:focus { border-color: #17422e; }
  .cms-field-group textarea { resize: vertical; min-height: 70px; line-height: 1.6; }

  /* 배열 행 편집기 */
  .cms-array-section { margin-bottom: 16px; }
  .cms-array-label {
    font-size: 12px; font-weight: 700; color: #17422e;
    margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between;
  }
  .cms-row {
    display: grid; gap: 6px;
    background: #f9fafb; border: 1.5px solid #e5e7eb;
    border-radius: 10px; padding: 10px 10px 10px 12px;
    margin-bottom: 7px; position: relative;
  }
  .cms-row input, .cms-row textarea, .cms-row select {
    padding: 7px 10px; border: 1.5px solid #d1d5db; border-radius: 6px;
    font-size: 13px; font-family: 'Paperlogy','Noto Sans KR',sans-serif;
    background: #fff; outline: none; box-sizing: border-box;
  }
  .cms-row input:focus, .cms-row textarea:focus, .cms-row select:focus { border-color: #17422e; }
  .cms-row-del {
    position: absolute; top: 8px; right: 8px;
    background: #fee2e2; color: #dc2626; border: none;
    width: 24px; height: 24px; border-radius: 50%;
    font-size: 14px; cursor: pointer; line-height: 1;
    display: flex; align-items: center; justify-content: center;
  }
  .cms-row-del:hover { background: #fecaca; }
  .cms-add-row-btn {
    width: 100%; padding: 8px; border-radius: 8px;
    border: 1.5px dashed #9ca3af; background: #fff;
    color: #6b7280; font-size: 13px; font-weight: 600;
    cursor: pointer; transition: all .15s;
    font-family: 'Paperlogy','Noto Sans KR',sans-serif;
    margin-top: 4px;
  }
  .cms-add-row-btn:hover { border-color: #17422e; color: #17422e; background: #f0fdf4; }

  .cms-divider { height: 1px; background: #e5e7eb; margin: 16px 0; }

  /* 푸터 버튼 */
  .cms-panel-footer {
    padding: 16px 18px; border-top: 1px solid #e5e7eb;
    display: flex; gap: 10px; flex-shrink: 0;
  }
  #cms-save-btn {
    flex: 1; padding: 12px; background: #17422e; color: #fff;
    border: none; border-radius: 10px; font-size: 14px; font-weight: 800;
    cursor: pointer; transition: background .15s;
    font-family: 'Paperlogy','Noto Sans KR',sans-serif;
  }
  #cms-save-btn:hover { background: #0f2e1f; }
  #cms-save-btn:disabled { background: #9ca3af; cursor: not-allowed; }
  #cms-cancel-btn {
    padding: 12px 18px; background: #f3f4f6; color: #374151;
    border: none; border-radius: 10px; font-size: 14px; font-weight: 600;
    cursor: pointer; transition: background .15s;
    font-family: 'Paperlogy','Noto Sans KR',sans-serif;
  }
  #cms-cancel-btn:hover { background: #e5e7eb; }

  /* 토스트 */
  #cms-toast {
    position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%);
    background: #111827; color: #fff; padding: 12px 24px;
    border-radius: 100px; font-size: 14px; font-weight: 600;
    opacity: 0; pointer-events: none; z-index: 9999;
    transition: opacity .25s;
    font-family: 'Paperlogy','Noto Sans KR',sans-serif;
  }
  #cms-toast.show { opacity: 1; }
  #cms-toast.success { background: #16a34a; }
  #cms-toast.error   { background: #dc2626; }

  /* 오버레이 다크 백드롭 */
  #cms-backdrop {
    position: fixed; inset: 0; z-index: 8500;
    background: rgba(0,0,0,.25);
    opacity: 0; pointer-events: none;
    transition: opacity .3s;
  }
  #cms-backdrop.show { opacity: 1; pointer-events: all; }
  `;
  document.head.appendChild(style);
}

function createFAB() {
  const fab = document.createElement('button');
  fab.id = 'cms-fab';
  fab.innerHTML = '✏️ 편집 모드';
  fab.addEventListener('click', toggleEditMode);
  document.body.appendChild(fab);
}

function createPanel() {
  /* 백드롭 */
  const bd = document.createElement('div');
  bd.id = 'cms-backdrop';
  bd.addEventListener('click', closePanel);
  document.body.appendChild(bd);

  /* 토스트 */
  const toast = document.createElement('div');
  toast.id = 'cms-toast';
  document.body.appendChild(toast);

  /* 패널 */
  const panel = document.createElement('div');
  panel.id = 'cms-panel';
  panel.innerHTML = `
    <div class="cms-panel-header">
      <h3 id="cms-panel-title">섹션 편집</h3>
      <button class="cms-panel-close" id="cms-panel-close">✕</button>
    </div>
    <div class="cms-section-tabs" id="cms-section-tabs"></div>
    <div class="cms-panel-body" id="cms-panel-body"></div>
    <div class="cms-panel-footer">
      <button id="cms-save-btn">💾 저장</button>
      <button id="cms-cancel-btn">취소</button>
    </div>`;
  document.body.appendChild(panel);

  document.getElementById('cms-panel-close').addEventListener('click', closePanel);
  document.getElementById('cms-cancel-btn').addEventListener('click', closePanel);
  document.getElementById('cms-save-btn').addEventListener('click', handleSave);

  /* 섹션 탭 생성 */
  const tabsEl = document.getElementById('cms-section-tabs');
  Object.entries(SCHEMA).forEach(([id, def]) => {
    const btn = document.createElement('button');
    btn.className = 'cms-stab';
    btn.dataset.sid = id;
    btn.textContent = def.label;
    btn.addEventListener('click', () => openPanel(id));
    tabsEl.appendChild(btn);
  });
}

/* ───────────────────────────────────────────────
   편집 모드 토글
─────────────────────────────────────────────── */
function toggleEditMode() {
  _editMode = !_editMode;
  const fab = document.getElementById('cms-fab');
  fab.innerHTML = _editMode ? '✕ 편집 모드 끄기' : '✏️ 편집 모드';
  fab.classList.toggle('active', _editMode);

  document.querySelectorAll('[data-cms-section]').forEach(sec => {
    if (_editMode) {
      sec.classList.add('cms-editable-section');
      if (!sec.querySelector('.cms-edit-overlay')) {
        const btn = document.createElement('button');
        btn.className = 'cms-edit-overlay';
        btn.innerHTML = '✏️ 편집';
        btn.dataset.sid = sec.dataset.cmsSection;
        btn.addEventListener('click', e => {
          e.stopPropagation();
          openPanel(sec.dataset.cmsSection);
        });
        sec.appendChild(btn);
      }
    } else {
      sec.classList.remove('cms-editable-section');
      sec.querySelectorAll('.cms-edit-overlay').forEach(b => b.remove());
      closePanel();
    }
  });
}

/* ───────────────────────────────────────────────
   패널 열기 / 닫기
─────────────────────────────────────────────── */
function openPanel(sectionId) {
  _activeId = sectionId;

  /* 탭 활성화 */
  document.querySelectorAll('.cms-stab').forEach(b => {
    b.classList.toggle('active', b.dataset.sid === sectionId);
  });

  document.getElementById('cms-panel-title').textContent = SCHEMA[sectionId]?.label || sectionId;
  document.getElementById('cms-panel-body').innerHTML = buildForm(sectionId);
  document.getElementById('cms-panel').classList.add('open');
  document.getElementById('cms-backdrop').classList.add('show');
}

function closePanel() {
  _activeId = null;
  document.getElementById('cms-panel').classList.remove('open');
  document.getElementById('cms-backdrop').classList.remove('show');
  document.querySelectorAll('.cms-stab').forEach(b => b.classList.remove('active'));
}

/* ───────────────────────────────────────────────
   폼 빌더
─────────────────────────────────────────────── */
function buildForm(sectionId) {
  const def     = SCHEMA[sectionId];
  const current = getSection(sectionId);
  let html = '';

  /* 단순 필드 */
  if (def.simple) {
    def.simple.forEach(f => {
      const val = esc(current[f.key] ?? '');
      html += `<div class="cms-field-group">
        <label>${f.label}</label>`;
      if (f.type === 'textarea') {
        html += `<textarea data-fkey="${f.key}" rows="3">${current[f.key] ?? ''}</textarea>`;
      } else {
        html += `<input type="text" data-fkey="${f.key}" value="${val}">`;
      }
      html += `</div>`;
    });
  }

  /* 배열 필드 */
  if (def.arrays) {
    def.arrays.forEach(arr => {
      const items = current[arr.key] || [];
      html += `<div class="cms-divider"></div>
        <div class="cms-array-section" data-arr-key="${arr.key}">
          <div class="cms-array-label">
            <span>${arr.label}</span>
          </div>
          <div class="cms-rows" id="cms-rows-${arr.key}">`;
      items.forEach((item, idx) => {
        html += buildRow(arr, item, idx);
      });
      html += `</div>
        <button class="cms-add-row-btn" data-add-arr="${arr.key}">＋ 항목 추가</button>
      </div>`;
    });
  }

  return html;
}

function buildRow(arrDef, item, idx) {
  const colDefs = arrDef.cols;
  const gridCols = colDefs.map(c => c.w).join(' ');
  let cells = colDefs.map(c => {
    if (c.options) {
      const opts = c.options.map(o =>
        `<option value="${esc(o)}" ${item[c.key] === o ? 'selected' : ''}>${o || '기본'}</option>`
      ).join('');
      return `<select data-col="${c.col || c.key}" title="${c.label}">${opts}</select>`;
    }
    return `<input type="text" data-col="${c.col || c.key}" value="${esc(item[c.key] ?? '')}" placeholder="${c.label}">`;
  }).join('');
  return `<div class="cms-row" style="grid-template-columns:${gridCols} 28px;" data-row-idx="${idx}">
    ${cells}
    <button class="cms-row-del" title="삭제">✕</button>
  </div>`;
}

/* ───────────────────────────────────────────────
   폼 이벤트 위임 (add row / del row)
─────────────────────────────────────────────── */
document.addEventListener('click', e => {
  /* 행 추가 */
  const addBtn = e.target.closest('[data-add-arr]');
  if (addBtn && _activeId) {
    const arrKey = addBtn.dataset.addArr;
    const arrDef = SCHEMA[_activeId]?.arrays?.find(a => a.key === arrKey);
    if (!arrDef) return;
    const emptyItem = {};
    arrDef.cols.forEach(c => { emptyItem[c.key] = ''; });
    const container = document.getElementById(`cms-rows-${arrKey}`);
    const idx = container.children.length;
    container.insertAdjacentHTML('beforeend', buildRow(arrDef, emptyItem, idx));
    return;
  }

  /* 행 삭제 */
  const delBtn = e.target.closest('.cms-row-del');
  if (delBtn) {
    delBtn.closest('.cms-row').remove();
  }
});

/* ───────────────────────────────────────────────
   저장
─────────────────────────────────────────────── */
async function handleSave() {
  if (!_activeId) return;
  const saveBtn = document.getElementById('cms-save-btn');
  saveBtn.disabled = true;
  saveBtn.textContent = '저장 중…';

  const content = collectForm(_activeId);
  const ok = await saveSection(_activeId, content);

  saveBtn.disabled = false;
  saveBtn.textContent = '💾 저장';

  if (ok) {
    _data[_activeId] = content;
    applyContent();
    showToast('✅ 저장되었습니다', 'success');
  } else {
    showToast('❌ 저장 실패 (Supabase 테이블을 확인하세요)', 'error');
  }
}

function collectForm(sectionId) {
  const def     = SCHEMA[sectionId];
  const body    = document.getElementById('cms-panel-body');
  const content = { ...getSection(sectionId) };

  /* 단순 필드 */
  if (def.simple) {
    body.querySelectorAll('[data-fkey]').forEach(el => {
      content[el.dataset.fkey] = el.value;
    });
  }

  /* 배열 필드 */
  if (def.arrays) {
    def.arrays.forEach(arr => {
      const rows = body.querySelectorAll(`#cms-rows-${arr.key} .cms-row`);
      content[arr.key] = Array.from(rows).map(row => {
        const item = {};
        row.querySelectorAll('[data-col]').forEach(inp => {
          item[inp.dataset.col] = inp.value;
        });
        return item;
      });
    });
  }

  return content;
}

/* ───────────────────────────────────────────────
   토스트
─────────────────────────────────────────────── */
function showToast(msg, type = '') {
  const t = document.getElementById('cms-toast');
  t.textContent = msg;
  t.className = `show ${type}`;
  setTimeout(() => { t.className = ''; }, 2800);
}

/* ───────────────────────────────────────────────
   초기화
─────────────────────────────────────────────── */
async function init() {
  await loadAllContent();
  applyContent();
  if (localStorage.getItem('rise_admin') === '1') {
    mountAdminUI();
  }
}

document.addEventListener('DOMContentLoaded', init);

/* 외부 노출 (admin.html에서 호출 가능) */
window.CMS = { openPanel, loadAllContent, applyContent, DEFAULTS, SCHEMA };

})();
