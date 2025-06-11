
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

const CoursePage = () => {
  const features = [
    'Make Money Online',
    'Improve Your Mindset',
    'Social Skills & Confidence',
    'Fitness & Masculinity',
    'Business & Time Management'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 p-3 pb-20">
      <div className="max-w-sm mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-16"
        >
          <Card className="bg-white/95 backdrop-blur border-0 shadow-2xl rounded-3xl overflow-hidden">
            <CardHeader className="text-center py-8 px-6">
              <motion.h1
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-4xl font-bold text-gray-900 mb-2"
              >
                Become a member
              </motion.h1>
            </CardHeader>

            <CardContent className="px-6 pb-8">
              <div className="text-center mb-8">
                <hr className="border-gray-200 mb-8" />
                
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="text-4xl font-bold text-gray-900 mb-6"
                >
                  Millioner
                </motion.h2>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="mb-8"
                >
                  <span className="text-5xl font-bold text-gray-900">$20</span>
                  <span className="text-xl text-gray-600">/month</span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="mb-8"
                >
                  <Button 
                    className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105"
                  >
                    Join
                  </Button>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.0 }}
                  className="text-gray-700 text-lg mb-8 font-medium"
                >
                  Are you ready to become a millionaire ?
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                  className="space-y-4 text-left"
                >
                  {features.map((feature, index) => (
                    <motion.div
                      key={feature}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 1.4 + index * 0.1 }}
                      className="flex items-center gap-4"
                    >
                      <div className="w-2 h-2 bg-black rounded-full flex-shrink-0"></div>
                      <span className="text-gray-800 text-lg font-medium">{feature}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default CoursePage;
