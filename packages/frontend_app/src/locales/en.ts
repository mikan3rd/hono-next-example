const en = {
  "posts.title": "Posts",
  "posts.subtitle": "View the latest posts",
  "posts.loading": "Loading",

  "posts.empty.title": "No posts yet",
  "posts.empty.subtitle": "Create your first post",

  "postForm.heading": "Create New Post",
  "postForm.placeholder": "Write your post content here...",
  "postForm.create": "Create Post",
  "postForm.creating": "Creating...",
  "postForm.clear": "Clear",

  "signUp.trigger": "Sign Up Dialog",
  "signUp.title": "Sign Up",
  "signUp.description": "You can sign up to the app anonymously.",
  "signUp.nameLabel": "Your Name",
  "signUp.namePlaceholder": "John Doe",
  "signUp.cancel": "Cancel",
  "signUp.submit": "Sign Up",

  "logout.trigger": "Sign Out Dialog",
  "logout.title": "Sign Out",
  "logout.description": "You are signed in",
  "logout.cancel": "Cancel",
  "logout.submit": "Sign Out",

  "postCard.updated": "Updated",
  "postCard.actionsLabel": "Actions",
  "postCard.edit": "Edit",
  "postCard.delete": "Delete",
  "postCard.saving": "Saving...",
  "postCard.save": "Save",
  "postCard.cancel": "Cancel",
  "postCard.created": "Created:",
  "postCard.updatedLabel": "Updated:",

  "locale.switchJa": "日本語",
  "locale.switchEn": "English",

  "toast.signedUp": "Signed up successfully",
  "toast.failedToLogin": "Failed to login",
  "toast.signOutSuccess": "Signed out successfully",
  "toast.postCreated": "Post created successfully",
  "toast.postUpdated": "Post updated successfully",
  "toast.postDeleted": "Post deleted successfully",
} as const;

export default en;
export type EnMessages = typeof en;
