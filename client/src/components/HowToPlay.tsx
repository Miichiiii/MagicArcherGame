import { SPELL_TYPES } from "@/game/constants";

interface HowToPlayProps {
  onClose: () => void;
}

const HowToPlay = ({ onClose }: HowToPlayProps) => {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-8 max-w-2xl max-h-[80vh] overflow-auto">
        <h2 className="text-2xl font-bold text-white mb-4">How to Play</h2>
        
        <div className="mb-6">
          <h3 className="text-xl text-purple-400 mb-2">Game Objective</h3>
          <p className="text-gray-300">
            As a wizard, your mission is to heal unhappy NPCs using your magical spells.
            Make all NPCs happy to complete each level!
          </p>
        </div>
        
        <div className="mb-6">
          <h3 className="text-xl text-purple-400 mb-2">Controls</h3>
          <ul className="space-y-2 text-gray-300">
            <li><span className="font-semibold">WASD or Arrow Keys:</span> Move your wizard</li>
            <li><span className="font-semibold">1-5 Keys:</span> Select different healing spells</li>
            <li><span className="font-semibold">Space:</span> Cast the selected spell</li>
            <li><span className="font-semibold">P:</span> Pause the game</li>
          </ul>
        </div>
        
        <div className="mb-6">
          <h3 className="text-xl text-purple-400 mb-2">Spells</h3>
          <div className="space-y-3">
            {Object.entries(SPELL_TYPES).map(([key, spell]) => (
              <div key={key} className="flex items-center">
                <div 
                  className="w-6 h-6 rounded-full mr-3 flex-shrink-0"
                  style={{ backgroundColor: spell.color }}
                ></div>
                <div>
                  <h4 className="text-white font-semibold">{spell.name} (Key {key})</h4>
                  <p className="text-gray-400 text-sm">{spell.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-xl text-purple-400 mb-2">NPCs</h3>
          <p className="text-gray-300 mb-2">
            NPCs can be in different emotional states:
          </p>
          <ul className="space-y-1 text-gray-300">
            <li><span className="text-red-500">😠 Angry</span> - Very unhappy, needs lots of healing</li>
            <li><span className="text-blue-500">😢 Sad</span> - Unhappy, needs medium healing</li>
            <li><span className="text-yellow-500">😟 Worried</span> - Slightly unhappy, needs a little healing</li>
            <li><span className="text-gray-400">😐 Neutral</span> - Neither happy nor unhappy</li>
            <li><span className="text-green-500">🙂 Content</span> - Somewhat happy</li>
            <li><span className="text-teal-500">😄 Happy</span> - Fully healed and happy!</li>
          </ul>
        </div>
        
        <div className="mb-6">
          <h3 className="text-xl text-purple-400 mb-2">Multiplayer</h3>
          <p className="text-gray-300">
            In two-player mode, two wizards can work together to heal NPCs more efficiently.
            Coordinate your spells for maximum effect!
          </p>
        </div>
        
        <button 
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg"
          onClick={onClose}
        >
          Got it!
        </button>
      </div>
    </div>
  );
};

export default HowToPlay;
