
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import DocumentList from "@/components/DocumentList";
import QueryChat from "@/components/QueryChat";

interface Document {
  text: string;
  metadata: {
    id: string;
    source: string;
    updated_at: string;
  };
}

interface DocumentMainProps {
  documents: Document[];
  isChatOpen: boolean;
  setIsChatOpen: (isOpen: boolean) => void;
}

const DocumentMain = ({
  documents,
  isChatOpen,
  setIsChatOpen
}: DocumentMainProps) => {
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
        <main className="flex-1 overflow-auto p-4">
          <div className="container mx-auto">
            <DocumentList documents={documents} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DocumentMain;
