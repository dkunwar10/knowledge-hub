
import { motion } from "framer-motion";

const Loading = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center"
    >
      <div className="relative">
        <motion.div 
          className="w-16 h-16 border-4 border-indigo-200 rounded-full"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        />
        <motion.div 
          className="absolute top-0 left-0 w-16 h-16 border-4 border-t-indigo-600 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity, 
            ease: "linear"
          }}
        />
      </div>
      <motion.p 
        className="mt-4 text-lg text-gray-600 font-medium"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        Loading...
      </motion.p>
    </motion.div>
  </div>
);

export default Loading;
