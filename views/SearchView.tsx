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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
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
        setErrorMessage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;
    setIsAnalyzing(true);
    setErrorMessage(null);
    const result = await analyzeImageForTags(selectedImage);
    if (!result) {
      setErrorMessage("Impossible d'analyser l'image. Vérifiez que la clé GEMINI_API_KEY est bien configurée.");
    } else {
      setAnalysisResult(result);
    }
    setIsAnalyzing(false);
  };

  const handleEdit = async () => {
    if (!selectedImage || !editPrompt) return;
    setIsEditing(true);
    setErrorMessage(null);
    const result = await editImageWithPrompt(selectedImage, editPrompt);
    if (result) {
      setSelectedImage(result);
      setAnalysisResult(null); // Reset analysis as image changed
    } else {
      setErrorMessage("Impossible de modifier l'image. Vérifiez votre clé GEMINI_API_KEY.");
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
      <div className="flex bg-border rounded-md p-1">
        <button
          onClick={() => setMode('search')}
          className={`flex-1 py-2 text-sm font-medium rounded-sm transition ${mode === 'search' ? 'bg-surface text-secondary shadow-sm border border-border' : 'text-gray-500'}`}
        >
          Visual Search
        </button>
        <button
          onClick={() => setMode('edit')}
          className={`flex-1 py-2 text-sm font-medium rounded-sm transition ${mode === 'edit' ? 'bg-surface text-secondary shadow-sm border border-border' : 'text-gray-500'}`}
        >
          Edit Image
        </button>
      </div>

      {/* Image Upload Area */}
      <div 
        onClick={() => fileInputRef.current?.click()}
        className={`border border-border rounded-lg flex flex-col items-center justify-center cursor-pointer transition relative overflow-hidden ${selectedImage ? 'bg-secondary h-64' : 'bg-surface h-48 hover:bg-background'}`}
      >
        {selectedImage ? (
          <img 
            src={`data:image/jpeg;base64,${selectedImage}`} 
            alt="Upload" 
            className="w-full h-full object-contain" 
          />
        ) : (
          <div className="text-center p-6">
            <Camera className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-secondary font-medium">Select photo</p>
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
            <div className="absolute bottom-2 right-2 bg-secondary/80 text-white text-xs px-2 py-1 rounded">
                Tap to change
            </div>
        )}
      </div>

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
          {errorMessage}
        </div>
      )}

      {/* Logic for Search Mode */}
      {mode === 'search' && selectedImage && (
        <div className="space-y-4">
          {!analysisResult && (
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full bg-primary text-white py-3 rounded-md font-medium flex items-center justify-center space-x-2 transition disabled:opacity-50"
            >
              {isAnalyzing && <Loader2 className="animate-spin" size={18} />}
              <span>{isAnalyzing ? 'Scanning image...' : 'Scan & Search'}</span>
            </button>
          )}

          {analysisResult && (
            <div className="bg-surface p-4 rounded-lg border border-border">
              <h3 className="font-display font-semibold text-secondary mb-2">Scan Results</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {Object.entries(analysisResult).map(([key, value]) => (
                  <span key={key} className="px-2 py-1 bg-background text-secondary text-xs rounded border border-border capitalize">
                    <span className="opacity-60 mr-1">{key}:</span>{String(value)}
                  </span>
                ))}
              </div>
              
              <h4 className="font-medium text-secondary text-sm mb-3">Nearby Matches ({matchedItems.length})</h4>
              {matchedItems.length > 0 ? (
                <div className="space-y-3">
                  {matchedItems.map(item => (
                    <div key={item.id} className="flex bg-background p-2 rounded-md border border-border">
                      <img src={item.image} className="w-16 h-16 object-cover rounded" alt={item.name} />
                      <div className="ml-3 flex-1">
                        <h5 className="font-medium text-secondary text-sm">{item.name}</h5>
                        <p className="text-primary font-semibold text-sm">{item.price.toLocaleString()} XAF</p>
                      </div>
                      <button 
                        onClick={() => onAddToCart(item)}
                        className="bg-primary text-white p-2 rounded-md self-center hover:opacity-90 transition"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No exact matches found nearby.</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Logic for Edit Mode */}
      {mode === 'edit' && selectedImage && (
        <div className="space-y-4">
          <div className="bg-surface p-4 rounded-lg border border-border">
             <label className="block text-sm font-medium text-secondary mb-2">Edit instructions</label>
             <div className="flex gap-2">
               <input
                 type="text"
                 value={editPrompt}
                 onChange={(e) => setEditPrompt(e.target.value)}
                 placeholder="e.g., 'Remove background'"
                 className="flex-1 border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary"
               />
               <button
                 onClick={handleEdit}
                 disabled={isEditing || !editPrompt}
                 className="bg-primary text-white p-2 rounded-md disabled:opacity-50 transition"
               >
                 {isEditing ? <Loader2 className="animate-spin" size={18} /> : <Wand2 size={18} />}
               </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};