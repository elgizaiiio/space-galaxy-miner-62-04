
import React from 'react';
import { getTranslation, getStoredLanguage } from '../utils/language';

const GamePage = () => {
  const currentLanguage = getStoredLanguage();
  const t = (key: string) => getTranslation(key, currentLanguage.code);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-black text-white">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-2">
            {t('game') || 'Game'}
          </h1>
          <p className="text-gray-300">
            {t('enjoy_game') || 'Enjoy playing and earn rewards!'}
          </p>
        </div>

        {/* Game Container */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-black/40 backdrop-blur-sm rounded-lg border border-white/20 p-4">
            <div className="relative w-full" style={{ paddingBottom: '75%' }}>
              <iframe
                src="https://playhop.com/app/398438?utm_source=distrib&skip-guard=1&header=no&flags={%22adv_sticky_banner_disabled%22:true}"
                className="absolute top-0 left-0 w-full h-full rounded-lg"
                frameBorder="0"
                allowFullScreen
                allow="gamepad; microphone; camera"
                title="Space Game"
              />
            </div>
            
            {/* Game Info */}
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-400">
                {t('game_tip') || 'Play the game to earn $SPACE tokens!'}
              </p>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="max-w-2xl mx-auto mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <h3 className="text-lg font-semibold text-blue-400 mb-2">
                {t('how_to_play') || 'How to Play'}
              </h3>
              <p className="text-sm text-gray-300">
                {t('game_instructions') || 'Use the controls to navigate and complete challenges to earn rewards.'}
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <h3 className="text-lg font-semibold text-purple-400 mb-2">
                {t('rewards') || 'Rewards'}
              </h3>
              <p className="text-sm text-gray-300">
                {t('earn_tokens') || 'Complete levels and challenges to earn $SPACE tokens automatically.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePage;
