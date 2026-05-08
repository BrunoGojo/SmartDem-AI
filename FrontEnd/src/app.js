const { useState, useRef, useEffect } = React;

function App() {
    const [messages, setMessages] = useState([
        { id: 1, role: 'assistant', text: 'Bem-vindo ao sistema de triagem. Por favor, anexe uma imagem nítida da lesão na pele para análise da IA.', image: null }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);
    const fileRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, loading]);

    const simulateResponse = (userText, userImg) => {
        setLoading(true);
        setTimeout(() => {
            const response = {
                id: Date.now(),
                role: 'assistant',
                text: userImg
                    ? "Análise concluída (Simulação): Foram detectadas bordas irregulares e pigmentação mista. Recomendamos a consulta com um dermatologista para realizar uma dermatoscopia."
                    : "Para uma análise de câncer de pele, é necessário o envio de uma foto da lesão.",
                image: null
            };
            setMessages(prev => [...prev, response]);
            setLoading(false);
        }, 2000);
    };

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        const newMsg = { id: Date.now(), role: 'user', text: input, image: null };
        setMessages(prev => [...prev, newMsg]);
        setInput('');
        simulateResponse(input, null);
    };

    const handleUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const newMsg = { id: Date.now(), role: 'user', text: "Imagem enviada para triagem.", image: reader.result };
                setMessages(prev => [...prev, newMsg]);
                simulateResponse("", reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="flex h-screen w-full text-gray-100">
            {/* Sidebar */}
            <div className="hidden md:flex w-64 bg-[#202123] p-2 flex-col">
                <button onClick={() => window.location.reload()} className="flex items-center gap-3 p-3 border border-white/20 rounded hover:bg-gray-500/10 transition text-sm">
                    + Nova Consulta
                </button>
                <div className="mt-4 flex-1 overflow-y-auto text-xs text-gray-400">
                    <p className="p-3 uppercase font-bold tracking-widest opacity-50">Histórico Recente</p>
                    <div className="p-3 hover:bg-[#2A2B32] rounded cursor-pointer truncate">Análise_Lesao_Costas.jpg</div>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col relative bg-[#343541]">
                <div ref={scrollRef} className="flex-1 overflow-y-auto chat-scroll pb-40">
                    {messages.map(m => (
                        <div key={m.id} className={`py-8 ${m.role === 'assistant' ? 'bg-[#444654]' : ''}`}>
                            <div className="max-w-3xl mx-auto px-4 flex gap-6">
                                <div className={`w-8 h-8 rounded shrink-0 flex items-center justify-center font-bold ${m.role === 'assistant' ? 'bg-emerald-600' : 'bg-blue-600'}`}>
                                    {m.role === 'assistant' ? 'IA' : 'U'}
                                </div>
                                <div className="flex-1 space-y-4">
                                    {m.image && <img src={m.image} className="max-w-xs rounded-lg border border-white/10" />}
                                    <p className="leading-relaxed">{m.text}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="py-8 bg-[#444654]">
                            <div className="max-w-3xl mx-auto px-4 flex gap-6 italic text-gray-400">
                                <div className="w-8 h-8 rounded bg-emerald-600 shrink-0 flex items-center justify-center text-white font-bold not-italic">IA</div>
                                <span>IA está processando a imagem...</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#343541] pt-10">
                    <form onSubmit={handleSend} className="max-w-3xl mx-auto px-4 pb-10">
                        <div className="relative flex items-center bg-[#40414f] rounded-xl border border-white/10 p-3 shadow-2xl">
                            <button type="button" onClick={() => fileRef.current.click()} className="p-2 text-gray-400 hover:text-white transition">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                            </button>
                            <input type="file" ref={fileRef} onChange={handleUpload} className="hidden" accept="image/*" />
                            <input 
                                type="text" 
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Envie uma imagem ou descreva a lesão..."
                                className="flex-1 bg-transparent border-none focus:ring-0 px-4 text-sm md:text-base"
                            />
                            <button type="submit" className="p-2 text-gray-400 hover:text-emerald-500 transition disabled:opacity-30" disabled={!input.trim()}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                            </button>
                        </div>
                        <p className="text-[10px] text-center text-gray-500 mt-2">Protótipo de uso acadêmico. Não substitui parecer médico.</p>
                    </form>
                </div>
            </div>
        </div>
    );
}

// Inicialização Final
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);   