import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Building2, 
  User, 
  MessageSquare, 
  FileText, 
  CheckCircle2,
  Sparkles,
  Copy,
  ExternalLink
} from 'lucide-react';

const HistoricoPage = () => {
  const { id } = useParams();

  // Função para copiar o ID
  const copyToClipboard = () => {
    navigator.clipboard.writeText(id);
    alert('ID copiado!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50 font-sans text-slate-800 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium text-sm mb-6 transition-colors"
          >
            <ArrowLeft size={16} />
            Voltar ao formulário
          </Link>
          
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl text-white">
                <FileText size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Histórico de Submissão</h1>
                <p className="text-slate-500 text-sm">Detalhes do preenchimento</p>
              </div>
            </div>

            {/* ID da Submissão */}
            <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-200">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                ID da Submissão
              </label>
              <div className="flex items-center justify-between gap-3">
                <code className="text-lg font-mono font-bold text-indigo-600 break-all">
                  {id}
                </code>
                <button 
                  onClick={copyToClipboard}
                  className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors shrink-0"
                  title="Copiar ID"
                >
                  <Copy size={18} />
                </button>
              </div>
            </div>

            {/* Mensagem Informativa */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-100 text-amber-600 rounded-lg shrink-0">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-amber-800 mb-1">Dados em Processamento</h3>
                  <p className="text-amber-700 text-sm leading-relaxed">
                    Os dados associados a este ID estão sendo processados pela nossa equipe. 
                    Para visualizar os detalhes completos, entre em contato com o suporte 
                    informando o ID acima.
                  </p>
                </div>
              </div>
            </div>

            {/* Seção de Status */}
            <div className="mt-6 pt-6 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">
                Status do Processamento
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-green-600">
                  <CheckCircle2 size={18} />
                  <span className="text-sm font-medium">Formulário recebido com sucesso</span>
                </div>
                <div className="flex items-center gap-3 text-green-600">
                  <CheckCircle2 size={18} />
                  <span className="text-sm font-medium">Dados enviados para processamento</span>
                </div>
                <div className="flex items-center gap-3 text-slate-400">
                  <div className="w-[18px] h-[18px] rounded-full border-2 border-slate-300"></div>
                  <span className="text-sm font-medium">Configuração do agente (em breve)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center space-y-2">
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
