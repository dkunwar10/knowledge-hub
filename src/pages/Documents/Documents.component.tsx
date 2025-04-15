
import { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Plus, Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import DocumentList from "../../components/DocumentList";
import QueryChat from "../../components/QueryChat";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

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
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <div className="w-16 h-16 relative">
            <motion.div 
              className="absolute inset-0 rounded-full border-t-2 border-blue-500"
              animate={{ rotate: 360 }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                ease: "linear"
              }}
            />
            <motion.div 
              className="absolute inset-0 rounded-full border-t-2 border-purple-500"
              animate={{ rotate: -180 }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "linear"
              }}
            />
          </div>
          <motion.p 
            className="mt-4 text-xl text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Loading knowledge base...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center min-h-screen bg-gray-50"
      >
        <motion.div 
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-xl text-red-600 mb-4 p-4 bg-red-50 rounded-lg"
        >
          {error}
        </motion.div>
        <Button
          onClick={onRefresh}
          variant="default"
          className="mt-4"
          size="lg"
        >
          Retry
        </Button>
      </motion.div>
    );
  }

  const handleSearch = () => {
    onSearch(searchTerm);
    toast({
      title: "Searching Documents",
      description: `Searching for "${searchTerm}"`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-6"
      >
        <header className="mb-8">
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-3xl font-bold text-gray-800 mb-2"
          >
            Knowledge Base
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex items-center space-x-2"
          >
            <Input
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-lg"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch} variant="outline" size="icon">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="default" size="sm" onClick={onRefresh}>
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Plus size={16} className="mr-1" /> Add Document
            </Button>
          </motion.div>
        </header>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="pb-20"
        >
          <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
            <CardContent className="p-0">
              <DocumentList documents={documents} />
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Chat Query Button (fixed to left side) */}
      <div className="fixed left-6 bottom-6 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button 
              size="lg" 
              className="rounded-full w-16 h-16 shadow-lg bg-indigo-600 hover:bg-indigo-700 transition-transform hover:scale-105"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <MessageCircle size={24} />
              </motion.div>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[400px] sm:w-[540px] p-0">
            <QueryChat />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default DocumentsComponent;
