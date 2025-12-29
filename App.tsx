
import React, { useState, useCallback } from 'react';
import { ToolType, PostState } from './types';
import PostPreview from './components/PostPreview';
import { generatePostImage, generatePostContent } from './services/geminiService';

const App: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ToolType>(ToolType.IMAGE_GEN);
  const [state, setState] = useState<PostState>({
    image: null,
    caption: '',
    hashtags: [],
    aspectRatio: '1:1',
    location: '',
    isGenerating: false,
  });

  const [prompt, setPrompt] = useState('');
  const [tone, setTone] = useState('Profissional');
  const [isLoadingContent, setIsLoadingContent] = useState(false);

  const handleGenerateImage = async () => {
    if (!prompt) return;
    setState(prev => ({ ...prev, isGenerating: true }));
    try {
      const imageUrl = await generatePostImage(prompt, state.aspectRatio);
      setState(prev => ({ ...prev, image: imageUrl, isGenerating: false }));
    } catch (error) {
      alert("Erro ao gerar imagem. Verifique seu console.");
      setState(prev => ({ ...prev, isGenerating: false }));
    }
  };

  const handleGenerateText = async () => {
    if (!prompt) return;
    setIsLoadingContent(true);
    try {
      const data = await generatePostContent(prompt, tone);
      setState(prev => ({ 
        ...prev, 
        caption: data.caption, 
        hashtags: data.hashtags 
      }));
    } catch (error) {
      alert("Erro ao gerar conteúdo.");
    } finally {
      setIsLoadingContent(false);
    }
  };

  const handleMagicBuild = async () => {
    if (!prompt) return;
    setState(prev => ({ ...prev, isGenerating: true }));
    setIsLoadingContent(true);
    try {
      const [img, txt] = await Promise.all([
        generatePostImage(prompt, state.aspectRatio),
        generatePostContent(prompt, tone)
      ]);
      setState(prev => ({
        ...prev,
        image: img,
        caption: txt.caption,
        hashtags: txt.hashtags,
        isGenerating: false
      }));
    } catch (error) {
      alert("Erro na geração completa.");
      setState(prev => ({ ...prev, isGenerating: false }));
    } finally {
      setIsLoadingContent(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#0f172a]">
      {/* Sidebar Navigation */}
      <nav className="w-full md:w-20 bg-slate-900 border-b md:border-b-0 md:border-r border-slate-800 flex md:flex-col items-center justify-around md:justify-start py-4 md:py-8 gap-8 z-50">
        <div className="w-10 h-10 instagram-gradient rounded-xl flex items-center justify-center text-white text-xl shadow-lg shadow-purple-500/20 mb-4 hidden md:flex">
          <i className="fas fa-rocket"></i>
        </div>
        
        <button 
          onClick={() => setActiveTool(ToolType.IMAGE_GEN)}
          className={`p-3 rounded-xl transition-all ${activeTool === ToolType.IMAGE_GEN ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          title="Gerador de Imagem"
        >
          <i className="fas fa-wand-magic-sparkles text-xl"></i>
        </button>
        
        <button 
          onClick={() => setActiveTool(ToolType.CONTENT)}
          className={`p-3 rounded-xl transition-all ${activeTool === ToolType.CONTENT ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          title="IA de Texto"
        >
          <i className="fas fa-pen-nib text-xl"></i>
        </button>
        
        <button 
          onClick={() => setActiveTool(ToolType.DESIGN)}
          className={`p-3 rounded-xl transition-all ${activeTool === ToolType.DESIGN ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          title="Editor de Design"
        >
          <i className="fas fa-layer-group text-xl"></i>
        </button>
        
        <button 
          onClick={() => setActiveTool(ToolType.PLANNER)}
          className={`p-3 rounded-xl transition-all ${activeTool === ToolType.PLANNER ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          title="Planejador"
        >
          <i className="fas fa-calendar-check text-xl"></i>
        </button>
      </nav>

      {/* Main Tools Panel */}
      <main className="flex-1 flex flex-col md:flex-row h-full overflow-hidden">
        
        {/* Workspace/Form */}
        <div className="flex-1 p-6 md:p-10 overflow-y-auto bg-slate-900/30">
          <header className="mb-10">
            <h1 className="text-3xl font-bold text-white mb-2">InstaAI Studio</h1>
            <p className="text-slate-400">Transforme suas ideias em posts virais em segundos.</p>
          </header>

          <div className="space-y-8 max-w-2xl">
            {/* Context Input */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-300">
                Sobre o que é o seu post? (Inspirado em Midjourney/Jasper)
              </label>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ex: Um café aconchegante em estilo minimalista com luz da manhã..."
                className="w-full h-32 bg-slate-800 border border-slate-700 rounded-xl p-4 text-slate-100 placeholder:text-slate-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none"
              />
            </div>

            {/* Specific Tool Options */}
            {activeTool === ToolType.IMAGE_GEN && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-slate-800/40 rounded-2xl border border-slate-700">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Formato</label>
                  <div className="flex gap-2">
                    {['1:1', '4:5', '9:16'].map(ratio => (
                      <button 
                        key={ratio}
                        onClick={() => setState(s => ({ ...s, aspectRatio: ratio as any }))}
                        className={`flex-1 py-2 rounded-lg border text-sm transition-all ${state.aspectRatio === ratio ? 'bg-purple-600 border-purple-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
                      >
                        {ratio}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Qualidade</label>
                  <select className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm text-slate-300 outline-none">
                    <option>Padrão (Gemini 2.5)</option>
                    <option>Ultra HD (Gemini 3 Pro)</option>
                  </select>
                </div>
                <button 
                  onClick={handleGenerateImage}
                  disabled={state.isGenerating || !prompt}
                  className="md:col-span-2 bg-white text-slate-900 font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {state.isGenerating ? <i className="fas fa-spinner animate-spin"></i> : <i className="fas fa-paint-brush"></i>}
                  Gerar Imagem AI
                </button>
              </div>
            )}

            {activeTool === ToolType.CONTENT && (
              <div className="grid grid-cols-1 gap-6 p-6 bg-slate-800/40 rounded-2xl border border-slate-700">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Tom de Voz (Estilo Copy.ai)</label>
                  <select 
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm text-slate-300 outline-none"
                  >
                    <option>Profissional</option>
                    <option>Engraçado</option>
                    <option>Inspirador</option>
                    <option>Direto ao Ponto</option>
                    <option>Storytelling</option>
                  </select>
                </div>
                <button 
                  onClick={handleGenerateText}
                  disabled={isLoadingContent || !prompt}
                  className="bg-white text-slate-900 font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoadingContent ? <i className="fas fa-spinner animate-spin"></i> : <i className="fas fa-keyboard"></i>}
                  Criar Legenda Máquina
                </button>
              </div>
            )}

            {/* All-in-One Quick Action */}
            <div className="pt-4">
              <button 
                onClick={handleMagicBuild}
                disabled={state.isGenerating || isLoadingContent || !prompt}
                className="w-full instagram-gradient p-[2px] rounded-2xl group transition-transform active:scale-95"
              >
                <div className="w-full bg-slate-900 py-4 rounded-[14px] flex items-center justify-center gap-3 font-bold text-white group-hover:bg-slate-900/80">
                  <i className="fas fa-bolt text-yellow-400 group-hover:animate-bounce"></i>
                  Criação Completa com 1 Clique (All-in-One)
                </div>
              </button>
              <p className="text-[10px] text-center text-slate-500 mt-2">
                Inspirado em Predis.ai e Craftly.ai para agilidade total.
              </p>
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <aside className="w-full lg:w-[450px] bg-slate-900 border-l border-slate-800 p-8 overflow-y-auto">
          <div className="sticky top-0 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Visualização</h2>
              <span className="bg-slate-800 text-[10px] px-2 py-1 rounded text-slate-400 uppercase tracking-widest font-bold">Ao Vivo</span>
            </div>
            
            <PostPreview state={state} />

            <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-800 text-xs text-slate-400">
               <p className="flex items-center gap-2 mb-2">
                 <i className="fas fa-info-circle text-purple-400"></i>
                 <strong>Dica Pro:</strong>
               </p>
               Para melhores resultados em português, use palavras-chave como "elegante", "sofisticado" ou "urbano" na descrição.
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default App;
