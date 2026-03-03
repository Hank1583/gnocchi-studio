"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type LinkItem = { title: string; url: string; note?: string };

function useInstagramEmbedProcess(dep: any) {
  useEffect(() => {
    const run = () => (window as any).instgrm?.Embeds?.process?.();

    const existing = document.querySelector(
      'script[src="https://www.instagram.com/embed.js"]'
    ) as HTMLScriptElement | null;

    if (existing) {
      run();
      return;
    }

    const s = document.createElement("script");
    s.async = true;
    s.src = "https://www.instagram.com/embed.js";
    s.onload = run;
    document.body.appendChild(s);
  }, [dep]);
}

function InstagramEmbed({ url }: { url: string }) {
  // 去掉 query，避免 embed 不吃 ?img_index
  const cleanUrl = useMemo(() => url.split("?")[0], [url]);

  useEffect(() => {
    const run = () => (window as any).instgrm?.Embeds?.process?.();

    const existing = document.querySelector(
      'script[src="https://www.instagram.com/embed.js"]'
    ) as HTMLScriptElement | null;

    if (existing) {
      // 等 DOM 更新後再 process（很重要）
      setTimeout(run, 50);
      return;
    }

    const s = document.createElement("script");
    s.async = true;
    s.src = "https://www.instagram.com/embed.js";
    s.onload = () => setTimeout(run, 50);
    document.body.appendChild(s);
  }, [cleanUrl]);

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={cleanUrl}
        data-instgrm-version="14"
        style={{
          background: "#fff",
          border: 0,
          margin: 0,
          width: "100%",
          maxWidth: 560,
        }}
      />
    </div>
  );
}

export default function Home() {
  const profile = {
    handle: "gnocchi.studio",
    name: "Gnocchi.Studio 麵疙瘩狗",
    bioLines: [
      "𓂃⟡.·即使生活不愉快，也要很可愛(๑´ڡ`๑)🎄",
      "❄️編織限定款麵疙瘩娃娃｜販售中",
      "✉️合作｜gnocchi.studio@gmail.com",
      "🩵聯名周邊🩵購買這邊請👇商品型錄在精選動態",
    ],
    igUrl: "https://www.instagram.com/gnocchi.studio/",
  };

  const links: LinkItem[] = [
    {
      title: "麵疙瘩狗的家 💙",
      url: "https://myship.7-11.com.tw/general/detail/GM2412028185638",
    },
    {
      title: "獨角獸 x 麵疙瘩狗 聯名",
      url: "https://bmai.app/b7b993bb",
    },
    {
      title: "LINE 貼圖（節慶篇）",
      url: "https://store.line.me/stickershop/product/32351683/zh-Hant",
    },
    {
      title: "編織限定款賣場／新年紅包袋",
      url: "https://myship.7-11.com.tw/general/detail/GM2512250828207",
    },
  ];

  // 你提供的 IG 精選貼文（輪播）
  const featuredPosts = [
    "https://www.instagram.com/p/DVaSIFzE60x/",
    "https://www.instagram.com/p/DU2moBvky0Q/?img_index=1",
    "https://www.instagram.com/p/DU0X5E8Ew-A/?img_index=1",
    "https://www.instagram.com/p/DUw6IgLE4rC/?img_index=1",
    "https://www.instagram.com/p/DUvx2RSE44a/",
  ];

  // 輪播控制
  const [index, setIndex] = useState(0);
  const max = featuredPosts.length;

  const go = (n: number) => {
    const next = (n + max) % max;
    setIndex(next);
  };

  // 可選：自動輪播（不想要就把這段 useEffect 刪掉）
  useEffect(() => {
    const t = setInterval(() => go(index + 1), 6000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  // 導覽 anchor
  const refFeatured = useRef<HTMLElement | null>(null);
  const refAbout = useRef<HTMLElement | null>(null);
  const refLinks = useRef<HTMLElement | null>(null);

  const scrollTo = (el: HTMLElement | null) => {
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main style={{ background: "#fff", minHeight: "100vh" }}>
      {/* Top Nav */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid #eee",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "14px 18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img
              src="/logo.jpg"
              alt="gnocchi.studio logo"
              width={44}
              height={44}
              style={{ borderRadius: 12, border: "1px solid #eee" }}
            />
            <div style={{ lineHeight: 1.1 }}>
              <div style={{ fontWeight: 800 }}>{profile.name}</div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>@{profile.handle}</div>
            </div>
          </div>

          {/* 右側選單 */}
          <nav style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <NavBtn onClick={() => scrollTo(refFeatured.current)}>精選</NavBtn>
            <NavBtn onClick={() => scrollTo(refAbout.current)}>關於</NavBtn>
            <NavBtn onClick={() => scrollTo(refLinks.current)}>購買連結</NavBtn>
            <a
              href={profile.igUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                padding: "10px 12px",
                borderRadius: 999,
                border: "1px solid #111",
                textDecoration: "none",
                fontSize: 14,
              }}
            >
              Instagram →
            </a>
          </nav>
        </div>
      </header>

      {/* Hero / Featured Carousel */}
      <section
        ref={(n) => {
          refFeatured.current = n;
        }}
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "28px 18px 10px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 0.9fr",
            gap: 20,
            alignItems: "start",
          }}
        >
          {/* 左：輪播 */}
          <div
            style={{
              border: "1px solid #eee",
              borderRadius: 18,
              overflow: "hidden",
              padding: 14,
              background: "#fafafa",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 18 }}>IG 精選</div>
                <div style={{ fontSize: 12, opacity: 0.7 }}>最新作品 / 活動 / 上架資訊</div>
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <SmallBtn onClick={() => go(index - 1)}>←</SmallBtn>
                <SmallBtn onClick={() => go(index + 1)}>→</SmallBtn>
              </div>
            </div>

            <div style={{ marginTop: 12, display: "flex", justifyContent: "center" }}>
              <InstagramEmbed key={featuredPosts[index].split("?")[0]} url={featuredPosts[index]} />
            </div>

            {/* dots */}
            <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 10 }}>
              {featuredPosts.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 999,
                    border: 0,
                    background: i === index ? "#111" : "#ddd",
                    cursor: "pointer",
                  }}
                />
              ))}
            </div>
          </div>

          {/* 右：品牌文字區（官網感） */}
          <div
            style={{
              border: "1px solid #eee",
              borderRadius: 18,
              padding: 18,
            }}
          >
            <div style={{ fontWeight: 900, fontSize: 22, lineHeight: 1.2 }}>
              即使生活不愉快，<br />
              也要很可愛。
            </div>
            <p style={{ marginTop: 10, opacity: 0.8, lineHeight: 1.8 }}>
              Gnocchi.Studio 麵疙瘩狗 — 編織限定款娃娃、周邊與聯名商品。
              這裡是簡單的小官網，快速找到最新精選與購買連結。
            </p>

            <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 8 }}>
              <Pill>編織娃娃</Pill>
              <Pill>限定販售</Pill>
              <Pill>聯名周邊</Pill>
              <Pill>LINE 貼圖</Pill>
            </div>

            <div style={{ marginTop: 16, display: "grid", gap: 10 }}>
              <a
                href={`mailto:${profile.bioLines[2].split("｜").pop() ?? "gnocchi.studio@gmail.com"}`}
                style={{
                  display: "block",
                  padding: "12px 14px",
                  borderRadius: 14,
                  border: "1px solid #eee",
                  textDecoration: "none",
                }}
              >
                <div style={{ fontWeight: 700 }}>合作洽談</div>
                <div style={{ fontSize: 12, opacity: 0.7 }}>gnocchi.studio@gmail.com</div>
              </a>

              <a
                href={profile.igUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "block",
                  padding: "12px 14px",
                  borderRadius: 14,
                  border: "1px solid #111",
                  textDecoration: "none",
                }}
              >
                <div style={{ fontWeight: 700 }}>看更多作品</div>
                <div style={{ fontSize: 12, opacity: 0.7 }}>前往 Instagram</div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section
        ref={(n) => {
          refAbout.current = n;
        }}
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "18px 18px 6px",
        }}
      >
        <div style={{ borderTop: "1px solid #eee", paddingTop: 18 }}>
          <h2 style={{ margin: 0, fontSize: 18 }}>介紹</h2>
          <div style={{ marginTop: 10, lineHeight: 1.9, opacity: 0.85 }}>
            {profile.bioLines.map((t) => (
              <div key={t}>{t}</div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Links */}
      <section
        ref={(n) => {
          refLinks.current = n;
        }}
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "18px 18px 40px",
        }}
      >
        <div style={{ borderTop: "1px solid #eee", paddingTop: 18 }}>
          <h2 style={{ margin: 0, fontSize: 18 }}>購買連結</h2>

          <div
            style={{
              marginTop: 12,
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 12,
            }}
          >
            {links.map((l) => (
              <a
                key={l.url}
                href={l.url}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "block",
                  padding: "14px 16px",
                  border: "1px solid #eee",
                  borderRadius: 16,
                  textDecoration: "none",
                }}
              >
                <div style={{ fontWeight: 800 }}>{l.title}</div>
                <div style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>
                  點我前往
                </div>
              </a>
            ))}
          </div>

          <footer style={{ marginTop: 18, fontSize: 12, opacity: 0.6 }}>
            © {new Date().getFullYear()} {profile.name}
          </footer>
        </div>
      </section>
    </main>
  );
}

function NavBtn({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "10px 12px",
        borderRadius: 999,
        border: "1px solid #eee",
        background: "#fff",
        cursor: "pointer",
        fontSize: 14,
      }}
    >
      {children}
    </button>
  );
}

function SmallBtn({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 36,
        height: 36,
        borderRadius: 999,
        border: "1px solid #eaeaea",
        background: "#fff",
        cursor: "pointer",
        fontSize: 14,
      }}
    >
      {children}
    </button>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        padding: "6px 10px",
        border: "1px solid #eee",
        borderRadius: 999,
        fontSize: 12,
        opacity: 0.85,
      }}
    >
      {children}
    </span>
  );
}