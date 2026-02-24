import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const CookieBanner = ({ canShow = true }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!canShow) {
      setIsVisible(false);
      setIsAnimating(false);
      return;
    }

    const cookieDecision = localStorage.getItem('cookieConsent');

    if (!cookieDecision) {
      const timer = setTimeout(() => {
        setIsVisible(true);
        setIsAnimating(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [canShow]);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setIsAnimating(false);
    setTimeout(() => setIsVisible(false), 300);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setIsAnimating(false);
    setTimeout(() => setIsVisible(false), 300);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isAnimating && (
        <motion.div
          className="fixed bottom-5 left-5 right-5 rounded-2xl z-[100] bg-white shadow-lg border-t border-gray-200"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div className="container mx-auto px-4 py-4 md:py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Использование файлов cookie
                </h3>
                <p className="text-gray-600 text-sm md:text-base">
                  На нашем сайте используются cookie-файлы, в том числе сервисов веб-аналитики. Используя сайт, вы соглашаетесь на обработку персональных данных при помощи cookie-файлов. Подробнее об обработке персональных данных вы можете узнать в {' '}
                   <Link
                    to="/dataProcessing"
                    className="text-brown-dark hover:text-brown underline font-medium transition-colors cursor-pointer"
                  >
                    Политике конфиденциальности
                  </Link>.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAccept}
                  className="px-6 py-2.5 text-sm font-medium text-white bg-brown-dark hover:bg-brown rounded-lg transition-colors duration-200 shadow-sm"
                >
                  Принять и продолжить
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieBanner;
