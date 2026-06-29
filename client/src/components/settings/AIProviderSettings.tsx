import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';
import { useSettingsStore } from '../../store/settingsStore';
import { patchSettings, testExtraction } from '../../services/authService';
import { Button } from '../ui/Button';

const PROVIDERS = [
  { id: 'groq',    label: 'Groq (Llama 3.3 70B)',    desc: 'Fastest • Free tier',  env: 'GROQ_API_KEY'   },
  { id: 'zhipu',   label: 'Z.ai GLM-4 Flash',         desc: 'ZhipuAI • Fast',       env: 'ZHIPU_API_KEY'  },
  { id: 'gemini',  label: 'Google Gemini 1.5 Flash',  desc: 'Google • Free tier',   env: 'GEMINI_API_KEY' },
  { id: 'mistral', label: 'Mistral Small',             desc: 'Mistral AI • Free',    env: 'MISTRAL_API_KEY'},
  { id: 'ollama',  label: 'Ollama (Local)',             desc: 'Self-hosted • No key', env: 'OLLAMA_BASE_URL' },
];

export function AIProviderSettings() {
  const { accessToken, updateUser } = useAuthStore();
  const { aiProvider, setAiProvider } = useSettingsStore();
  const [testing, setTesting] = useState(false);

  const save = async (provider: string) => {
    setAiProvider(provider);
    if (!accessToken) return;
    try {
      const res = await patchSettings(accessToken, { aiProvider: provider });
      updateUser(res.settings);
      toast.success('AI provider updated');
    } catch {
      toast.error('Failed to update provider');
    }
  };

  const test = async () => {
    if (!accessToken) return;
    setTesting(true);
    try {
      await testExtraction(accessToken, aiProvider);
      toast.success('Test extraction succeeded!');
    } catch {
      toast.error('Test failed — check API key for this provider');
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-semibold text-[#111827] mb-1">Select AI Provider</h3>
        <p className="text-xs text-[#9ca3af]">
          API keys are set server-side via environment variables. The fallback chain tries each provider in order if one fails.
        </p>
      </div>

      <div className="space-y-2">
        {PROVIDERS.map((p) => (
          <label
            key={p.id}
            className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${
              aiProvider === p.id
                ? 'border-accent bg-[#eff6ff]'
                : 'border-[#e5e7eb] bg-white hover:border-[#d1d5db] hover:bg-[#f9fafb]'
            }`}
          >
            <input
              type="radio"
              name="provider"
              checked={aiProvider === p.id}
              onChange={() => save(p.id)}
              className="mt-0.5 accent-accent"
            />
            <div className="flex-1">
              <p className={`text-sm font-semibold ${aiProvider === p.id ? 'text-accent' : 'text-[#111827]'}`}>
                {p.label}
              </p>
              <p className="text-xs text-[#9ca3af] mt-0.5">{p.desc}</p>
            </div>
            <code className="text-[10px] text-[#9ca3af] font-mono bg-[#f3f4f6] px-2 py-0.5 rounded">
              {p.env}
            </code>
          </label>
        ))}
      </div>

      <div className="flex items-center gap-3 pt-1">
        <Button variant="secondary" size="sm" onClick={test} disabled={testing}>
          {testing ? 'Testing…' : 'Test current provider'}
        </Button>
        <p className="text-xs text-[#9ca3af]">
          Sends a small test extraction to verify the provider is working.
        </p>
      </div>
    </div>
  );
}
