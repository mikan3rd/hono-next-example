import type { EnMessages } from "./en";

const ja = {
  "posts.title": "投稿",
  "posts.subtitle": "最新の投稿を表示します",
  "posts.loading": "読み込み中",

  "posts.empty.title": "まだ投稿がありません",
  "posts.empty.subtitle": "最初の投稿を作成しましょう",

  "postForm.heading": "新規投稿",
  "postForm.placeholder": "投稿内容を入力...",
  "postForm.create": "投稿する",
  "postForm.creating": "送信中...",
  "postForm.clear": "クリア",

  "signUp.trigger": "サインアップ",
  "signUp.title": "サインアップ",
  "signUp.description": "匿名でアプリにサインアップできます。",
  "signUp.nameLabel": "表示名",
  "signUp.namePlaceholder": "山田 太郎",
  "signUp.cancel": "キャンセル",
  "signUp.submit": "サインアップ",

  "logout.trigger": "サインアウト",
  "logout.title": "サインアウト",
  "logout.description": "ログイン中です",
  "logout.cancel": "キャンセル",
  "logout.submit": "サインアウト",

  "postCard.updated": "更新済み",
  "postCard.actionsLabel": "操作",
  "postCard.edit": "編集",
  "postCard.delete": "削除",
  "postCard.saving": "保存中...",
  "postCard.save": "保存",
  "postCard.cancel": "キャンセル",
  "postCard.created": "作成:",
  "postCard.updatedLabel": "更新:",

  "locale.switchJa": "日本語",
  "locale.switchEn": "English",

  "toast.signedUp": "サインアップしました",
  "toast.failedToLogin": "ログインに失敗しました",
  "toast.signOutSuccess": "サインアウトしました",
  "toast.postCreated": "投稿を作成しました",
  "toast.postUpdated": "投稿を更新しました",
  "toast.postDeleted": "投稿を削除しました",
} as const satisfies Record<keyof EnMessages, string>;

export default ja;
