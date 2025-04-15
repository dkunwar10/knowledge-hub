
interface Document {
  text: string;
  metadata: {
    id: string;
    source: string;
    updated_at: string;
  };
}

interface DocumentsComponentProps {
  documents: Document[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}

const DocumentsComponent = ({ documents, loading, error, onRefresh }: DocumentsComponentProps) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading documents...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-xl text-red-600 mb-4">{error}</div>
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Documents</h1>
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Refresh
        </button>
      </div>
      
      <div className="grid gap-4">
        {documents.map((doc) => (
          <div
            key={doc.metadata.id}
            className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <div className="mb-2 text-gray-600">
              <span className="font-semibold">ID:</span> {doc.metadata.id}
            </div>
            <div className="mb-2 text-gray-600">
              <span className="font-semibold">Source:</span> {doc.metadata.source}
            </div>
            <div className="mb-4 text-gray-600">
              <span className="font-semibold">Updated:</span>{' '}
              {new Date(doc.metadata.updated_at).toLocaleString()}
            </div>
            <p className="text-gray-800">{doc.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentsComponent;
