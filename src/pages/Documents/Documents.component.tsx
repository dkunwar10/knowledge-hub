
import { useState } from "react";
import DocumentHeader from "./components/DocumentHeader/DocumentHeader";
import DocumentMain from "./components/DocumentMain/DocumentMain";

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
  onSearch: (searchTerm: string) => void;
}

const DocumentsComponent = ({ 
  documents, 
  loading, 
  error, 
  onRefresh,
  onSearch
}: DocumentsComponentProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  return (
    <div className="flex flex-col h-screen">
      <DocumentHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSearch={handleSearch}
        onRefresh={onRefresh}
      />
      <DocumentMain
        documents={documents}
        isChatOpen={isChatOpen}
        setIsChatOpen={setIsChatOpen}
      />
    </div>
  );
};

export default DocumentsComponent;
