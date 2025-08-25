"use client";

type PostFormProps = {
  content: string;
  onContentChange: (content: string) => void;
  onSubmit: (content: string) => void;
  onClear: () => void;
  isPending: boolean;
};

export const PostForm = ({
  content,
  onContentChange,
  onSubmit,
  onClear,
  isPending,
}: PostFormProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedContent = content.trim();
    if (!trimmedContent) return;
    onSubmit(trimmedContent);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Create New Post
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <textarea
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            placeholder="Write your post content here..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900"
            rows={4}
            disabled={isPending}
          />
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={!content.trim() || isPending}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200 disabled:cursor-not-allowed"
          >
            {isPending ? "Creating..." : "Create Post"}
          </button>
          <button
            type="button"
            onClick={onClear}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md font-medium transition-colors duration-200"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
};
