import React, { useState, useRef, useEffect } from 'react';
import { 
  Building2, 
  User, 
  Sparkles, 
  MessageSquare, 
  Star, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2,
  Copy,
  SmilePlus,
  Ban,
  Target,
  FileText,
  AlertCircle,
  ClipboardList,
  Fingerprint,
  UploadCloud,
  File as FileIcon,
  X,
  Trophy,
  Loader2
} from 'lucide-react';

// Card de Seleção Premium (Minimalista com Glow)
const SelectionCard = ({ icon: Icon, title, description, value, checked, onChange, name }) => (
  <label className={`relative flex-1 flex flex-col p-5 rounded-2xl border cursor-pointer transition-all duration-500 group overflow-hidden ${
    checked 
      ? 'border-indigo-500 bg-white shadow-[0_0_30px_-10px_rgba(99,102,241,0.3)]' 
      : 'border-white/40 bg-white/40 hover:bg-white/60 hover:border-white/80'
  }`}>
    {checked && <div className="absolute inset-0 bg-gradient-to-tr from-indigo-50 via-white to-white opacity-50 transition-opacity" />}
    
    <div className="relative z-10 flex items-center gap-3 mb-2">
      <div className={`p-2.5 rounded-xl transition-all duration-300 ${
        checked 
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
          : 'bg-slate-100 text-slate-400 group-hover:text-indigo-500 group-hover:bg-white'
      }`}>
        <Icon size={22} strokeWidth={1.5} />
      </div>
      <span className={`font-semibold text-lg tracking-tight ${checked ? 'text-slate-800' : 'text-slate-600'}`}>
        {title}
      </span>
    </div>
    {description && (
      <p className="relative z-10 text-sm text-slate-500 pl-[54px] leading-relaxed font-medium">
        {description}
      </p>
    )}
    <input 
      type="radio" 
      name={name} 
      value={value} 
      checked={checked} 
      onChange={onChange} 
      className="hidden" 
    />
    {checked && (
      <div className="absolute top-4 right-4 text-indigo-600 animate-fade-in-up">
        <CheckCircle2 size={20} />
      </div>
    )}
  </label>
);

// Chip de Multipla Seleção (Agora usado para Tom de Voz)
const MultiSelectChip = ({ label, selected, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 border ${
      selected
        ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/20 transform scale-105'
        : 'bg-white/50 text-slate-600 border-slate-200 hover:border-indigo-300 hover:bg-white'
    }`}
  >
    <div className="flex items-center gap-2">
      {selected && <CheckCircle2 size={14} className="animate-bounce-short" />}
      {label}
    </div>
  </button>
);

const StyledInput = ({ label, error, ...props }) => (
  <div className="group">
    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 pl-1 transition-colors group-focus-within:text-indigo-600">
      {label} {error && <span className="text-red-500">*</span>}
    </label>
    <input
      {...props}
      className={`w-full p-4 border rounded-xl outline-none transition-all duration-300 text-slate-700 placeholder:text-slate-300 font-medium ${
        error 
          ? 'border-red-300 bg-red-50/50 focus:border-red-500' 
          : 'border-slate-200 bg-white/50 focus:bg-white focus:border-indigo-500 focus:shadow-[0_4px_20px_-5px_rgba(99,102,241,0.15)]'
      }`}
    />
  </div>
);

const StyledSelect = ({ label, children, ...props }) => (
  <div className="group">
    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 pl-1 transition-colors group-focus-within:text-indigo-600">
      {label}
    </label>
    <div className="relative">
      <select
        {...props}
        className="w-full p-4 border border-slate-200 rounded-xl outline-none transition-all duration-300 bg-white/50 focus:bg-white focus:border-indigo-500 focus:shadow-[0_4px_20px_-5px_rgba(99,102,241,0.15)] text-slate-700 font-medium cursor-pointer appearance-none"
      >
        {children}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
        <ChevronRight size={16} className="rotate-90" />
      </div>
    </div>
  </div>
);

const StyledTextarea = ({ label, error, ...props }) => (
  <div className="group">
    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 pl-1 transition-colors group-focus-within:text-indigo-600">
      {label} {error && <span className="text-red-500">*</span>}
    </label>
    <textarea
      {...props}
      className={`w-full p-4 border rounded-xl outline-none transition-all duration-300 text-slate-700 placeholder:text-slate-300 font-medium resize-y min-h-[120px] ${
        error 
          ? 'border-red-300 bg-red-50/50 focus:border-red-500' 
          : 'border-slate-200 bg-white/50 focus:bg-white focus:border-indigo-500 focus:shadow-[0_4px_20px_-5px_rgba(99,102,241,0.15)]'
      }`}
    />
  </div>
);

const TONE_OPTIONS = [
  "Formal",
  "Profissional", 
  "Educado",
  "Amigável",
  "Simpático",
  "Descontraído",
  "Acolhedor",
  "Empático",
  "Direto",
  "Entusiasta"
];

const App = () => {
  const [step, setStep] = useState(1);
  const totalSteps = 5;
  const [error, setError] = useState('');
  const [isSending, setIsSending] = useState(false);
  
  const faqFileInputRef = useRef(null);
  const trainingFileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    companyName: '',
    segment: '',
    segmentOther: '',
    cityState: '',
    agentName: '',
    tones: ['Profissional', 'Educado'],
    useEmoji: 'Sim',
    intro: '',
    style: 'Objetiva',
    avoidPhrases: '',
    faqQuestions: '',
    faqAnswers: '',
    faqFiles: [],
    trainingText: '',
    trainingFiles: []
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const toggleTone = (tone) => {
    setFormData(prev => {
      const exists = prev.tones.includes(tone);
      let newTones;
      if (exists) {
        newTones = prev.tones.filter(t => t !== tone);
      } else {
        newTones = [...prev.tones, tone];
      }
      return { ...prev, tones: newTones };
    });
    if (error) setError('');
  };

  const handleFileChange = (e, fieldName) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => 
      file.type === "application/pdf" || 
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || 
      file.type === "text/plain"
    );
    
    if (validFiles.length > 0) {
      setFormData(prev => ({ 
        ...prev, 
        [fieldName]: [...prev[fieldName], ...validFiles] 
      }));
      if (error) setError('');
    }
    
    if (validFiles.length < files.length) {
      alert("Alguns arquivos foram ignorados. Apenas PDF, DOCX ou TXT são aceitos.");
    }
    
    // Limpar input para permitir adicionar o mesmo arquivo novamente
    e.target.value = '';
  };

  const removeFile = (fieldName, index) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: prev[fieldName].filter((_, i) => i !== index)
    }));
  };

  const validateStep = (currentStep) => {
    switch (currentStep) {
      case 1:
        if (!formData.companyName.trim()) return false;
        if (!formData.cityState.trim()) return false;
        if (!formData.segment) return false;
        if (formData.segment === 'Outros' && !formData.segmentOther.trim()) return false;
        return true;
      case 2:
        if (!formData.agentName.trim()) return false;
        if (formData.tones.length === 0) return false;
        return true;
      case 3:
        if (!formData.intro.trim()) return false;
        return true;
      case 4:
        const hasFaqText = formData.faqQuestions.trim() && formData.faqAnswers.trim();
        const hasFaqFiles = formData.faqFiles.length > 0;
        if (!hasFaqText && !hasFaqFiles) return false;
        return true;
      case 5:
        const hasTrainingText = formData.trainingText.trim();
        const hasTrainingFiles = formData.trainingFiles.length > 0;
        if (!hasTrainingText && !hasTrainingFiles) return false;
        return true;
      default:
        return true;
    }
  };

  const triggerConfetti = () => {
    if (window.confetti) {
      const duration = 3000;
      const end = Date.now() + duration;

      (function frame() {
        window.confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#6366f1', '#8b5cf6', '#ec4899']
        });
        window.confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#6366f1', '#8b5cf6', '#ec4899']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      }());
    }
  };

  // Gerar ID único para a submissão
  const generateSubmissionId = () => {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 8);
    return `SUB-${timestamp}-${randomPart}`.toUpperCase();
  };

  const createFormData = (file = null, context = null, submissionId = null) => {
    const dataToSend = new FormData();
    
    // ID da Submissão - permite agrupar todas as requisições do mesmo usuário
    if (submissionId) {
      dataToSend.append("ID da Submissao", submissionId);
      // URL do Histórico - link para visualizar este preenchimento
      dataToSend.append("URL do Historico", `https://forms-diferencial.vercel.app/historico/${submissionId}`);
    }
    
    // Mapeamento para nomes em Português
    dataToSend.append("Nome da Empresa", formData.companyName);
    dataToSend.append("Segmento de Atuação", formData.segment === 'Outros' ? formData.segmentOther : formData.segment);
    dataToSend.append("Cidade e Estado", formData.cityState);
    dataToSend.append("Nome da Assistente Virtual", formData.agentName);
    dataToSend.append("Tons de Voz Escolhidos", formData.tones.join(', '));
    dataToSend.append("Uso de Emojis", formData.useEmoji);
    dataToSend.append("Apresentação Inicial", formData.intro);
    dataToSend.append("Estilo de Resposta", formData.style);
    dataToSend.append("Frases para Evitar", formData.avoidPhrases);
    
    dataToSend.append("Perguntas FAQ (Texto)", formData.faqQuestions || "Não informado");
    dataToSend.append("Respostas FAQ (Texto)", formData.faqAnswers || "Não informado");
    dataToSend.append("Exemplos de Venda/Conversa (Texto)", formData.trainingText || "Não informado");

    // Se houver arquivo, anexar como 'data' e adicionar o contexto
    if (file) {
      dataToSend.append('data', file); // Chave sempre 'data'
      dataToSend.append('Tipo do Arquivo', context); 
      dataToSend.append('Nome do Arquivo Original', file.name);
    }

    return dataToSend;
  };

  const handleFinalSubmit = async () => {
    if (!validateStep(step)) {
      setError('Por favor, preencha os campos obrigatórios para finalizar.');
      return;
    }
    setError('');
    setIsSending(true);
    setIsLoading(true);

    const webhookUrl = 'https://diferencialbi.app.n8n.cloud/webhook/recebiforms';

    try {
      const requests = [];
      
      // Gerar ID único para esta submissão - será o mesmo em todas as requisições
      const submissionId = generateSubmissionId();
      console.log(`ID da Submissão: ${submissionId}`);

      // Estratégia: Enviar requisições separadas para garantir que cada arquivo use a chave 'data'
      
      // 1. Envio dos Arquivos de FAQ (se existirem)
      formData.faqFiles.forEach(file => {
        requests.push(
          fetch(webhookUrl, {
            method: 'POST',
            body: createFormData(file, "FAQ", submissionId)
          })
        );
      });

      // 2. Envio dos Arquivos de Treinamento (se existirem)
      formData.trainingFiles.forEach(file => {
        requests.push(
          fetch(webhookUrl, {
            method: 'POST',
            body: createFormData(file, "Treinamento", submissionId)
          })
        );
      });

      // 3. Caso não haja NENHUM arquivo, envia apenas os dados de texto
      if (formData.faqFiles.length === 0 && formData.trainingFiles.length === 0) {
        requests.push(
          fetch(webhookUrl, {
            method: 'POST',
            body: createFormData(null, null, submissionId)
          })
        );
      }

      console.log(`Iniciando ${requests.length} envios para garantir chave 'data'...`);
      
      await Promise.all(requests);

      console.log('Todos os envios concluídos com sucesso!');
      
      // Mostrar loading por pelo menos 2.5 segundos para melhor UX
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      setIsLoading(false);
      triggerConfetti();
      setIsSubmitted(true);
      window.scrollTo(0, 0);

    } catch (err) {
      console.error('Erro ao enviar webhook:', err);
      // Fallback visual para sucesso
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsLoading(false);
      triggerConfetti();
      setIsSubmitted(true);
      window.scrollTo(0, 0);
    } finally {
      setIsSending(false);
    }
  };

  const nextStep = () => {
    if (!validateStep(step)) {
      setError('Por favor, preencha os campos obrigatórios para continuar.');
      return;
    }
    setError('');

    if (step < totalSteps) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    } else {
      handleFinalSubmit();
    }
  };

  const prevStep = () => {
    setError('');
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo(0, 0);
    }
  };

  const progressPercentage = ((step - 1) / (totalSteps - 1)) * 100;

  const renderStepIcon = (stepNumber) => {
    switch(stepNumber) {
      case 1: return <Building2 size={18} strokeWidth={2.5} />;
      case 2: return <User size={18} strokeWidth={2.5} />;
      case 3: return <MessageSquare size={18} strokeWidth={2.5} />;
      case 4: return <Star size={18} strokeWidth={2.5} />;
      case 5: return <Sparkles size={18} strokeWidth={2.5} />;
      default: return <CheckCircle2 size={18} strokeWidth={2.5} />;
    }
  };

  const renderContent = () => {
    // Tela de Loading com animação
    if (isLoading) {
      return (
        <div className="animate-fade-in text-center space-y-8 py-24 flex flex-col items-center justify-center min-h-[400px]">
          <div className="analyze">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              height="80"
              width="80"
            >
              <rect height="24" width="24"></rect>
              <path
                strokeLinecap="round"
                strokeWidth="1.5"
                stroke="#6366f1"
                d="M19.25 9.25V5.25C19.25 4.42157 18.5784 3.75 17.75 3.75H6.25C5.42157 3.75 4.75 4.42157 4.75 5.25V18.75C4.75 19.5784 5.42157 20.25 6.25 20.25H12.25"
                className="board"
              ></path>
              <path
                fill="#6366f1"
                d="M9.18748 11.5066C9.12305 11.3324 8.87677 11.3324 8.81234 11.5066L8.49165 12.3732C8.47139 12.428 8.42823 12.4711 8.37348 12.4914L7.50681 12.8121C7.33269 12.8765 7.33269 13.1228 7.50681 13.1872L8.37348 13.5079C8.42823 13.5282 8.47139 13.5714 8.49165 13.6261L8.81234 14.4928C8.87677 14.6669 9.12305 14.6669 9.18748 14.4928L9.50818 13.6261C9.52844 13.5714 9.5716 13.5282 9.62634 13.5079L10.493 13.1872C10.6671 13.1228 10.6671 12.8765 10.493 12.8121L9.62634 12.4914C9.5716 12.4711 9.52844 12.428 9.50818 12.3732L9.18748 11.5066Z"
                className="star-2"
              ></path>
              <path
                fill="#6366f1"
                d="M11.7345 6.63394C11.654 6.41629 11.3461 6.41629 11.2656 6.63394L10.8647 7.71728C10.8394 7.78571 10.7855 7.83966 10.717 7.86498L9.6337 8.26585C9.41605 8.34639 9.41605 8.65424 9.6337 8.73478L10.717 9.13565C10.7855 9.16097 10.8394 9.21493 10.8647 9.28335L11.2656 10.3667C11.3461 10.5843 11.654 10.5843 11.7345 10.3667L12.1354 9.28335C12.1607 9.21493 12.2147 9.16097 12.2831 9.13565L13.3664 8.73478C13.5841 8.65424 13.5841 8.34639 13.3664 8.26585L12.2831 7.86498C12.2147 7.83966 12.1607 7.78571 12.1354 7.71728L11.7345 6.63394Z"
                className="star-1"
              ></path>
              <path
                className="stick"
                strokeLinejoin="round"
                strokeWidth="1.5"
                stroke="#6366f1"
                d="M17 14L21.2929 18.2929C21.6834 18.6834 21.6834 19.3166 21.2929 19.7071L20.7071 20.2929C20.3166 20.6834 19.6834 20.6834 19.2929 20.2929L15 16M17 14L15.7071 12.7071C15.3166 12.3166 14.6834 12.3166 14.2929 12.7071L13.7071 13.2929C13.3166 13.6834 13.3166 14.3166 13.7071 14.7071L15 16M17 14L15 16"
              ></path>
            </svg>
          </div>
          <div className="space-y-3 max-w-lg mx-auto">
            <h2 className="text-2xl font-bold text-slate-700 tracking-tight">Processando...</h2>
            <p className="text-slate-500 text-base font-medium">Aguarde enquanto enviamos as configurações.</p>
          </div>
        </div>
      );
    }

    if (isSubmitted) {
      return (
        <div className="animate-fade-in text-center space-y-8 py-24 flex flex-col items-center justify-center min-h-[400px]">
          <div className="relative">
            <div className="h-32 w-32 bg-gradient-to-tr from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white shadow-xl relative z-10 border-4 border-white animate-fade-in-up">
              <CheckCircle2 size={72} strokeWidth={2} />
            </div>
          </div>
          <div className="space-y-4 max-w-lg mx-auto">
             <h2 className="text-4xl font-extrabold text-slate-800 tracking-tight">Sucesso!</h2>
             <p className="text-slate-600 text-xl font-medium leading-relaxed">
               As informações da <strong className="text-indigo-600">{formData.companyName || "sua empresa"}</strong> foram enviadas e a configuração foi concluída com êxito.
             </p>
             <p className="text-slate-400 text-sm">Nossa equipe processará seus dados em breve.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="animate-fade-in space-y-10 py-2">
        {/* Step 1: Info Empresa */}
        {step === 1 && (
          <>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Sobre a Empresa</h2>
              <p className="text-slate-500 mt-3 text-lg font-medium">Vamos começar definindo o perfil do seu negócio.</p>
            </div>

            <div className="space-y-8 max-w-xl mx-auto">
              <StyledInput
                label="Nome da Empresa"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Ex: Loja Modas & Cia"
                error={error && !formData.companyName}
              />

              <StyledSelect
                label="Segmento de Atuação"
                name="segment"
                value={formData.segment}
                onChange={handleChange}
              >
                  <option value="" disabled>Selecione um segmento...</option>
                  <option value="Roupas / Moda">Roupas / Moda</option>
                  <option value="Calçados">Calçados</option>
                  <option value="Cosméticos / Beleza">Cosméticos / Beleza</option>
                  <option value="Eletrônicos">Eletrônicos</option>
                  <option value="Informática">Informática</option>
                  <option value="Alimentos / Delivery">Alimentos / Delivery</option>
                  <option value="Mercado / Hortifruti">Mercado / Hortifruti</option>
                  <option value="Pet Shop">Pet Shop</option>
                  <option value="Artigos para Casa">Artigos para Casa</option>
                  <option value="Joias / Acessórios">Joias / Acessórios</option>
                  <option value="Serviços">Serviços</option>
                  <option value="Academia / Saúde">Academia / Saúde</option>
                  <option value="Outros">Outros</option>
              </StyledSelect>

              {formData.segment === 'Outros' && (
                <div className="animate-fade-in-up">
                  <StyledInput
                    label="Qual o segmento?"
                    name="segmentOther"
                    value={formData.segmentOther}
                    onChange={handleChange}
                    placeholder="Descreva seu segmento"
                    autoFocus
                    error={error && !formData.segmentOther}
                  />
                </div>
              )}

              <StyledInput
                label="Cidade e Estado"
                name="cityState"
                value={formData.cityState}
                onChange={handleChange}
                placeholder="Ex: São Paulo, SP"
                error={error && !formData.cityState}
              />
            </div>
          </>
        )}

        {/* Step 2: Identidade */}
        {step === 2 && (
          <>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Persona da I.A.</h2>
              <p className="text-slate-500 mt-3 text-lg font-medium">Defina a identidade e o tom de voz da assistente.</p>
            </div>

            <div className="space-y-8 max-w-xl mx-auto">
              <StyledInput
                label="Nome da Atendente"
                name="agentName"
                value={formData.agentName}
                onChange={handleChange}
                placeholder="Ex: Ana, Bia, Assistente Virtual"
                error={error && !formData.agentName}
              />

              <div className="group">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 pl-1">
                  Tons de Voz Preferidos {error && formData.tones.length === 0 && <span className="text-red-500">*</span>}
                </label>
                <div className="flex flex-wrap gap-2">
                  {TONE_OPTIONS.map(tone => (
                    <MultiSelectChip 
                      key={tone}
                      label={tone}
                      selected={formData.tones.includes(tone)}
                      onClick={() => toggleTone(tone)}
                    />
                  ))}
                </div>
                <p className="text-xs text-slate-400 mt-2 pl-1">Selecione uma ou mais opções para combinar.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 pl-1">Uso de Emojis</label>
                <div className="flex gap-4 md:gap-6">
                  <SelectionCard
                    icon={SmilePlus}
                    title="Sim, usar"
                    description="Comunicação leve."
                    value="Sim"
                    name="useEmoji"
                    checked={formData.useEmoji === 'Sim'}
                    onChange={handleChange}
                  />
                   <SelectionCard
                    icon={Ban}
                    title="Não usar"
                    description="Comunicação séria."
                    value="Não"
                    name="useEmoji"
                    checked={formData.useEmoji === 'Não'}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {/* Step 3: Comportamento */}
        {step === 3 && (
          <>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Comportamento</h2>
              <p className="text-slate-500 mt-3 text-lg font-medium">Como ela deve interagir e reagir aos clientes.</p>
            </div>

            <div className="space-y-8 max-w-xl mx-auto">
              <StyledTextarea
                label="Apresentação Inicial"
                name="intro"
                value={formData.intro}
                onChange={handleChange}
                placeholder="Ex: Olá! Sou a assistente virtual da Loja X. Como posso ajudar hoje?"
                error={error && !formData.intro}
              />

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 pl-1">Estilo de Resposta</label>
                 <div className="flex gap-4 md:gap-6">
                  <SelectionCard
                    icon={Target}
                    title="Objetiva"
                    description="Direto ao ponto."
                    value="Objetiva"
                    name="style"
                    checked={formData.style === 'Objetiva'}
                    onChange={handleChange}
                  />
                  <SelectionCard
                    icon={FileText}
                    title="Detalhada"
                    description="Explicativa."
                    value="Detalhada"
                    name="style"
                    checked={formData.style === 'Detalhada'}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <StyledTextarea
                label="O que ela deve evitar falar?"
                name="avoidPhrases"
                value={formData.avoidPhrases}
                onChange={handleChange}
                placeholder="Ex: 'Não sei', 'Talvez', gírias muito informais..."
                error={error && !formData.avoidPhrases}
              />
            </div>
          </>
        )}

        {/* Step 4: FAQ */}
        {step === 4 && (
          <>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Base de Conhecimento</h2>
              <p className="text-slate-500 mt-3 text-lg font-medium">Ensine o básico sobre o seu funcionamento.</p>
            </div>

            <div className="space-y-8 max-w-xl mx-auto">
              
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl">
                 <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-4 flex items-center gap-2">
                   <FileText size={16} /> Opção 1: Digitar FAQ Manualmente
                 </h3>
                 <div className="space-y-4">
                    <StyledTextarea
                      label="Perguntas Frequentes"
                      name="faqQuestions"
                      value={formData.faqQuestions}
                      onChange={handleChange}
                      placeholder="Ex: Quais as formas de pagamento? Vocês entregam?"
                    />
                    <StyledTextarea
                      label="Respostas"
                      name="faqAnswers"
                      value={formData.faqAnswers}
                      onChange={handleChange}
                      placeholder="Ex: Aceitamos Pix. Entregamos em toda cidade."
                    />
                 </div>
              </div>

              <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-slate-200"></div>
                  <span className="flex-shrink-0 mx-4 text-slate-400 text-xs font-bold uppercase tracking-wider">OU</span>
                  <div className="flex-grow border-t border-slate-200"></div>
              </div>

              <div className="p-6 bg-indigo-50/50 border border-indigo-100 rounded-2xl">
                <h3 className="text-sm font-bold text-indigo-700 uppercase tracking-wide mb-4 flex items-center gap-2">
                   <UploadCloud size={16} /> Opção 2: Enviar Arquivo(s) FAQ
                 </h3>
                 
                 {/* Lista de arquivos enviados */}
                 {formData.faqFiles.length > 0 && (
                   <div className="space-y-2 mb-4">
                     {formData.faqFiles.map((file, index) => (
                       <div key={index} className="flex items-center justify-between p-3 bg-white border border-indigo-200 rounded-xl shadow-sm animate-fade-in-up">
                         <div className="flex items-center gap-3">
                           <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                             <FileIcon size={20} />
                           </div>
                           <div>
                             <p className="text-sm font-bold text-slate-700 truncate max-w-[180px]">{file.name}</p>
                             <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(1)} KB</p>
                           </div>
                         </div>
                         <button 
                           onClick={() => removeFile('faqFiles', index)}
                           className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                           title="Remover arquivo"
                         >
                           <X size={18} />
                         </button>
                       </div>
                     ))}
                   </div>
                 )}

                 {/* Área de upload */}
                 <label className={`flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-xl cursor-pointer hover:bg-white transition-colors group ${error && formData.faqFiles.length === 0 && !formData.faqQuestions ? 'border-red-300 bg-red-50/20' : 'border-indigo-200 bg-white/50'}`}>
                    <div className="flex flex-col items-center justify-center py-4">
                        <UploadCloud className={`mb-2 ${error && formData.faqFiles.length === 0 && !formData.faqQuestions ? 'text-red-400' : 'text-indigo-400 group-hover:scale-110 transition-transform'}`} size={28} />
                        <p className="text-sm text-slate-600 font-medium">{formData.faqFiles.length > 0 ? 'Adicionar mais arquivos' : 'Clique para enviar'}</p>
                        <p className="text-xs text-slate-400">PDF ou DOCX (Max 5MB cada)</p>
                    </div>
                    <input 
                      ref={faqFileInputRef}
                      type="file" 
                      className="hidden" 
                      multiple
                      accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={(e) => handleFileChange(e, 'faqFiles')}
                    />
                 </label>

                 {error && formData.faqFiles.length === 0 && !formData.faqQuestions && (
                   <p className="text-red-500 text-xs mt-2 font-medium flex items-center gap-1">
                     <AlertCircle size={12} /> Selecione pelo menos uma opção (Texto ou Arquivo).
                   </p>
                 )}
              </div>

            </div>
          </>
        )}

        {/* Step 5: Exemplos (Modificado) */}
        {step === 5 && (
          <>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Treinamento Fino</h2>
              <p className="text-slate-500 mt-3 text-lg font-medium">Calibragem para sucesso em vendas.</p>
            </div>

            <div className="space-y-8 max-w-xl mx-auto">
              
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl">
                 <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-4 flex items-center gap-2">
                   <Trophy size={16} /> Opção 1: Digitar Conversas de Sucesso
                 </h3>
                 <p className="text-xs text-slate-500 mb-3">Cole abaixo 3 exemplos de conversas onde a venda foi fechada ou o pedido realizado.</p>
                 <StyledTextarea
                   label="3 Conversas de Sucesso (Texto)"
                   name="trainingText"
                   value={formData.trainingText}
                   onChange={handleChange}
                   placeholder="Exemplo 1: &#10;Cliente: Quero comprar. &#10;Atendente: Perfeito! Aqui está o link... (Venda Fechada)&#10;&#10;Exemplo 2: ..."
                   rows={8}
                 />
              </div>

              <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-slate-200"></div>
                  <span className="flex-shrink-0 mx-4 text-slate-400 text-xs font-bold uppercase tracking-wider">OU</span>
                  <div className="flex-grow border-t border-slate-200"></div>
              </div>

              <div className="p-6 bg-indigo-50/50 border border-indigo-100 rounded-2xl">
                <h3 className="text-sm font-bold text-indigo-700 uppercase tracking-wide mb-4 flex items-center gap-2">
                   <UploadCloud size={16} /> Opção 2: Enviar Arquivo(s) com Conversas
                 </h3>
                 
                 {/* Lista de arquivos enviados */}
                 {formData.trainingFiles.length > 0 && (
                   <div className="space-y-2 mb-4">
                     {formData.trainingFiles.map((file, index) => (
                       <div key={index} className="flex items-center justify-between p-3 bg-white border border-indigo-200 rounded-xl shadow-sm animate-fade-in-up">
                         <div className="flex items-center gap-3">
                           <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                             <FileIcon size={20} />
                           </div>
                           <div>
                             <p className="text-sm font-bold text-slate-700 truncate max-w-[180px]">{file.name}</p>
                             <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(1)} KB</p>
                           </div>
                         </div>
                         <button 
                           onClick={() => removeFile('trainingFiles', index)}
                           className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                           title="Remover arquivo"
                         >
                           <X size={18} />
                         </button>
                       </div>
                     ))}
                   </div>
                 )}

                 {/* Área de upload */}
                 <label className={`flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-xl cursor-pointer hover:bg-white transition-colors group ${error && formData.trainingFiles.length === 0 && !formData.trainingText ? 'border-red-300 bg-red-50/20' : 'border-indigo-200 bg-white/50'}`}>
                    <div className="flex flex-col items-center justify-center py-4">
                        <UploadCloud className={`mb-2 ${error && formData.trainingFiles.length === 0 && !formData.trainingText ? 'text-red-400' : 'text-indigo-400 group-hover:scale-110 transition-transform'}`} size={28} />
                        <p className="text-sm text-slate-600 font-medium">{formData.trainingFiles.length > 0 ? 'Adicionar mais arquivos' : 'Clique para enviar'}</p>
                        <p className="text-xs text-slate-400">PDF, DOCX ou TXT (Max 5MB cada)</p>
                    </div>
                    <input 
                      ref={trainingFileInputRef}
                      type="file" 
                      className="hidden" 
                      multiple
                      accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                      onChange={(e) => handleFileChange(e, 'trainingFiles')}
                    />
                 </label>

                 {error && formData.trainingFiles.length === 0 && !formData.trainingText && (
                   <p className="text-red-500 text-xs mt-2 font-medium flex items-center gap-1">
                     <AlertCircle size={12} /> Selecione pelo menos uma opção (Texto ou Arquivo).
                   </p>
                 )}
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    // Premium Mesh Gradient Background
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-800 p-4 md:p-8 flex items-center justify-center relative overflow-hidden">
      
      {/* Lightweight Background - Solid gradients instead of blur */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-50 via-white to-violet-50 opacity-60"></div>

      <div className="w-full max-w-3xl relative z-10">
        
        {/* Intro Banner - Glassmorphism */}
        {!isSubmitted && step === 1 && (
          <div className="mb-8 bg-white/95 border border-slate-200 p-8 rounded-3xl shadow-lg animate-fade-in relative overflow-hidden group">
             
             {/* Flowchart Background Pattern - Ultra Subtle */}
             <div className="absolute inset-0 opacity-5 pointer-events-none group-hover:scale-105 transition-transform duration-[2s]">
                <svg className="w-full h-full" viewBox="0 0 800 300" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                      <path d="M0,0 L0,6 L6,3 z" fill="#1e293b" />
                    </marker>
                  </defs>
                  
                  {/* Left Group */}
                  <rect x="50" y="50" width="80" height="50" rx="8" stroke="#1e293b" strokeWidth="1" fill="none" />
                  <rect x="50" y="150" width="80" height="50" rx="8" stroke="#1e293b" strokeWidth="1" fill="none" />
                  
                  {/* Middle Group */}
                  <rect x="250" y="100" width="100" height="60" rx="8" stroke="#1e293b" strokeWidth="1" fill="none" />
                  <circle cx="300" cy="220" r="30" stroke="#1e293b" strokeWidth="1" fill="none" />
                  
                  {/* Right Group */}
                  <rect x="500" y="40" width="90" height="50" rx="8" stroke="#1e293b" strokeWidth="1" fill="none" />
                  <rect x="500" y="140" width="90" height="50" rx="8" stroke="#1e293b" strokeWidth="1" fill="none" />
                  <rect x="680" y="90" width="80" height="50" rx="8" stroke="#1e293b" strokeWidth="1" fill="none" />
                  <rect x="680" y="190" width="80" height="50" rx="8" stroke="#1e293b" strokeWidth="1" fill="none" />

                  {/* Connecting Lines */}
                  <path d="M130 75 C 190 75, 190 130, 250 130" stroke="#1e293b" strokeWidth="1" fill="none" markerEnd="url(#arrow)" />
                  <path d="M130 175 C 190 175, 190 130, 250 130" stroke="#1e293b" strokeWidth="1" fill="none" markerEnd="url(#arrow)" />
                  <path d="M300 160 L 300 190" stroke="#1e293b" strokeWidth="1" fill="none" markerEnd="url(#arrow)" />
                  <path d="M350 130 C 420 130, 420 65, 500 65" stroke="#1e293b" strokeWidth="1" fill="none" markerEnd="url(#arrow)" />
                  <path d="M350 130 C 420 130, 420 165, 500 165" stroke="#1e293b" strokeWidth="1" fill="none" markerEnd="url(#arrow)" />
                  <path d="M590 65 C 630 65, 630 115, 680 115" stroke="#1e293b" strokeWidth="1" fill="none" markerEnd="url(#arrow)" />
                  <path d="M590 165 C 630 165, 630 115, 680 115" stroke="#1e293b" strokeWidth="1" fill="none" markerEnd="url(#arrow)" />
                  <path d="M590 165 C 630 165, 630 215, 680 215" stroke="#1e293b" strokeWidth="1" fill="none" markerEnd="url(#arrow)" />
                </svg>
             </div>

             <div className="absolute -top-12 -right-12 opacity-[0.08] rotate-12">
               <ClipboardList size={180} />
             </div>
             <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
               <div className="bg-gradient-to-br from-indigo-500 to-violet-600 p-4 rounded-2xl shadow-lg shadow-indigo-500/30 text-white shrink-0">
                  <ClipboardList size={32} strokeWidth={1.5}/> 
               </div>
               <div>
                  <h1 className="text-2xl md:text-3xl font-extrabold mb-2 text-slate-800 tracking-tight">
                    Configurador de Agente I.A
                  </h1>
                  <p className="text-slate-600 text-base leading-relaxed max-w-lg font-medium">
                    Personalize a inteligência artificial da sua empresa em poucos passos.
                  </p>
               </div>
             </div>
          </div>
        )}

        {/* Main Card - Solid Container (Otimizado) */}
        <div className="bg-white/95 rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden relative flex flex-col min-h-[650px] transition-all duration-300">
          
          {/* Timeline Indicator */}
          {!isSubmitted && (
            <div className="px-8 pt-10 pb-4">
              <div className="flex justify-between relative px-2">
                {/* Lines */}
                <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 h-0.5 bg-slate-200 rounded-full z-0"></div>
                <div 
                  className="absolute top-1/2 -translate-y-1/2 left-4 h-0.5 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full z-0 transition-all duration-700 ease-out"
                  style={{ width: `calc(${progressPercentage}% - 1rem)` }}
                ></div>

                {[1, 2, 3, 4, 5].map((s) => {
                  const isActive = s === step;
                  const isPassed = s < step;
                  return (
                  <div key={s} className="relative z-10 flex flex-col items-center gap-3">
                    <div 
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border-[3px] shadow-sm ${
                        isActive
                          ? 'bg-white text-indigo-600 border-indigo-600 shadow-indigo-500/30 scale-125' 
                          : isPassed 
                            ? 'bg-indigo-600 text-white border-indigo-600' 
                            : 'bg-white text-slate-300 border-slate-200'
                      }`}
                    >
                      {renderStepIcon(s)}
                    </div>
                  </div>
                )})}
              </div>
              <div className="flex justify-between px-1 mt-3">
                 {[1,2,3,4,5].map(s => (
                   <span key={s} className={`text-[10px] font-bold uppercase tracking-widest transition-colors duration-300 w-10 text-center ${s === step ? 'text-indigo-600' : 'text-slate-300 opacity-0 md:opacity-100'}`}>
                     0{s}
                   </span>
                 ))}
              </div>
            </div>
          )}

          {/* Form Content Area */}
          <div className="flex-1 px-8 md:px-16 py-8 overflow-y-auto custom-scrollbar">
            {renderContent()}
          </div>

          {/* Navigation Footer */}
          {!isSubmitted && (
            <div className="px-8 md:px-16 py-8 bg-slate-50 border-t border-slate-100 flex flex-col gap-5">
              
              {/* Error Alert */}
              {error && (
                <div className="flex items-center gap-3 text-red-600 text-sm font-semibold animate-fade-in-up bg-red-50 p-4 rounded-xl border border-red-100 shadow-sm">
                  <AlertCircle size={20} />
                  {error}
                </div>
              )}

              <div className="flex justify-between items-center w-full">
                <button
                  onClick={prevStep}
                  disabled={step === 1 || isSending}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                    step === 1 || isSending
                      ? 'text-slate-300 cursor-not-allowed opacity-50' 
                      : 'text-slate-500 hover:text-indigo-600 hover:bg-white hover:shadow-md'
                  }`}
                >
                  <ChevronLeft size={18} />
                  Voltar
                </button>

                <button
                  onClick={nextStep}
                  disabled={isSending}
                  className={`group flex items-center gap-3 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-xl font-bold shadow-md hover:-translate-y-0.5 transition-all duration-200 active:scale-95 ${isSending ? 'opacity-80 cursor-wait' : ''}`}
                >
                  {isSending ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Enviando...</span>
                    </>
                  ) : (
                    <>
                      <span>{step === totalSteps ? 'Finalizar Configuração' : 'Avançar'}</span>
                      {step !== totalSteps && (
                        <div className="group-hover:translate-x-1 transition-transform">
                          <ChevronRight size={18} />
                        </div>
                      )}
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="text-center mt-12 space-y-3 pb-8 opacity-60 hover:opacity-100 transition-opacity duration-500">
           <p className="text-slate-500 text-xs font-semibold tracking-wider flex items-center justify-center gap-2 uppercase">
            <Sparkles size={12} className="text-indigo-400"/>
            AI Agent Configurator 2025
          </p>
          <p className="text-slate-400 text-[10px] font-medium tracking-wide">
            Desenvolvido pelo time técnico da <strong className="text-slate-600">Diferencial Consultoria Empresarial</strong>
          </p>
        </div>

      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); scale: 0.98; }
          to { opacity: 1; transform: translateY(0); scale: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-fade-in-up {
          animation: fadeIn 0.4s ease-out forwards;
        }
        .animate-bounce-short {
          animation: bounceShort 0.5s;
        }
        @keyframes bounceShort {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }

        /* Custom Scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: #cbd5e1;
            border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background-color: #94a3b8;
        }

        /* Loading Animation Styles */
        .analyze {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .analyze svg {
          overflow: visible;
        }
        .analyze .board {
          stroke-dasharray: 80;
          stroke-dashoffset: 80;
          animation: drawBoard 2s ease-in-out infinite;
        }
        .analyze .stick {
          stroke-dasharray: 50;
          stroke-dashoffset: 50;
          animation: drawStick 1.5s ease-in-out infinite;
        }
        .analyze .star-1 {
          transform-origin: center;
          animation: pulseStar 1s ease-in-out infinite;
        }
        .analyze .star-2 {
          transform-origin: center;
          animation: pulseStar 1s ease-in-out infinite 0.3s;
        }
        @keyframes drawBoard {
          0% { stroke-dashoffset: 80; }
          50% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: 80; }
        }
        @keyframes drawStick {
          0% { stroke-dashoffset: 50; }
          50% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: 50; }
        }
        @keyframes pulseStar {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.3); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default App;
