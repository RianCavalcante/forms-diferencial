import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Building2, 
  User, 
  MessageSquare, 
  FileText, 
  CheckCircle2,
  Sparkles,
  MapPin,
  Smile,
  Target,
  Ban,
  HelpCircle,
  Trophy,
  AlertCircle
} from 'lucide-react';

const HistoricoPage = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dados, setDados] = useState(null);

  useEffect(() => {
    const buscarHistorico = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('https://diferencialbi.app.n8n.cloud/webhook/historicoforms', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: id,
            url: `https://forms-diferencial.vercel.app/historico/${id}`
          })
        });

        if (!response.ok) {
          throw new Error('Erro ao buscar dados');
        }

        const data = await response.json();
        setDados(data);
      } catch (err) {
        console.error('Erro:', err);
        setError('Não foi possível carregar os dados do histórico.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      buscarHistorico();
    }
  }, [id]);

  // Componente de Campo para exibição
  const Campo = ({ label, value, icon: Icon }) => (
    <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
      <div className="flex items-start gap-3">
        {Icon && (
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
            <Icon size={18} />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            {label}
          </label>
          <p className="text-slate-700 font-medium break-words">
            {value || <span className="text-slate-300 italic">Não informado</span>}
          </p>
        </div>
      </div>
    </div>
  );

  // Loading animado
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50 flex items-center justify-center p-4">
        <div className="text-center space-y-6">
          {/* Animação de Loading */}
          <div className="relative">
            <div className="w-20 h-20 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-indigo-100"></div>
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-600 animate-spin"></div>
              <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-violet-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <FileText size={24} className="text-indigo-600 animate-pulse" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-700">Carregando histórico...</h2>
            <p className="text-slate-500 text-sm">Buscando informações da submissão</p>
            <p className="text-indigo-600 font-mono text-xs bg-indigo-50 px-3 py-1 rounded-full inline-block">
              {id}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Erro
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50 flex items-center justify-center p-4">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle size={40} className="text-red-500" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-700">Erro ao carregar</h2>
            <p className="text-slate-500 text-sm">{error}</p>
            <p className="text-slate-400 font-mono text-xs">{id}</p>
          </div>
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium text-sm transition-colors"
          >
            <ArrowLeft size={16} />
            Voltar ao formulário
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50 font-sans text-slate-800 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="mb-6">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium text-sm mb-6 transition-colors"
          >
            <ArrowLeft size={16} />
            Voltar ao formulário
          </Link>
        </div>

        {/* Card Principal */}
        <div className="bg-white/95 rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          
          {/* Header do Card */}
          <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-2xl">
                <FileText size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Histórico de Submissão</h1>
                <p className="text-indigo-100 text-sm font-mono">{id}</p>
              </div>
            </div>
          </div>

          {/* Conteúdo */}
          <div className="p-6 space-y-6">
            
            {/* Seção: Empresa */}
            <div>
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Building2 size={16} /> Sobre a Empresa
              </h3>
              <div className="grid gap-3 md:grid-cols-2">
                <Campo 
                  label="Nome da Empresa" 
                  value={dados?.["Nome da Empresa"]} 
                  icon={Building2} 
                />
                <Campo 
                  label="Segmento de Atuação" 
                  value={dados?.["Segmento de Atua\u00e7\u00e3o"]} 
                  icon={Target} 
                />
                <Campo 
                  label="Cidade e Estado" 
                  value={dados?.["Cidade e Estado"]} 
                  icon={MapPin} 
                />
              </div>
            </div>

            {/* Seção: Persona */}
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <User size={16} /> Persona da I.A.
              </h3>
              <div className="grid gap-3 md:grid-cols-2">
                <Campo 
                  label="Nome da Assistente" 
                  value={dados?.["Nome da Assistente Virtual"]} 
                  icon={User} 
                />
                <Campo 
                  label="Tons de Voz" 
                  value={dados?.["Tons de Voz Escolhidos"]} 
                  icon={MessageSquare} 
                />
                <Campo 
                  label="Uso de Emojis" 
                  value={dados?.["Uso de Emojis"]} 
                  icon={Smile} 
                />
              </div>
            </div>

            {/* Seção: Comportamento */}
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <MessageSquare size={16} /> Comportamento
              </h3>
              <div className="space-y-3">
                <Campo 
                  label="Apresentação Inicial" 
                  value={dados?.["Apresenta\u00e7\u00e3o Inicial"]} 
                  icon={Sparkles} 
                />
                <div className="grid gap-3 md:grid-cols-2">
                  <Campo 
                    label="Estilo de Resposta" 
                    value={dados?.["Estilo de Resposta"]} 
                    icon={Target} 
                  />
                  <Campo 
                    label="Frases para Evitar" 
                    value={dados?.["Frases para Evitar"]} 
                    icon={Ban} 
                  />
                </div>
              </div>
            </div>

            {/* Seção: FAQ */}
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <HelpCircle size={16} /> Base de Conhecimento - FAQ
              </h3>
              <div className="space-y-3">
                <Campo 
                  label="Perguntas FAQ" 
                  value={dados?.["Perguntas FAQ (Texto)"]} 
                  icon={HelpCircle} 
                />
                <Campo 
                  label="Respostas FAQ" 
                  value={dados?.["Respostas FAQ (Texto)"]} 
                  icon={CheckCircle2} 
                />
              </div>
            </div>

            {/* Seção: Treinamento */}
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Trophy size={16} /> Treinamento Fino
              </h3>
              <div className="space-y-3">
                <Campo 
                  label="Exemplos de Venda/Conversa" 
                  value={dados?.["Exemplos de Venda/Conversa (Texto)"]} 
                  icon={Trophy} 
                />
                {dados?.["Nome do Arquivo Original"] && dados?.["Nome do Arquivo Original"] !== "Não informado" && (
                  <Campo 
                    label="Arquivo Enviado" 
                    value={`${dados?.["Tipo do Arquivo"]}: ${dados?.["Nome do Arquivo Original"]}`} 
                    icon={FileText} 
                  />
                )}
              </div>
            </div>

          </div>

          {/* Footer do Card */}
          <div className="bg-green-50 border-t border-green-100 p-4">
            <div className="flex items-center gap-3 text-green-700">
              <CheckCircle2 size={20} />
              <span className="text-sm font-medium">Dados recebidos e processados com sucesso</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 space-y-2">
          <p className="text-slate-500 text-xs font-semibold tracking-wider flex items-center justify-center gap-2 uppercase">
            <Sparkles size={12} className="text-indigo-400"/>
            AI Agent Configurator 2025
          </p>
          <p className="text-slate-400 text-[10px] font-medium tracking-wide">
            Desenvolvido pelo time técnico da <strong className="text-slate-600">Diferencial Consultoria Empresarial</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default HistoricoPage;
