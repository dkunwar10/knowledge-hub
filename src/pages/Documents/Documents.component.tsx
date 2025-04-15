
import { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Plus, Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DocumentList from "../../components/DocumentList";
import QueryChat from "../../components/QueryChat";

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
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleSearch = () => {
    onSearch(searchTerm);
    toast({
      title: "Searching Documents",
      description: `Searching for "${searchTerm}"`,
    });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Chat Section - Left Side */}
      <motion.div 
        initial={{ x: -300, opacity: 0 }}
        animate={{ 
          x: isChatOpen ? 0 : -300,
          opacity: isChatOpen ? 1 : 0
        }}
        className="w-[400px] h-full bg-white shadow-lg border-r relative"
      >
        <QueryChat />
        <Button
          className="absolute -right-12 top-4 bg-indigo-600 hover:bg-indigo-700"
          onClick={() => setIsChatOpen(!isChatOpen)}
        >
          <MessageCircle size={20} />
        </Button>
      </motion.div>

      {/* Documents Section - Right Side */}
      <div className={`flex-1 flex flex-col transition-all ${isChatOpen ? 'ml-4' : 'ml-16'}`}>
        <header className="p-4 bg-white shadow-sm">
          <div className="container mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Knowledge Base</h1>
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Input
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              </div>
              <Button onClick={handleSearch} variant="outline">
                Search
              </Button>
              <Button onClick={onRefresh} variant="outline">
                Refresh
              </Button>
              <Button>
                <Plus size={18} className="mr-2" /> Add Document
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4">
          <div className="container mx-auto">
            <DocumentList documents={documents} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DocumentsComponent;
