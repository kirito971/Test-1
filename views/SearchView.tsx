import React, { useState, useRef } from 'react';
import { Camera, Sparkles, Wand2, Loader2, Plus } from 'lucide-react';
import { analyzeImageForTags, editImageWithPrompt } from '../services/geminiService';
import { MOCK_INVENTORY } from '../mockData';
import { InventoryItem } from '../types';

interface SearchViewProps {
  onAddToCart: (item: InventoryItem) => void;
}

export const SearchView: React.FC<SearchViewProps> = ({ onAddToCart }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [editPrompt, setEditPrompt] = useState('');
  const [mode, setMode] = useState<'search' | 'edit'>('search');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setSelectedImage(base64.split(',')[1]); // Remove data:image/...;base64,
        setAnalysisResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;
    setIsAnalyzing(true);
    const result = await analyzeImageForTags(selectedImage);
    setAnalysisResult(result);
    setIsAnalyzing(false);
  };

  const handleEdit = async () => {
    if (!selectedImage || !editPrompt) return;
    setIsEditing(true);
    const result = await editImageWithPrompt(selectedImage, editPrompt);
    if (result) {
      setSelectedImage(result);
      setAnalysisResult(null); // Reset analysis as image changed
    }
    setIsEditing(false);
  };

  const getFilteredInventory = () => {
    if (!analysisResult) return [];
    return MOCK_INVENTORY.filter(item => 
      (analysisResult.item && item.aiTags.item.toLowerCase().includes(analysisResult.item.toLowerCase())) ||
      (analysisResult.category && item.aiTags.category.toLowerCase().includes(analysisResult.category.toLowerCase()))
    );
  };

  const matchedItems = getFilteredInventory();

  return (
    <div className="p-4 space-y-6">
      {/* Mode Switcher */}
      <div className="flex bg-gray-200 rounded-lg p-1">
        <button
          onClick={() => setMode('search')}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${mode === 'search' ? 'bg-white shadow text-primary' : 'text-gray-600'}`}
        >
          Nano Search
        </button>
        <button
          onClick={() => setMode('edit')}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${mode === 'edit' ? 'bg-white shadow text-primary' : 'text-gray-600'}`}
        >
          AI Editor
        </button>
      </div>

      {/* Image Upload Area */}
      <div 
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 h-64 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition relative overflow-hidden"
      >
        {selectedImage ? (
          <img 
            src={`data:image/jpeg;base64,${selectedImage}`} 
            alt="Upload" 
            className="w-full h-full object-contain" 
          />
        ) : (
          <div className="text-center p-6">
            <Camera className="mx-auto h-12 w-12 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 font-medium">Tap to upload photo</p>
            <p className="text-xs text-gray-400 mt-1">Take a pic of what you want to find</p>
          </div>
        )}
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*" 
          onChange={handleFileChange} 
        />
        {selectedImage && (
            <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                Tap to change
            </div>
        )}
      </div>

      {/* Logic for Search Mode */}
      {mode === 'search' && selectedImage && (
        <div className="space-y-4">
          {!analysisResult && (
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full bg-primary text-white py-3 rounded-xl font-bold flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50"
            >
              {isAnalyzing ? <Loader2 className="animate-spin" /> : <Sparkles />}
              <span>{isAnalyzing ? 'Analyzing with Gemini...' : 'Find with Nano Search'}</span>
            </button>
          )}

          {analysisResult && (
            <div className="bg-white p-4 rounded-xl shadow border border-gray-100 animate-fade-in">
              <h3 className="font-bold text-gray-800 mb-2">Gemini Analysis</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {Object.entries(analysisResult).map(([key, value]) => (
                  <span key={key} className="px-3 py-1 bg-green-50 text-primary text-xs rounded-full border border-green-100 capitalize">
                    {key}: {String(value)}
                  </span>
                ))}
              </div>
              
              <h4 className="font-medium text-gray-600 text-sm mb-3">Nearby Matches ({matchedItems.length})</h4>
              {matchedItems.length > 0 ? (
                <div className="space-y-3">
                  {matchedItems.map(item => (
                    <div key={item.id} className="flex bg-gray-50 p-2 rounded-lg border border-gray-200">
                      <img src={item.image} className="w-16 h-16 object-cover rounded" alt={item.name} />
                      <div className="ml-3 flex-1">
                        <h5 className="font-bold text-gray-800 text-sm">{item.name}</h5>
                        <p className="text-primary font-bold text-sm">{item.price.toLocaleString()} XAF</p>
                      </div>
                      <button 
                        onClick={() => onAddToCart(item)}
                        className="bg-primary text-white p-2 rounded-lg self-center"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">No exact matches found nearby.</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Logic for Edit Mode */}
      {mode === 'edit' && selectedImage && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
             <label className="block text-sm font-medium text-gray-700 mb-2">How should Gemini edit this?</label>
             <div className="flex gap-2">
               <input
                 type="text"
                 value={editPrompt}
                 onChange={(e) => setEditPrompt(e.target.value)}
                 placeholder="e.g., 'Add a retro filter', 'Remove background'"
                 className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-primary focus:border-primary"
               />
               <button
                 onClick={handleEdit}
                 disabled={isEditing || !editPrompt}
                 className="bg-secondary text-white p-2 rounded-lg disabled:opacity-50"
               >
                 {isEditing ? <Loader2 className="animate-spin" /> : <Wand2 />}
               </button>
             </div>
             <p className="text-xs text-gray-400 mt-2">Powered by gemini-2.5-flash-image</p>
          </div>
        </div>
      )}
    </div>
  );
};