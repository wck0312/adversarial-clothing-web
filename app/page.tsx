import Link from 'next/link';
import Header from './components/Header';

function HeroTshirt() {
  return (
    <div className="flex min-h-[280px] items-center justify-center rounded-[24px] bg-gradient-to-br from-red-50 via-zinc-50 to-zinc-100 p-4 sm:min-h-[320px] sm:rounded-[32px] lg:min-h-[360px]">
      <svg
        viewBox="0 0 240 240"
        className="h-[220px] w-[220px] sm:h-64 sm:w-64"
        fill="none"
      >
        <path
          d="M78 52L98 34H142L162 52L195 67L178 98L160 90V196H80V90L62 98L45 67L78 52Z"
          fill="#FFFFFF"
          stroke="#18181B"
          strokeWidth="6"
          strokeLinejoin="round"
        />
        <path
          d="M98 34C100 46 108 54 120 54C132 54 140 46 142 34"
          stroke="#18181B"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <rect x="96" y="94" width="56" height="56" rx="8" fill="#18181B" />
        <path d="M102 102L146 144" stroke="#FEF2F2" strokeWidth="4" strokeLinecap="round" />
        <path d="M146 102L102 144" stroke="#FEF2F2" strokeWidth="4" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-zinc-100 text-zinc-900">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:gap-5 sm:px-6 sm:py-6 lg:px-10">
        <Header />

        <section className="grid flex-1 items-stretch gap-4 lg:grid-cols-2 lg:gap-5">
          <div className="rounded-[24px] border border-zinc-200 bg-white p-5 shadow-sm sm:rounded-[32px] sm:p-8 lg:p-10">
            <div className="mb-4 inline-flex rounded-full bg-red-600 px-4 py-2 text-xs font-semibold text-white">
              Adversarial Patch Research Demo
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              적대적 패치 의류
              <br />
              제작 스튜디오 데모
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-7 text-zinc-600 sm:text-base">
              본 프로젝트는 물리적 적대적 패치를 실제 의류에 적용하여 YOLO 기반 사람 탐지
              회피 가능성을 검증하고, 부위별 패치 위치와 의류 조합에 따른 효과를 비교하는
              것을 목표로 합니다. 웹에서는 적대적 패치 적용 의류를 선택하고 시연 구성을
              확인할 수 있도록 설계했습니다.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/products/tshirt"
                className="rounded-2xl bg-zinc-900 px-5 py-3 text-center font-medium text-white transition hover:bg-black"
              >
                적대적 패치 시연 시작
              </Link>

              <button
                type="button"
                className="rounded-2xl border border-zinc-300 bg-white px-5 py-3 font-medium text-zinc-700 transition hover:bg-zinc-50"
              >
                연구 개요 보기
              </button>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <div className="rounded-2xl bg-zinc-100 p-4">
                <div className="text-xs text-zinc-500">연구 주제</div>
                <div className="mt-1 font-semibold">물리적 적대적 패치 의류 적용</div>
              </div>

              <div className="rounded-2xl bg-zinc-100 p-4">
                <div className="text-xs text-zinc-500">검증 목표</div>
                <div className="mt-1 font-semibold">YOLO 기반 탐지 회피 효과 비교</div>
              </div>

              <div className="rounded-2xl bg-red-50 p-4 sm:col-span-2 xl:col-span-1">
                <div className="text-xs text-red-700">웹 구현 범위</div>
                <div className="mt-1 font-semibold">티셔츠 및 복수 의류 조합 시연</div>
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border border-zinc-200 bg-white p-5 shadow-sm sm:rounded-[32px] sm:p-6 lg:p-8">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-sm font-semibold text-zinc-500">대표 시연 시안</div>
                <h2 className="text-xl font-bold sm:text-2xl">적대적 패치 티셔츠 미리보기</h2>
              </div>

              <span className="w-fit rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
                Demo Preview
              </span>
            </div>

            <HeroTshirt />

            <Link
              href="/products/tshirt"
              className="mt-5 block rounded-2xl bg-red-600 px-5 py-3 text-center font-medium text-white transition hover:bg-red-700"
            >
              티셔츠 패치 시연 보기
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}