
import React, { useState } from 'react';
import { PostState } from '../types';

interface PostPreviewProps {
  state: PostState;
}

const PostPreview: React.FC<PostPreviewProps> = ({ state }) => {
  const [copied, setCopied] = useState(false);

  const handleDownloadImage = () => {
    if (!state.image) {
      alert("Gere uma imagem primeiro!");
      return;
    }
    const link = document.createElement('a');
    link.href = state.image;
    link.download = `insta-post-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyCaption = () => {
    if (!state.caption) return;
    const fullText = `${state.caption}\n\n${state.hashtags.map(h => h.startsWith('#') ? h : `#${h}`).join(' ')}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-slate-900/50 rounded-2xl border border-slate-700 w-full max-w-md mx-auto shadow-2xl">
      <div className="w-full bg-black rounded-lg overflow-hidden border border-slate-800 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-slate-800 bg-black">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full instagram-gradient p-[1.5px]">
              <div className="w-full h-full rounded-full border-2 border-black bg-slate-700 overflow-hidden">
                <img src="https://picsum.photos/seed/user/100/100" alt="User" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-white">seu_perfil_ai</span>
              {state.location && <span className="text-[10px] text-slate-400">{state.location}</span>}
            </div>
          </div>
          <button className="text-white hover:text-slate-400">
            <i className="fas fa-ellipsis-h"></i>
          </button>
        </div>

        {/* Image Area */}
        <div id="post-image-container" className={`relative bg-slate-800 flex items-center justify-center min-h-[300px] ${
          state.aspectRatio === '1:1' ? 'aspect-square' : state.aspectRatio === '4:5' ? 'aspect-[4/5]' : 'aspect-[9/16]'
        }`}>
          {state.isGenerating ? (
            <div className="flex flex-col items-center gap-2 animate-pulse text-center p-4">
              <i className="fas fa-magic text-3xl text-purple-500 mb-2"></i>
              <span className="text-xs text-slate-400">Criando sua obra de arte...</span>
            </div>
          ) : state.image ? (
            <img src={state.image} alt="Generated Content" className="w-full h-full object-cover" />
          ) : (
            <div className="text-center p-8">
              <i className="fas fa-image text-5xl text-slate-700 mb-4"></i>
              <p className="text-sm text-slate-500">A imagem do seu post aparecerá aqui</p>
            </div>
          )}
        </div>

        {/* Interactions */}
        <div className="p-3 bg-black">
          <div className="flex justify-between items-center mb-2">
            <div className="flex gap-4">
              <button className="text-white text-xl"><i className="far fa-heart"></i></button>
              <button className="text-white text-xl"><i className="far fa-comment"></i></button>
              <button className="text-white text-xl"><i className="far fa-paper-plane"></i></button>
            </div>
            <button className="text-white text-xl"><i className="far fa-bookmark"></i></button>
          </div>
          
          <div className="mb-2">
            <span className="text-sm font-semibold text-white">999 curtidas</span>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-start group">
              <p className="text-sm leading-relaxed flex-1">
                <span className="font-semibold text-white mr-2">seu_perfil_ai</span>
                {state.caption || "A sua legenda mágica aparecerá aqui..."}
              </p>
              {state.caption && (
                <button 
                  onClick={handleCopyCaption}
                  className="ml-2 text-slate-500 hover:text-purple-400 transition-colors"
                  title="Copiar Legenda"
                >
                  <i className={`fas ${copied ? 'fa-check text-green-500' : 'fa-copy'}`}></i>
                </button>
              )}
            </div>
            <p className="text-sm text-blue-400 mt-1">
              {state.hashtags.map(h => h.startsWith('#') ? h : `#${h}`).join(' ')}
            </p>
          </div>
          
          <div className="mt-2">
            <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Agora mesmo</p>
          </div>
        </div>
      </div>
      
      <div className="mt-4 flex flex-col gap-2 w-full">
        <button 
          onClick={handleDownloadImage}
          disabled={!state.image}
          className="w-full bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl text-sm font-semibold transition-all border border-slate-700 flex items-center justify-center gap-2"
        >
           <i className="fas fa-download"></i> Baixar Imagem do Post
        </button>
        <button 
          onClick={handleCopyCaption}
          disabled={!state.caption}
          className="w-full bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl text-sm font-semibold transition-all border border-slate-700 flex items-center justify-center gap-2"
        >
           <i className="fas fa-copy"></i> {copied ? 'Copiado!' : 'Copiar Legenda e Tags'}
        </button>
        <button className="w-full instagram-gradient text-white py-3 rounded-xl text-sm font-bold transition-opacity hover:opacity-90 shadow-lg shadow-purple-500/20">
           <i className="fas fa-calendar-alt mr-2"></i> Agendar Publicação
        </button>
      </div>
    </div>
  );
};

export default PostPreview;
