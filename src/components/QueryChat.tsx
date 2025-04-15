
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, LoaderCircle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import httpBase from "../services/httpBase";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: {
    text: string;
    metadata: {
      id: string;
      source: string;
    };
    score: number;
  }[];
}

const QueryChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [showSourcesMap, setShowSourcesMap] = useState<{[key: string]: boolean}>({});

  const toggleSources = (messageId: string) => {
    setShowSourcesMap(prev => ({
      ...prev,
      [messageId]: !prev[messageId]
    }));
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, showSourcesMap]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      await httpBase.post('/query', {
        collection_name: "test_page_info",
        query_text: input,
        limit: 5
      }, {
        successCallback: (response) => {
          if (response.data) {
            const botMessage: Message = {
              id: (Date.now() + 1).toString(),
              role: "assistant",
              content: response.data.response || "I couldn't find relevant information for your query.",
              sources: response.data.source_nodes?.map((node: any) => ({
                text: node.text,
                metadata: node.metadata,
                score: node.score
              }))
            };
            setMessages(prev => [...prev, botMessage]);
          }
        },
        failureCallback: (error) => {
          toast({
            variant: "destructive",
            title: "Query failed",
            description: error.message || "Failed to query the knowledge base",
          });
          
          const errorMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: "Sorry, I encountered an error while processing your request."
          };
          setMessages(prev => [...prev, errorMessage]);
        },
        finalCallback: () => {
          setIsLoading(false);
        }
      });
    } catch (error) {
      console.error("Error querying knowledge base:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="p-4 border-b bg-white shadow-sm">
        <h2 className="text-xl font-bold text-gray-800">Knowledge Assistant</h2>
        <p className="text-sm text-gray-500">Ask questions about your knowledge base</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center justify-center h-full text-center p-6"
            >
              <Bot size={48} className="text-indigo-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-700">Knowledge Assistant</h3>
              <p className="text-gray-500 mt-2 max-w-xs">
                Ask any question about your knowledge base and get answers with source references.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {messages.map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className={`max-w-[80%] rounded-lg p-3 shadow-sm
              ${message.role === "user" 
                ? "bg-indigo-600 text-white rounded-br-none" 
                : "bg-white text-gray-800 rounded-bl-none border"}`}
            >
              <div className="flex items-start gap-2">
                <div className={`rounded-full p-1.5 ${message.role === "user" ? "bg-indigo-700" : "bg-gray-100"}`}>
                  {message.role === "user" ? (
                    <User size={16} className="text-white" />
                  ) : (
                    <Bot size={16} className="text-indigo-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className={message.role === "user" ? "text-white" : "text-gray-800"}>
                    {message.content}
                  </p>
                  
                  {message.sources && message.sources.length > 0 && (
                    <div className="mt-3">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => toggleSources(message.id)}
                        className="text-xs text-indigo-200 hover:text-white hover:bg-indigo-700 px-2 py-1 h-auto"
                      >
                        {showSourcesMap[message.id] ? "Hide Sources" : "Show Sources"} 
                        <ChevronRight size={14} className={`ml-1 transition-transform ${showSourcesMap[message.id] ? "rotate-90" : ""}`} />
                      </Button>
                      
                      <AnimatePresence>
                        {showSourcesMap[message.id] && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-2 space-y-2"
                          >
                            {message.sources.map((source, idx) => (
                              <motion.div 
                                key={idx}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="text-xs bg-indigo-700/50 rounded p-2 space-y-1"
                              >
                                <p className="line-clamp-2">{source.text}</p>
                                <div className="flex justify-between items-center">
                                  <span className="text-indigo-200">Source: {source.metadata.source}</span>
                                  <span className="bg-indigo-500 text-white px-1.5 py-0.5 rounded text-xs">
                                    Score: {(source.score * 100).toFixed(0)}%
                                  </span>
                                </div>
                              </motion.div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-white rounded-lg p-4 shadow-sm flex items-center space-x-2 rounded-bl-none border">
              <LoaderCircle className="h-5 w-5 text-indigo-600 animate-spin" />
              <p className="text-gray-600 text-sm">Searching knowledge base...</p>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t bg-white">
        <div className="flex space-x-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            className="min-h-[60px] flex-1 resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <Button 
            type="submit" 
            className="px-4" 
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? (
              <LoaderCircle className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default QueryChat;
