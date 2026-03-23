'use client';

import Link from 'next/link';
import { useState } from 'react';

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="2" />
      <path d="M16 16L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
      <path
        d="M12 20.2C11.7 20.2 11.5 20.1 11.3 19.9L4.8 13.8C3.2 12.3 3 9.8 4.3 8.1C5.6 6.4 8 6.1 9.7 7.2L12 8.8L14.3 7.2C16 6.1 18.4 6.4 19.7 8.1C21 9.8 20.8 12.3 19.2 13.8L12.7 19.9C12.5 20.1 12.3 20.2 12 20.2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
      <path
        d="M3 5H5L7.2 14.5H18.2L20.5 8H8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9.5" cy="19" r="1.5" fill="currentColor" />
      <circle cx="17" cy="19" r="1.5" fill="currentColor" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="2" />
      <path
        d="M5 20C5.8 16.8 8.5 15 12 15C15.5 15 18.2 16.8 19 20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
      <path
        d="M6 9L12 15L18 9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
      <path
        d="M4 7H20M4 12H20M4 17H20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
      <path
        d="M6 6L18 18M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconButton({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-2xl border border-zinc-300 bg-white text-zinc-700 transition hover:border-red-400 hover:bg-red-50 hover:shadow-sm"
    >
      {children}
    </button>
  );
}

const clothingItems = [
  { name: '티셔츠', href: '/products/tshirt', clickable: true },
  { name: '셔츠', href: '#', clickable: false },
  { name: '맨투맨', href: '#', clickable: false },
  { name: '모자', href: '#', clickable: false },
  { name: '바지', href: '#', clickable: false },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileClothingOpen, setMobileClothingOpen] = useState(false);

  return (
    <header className="rounded-[24px] border border-zinc-200 bg-white px-4 py-4 shadow-sm sm:rounded-[28px] sm:px-5">
      <div className="flex items-center justify-between gap-3">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-zinc-900 shadow-sm sm:h-11 sm:w-11">
            <div className="h-3 w-3 rounded-full bg-red-500" />
          </div>
          <div className="truncate text-xl font-extrabold tracking-tight text-zinc-900 sm:text-2xl">
            안보<span className="text-red-600">Easy</span>
          </div>
        </Link>

        <div className="hidden flex-1 items-center justify-center md:flex">
          <div className="flex h-11 w-full max-w-xl items-center gap-2 rounded-2xl border border-zinc-300 bg-zinc-50 px-4">
            <SearchIcon />
            <input
              className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-400"
              placeholder="적대적 패치, 의류 조합, 시연 구성 검색"
            />
          </div>
        </div>

        <div className="hidden items-center gap-2 sm:flex">
          <IconButton label="좋아요">
            <HeartIcon />
          </IconButton>
          <IconButton label="장바구니">
            <CartIcon />
          </IconButton>
          <IconButton label="마이페이지">
            <UserIcon />
          </IconButton>
        </div>

        <button
          type="button"
          aria-label="모바일 메뉴"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-zinc-300 bg-white text-zinc-700 transition hover:border-red-400 hover:bg-red-50 sm:hidden"
        >
          {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      <div className="mt-4 md:hidden">
        <div className="flex h-11 w-full items-center gap-2 rounded-2xl border border-zinc-300 bg-zinc-50 px-4">
          <SearchIcon />
          <input
            className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-400"
            placeholder="적대적 패치, 의류 조합, 시연 구성 검색"
          />
        </div>
      </div>

      <nav className="mt-4 hidden flex-wrap items-center gap-x-6 gap-y-3 border-t border-zinc-200 pt-3 text-sm text-zinc-600 sm:flex">
        <Link href="/" className="font-medium text-zinc-900">
          홈
        </Link>

        <div className="relative group">
          <button
            type="button"
            className="flex items-center gap-1 font-medium text-red-600 transition"
          >
            의류
            <ChevronDownIcon />
          </button>

          <div className="invisible absolute left-0 top-full z-50 mt-3 w-52 translate-y-1 rounded-2xl border border-zinc-200 bg-white p-2 opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
            {clothingItems.map((item) =>
              item.clickable ? (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block rounded-xl px-3 py-2 text-sm font-medium text-zinc-900 transition hover:bg-red-50 hover:text-red-600"
                >
                  {item.name}
                </Link>
              ) : (
                <button
                  key={item.name}
                  type="button"
                  className="block w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-zinc-900 transition hover:bg-red-50 hover:text-red-600"
                >
                  {item.name}
                </button>
              )
            )}
          </div>
        </div>

        <button type="button" className="transition hover:text-red-600">
          패치 설계
        </button>
        <button type="button" className="transition hover:text-red-600">
          시연 구성
        </button>
        <button type="button" className="transition hover:text-red-600">
          연구 개요
        </button>
        <button type="button" className="transition hover:text-red-600">
          방어 인사이트
        </button>
      </nav>

      {mobileMenuOpen && (
        <div className="mt-4 space-y-3 border-t border-zinc-200 pt-4 sm:hidden">
          <Link
            href="/"
            className="block rounded-2xl border border-zinc-200 px-4 py-3 text-sm font-medium text-zinc-900"
            onClick={() => setMobileMenuOpen(false)}
          >
            홈
          </Link>

          <div className="rounded-2xl border border-zinc-200">
            <button
              type="button"
              onClick={() => setMobileClothingOpen((prev) => !prev)}
              className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-red-600"
            >
              의류
              <ChevronDownIcon />
            </button>

            {mobileClothingOpen && (
              <div className="border-t border-zinc-200 px-2 py-2">
                {clothingItems.map((item) =>
                  item.clickable ? (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="block rounded-xl px-3 py-2 text-sm font-medium text-zinc-900 transition hover:bg-red-50 hover:text-red-600"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ) : (
                    <button
                      key={item.name}
                      type="button"
                      className="block w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-zinc-500"
                    >
                      {item.name}
                    </button>
                  )
                )}
              </div>
            )}
          </div>

          <button
            type="button"
            className="block w-full rounded-2xl border border-zinc-200 px-4 py-3 text-left text-sm font-medium text-zinc-700"
          >
            패치 설계
          </button>
          <button
            type="button"
            className="block w-full rounded-2xl border border-zinc-200 px-4 py-3 text-left text-sm font-medium text-zinc-700"
          >
            시연 구성
          </button>
          <button
            type="button"
            className="block w-full rounded-2xl border border-zinc-200 px-4 py-3 text-left text-sm font-medium text-zinc-700"
          >
            연구 개요
          </button>
          <button
            type="button"
            className="block w-full rounded-2xl border border-zinc-200 px-4 py-3 text-left text-sm font-medium text-zinc-700"
          >
            방어 인사이트
          </button>

          <div className="grid grid-cols-3 gap-2 pt-1">
            <IconButton label="좋아요">
              <HeartIcon />
            </IconButton>
            <IconButton label="장바구니">
              <CartIcon />
            </IconButton>
            <IconButton label="마이페이지">
              <UserIcon />
            </IconButton>
          </div>
        </div>
      )}
    </header>
  );
}