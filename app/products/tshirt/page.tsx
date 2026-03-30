'use client';

import { useState } from 'react';
import Header from '../../components/Header';
import Tshirt3DViewer from '../../components/Tshirt3DViewer';

function OptionButton({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border px-4 py-3 text-sm font-medium transition ${
        active
          ? 'border-red-600 bg-red-600 text-white shadow-sm'
          : 'border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50'
      }`}
    >
      {children}
    </button>
  );
}

export default function TshirtPage() {
  const [color, setColor] = useState<'white' | 'black'>('white');
  const [position, setPosition] = useState<'center' | 'left' | 'right'>('center');
  const [patchSize, setPatchSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [shirtSize, setShirtSize] = useState<'S' | 'M' | 'L' | 'XL'>('M');
  const [fit, setFit] = useState<'basic' | 'overfit'>('basic');

  return (
    <main className="min-h-screen overflow-x-hidden bg-zinc-100 text-zinc-900">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:gap-5 sm:px-6 sm:py-6 lg:px-8">
        <Header />

        <section className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr] xl:items-start">
          <div className="rounded-[24px] border border-zinc-200 bg-white p-4 shadow-sm sm:rounded-[32px] sm:p-6 lg:p-8">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-sm font-semibold text-zinc-500">3D 시연 미리보기</div>
                <h1 className="text-2xl font-bold sm:text-3xl lg:text-4xl">
                  적대적 패치 티셔츠
                </h1>
              </div>

              <div className="w-fit rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
                360° Viewer
              </div>
            </div>

            <Tshirt3DViewer
              color={color}
              patchImage="/images/default-patch.png"
              patchPosition={position}
              patchSize={patchSize}
              showPatch={true}
            />

            <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm leading-6 text-zinc-600">
              마우스로 드래그해서 티셔츠를 자유롭게 회전할 수 있습니다.
              앞면, 옆면, 뒷면까지 연속적으로 확인할 수 있도록 3D 시연 뷰어를 적용했습니다.
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl bg-zinc-100 p-4">
                <div className="text-xs text-zinc-500">색상</div>
                <div className="mt-1 font-semibold">
                  {color === 'white' ? '화이트' : '블랙'}
                </div>
              </div>

              <div className="rounded-2xl bg-zinc-100 p-4">
                <div className="text-xs text-zinc-500">패치 위치</div>
                <div className="mt-1 font-semibold">
                  {position === 'center'
                    ? '가슴 중앙'
                    : position === 'left'
                    ? '좌측 가슴'
                    : '우측 가슴'}
                </div>
              </div>

              <div className="rounded-2xl bg-zinc-100 p-4">
                <div className="text-xs text-zinc-500">패치 크기</div>
                <div className="mt-1 font-semibold">
                  {patchSize === 'small'
                    ? '소형'
                    : patchSize === 'medium'
                    ? '중형'
                    : '대형'}
                </div>
              </div>

              <div className="rounded-2xl bg-red-50 p-4">
                <div className="text-xs text-red-700">의류 사이즈</div>
                <div className="mt-1 font-semibold">{shirtSize}</div>
              </div>
            </div>
          </div>

          <aside className="rounded-[24px] border border-zinc-200 bg-white p-4 shadow-sm sm:rounded-[32px] sm:p-6 lg:p-7">
            <div className="border-b border-zinc-200 pb-5">
              <div className="text-sm font-semibold text-zinc-500">상품명</div>
              <h2 className="mt-1 text-xl font-bold sm:text-2xl">안보Easy 패치 티셔츠</h2>
              <p className="mt-3 text-sm leading-6 text-zinc-600">
                연구 발표용 시연 페이지입니다. 사용자가 직접 의류를 회전시키며
                패치 적용 결과를 입체적으로 확인할 수 있도록 구성했습니다.
              </p>
            </div>

            <div className="mt-5 space-y-5">
              <div>
                <div className="mb-3 text-sm font-semibold text-zinc-900">티셔츠 색상</div>
                <div className="grid grid-cols-2 gap-2">
                  <OptionButton
                    active={color === 'white'}
                    onClick={() => setColor('white')}
                  >
                    화이트
                  </OptionButton>
                  <OptionButton
                    active={color === 'black'}
                    onClick={() => setColor('black')}
                  >
                    블랙
                  </OptionButton>
                </div>
              </div>

              <div>
                <div className="mb-3 text-sm font-semibold text-zinc-900">패치 위치</div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  <OptionButton
                    active={position === 'left'}
                    onClick={() => setPosition('left')}
                  >
                    좌측 가슴
                  </OptionButton>
                  <OptionButton
                    active={position === 'center'}
                    onClick={() => setPosition('center')}
                  >
                    중앙
                  </OptionButton>
                  <OptionButton
                    active={position === 'right'}
                    onClick={() => setPosition('right')}
                  >
                    우측 가슴
                  </OptionButton>
                </div>
              </div>

              <div>
                <div className="mb-3 text-sm font-semibold text-zinc-900">패치 크기</div>
                <div className="grid grid-cols-3 gap-2">
                  <OptionButton
                    active={patchSize === 'small'}
                    onClick={() => setPatchSize('small')}
                  >
                    소형
                  </OptionButton>
                  <OptionButton
                    active={patchSize === 'medium'}
                    onClick={() => setPatchSize('medium')}
                  >
                    중형
                  </OptionButton>
                  <OptionButton
                    active={patchSize === 'large'}
                    onClick={() => setPatchSize('large')}
                  >
                    대형
                  </OptionButton>
                </div>
              </div>

              <div>
                <div className="mb-3 text-sm font-semibold text-zinc-900">의류 사이즈</div>
                <div className="grid grid-cols-4 gap-2">
                  <OptionButton
                    active={shirtSize === 'S'}
                    onClick={() => setShirtSize('S')}
                  >
                    S
                  </OptionButton>
                  <OptionButton
                    active={shirtSize === 'M'}
                    onClick={() => setShirtSize('M')}
                  >
                    M
                  </OptionButton>
                  <OptionButton
                    active={shirtSize === 'L'}
                    onClick={() => setShirtSize('L')}
                  >
                    L
                  </OptionButton>
                  <OptionButton
                    active={shirtSize === 'XL'}
                    onClick={() => setShirtSize('XL')}
                  >
                    XL
                  </OptionButton>
                </div>
              </div>

              <div>
                <div className="mb-3 text-sm font-semibold text-zinc-900">핏 선택</div>
                <div className="grid grid-cols-2 gap-2">
                  <OptionButton
                    active={fit === 'basic'}
                    onClick={() => setFit('basic')}
                  >
                    기본핏
                  </OptionButton>
                  <OptionButton
                    active={fit === 'overfit'}
                    onClick={() => setFit('overfit')}
                  >
                    오버핏
                  </OptionButton>
                </div>
              </div>

              <div className="rounded-[24px] bg-zinc-100 p-4">
                <div className="text-sm font-semibold text-zinc-900">선택 요약</div>
                <div className="mt-3 space-y-2 text-sm text-zinc-600">
                  <p>색상: {color === 'white' ? '화이트' : '블랙'}</p>
                  <p>
                    패치 위치:{' '}
                    {position === 'center'
                      ? '가슴 중앙'
                      : position === 'left'
                      ? '좌측 가슴'
                      : '우측 가슴'}
                  </p>
                  <p>
                    패치 크기:{' '}
                    {patchSize === 'small'
                      ? '소형'
                      : patchSize === 'medium'
                      ? '중형'
                      : '대형'}
                  </p>
                  <p>의류 사이즈: {shirtSize}</p>
                  <p>핏: {fit === 'basic' ? '기본핏' : '오버핏'}</p>
                </div>
              </div>

              <div className="grid gap-2">
                <button
                  type="button"
                  className="rounded-2xl bg-red-600 px-5 py-3 font-medium text-white transition hover:bg-red-700"
                >
                  시안 저장하기
                </button>
                <button
                  type="button"
                  className="rounded-2xl border border-zinc-300 bg-white px-5 py-3 font-medium text-zinc-700 transition hover:bg-zinc-50"
                >
                  장바구니 담기
                </button>
              </div>
            </div>
          </aside>
        </section>

        <section className="grid gap-4 xl:grid-cols-[220px_1fr]">
          <aside className="rounded-[24px] border border-zinc-200 bg-white p-4 shadow-sm sm:rounded-[32px] sm:p-5">
            <div className="text-sm font-semibold text-zinc-900">상세 메뉴</div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
              <button
                type="button"
                className="block w-full rounded-2xl bg-zinc-900 px-4 py-3 text-left text-white"
              >
                상품 정보
              </button>
              <button
                type="button"
                className="block w-full rounded-2xl border border-zinc-300 px-4 py-3 text-left transition hover:bg-zinc-50"
              >
                제작 가이드
              </button>
              <button
                type="button"
                className="block w-full rounded-2xl border border-zinc-300 px-4 py-3 text-left transition hover:bg-zinc-50"
              >
                리뷰
              </button>
              <button
                type="button"
                className="block w-full rounded-2xl border border-zinc-300 px-4 py-3 text-left transition hover:bg-zinc-50"
              >
                유의사항
              </button>
            </div>
          </aside>

          <div className="space-y-4 sm:space-y-5">
            <div className="rounded-[24px] border border-zinc-200 bg-white p-4 shadow-sm sm:rounded-[32px] sm:p-6">
              <h3 className="text-lg font-bold sm:text-xl">상품 정보</h3>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="rounded-[24px] bg-zinc-100 p-5">
                  <div className="text-sm font-semibold">기본 정보</div>
                  <div className="mt-3 space-y-2 text-sm text-zinc-600">
                    <p>상품명: 적대적 패치 티셔츠</p>
                    <p>소재: 면 100% (예시)</p>
                    <p>핏: 기본핏 / 오버핏 선택 가능</p>
                    <p>색상: 화이트 / 블랙</p>
                  </div>
                </div>

                <div className="rounded-[24px] bg-red-50 p-5">
                  <div className="text-sm font-semibold">실험 적용 정보</div>
                  <div className="mt-3 space-y-2 text-sm text-zinc-600">
                    <p>3D 회전 기반 시연 미리보기 제공</p>
                    <p>패치 적용 위치 선택 가능</p>
                    <p>패치 크기 단계별 선택 가능</p>
                    <p>향후 백엔드 연동 확장 가능</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[24px] border border-zinc-200 bg-white p-4 shadow-sm sm:rounded-[32px] sm:p-6">
              <h3 className="text-lg font-bold sm:text-xl">제작 가이드</h3>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <div className="rounded-[24px] bg-zinc-100 p-5">
                  <div className="text-sm font-semibold">3D 확인 방식</div>
                  <p className="mt-3 text-sm leading-6 text-zinc-600">
                    사용자는 마우스 드래그를 통해 티셔츠를 회전시키며 앞면, 측면, 뒷면을
                    연속적으로 확인할 수 있습니다.
                  </p>
                </div>

                <div className="rounded-[24px] bg-zinc-100 p-5">
                  <div className="text-sm font-semibold">패치 적용 기준</div>
                  <p className="mt-3 text-sm leading-6 text-zinc-600">
                    가슴 중앙, 좌측 가슴, 우측 가슴 위치를 기준으로 패치 실험 시안을
                    구성할 수 있도록 설계했습니다.
                  </p>
                </div>

                <div className="rounded-[24px] bg-red-50 p-5">
                  <div className="text-sm font-semibold">확장 예정</div>
                  <p className="mt-3 text-sm leading-6 text-zinc-600">
                    실제 패치 이미지 업로드, 모델 표면 적용, 결과 저장 기능으로 확장할 수
                    있습니다.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[24px] border border-zinc-200 bg-white p-4 shadow-sm sm:rounded-[32px] sm:p-6">
              <h3 className="text-lg font-bold sm:text-xl">리뷰 예시</h3>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="rounded-[24px] bg-zinc-100 p-5">
                  <div className="text-sm font-semibold">사용자 리뷰 01</div>
                  <p className="mt-3 text-sm leading-6 text-zinc-600">
                    “마우스로 회전하면서 앞면과 뒷면을 모두 볼 수 있어서 발표 시연용으로
                    훨씬 직관적이었습니다.”
                  </p>
                </div>

                <div className="rounded-[24px] bg-zinc-100 p-5">
                  <div className="text-sm font-semibold">사용자 리뷰 02</div>
                  <p className="mt-3 text-sm leading-6 text-zinc-600">
                    “상품 상세페이지 구조를 유지하면서도 3D 시연이 들어가서 연구 데모라는
                    느낌이 더 잘 살아났습니다.”
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}