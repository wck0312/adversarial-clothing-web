'use client';

import { useState } from 'react';
import Header from '../../components/Header';

function TshirtPreview({
  patch = false,
  color = 'white',
  position = 'center',
  size = 'medium',
}: {
  patch?: boolean;
  color?: 'white' | 'black';
  position?: 'center' | 'left' | 'right';
  size?: 'small' | 'medium' | 'large';
}) {
  const patchLeft =
    position === 'left' ? '41%' : position === 'right' ? '59%' : '50%';

  const patchWidth =
    size === 'small' ? '14%' : size === 'large' ? '24%' : '19%';

  const previewMaxWidth =
    size === 'small'
      ? 'max-w-[280px] sm:max-w-[320px] lg:max-w-[360px]'
      : size === 'large'
      ? 'max-w-[320px] sm:max-w-[380px] lg:max-w-[420px]'
      : 'max-w-[300px] sm:max-w-[340px] lg:max-w-[380px]';

  const patchFill = color === 'black' ? '#FEF2F2' : '#18181B';
  const patchLine = color === 'black' ? '#18181B' : '#FEF2F2';

  return (
    <div className="flex min-h-[360px] items-center justify-center rounded-[24px] bg-gradient-to-br from-red-50 via-zinc-50 to-zinc-100 p-4 sm:min-h-[440px] sm:rounded-[32px] sm:p-6 lg:min-h-[520px]">
      <div className={`relative w-full ${previewMaxWidth}`}>
        <img
          src="/images/tshirt-front.png"
          alt={`${color === 'white' ? '화이트' : '블랙'} 티셔츠 미리보기`}
          className="block h-auto w-full select-none object-contain"
          draggable={false}
        />

        {patch && (
          <div
            className="absolute"
            style={{
              top: '38%',
              left: patchLeft,
              transform: 'translate(-50%, -50%)',
              width: patchWidth,
              aspectRatio: '1 / 1',
              borderRadius: '10px',
              backgroundColor: patchFill,
              boxShadow: '0 6px 16px rgba(0,0,0,0.18)',
            }}
          >
            <svg viewBox="0 0 100 100" className="h-full w-full" fill="none">
              <path
                d="M18 20L82 80"
                stroke={patchLine}
                strokeWidth="6"
                strokeLinecap="round"
              />
              <path
                d="M82 20L18 80"
                stroke={patchLine}
                strokeWidth="6"
                strokeLinecap="round"
              />
              <circle cx="30" cy="36" r="5" fill={patchLine} />
              <circle cx="63" cy="55" r="5" fill={patchLine} />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}

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
  const [generated, setGenerated] = useState(true);

  return (
    <main className="min-h-screen overflow-x-hidden bg-zinc-100 text-zinc-900">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:gap-5 sm:px-6 sm:py-6 lg:px-8">
        <Header />

        <section className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr] xl:items-start">
          <div className="rounded-[24px] border border-zinc-200 bg-white p-4 shadow-sm sm:rounded-[32px] sm:p-6 lg:p-8">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-sm font-semibold text-zinc-500">상품 미리보기</div>
                <h1 className="text-2xl font-bold sm:text-3xl lg:text-4xl">적대적 패치 티셔츠</h1>
              </div>
              <div className="w-fit rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
                Product Detail
              </div>
            </div>

            <TshirtPreview
              patch={generated}
              color={color}
              position={position}
              size={patchSize}
            />

            <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-xs leading-5 text-zinc-600">
              <p className="font-semibold text-zinc-700">이미지 출처</p>
              <p className="mt-1 break-words">
                T-shirt product image source:{' '}
                <a
                  href="https://www.freepik.com/free-psd/psd-isolated-opened-white-black-tshirt_47863339.htm#fromView=keyword&page=2&position=5&uuid=9bb697b9-6f5e-4825-b8c2-6f0486ae5c01&query=T+shirt+mockup"
                  target="_blank"
                  rel="noreferrer"
                  className="underline underline-offset-2 hover:text-zinc-900"
                >
                  Freepik - PSD isolated opened white black tshirt
                </a>
              </p>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl bg-zinc-100 p-4">
                <div className="text-xs text-zinc-500">색상</div>
                <div className="mt-1 font-semibold">{color === 'white' ? '화이트' : '블랙'}</div>
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
                <div className="text-xs text-red-700">사이즈</div>
                <div className="mt-1 font-semibold">{shirtSize}</div>
              </div>
            </div>
          </div>

          <aside className="rounded-[24px] border border-zinc-200 bg-white p-4 shadow-sm sm:rounded-[32px] sm:p-6 lg:p-7">
            <div className="border-b border-zinc-200 pb-5">
              <div className="text-sm font-semibold text-zinc-500">상품명</div>
              <h2 className="mt-1 text-xl font-bold sm:text-2xl">안보Easy 패치 티셔츠</h2>
              <p className="mt-3 text-sm leading-6 text-zinc-600">
                실제 주문 제작 상품 상세 페이지 느낌으로 구성한 연구용 데모 상품입니다.
                옵션 선택에 따라 티셔츠 시안이 즉시 변경됩니다.
              </p>
            </div>

            <div className="mt-5 space-y-5">
              <div>
                <div className="mb-3 text-sm font-semibold text-zinc-900">티셔츠 색상</div>
                <div className="grid grid-cols-2 gap-2">
                  <OptionButton active={color === 'white'} onClick={() => setColor('white')}>
                    화이트
                  </OptionButton>
                  <OptionButton active={color === 'black'} onClick={() => setColor('black')}>
                    블랙
                  </OptionButton>
                </div>
              </div>

              <div>
                <div className="mb-3 text-sm font-semibold text-zinc-900">패치 위치</div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  <OptionButton active={position === 'left'} onClick={() => setPosition('left')}>
                    좌측 가슴
                  </OptionButton>
                  <OptionButton active={position === 'center'} onClick={() => setPosition('center')}>
                    중앙
                  </OptionButton>
                  <OptionButton active={position === 'right'} onClick={() => setPosition('right')}>
                    우측 가슴
                  </OptionButton>
                </div>
              </div>

              <div>
                <div className="mb-3 text-sm font-semibold text-zinc-900">패치 크기</div>
                <div className="grid grid-cols-3 gap-2">
                  <OptionButton active={patchSize === 'small'} onClick={() => setPatchSize('small')}>
                    소형
                  </OptionButton>
                  <OptionButton active={patchSize === 'medium'} onClick={() => setPatchSize('medium')}>
                    중형
                  </OptionButton>
                  <OptionButton active={patchSize === 'large'} onClick={() => setPatchSize('large')}>
                    대형
                  </OptionButton>
                </div>
              </div>

              <div>
                <div className="mb-3 text-sm font-semibold text-zinc-900">의류 사이즈</div>
                <div className="grid grid-cols-4 gap-2">
                  <OptionButton active={shirtSize === 'S'} onClick={() => setShirtSize('S')}>
                    S
                  </OptionButton>
                  <OptionButton active={shirtSize === 'M'} onClick={() => setShirtSize('M')}>
                    M
                  </OptionButton>
                  <OptionButton active={shirtSize === 'L'} onClick={() => setShirtSize('L')}>
                    L
                  </OptionButton>
                  <OptionButton active={shirtSize === 'XL'} onClick={() => setShirtSize('XL')}>
                    XL
                  </OptionButton>
                </div>
              </div>

              <div>
                <div className="mb-3 text-sm font-semibold text-zinc-900">핏 선택</div>
                <div className="grid grid-cols-2 gap-2">
                  <OptionButton active={fit === 'basic'} onClick={() => setFit('basic')}>
                    기본핏
                  </OptionButton>
                  <OptionButton active={fit === 'overfit'} onClick={() => setFit('overfit')}>
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
                  onClick={() => setGenerated(true)}
                  className="rounded-2xl bg-red-600 px-5 py-3 font-medium text-white transition hover:bg-red-700"
                >
                  시안 생성하기
                </button>
                <button className="rounded-2xl border border-zinc-300 bg-white px-5 py-3 font-medium text-zinc-700 transition hover:bg-zinc-50">
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
              <button className="block w-full rounded-2xl bg-zinc-900 px-4 py-3 text-left text-white">
                상품 정보
              </button>
              <button className="block w-full rounded-2xl border border-zinc-300 px-4 py-3 text-left transition hover:bg-zinc-50">
                제작 가이드
              </button>
              <button className="block w-full rounded-2xl border border-zinc-300 px-4 py-3 text-left transition hover:bg-zinc-50">
                리뷰
              </button>
              <button className="block w-full rounded-2xl border border-zinc-300 px-4 py-3 text-left transition hover:bg-zinc-50">
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
                    <p>패치 적용 위치 선택 가능</p>
                    <p>패치 크기 단계별 선택 가능</p>
                    <p>발표용 시안 실시간 반영</p>
                    <p>향후 백엔드 연동 확장 가능</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[24px] border border-zinc-200 bg-white p-4 shadow-sm sm:rounded-[32px] sm:p-6">
              <h3 className="text-lg font-bold sm:text-xl">제작 가이드</h3>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <div className="rounded-[24px] bg-zinc-100 p-5">
                  <div className="text-sm font-semibold">파일 가이드</div>
                  <p className="mt-3 text-sm leading-6 text-zinc-600">
                    패치 이미지는 향후 PNG/JPG/PDF 형식으로 확장 가능하도록 설계했습니다.
                  </p>
                </div>
                <div className="rounded-[24px] bg-zinc-100 p-5">
                  <div className="text-sm font-semibold">인쇄 위치</div>
                  <p className="mt-3 text-sm leading-6 text-zinc-600">
                    가슴 중앙, 좌측 가슴, 우측 가슴 위치를 기준으로 시안을 구성했습니다.
                  </p>
                </div>
                <div className="rounded-[24px] bg-red-50 p-5">
                  <div className="text-sm font-semibold">확장 예정</div>
                  <p className="mt-3 text-sm leading-6 text-zinc-600">
                    실제 의류 사진 교체, 패치 이미지 업로드, 결과 저장 기능을 추가할 수 있습니다.
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
                    “패치 위치와 크기를 바꾸면서 시안을 바로 확인할 수 있어서 발표 시연에 적합했습니다.”
                  </p>
                </div>
                <div className="rounded-[24px] bg-zinc-100 p-5">
                  <div className="text-sm font-semibold">사용자 리뷰 02</div>
                  <p className="mt-3 text-sm leading-6 text-zinc-600">
                    “상품 상세페이지 구조라서 실제 커스텀 의류 서비스처럼 보였습니다.”
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