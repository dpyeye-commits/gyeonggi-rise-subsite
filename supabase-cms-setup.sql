-- ============================================================
-- homepage_content 테이블 — 홈페이지 CMS 섹션 저장
-- Supabase SQL Editor에 붙여넣고 실행하세요
-- ============================================================

-- 1. 테이블 생성
CREATE TABLE IF NOT EXISTS homepage_content (
  id          TEXT PRIMARY KEY,        -- 섹션 ID (hero, stats, ...)
  content     JSONB NOT NULL DEFAULT '{}',
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 2. RLS 활성화
ALTER TABLE homepage_content ENABLE ROW LEVEL SECURITY;

-- 3. 정책: anon 읽기 허용 (공개 홈페이지에서 fetch)
CREATE POLICY "public_read" ON homepage_content
  FOR SELECT TO anon USING (true);

-- 4. 정책: anon 쓰기 허용 (관리자 localStorage 체크는 클라이언트에서 수행)
--    서버 인증이 필요하면 이 정책을 service_role 전용으로 변경하세요
CREATE POLICY "public_write" ON homepage_content
  FOR ALL TO anon USING (true) WITH CHECK (true);

-- ============================================================
-- 5. 기본 데이터 INSERT (처음 1회만 실행)
--    이미 데이터가 있으면 CONFLICT 무시
-- ============================================================

INSERT INTO homepage_content (id, content) VALUES
('hero', '{
  "main_badge": "🌿 중부대학교 자연치유학과 공식 과정",
  "rise_badge": "경기 RISE 지원",
  "h1_line1": "자연치유 지식을",
  "h1_em": "건강콘텐츠",
  "h1_line3": "세상에 전하다",
  "description": "누구나 시작할 수 있는 실전 중심 교육 — 영상 제작부터 SNS 운영, 개인 브랜드 상표 등록까지 체계적으로 지원합니다.",
  "btn_main": "지금 신청하기",
  "btn_ghost": "교육 과정 보기 →",
  "card_title": "✦ 핵심 혜택",
  "card_items": [
    {"icon": "💰", "title": "교육비 전액 무료",    "desc": "경기도 RISE 지원으로 수강료 100% 면제"},
    {"icon": "🎬", "title": "영상 제작 전 과정",   "desc": "기획·촬영·편집·채널 운영까지 실전 실습"},
    {"icon": "™️",  "title": "개인 상표 등록 지원", "desc": "수료 후 개인 브랜드 상표 등록 무료 지원"},
    {"icon": "🤝", "title": "1:1 개인 멘토링",     "desc": "담당 교수와 채널 성장 전략 수립"}
  ]
}')
ON CONFLICT (id) DO NOTHING;

INSERT INTO homepage_content (id, content) VALUES
('stats', '{
  "items": [
    {"num": "100", "unit": "%",  "label": "교육비 전액 지원"},
    {"num": "16",  "unit": "주", "label": "집중 커리큘럼"},
    {"num": "1",   "unit": ":1", "label": "개인 멘토링"},
    {"num": "무료", "unit": "",  "label": "상표 등록 지원"}
  ]
}')
ON CONFLICT (id) DO NOTHING;

INSERT INTO homepage_content (id, content) VALUES
('features_header', '{
  "tag": "PROGRAM FEATURES",
  "h2":  "왜 자연치유학과\n크리에이터 과정인가",
  "p":   "건강·치유 분야의 전문 지식과 디지털 콘텐츠 제작 역량을 동시에 키웁니다."
}')
ON CONFLICT (id) DO NOTHING;

INSERT INTO homepage_content (id, content) VALUES
('rise_support', '{
  "tag": "RISE SUPPORT",
  "h2":  "경기 RISE 사업단이\n함께합니다",
  "p":   "경기도 대학혁신지원(RISE) 사업의 특별 지원으로 진행되는 과정입니다.",
  "items": [
    {"icon": "💰", "title": "교육비 전액 지원",         "badge": "RISE 지원", "desc": "수강료·교재비 포함 교육비 전액을 경기도 RISE 사업단에서 지원합니다. 개인 부담 없이 전문 교육을 받을 수 있습니다."},
    {"icon": "🖥️", "title": "장비·소프트웨어 무상 지원", "badge": "",         "desc": "촬영 장비, 편집 소프트웨어 라이선스를 교육 기간 동안 무상으로 제공합니다."},
    {"icon": "🏢", "title": "기업 연계 실습 기회",       "badge": "",         "desc": "경기도 RISE 얼라이언스 기업들과 연계한 실무 인턴십 및 프로젝트 참여 기회를 제공합니다."},
    {"icon": "📜", "title": "공식 수료 인증서 발급",      "badge": "",         "desc": "중부대학교 총장 명의 수료 인증서 및 경기도 RISE 사업단 인증서를 함께 발급합니다."}
  ]
}')
ON CONFLICT (id) DO NOTHING;

INSERT INTO homepage_content (id, content) VALUES
('curriculum_header', '{
  "tag": "CURRICULUM",
  "h2":  "16주 집중 커리큘럼",
  "p":   "이론과 실습을 균형 있게 구성한 자연치유 크리에이터 양성 과정입니다."
}')
ON CONFLICT (id) DO NOTHING;

INSERT INTO homepage_content (id, content) VALUES
('steps', '{
  "h2": "간단한 신청 절차",
  "p":  "온라인 신청 후 담당자 확인 → 합격 통보까지 빠르게 진행됩니다.",
  "items": [
    {"icon": "📝", "title": "온라인 신청", "desc": "신청 양식 작성 및 지원 동기 제출",  "status": "done"},
    {"icon": "📋", "title": "서류 검토",   "desc": "담당자 검토 후 3일 내 결과 통보",  "status": "done"},
    {"icon": "📞", "title": "개별 상담",   "desc": "유선 또는 대면 간단 상담 진행",    "status": "active"},
    {"icon": "✅", "title": "최종 합격",   "desc": "합격 통보 및 OT 안내",            "status": ""},
    {"icon": "🎬", "title": "교육 시작",   "desc": "16주 집중 교육 수강",             "status": ""}
  ]
}')
ON CONFLICT (id) DO NOTHING;

INSERT INTO homepage_content (id, content) VALUES
('cta_banner', '{
  "h2":        "지금 바로 신청하세요",
  "p":         "교육비 전액 무료 · 선착순 모집 · 2026학년도 모집 중",
  "btn_main":  "수강 신청",
  "btn_ghost": "교육 과정 보기"
}')
ON CONFLICT (id) DO NOTHING;

INSERT INTO homepage_content (id, content) VALUES
('footer', '{
  "address":   "경기도 고양시 덕양구 동헌로 305, 중부대학교 고양캠퍼스",
  "phone":     "031-8075-1000",
  "email":     "chiyu@joongbu.ac.kr",
  "copyright": "© 2025 중부대학교 자연치유학과. 경기도 RISE 사업단 연계 교육과정."
}')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 확인 쿼리
-- ============================================================
SELECT id, jsonb_pretty(content), updated_at FROM homepage_content ORDER BY id;
