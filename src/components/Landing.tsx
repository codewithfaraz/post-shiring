import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { motion, AnimatePresence } from "framer-motion";
import AuthForm from "./AuthForm";
import Footer from "./Footer";

export default function Landing() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const localUser = localStorage.getItem("user");
    if (user || localUser) {
      navigate("/home");
    }
  }, [user, navigate]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <main className="flex-grow flex flex-col items-center justify-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-6">
          Share Your Stories with the World
        </h1>
        <p className="text-lg md:text-xl text-gray-600 text-center max-w-2xl mb-8">
          Join our community of writers and readers. Share your thoughts,
          experiences, and connect with like-minded people through meaningful
          content.
        </p>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 
                    transition-colors text-lg font-semibold"
        >
          Start Reading
        </button>
      </main>
      <Footer />

      <AnimatePresence mode="wait">
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.2,
              ease: [0.4, 0, 0.2, 1],
            }}
            onClick={handleBackdropClick}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 
                     flex items-center justify-center p-4"
          >
            <motion.div
              layout
              initial={{ scale: 0.9, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{
                type: "spring",
                stiffness: 350,
                damping: 30,
                mass: 1.5,
                opacity: { duration: 0.2 },
                scale: { duration: 0.4 },
                y: { type: "spring", stiffness: 400, damping: 30 },
              }}
              className="bg-white rounded-xl shadow-2xl max-w-md w-full 
                       overflow-hidden relative"
            >
              <div className="absolute right-4 top-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              <AuthForm onClose={() => setIsModalOpen(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
