# frontend_app 多言語対応：調査メモ

対象パッケージ: [packages/frontend_app](../packages/frontend_app)（Next 16 / `src/app`、調査時点で i18n 未導入）

参考: [Next.js App Router — Internationalization](https://nextjs.org/docs/app/guides/internationalization)

---

## 1. 評価の前提（要件）

以下を同時に満たす方向でライブラリを比較した。

1. **検知 A / B / C を typecheck で押さえたい**
   - **A** — コードが参照するキーが辞書に存在しない（誤キー・タイポ）
   - **B** — ベースロケールにあるキーが、別ロケールの辞書に欠けている
   - **C** — プレースホルダ（例: ICU の `{name}`）と呼び出し時の引数オブジェクトが不一致
2. **build（または i18n 用コード生成）を typecheck の前に必須にしない**  
   目標: **`tsc --noEmit`（本リポジトリでは `bun run typecheck`）のみ**で品質ゲートにできること。
3. **辞書は可能なら TS で宣言**（共有型 + 各ロケール `satisfies` で **B** を構造的に取る）

### 「build 不要」は next-international だけか

**いいえ。** 意味は「i18n 用の codegen / カタログ compile を `tsc` の前に必須にしない」こと。

- **next-international** — 専用 codegen なしで相性が良い。
- **next-intl** — **`createMessagesDeclaration` を使わない**運用なら、辞書を TS にし `Messages` を `typeof enMessages` で結べば **`tsc` だけで型検査可能**。
- **Tolgee 等** — ライブラリが翻訳 compile を強制しないことは多いが、**A/B/C を型で固める**とは別問題。
- **自前の `t()` + TS 辞書** — 当然 build 不要（ルーティング・DX は自前）。

---

## 2. 除外・優先度が下がりやすいもの

- **[next-i18n-router](https://github.com/i18nexus/next-i18n-router)** — ルーティング専用。辞書 API なし（比較対象外）。
- **Paraglide** — 生成が前提 → 要件 2 と相性悪（生成後は ABC は強い）。
- **Lingui** — `lingui compile` 文化 → 要件 2 と衝突しやすい。
- **next-intl + `createMessagesDeclaration`** — `.d.json.ts` は `next dev` / `next build` 等で生成 → 「generate なし `tsc` だけ」とは両立しにくい。
- **Tolgee / gt-next** — 典型 API は文字列キーで **A** が弱い。
- **Intlayer** — Next ビルドパイプライン依存 → 「純 `tsc`」の線引き要確認。

---

## 3. TS で A/B/C を寄せるときの注意

### A と B

共通 `Messages` 型を定義し、`en.ts` / `ja.ts` で `satisfies Messages` すれば **B** が tsc で落ちる。型付き `t` で **A** を取れる。

### C

**文字列 ICU だけ**をビルド無し・生成無しで完全に型に載せるのは難しい（[TypeScript#32063](https://github.com/microsoft/TypeScript/issues/32063) 系の話と関連）。

- **関数メッセージ** `(p: { name: string }) => string` などで **C** を満たしやすい。
- **next-intl** の ICU から引数型まで自動でやる場合は **`createMessagesDeclaration`**（生成ステップ）がドキュメント上の解。

**next-intl の `createMessagesDeclaration`（概要）**

- `createNextIntlPlugin` の実験オプション。ベースの `messages/en.json` から **`en.d.json.ts`** を生成し、JSON のリテラル型・ICU 引数を型に載せる。
- `tsconfig` の `allowArbitraryExtensions` が必要。`next dev` / `next build` / `next typegen` で生成。
- メリット: **C** を JSON のまま強化。デメリット: 要件 2（generate なし）とトレードオフ。

---

## 4. ライブラリ別 — 追加要件との適合（短縮）

| ライブラリ | 要件 2（codegen なし tsc） | 備考 |
|------------|---------------------------|------|
| next-international | 相性良 | TS + `as const` で A・C。B は `satisfies` 推奨 |
| next-intl | `createMessagesDeclaration` 無しなら可 | エコシステム厚い |
| Paraglide | 不可寄り（生成必須） | ABC は強い |
| Lingui | 不可寄り | compile が主戦場 |
| Tolgee / gt-next / Intlayer | 要件 1 or 2 とズレやすい | 用途次第 |

### SSR（App Router / RSC）

next-intl / next-international / Paraglide / Lingui / Tolgee / Intlayer / gt-next いずれも SSR の道筋はドキュメント上ある。Tolgee はサーバー・クライアントでファイルが増えやすい。

### ドキュメントの簡潔さ（主観）

- **短め**: next-international、gt-next（要件 1 とは相性悪）
- **中**: next-intl
- **長め**: Paraglide、Tolgee、Intlayer、Lingui

---

## 5. 推奨（要件反映）

1. **第一候補: next-international** — codegen なしで `tsc` と相性が良い。`international-types` で `{param}` から **C**。**B** は `EnMessages` + `satisfies` で補強。
2. **代替: next-intl** — 情報量・採用実績。TS 辞書 + `Messages` 拡張で A/B。**C** は生成 or 関数辞書でトレードオフ。

---

## 6. next-international 深掘り

出典: [Get Started](https://next-international.vercel.app/docs)、[App Router Setup](https://next-international.vercel.app/docs/app-setup)、[Writing locales](https://next-international.vercel.app/docs/writing-locales)、[international-types](https://github.com/QuiiBz/next-international/tree/main/packages/international-types)

### 公式特性と要件の対応

- No Webpack / no CLI / no code generation → **要件 2**
- TS 推奨（params の型安全）→ **要件 3**
- `CreateParams` で `{value}` 等から必須キー推論 → **A・C**
- `getI18n` / `useI18n` / `I18nProviderClient` / 静的レンダリング用 `setStaticParamsLocale` → **SSR**

### A / B / C

- **A**: `as const` ロケールからキーユニオン → 誤キーは型エラーになりやすい。
- **C**: TS リテラル `'Hello {name}!'` で公式どおり型安全。
- **B**: ライブラリ単体ではロケール間キー完全一致が自動保証されない場合がある → **基準型 + `satisfies`** を推奨。

### サンプル（公式ベース）

**ロケール（B 対策で `EnMessages` + `satisfies`）**

```ts
// locales/en.ts
const en = {
  hello: "Hello",
  "hello.world": "Hello world!",
  welcome: "Hello {name}!",
} as const;

export default en;
export type EnMessages = typeof en;
```

```ts
// locales/fr.ts
import type { EnMessages } from "./en";

const fr = {
  hello: "Bonjour",
  "hello.world": "Bonjour le monde !",
  welcome: "Bonjour {name} !",
} as const satisfies EnMessages;

export default fr;
```

**サーバー / クライアント**

```ts
// locales/server.ts
import { createI18nServer } from "next-international/server";

export const { getI18n, getScopedI18n, getStaticParams } = createI18nServer({
  en: () => import("./en"),
  fr: () => import("./fr"),
});
```

```ts
// locales/client.ts
"use client";
import { createI18nClient } from "next-international/client";

export const { useI18n, useScopedI18n, I18nProviderClient } = createI18nClient({
  en: () => import("./en"),
  fr: () => import("./fr"),
});
```

**ミドルウェア**

```ts
import { createI18nMiddleware } from "next-international/middleware";
import type { NextRequest } from "next/server";

const I18nMiddleware = createI18nMiddleware({
  locales: ["en", "fr"],
  defaultLocale: "en",
});

export function middleware(request: NextRequest) {
  return I18nMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt).*)"],
};
```

**サーバーコンポーネント**

```tsx
import { getI18n, getScopedI18n } from "@/locales/server";

export default async function Page() {
  const t = await getI18n();
  const scopedT = await getScopedI18n("hello");

  return (
    <div>
      <p>{t("hello")}</p>
      <p>{t("hello.world")}</p>
      <p>{scopedT("world")}</p>
      <p>{t("welcome", { name: "John" })}</p>
    </div>
  );
}
```

Next.js 15+ では `params` が `Promise` になる旨は [Setup](https://next-international.vercel.app/docs/app-setup) を参照。

### 要件チェックリスト（next-international）

| 要件 | 評価 |
|------|------|
| 2 build 不要 typecheck | ○ |
| 3 TS 辞書 | ○ |
| A | ○ |
| C | ○（`{param}` リテラル） |
| B | △ → `satisfies` で ○ に近づく |

---

## 7. 世間の評価・規模感（参考）

数値は日々変動。**2026 年 3 月頃の公開情報ベースの目安**。

- **next-intl** — npm / GitHub とも **最大級**。公式 i18n ガイド Resources 掲載。デファクトに近いとよく言及される。設定の多さへの言及も。
- **next-international** — スター **~1.3k–1.5k**、npm は **数万/週**規模の報告。型安全・軽量。**V2** 議論あり、API 変更に注意。
- **Paraglide** — コンパイラ型。バンドル・型への評価。パッケージ移行でドキュメントずれに注意、という声。
- **Lingui** — GitHub **5k+**、週次 DL **大**。React 汎用の定番。Next 専用 DX というよりマクロ + PO ワークフロー。
- **Tolgee** — TMS + SDK。インコンテキスト。**@tolgee/react** は **数万/週**規模の報告あり。
- **Intlayer** — スター **数百〜千**規模の報告。隣接辞書・ビルド・AI/CMS。学習コストへの言及も。
- **gt-next** — 週次 **1–2 万**規模の報告。**FSL** 等ライセンス・ベンダー依存は企業で要確認。
- **next-i18n-router** — ルーティング用の小さなピース。

---

## 8. メリット・デメリット・特徴（一覧）

※ 括弧内は「A/B/C・codegen なし・TS 辞書」軸での相性。

### next-intl

- **特徴**: App Router 向けドキュメントが厚い。ICU、`getTranslations` / `useTranslations`、日付・数値・リスト、ルーティング。公式 Resources 掲載。
- **メリット**: 採用実績・情報量。**Messages** 拡張、`createMessagesDeclaration` で **C**（生成依存）。
- **デメリット**: 設定・抽象が増えがち。**`createMessagesDeclaration` は Next 実行時生成** → 「`tsc` のみ」とトレードオフ。

### next-international

- **特徴**: **依存ゼロ**、codegen なし。`createI18nServer` / Client、ミドルウェア、**international-types**。
- **メリット**: **build 不要 typecheck に素直**。TS + `as const` で **A・C**。**B** は `satisfies`。
- **デメリット**: コミュニティは next-intl より小さい。**V2** 追従。**B** は自前パターン推奨。

### Paraglide JS（inlang）

- **特徴**: `messages/*.json` → **`m.message_key()`** 生成。tree-shaking。inlang ツール連携。
- **メリット**: 生成後 **ABC** に強い。
- **デメリット**: **生成が事実上必須**（要件 2 と衝突）。Next 統合の移行に注意。

### Lingui

- **特徴**: マクロ + PO 等 + compile。React 全体で成熟。
- **メリット**: 歴史・DL・採用例。PO ワークフロー。
- **デメリット**: **extract/compile が主戦場**（要件 2）。Next 最短セットアップとしては重い。

### Tolgee

- **特徴**: TMS + SDK。インコンテキスト。next-intl 併用案内あり。
- **メリット**: 翻訳プロセス・非エンジニア参加。
- **デメリット**: **`t('key')` で A が弱い**。ファイル分割・プラットフォーム運用。

### Intlayer

- **特徴**: **`*.content.ts`**、next-intlayer プラグイン。AI/CMS。
- **メリット**: コンポーネント単位の文言。
- **デメリット**: **Next ビルド依存**（要件 2 要確認）。**B** の前提が next-international の `satisfies` と異なる。

### gt-next

- **特徴**: **`<T>`**、gt CLI、ビルド時 translate。
- **メリット**: キー大量記述が不要。Quickstart は短め。
- **デメリット**: **パイプライン・サービス依存**。**ライセンス**要確認。TS 辞書厳密管理軸とはズレ。

### next-i18n-router

- **特徴**: ミドルウェアでロケール URL のみ。
- **メリット**: 軽い。メッセージは他ライブラリと併用。
- **デメリット**: 辞書 API なし。

---

## 9. リンク集（公式）

- [next-intl](https://next-intl.dev/) — [TypeScript](https://next-intl.dev/docs/workflows/typescript)
- [next-international](https://next-international.vercel.app/docs)
- [Paraglide](https://inlang.com/m/gerre34r/library-inlang-paraglideJs/basics)
- [Lingui](https://lingui.dev/)
- [Tolgee Next App Router](https://docs.tolgee.io/js-sdk/integrations/react/next/app-router)
- [Intlayer Next.js](https://intlayer.org/doc/environment/nextjs)
- [gt-next Quickstart](https://generaltranslation.com/en-US/docs/next)

---

## 10. 本リポジトリへの当てはめ

- 現状: `packages/frontend_app` に i18n 依存なし。`src/app/layout.tsx` が単一ルート。
- ロケール付き URL: `src/app/[locale]/...` と middleware / proxy が定番。

実装フェーズで決めること:

- **C** の満たし方（next-international の `{param}` で足りるか、next-intl の生成か、関数辞書か）
- ロケール識別子と `html lang`
- CI: **`bun run typecheck` を主ゲート**、辞書は **TS 共有型 + `satisfies`（B）**

---

*本ドキュメントは調査・方針整理用。実装の完了を意味しない。*
