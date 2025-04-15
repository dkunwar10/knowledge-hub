
import { Plus, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DocumentHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onSearch: () => void;
  onRefresh: () => void;
}

const DocumentHeader = ({
  searchTerm,
  setSearchTerm,
  onSearch,
  onRefresh
}: DocumentHeaderProps) => {
  const { toast } = useToast();

  const handleSearch = () => {
    onSearch();
    toast({
      title: "Searching Documents",
      description: `Searching for "${searchTerm}"`,
    });
  };

  return (
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
  );
};

export default DocumentHeader;
