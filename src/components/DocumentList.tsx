
import { motion } from "framer-motion";
import { Edit, Trash2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Document {
  text: string;
  metadata: {
    id: string;
    source: string;
    updated_at: string;
  };
}

interface DocumentListProps {
  documents: Document[];
}

const DocumentList = ({ documents }: DocumentListProps) => {
  if (documents.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-60 flex flex-col items-center justify-center text-gray-500"
      >
        <FileText size={48} className="text-gray-300 mb-4" />
        <p className="text-lg">No documents found</p>
        <p className="text-sm">Try a different search or add new documents</p>
      </motion.div>
    );
  }

  return (
    <div className="overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Content</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((doc, index) => (
            <motion.tr
              key={doc.metadata.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.3, 
                delay: index * 0.05,
                ease: "easeOut" 
              }}
              className="group hover:bg-gray-50"
              whileHover={{ 
                backgroundColor: "rgba(249, 250, 251, 1)",
              }}
            >
              <TableCell className="font-medium">
                <div className="max-w-md truncate">
                  {doc.text}
                </div>
              </TableCell>
              <TableCell>{doc.metadata.source}</TableCell>
              <TableCell>{new Date(doc.metadata.updated_at).toLocaleString()}</TableCell>
              <TableCell className="text-right">
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Button variant="ghost" size="sm">
                    <Edit size={16} className="mr-1" /> Edit
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                    <Trash2 size={16} className="mr-1" /> Delete
                  </Button>
                </motion.div>
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DocumentList;
